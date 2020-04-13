import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Palette from "./palette";
import { PaletteDTO } from "../types";
import { storePalette, removePaletteFromStorage, getRandomPalette, getPalettes } from "../services/palette-service";
import "../utils/extend-array";
import { FaPlus, FaDiceSix, FaCog } from "react-icons/fa";
import CircularIconButton from "./style/circular-icon-button";
import {DragDropContext, DropResult, Droppable} from "react-beautiful-dnd";
import { getRandomColor } from "../utils/get-random-color";
import Backdrop from "./style/backdrop";
import InfoPopover from "./style/info-popover";
import { useSelector, useDispatch } from "react-redux";
import { SettingsState } from "../state/types";
import { setRange, setMinPalette } from "../state/actions/settings-actions";

const MAX_PALETTES = 10;

const App: React.FC = () => {
    const settings = useSelector((settingsState: SettingsState) => settingsState);
    const dispatch = useDispatch();
    const [palettes, setPalettes] = useState<Array<PaletteDTO>>([]);
    const [canAdd, setCanAdd] = useState(true);
    const [settingsPopoverOpen, setSettingsPopoverOpen] = useState(false);

    useEffect(() => {
        if(settings) {
            setPalettes(getPalettes(settings.minPalette, settings.luminenceStep, settings.range));
        }
    }, [settings]);

    useEffect(() => {
        setCanAdd(palettes.length <= MAX_PALETTES);

        // make sure all that are locked are saved and are saved with the correct index
        for(let i = 0; i < palettes.length; i++) {
            const palette = palettes[i];
            
            if(palette.locked) {
                palette.index = i;
                storePalette(palette);
            } else {
                removePaletteFromStorage(palette.id);
            }
        }
    }, [palettes]);
    
    function addPaletteHandler() {
        if(canAdd) {
            setPalettes(p => [...p, getRandomPalette(p.length, settings.luminenceStep, settings.range)]);
        }
    }

    function deletePaletteHandler(paletteId: number) {
        removePaletteFromStorage(paletteId);

        setPalettes(ps => ps.filter(p => p.id !== paletteId));
    }

    function updatePalette(index: number, palette: PaletteDTO) {
        setPalettes(ps => {
            const copy = [...ps];
            copy.splice(index, 1, palette);
            return copy;
        });
    }

    function lockPaletteHandler(paletteIndex: number, lock: boolean) {
        const palette = palettes[paletteIndex];
        updatePalette(
            paletteIndex, 
            { 
                id: palette.id, 
                locked: lock, 
                normalColor: palette.normalColor, 
                luminenceStep: palette.luminenceStep, 
                range: palette.range,
                index: paletteIndex
            });
    }

    function shiftPaletteHandler(paletteIndex: number, newColor: string) {
        const palette = palettes[paletteIndex];
        updatePalette(
            paletteIndex, 
            { 
                id: palette.id, 
                locked: palette.locked, 
                normalColor: newColor, 
                luminenceStep: palette.luminenceStep, 
                range: palette.range,
                index: paletteIndex
            });
    }

    function randomisePalettesHandler() {
        for(let i = 0; i < palettes.length; i++) {
            if(!palettes[i].locked) {
                shiftPaletteHandler(i, getRandomColor());
            }
        }
    }

    function settingsButtonClickHandler() {
        setSettingsPopoverOpen(!settingsPopoverOpen);
    }

    function settingsPopoverClosedHandler() {
        setSettingsPopoverOpen(false);
    }

    function onDragEndHandler(result: DropResult) {
        const { destination, source } = result;

        if(!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }
        
        setPalettes(p => {
            const copy = [...p];
            const sourcePalette = copy[source.index];
            copy.splice(source.index, 1);
            copy.splice(destination.index, 0, sourcePalette);
            
            return copy;
        });
    }
    
    return (
        <AppContainer>
            <NavBar>
                <NavBarInner>
                    <TagLine>Create a brand new color scheme for your next project. Mix and match colors you like with this drag and drop palette creator.</TagLine>
                </NavBarInner>
                <NavBarInner>
                    <InfoPopover onClose={settingsPopoverClosedHandler} show={settingsPopoverOpen} content={(
                        <button onClick={() => dispatch(setMinPalette(settings.minPalette + 1))}>Min {settings.minPalette}</button>
                    )}>
                        <CircularIconButton 
                            lg 
                            onClick={settingsButtonClickHandler}
                            title="Settings"
                            titleDisplayDirection="left"
                            disableTitle={settingsPopoverOpen}
                            >
                            <FaCog />
                        </CircularIconButton>
                    </InfoPopover>
                    <CircularIconButton 
                        lg 
                        onClick={randomisePalettesHandler}
                        titleDisplayDirection="left"
                        title="Randomise unlocked palettes"
                    >
                        <FaDiceSix />
                    </CircularIconButton>
                    <CircularIconButton 
                        lg 
                        onClick={addPaletteHandler} 
                        titleDisplayDirection="left"
                        title={canAdd ? "Add a new palette" : "10/10 palettes"}
                    >
                        <FaPlus />
                    </CircularIconButton>
                </NavBarInner>
            </NavBar>
            <DragDropContext onDragEnd={onDragEndHandler}>
                <Droppable droppableId="paletteContainer" direction="horizontal">
                    {provided => (
                        <PaletteContainer {...provided.droppableProps} ref={provided.innerRef}>
                            {palettes.map((p, i) => <Palette index={i} palette={p} key={p.id} onDelete={deletePaletteHandler} onShiftPalette={shiftPaletteHandler} onLockPalette={lockPaletteHandler} />)}
                            {provided.placeholder}
                            <Backdrop />
                        </PaletteContainer>
                    )}
                </Droppable>
            </DragDropContext>
        </AppContainer>
    );
}

export default App;

const AppContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display:grid;
    grid-template-rows: [header] 60px [main] auto;
    background: #EDF2F7;
    color: rgba(0,0,0,.7);
`;

const TagLine = styled.span`
    font-size: 14px;
    font-weight: 500;
`

const NavBarInner = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;

    > * {
        padding: 0 .35rem;
    }

    > *:first-child {
        padding-left: 0;
    }

    > *:last-child {
        padding-right: 0;
    }
`

const NavBar = styled.div`
    grid-row-start: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 1rem;
`;

const PaletteContainer = styled.div`
    overflow: hidden;
    display:flex;
    position: relative;
    border-radius: 3px;
    margin: 0 1rem 1rem 1rem;
    box-shadow:
        0 0px 4.8px rgba(0, 0, 0, 0.052),
        0 0px 13.4px rgba(0, 0, 0, 0.069),
        0 0px 32.3px rgba(0, 0, 0, 0.088),
        0 0px 107px rgba(0, 0, 0, 0.16)
    ;
`