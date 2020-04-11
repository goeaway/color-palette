import * as React from "react";
import styled from "styled-components";
import Palette from "./palette";
import { PaletteDTO, TooltipPosition } from "../types";
import { storePalette, removePaletteFromStorage, getRandomPalette, getPalettes } from "../services/palette-service";
import "../utils/extend-array";
import { FaPlus, FaDiceSix } from "react-icons/fa";
import CircularIconButton from "./style/buttons";
import {DragDropContext, DropResult, Droppable} from "react-beautiful-dnd";
import Backdrop from "./style/backdrop";
import { getRandomColor } from "../utils/get-random-color";
import AppTooltip from "./style/tooltip";

const MAX_PALETTES = 10;
const MIN_PALETTES_START = 5;

const App: React.FC = () => {
    const [palettes, setPalettes] = React.useState<Array<PaletteDTO>>(getPalettes(MIN_PALETTES_START));
    const [canAdd, setCanAdd] = React.useState(true);

    React.useEffect(() => {
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
                name: palette.name,
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
                name: palette.name,
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
                <AppTooltip position={TooltipPosition.right} content="Randomise unlocked palettes">
                    <CircularIconButton lg onClick={randomisePalettesHandler}><FaDiceSix /></CircularIconButton>
                </AppTooltip>
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
            <AddButton data-tip="Add a new palette" data-place="left" onClick={addPaletteHandler} disabled={!canAdd}><FaPlus /></AddButton>
        </AppContainer>
    );
}

export default App;

const AppContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display:grid;
    grid-template-rows: [header] 50px [main] auto;
    grid-template-columns: [main] auto [controls] 90px;
    background: #EDF2F7;
    color: rgba(0,0,0,.7);

    
`

const NavBar = styled.div`
    grid-row-start: header;
    grid-column-start: main;
    grid-column-end: controls;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 1rem;
`;

const PaletteContainer = styled.div`
    overflow: hidden;
    display:flex;
    position: relative;
    grid-row-start: main;
    grid-column-start: main;
    border-radius: 3px;
    margin: 0 0 1rem 1rem;
    box-shadow:
        0 0px 4.8px rgba(0, 0, 0, 0.052),
        0 0px 13.4px rgba(0, 0, 0, 0.069),
        0 0px 32.3px rgba(0, 0, 0, 0.088),
        0 0px 107px rgba(0, 0, 0, 0.16)
    ;
`

const AddButton = styled.button`
    grid-row-start: main;
    grid-column-start: controls;
    border-radius: 3px;
    margin: 0 1rem 1rem 1rem;
    transition: all .1s ease;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    border: 1px solid #ddd;
    background: #e0e0e0;
    color: inherit;
    outline: none;

    &:hover {
        filter: brightness(90%);
    }

    &:disabled {
        filter: brightness(100%);
        cursor: default;
    }
`;

const ModalBackground = styled.div`
    z-index: 2000;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.2);
`