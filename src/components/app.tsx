import React, { useState, useEffect, FC } from "react";
import styled from "styled-components";
import Palette from "./palette";
import { PaletteDTO, Settings, HSL } from "../types";
import { storePalette, removePaletteFromStorage, getRandomPalette, getPalettes } from "../services/palette-service";
import { FaPlus, FaDiceSix, FaCog, FaCopy } from "react-icons/fa";
import CircularIconButton from "./style/circular-icon-button";
import {DragDropContext, DropResult, Droppable} from "react-beautiful-dnd";
import { getRandomColor } from "../utils/get-random-color";
import Backdrop from "./style/backdrop";
import InfoPopover from "./style/info-popover";
import SettingsPopover from "./settings-popover";
import { getSettings, storeSettings } from "../services/settings-service";
import useResetFlagAfter from "../hooks/use-reset-flag-after";
import { convertToTypeString, generateColors } from "../utils/colors";
import { LOWEST_LUM, HIGHEST_LUM } from "../consts";
import { getTagline } from "../utils/get-tag-line";

const MAX_PALETTES = 10;
const START_PALETTES = 5;

const App: FC = () => {
    const [settings, setSettings] = useState<Settings>(getSettings());
    const [palettes, setPalettes] = useState<Array<PaletteDTO>>(getPalettes(START_PALETTES));
    const [canAdd, setCanAdd] = useState(true);
    const [settingsPopoverOpen, setSettingsPopoverOpen] = useState(false);
    const [copiedToClipboard, setCopiedToClipboard] = useResetFlagAfter(1500);

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

    useEffect(() => {
        // store any changes to local storage
        if(settings != getSettings())  {
            storeSettings(settings);
        }
    }, [settings]);
    
    function addPaletteHandler() {
        if(canAdd) {
            setPalettes(p => [...p, getRandomPalette(p.length)]);
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
                index: paletteIndex
            });
    }

    function shiftPaletteHandler(paletteIndex: number, newColor: HSL) {
        const palette = palettes[paletteIndex];
        updatePalette(
            paletteIndex, 
            { 
                id: palette.id, 
                locked: palette.locked, 
                normalColor: newColor, 
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

    async function copyPalettesHandler() {
        await navigator.clipboard.writeText(
            palettes
                .map(p => 
                    generateColors(p.normalColor, settings.range, settings.luminenceStep, LOWEST_LUM, HIGHEST_LUM)
                    .map(c => convertToTypeString(c, settings.preferredColorType))
                    .join("\n"))
                .join("\n\n")
        );
        setCopiedToClipboard(true);
    }

    function settingsButtonClickHandler() {
        setSettingsPopoverOpen(!settingsPopoverOpen);
    }

    function settingsPopoverClosedHandler() {
        setSettingsPopoverOpen(false);
    }

    function settingsPopoverOnChangeHandler(settings: Settings) {
        setSettings(settings);
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
                    <TagLine>{getTagline()}</TagLine>
                </NavBarInner>
                <NavBarInner>
                    <InfoPopover onClose={settingsPopoverClosedHandler} show={settingsPopoverOpen} content={(<SettingsPopover settings={settings} onChange={settingsPopoverOnChangeHandler} />)}>
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
                        onClick={copyPalettesHandler}
                        titleDisplayDirection="left"
                        title={copiedToClipboard ? "Copied!" : "Copy all palettes to clipboard"}
                    >
                        <FaCopy />
                    </CircularIconButton>
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
                            {palettes.map((p, i) => <Palette index={i} palette={p} settings={settings} key={p.id} onDelete={deletePaletteHandler} onShiftPalette={shiftPaletteHandler} onLockPalette={lockPaletteHandler} />)}
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