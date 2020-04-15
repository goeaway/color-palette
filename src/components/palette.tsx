import React, { useState, useEffect} from "react";
import { PaletteDTO, HSL, Settings } from "../types";
import styled, { css } from "styled-components";
import PaletteColor from "./palette-color";
import { hexToHSL, HSLToHex, getContrastYIQ, Black, White, convertToTypeString } from "../utils/colors";
import { FaTrash, FaLock, FaLockOpen, FaCopy, FaArrowUp, FaArrowDown, FaDiceSix } from "react-icons/fa";
import CircularIconButton from "./style/circular-icon-button";
import { Draggable } from "react-beautiful-dnd";
import { getRandomColor } from "../utils/get-random-color";

export interface PaletteProps {
    palette: PaletteDTO;
    settings: Settings;
    index: number;
    onDelete: (id: number) => void;
    onShiftPalette: (index: number, newColor: HSL) => void;
    onLockPalette: (index: number, lock: boolean) => void;
}

const LOWEST_LUM = 1;
const HIGHEST_LUM = 99;

const Palette: React.FC<PaletteProps> = ({ palette, settings, index, onDelete, onShiftPalette, onLockPalette }) => {
    const [colors, setColors] = useState<Array<HSL>>([]);
    const [showControls, setShowControls] = useState(false);
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);
    const [isIn, setIsIn] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsIn(true);
        }, 50);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const { normalColor: hsl} = palette;
        
        const lightHSLs: Array<HSL> = [];
        const darkHSLs: Array<HSL> = [];
        
        for(let i = 0; i < settings.range; i++) {
            const dSource = i === 0 ? hsl.l : darkHSLs[i-1].l;
            const lSource = i === 0 ? hsl.l : lightHSLs[i-1].l;
            
            const dL = dSource - settings.luminenceStep;
            const lL = lSource + settings.luminenceStep;
            
            lightHSLs.push({ h: hsl.h, s: hsl.s, l: lL > HIGHEST_LUM ? HIGHEST_LUM : lL });
            darkHSLs.push({ h: hsl.h, s: hsl.s, l: dL < LOWEST_LUM ? LOWEST_LUM : dL });
        }
        
        setColors([...darkHSLs.reverse(), palette.normalColor, ...lightHSLs]);
    }, [palette.normalColor, settings]);

    useEffect(() => {
        if(copiedToClipboard) {
            const timeout = setTimeout(() => {
                setCopiedToClipboard(false);
            }, 1500);

            return () => clearTimeout(timeout);
        }
    }, [copiedToClipboard]);

    function onMouseEnterHandler() {
        setShowControls(true);
    }

    function onMouseLeaveHandler() {
        setShowControls(false);
    }

    function deleteButtonClickHandler() {
        setIsIn(false);
        setTimeout(() => onDelete(palette.id), 300);
    }

    function randomiseButtonClickHandler() {
        onShiftPalette(index, getRandomColor());
    }

    function onScrollUp () {
        if(colors && colors.length && colors[0].l - settings.luminenceStep >= LOWEST_LUM && !palette.locked) {
            // shift to the middle index - 1
            onShiftPalette(index, colors[(colors.length / 2 | 0) - 1]);
        }
    }

    function onScrollDown () {
        if(colors && colors.length && colors[colors.length -1].l + settings.luminenceStep <= HIGHEST_LUM && !palette.locked) {
            // shift to the middle index + 1
            onShiftPalette(index, colors[(colors.length / 2 | 0) + 1]);
        }
    }

    function onScrollHandler (e: React.WheelEvent) {
        if(e.deltaY < 0) {
            onScrollUp();
        } else {
            onScrollDown();
        }
    }

    function lockButtonClickHandler() {
        onLockPalette(index, !palette.locked);
    }

    async function copyButtonClickHandler() {
        await navigator.clipboard.writeText(colors.map(c => convertToTypeString(c, settings.preferredColorType)).join("\n"));
        setCopiedToClipboard(true);
    }

    function paletteNormalColorEditedHandler(value: HSL) {
        onShiftPalette(index, value);
    }

    return (
        <Draggable draggableId={palette.id + ""} index={index}>
            {(provided, snapshot) => (
                <Container 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    onMouseOver={onMouseEnterHandler} 
                    onMouseEnter={onMouseEnterHandler} 
                    onMouseLeave={onMouseLeaveHandler}
                    ref={provided.innerRef}
                    isIn={isIn}
                    isDragging={snapshot.isDragging}
                    onWheel={onScrollHandler}
                >
                    <PaletteControls showing={showControls && !snapshot.isDragging} color={getContrastYIQ(colors[0])}>
                        <VerticalMenu>
                            <CircularIconButton titleDisplayDirection="right" title={palette.locked ? "Unlock palette" : "Lock palette"} onClick={lockButtonClickHandler}>{palette.locked ? <FaLock /> : <FaLockOpen /> }</CircularIconButton>
                            <CircularIconButton titleDisplayDirection="right" title="Remove palette" onClick={deleteButtonClickHandler}><FaTrash /></CircularIconButton>
                            <CircularIconButton titleDisplayDirection="right" title={copiedToClipboard ? "Copied!" : "Copy palette to clipboard"} onClick={copyButtonClickHandler}><FaCopy /></CircularIconButton>
                            <CircularIconButton titleDisplayDirection="right" title="Randomise palette" onClick={randomiseButtonClickHandler}><FaDiceSix /></CircularIconButton>
                        </VerticalMenu>
                    </PaletteControls>

                    <ScrollButton showing={showControls && !snapshot.isDragging && colors[0].l - settings.luminenceStep >= LOWEST_LUM && !palette.locked} color={getContrastYIQ(colors[0])}>
                        <CircularIconButton titleDisplayDirection="left" title="Scroll up for darker tints" onClick={onScrollUp}><FaArrowUp/></CircularIconButton>
                    </ScrollButton>
                    
                    <ScrollButton bottom showing={showControls && !snapshot.isDragging && colors[colors.length -1].l + settings.luminenceStep <= HIGHEST_LUM && !palette.locked} color={getContrastYIQ(colors[colors.length -1])}>
                        <CircularIconButton titleDisplayDirection="left" title="Scroll down for lighter tints" onClick={onScrollDown}><FaArrowDown/></CircularIconButton>
                    </ScrollButton>
                    
                    <LockIndicator showing={palette.locked && !showControls} color={getContrastYIQ(colors[0])}><FaLock /></LockIndicator>
                    {colors.map((c, index) => <PaletteColor key={index} colorType={settings.preferredColorType} editable={c === palette.normalColor && showControls && !snapshot.isDragging && !palette.locked} onEdited={paletteNormalColorEditedHandler} color={c} />)}
                </Container>
            )}
        </Draggable>
    );
}

export default Palette;

interface ContainerStyleProps {
    isDragging: boolean;
    isIn: boolean;
}

const Container = styled.div`
    cursor: pointer;
    flex-grow: 1;
    display:flex;
    z-index: 900;
    flex-direction: column;
    position: relative;
    overflow:hidden;
    opacity: 0;
    visibility: hidden;
    transition: visibility .3s ease, opacity .3s ease;
    
    ${(p: ContainerStyleProps) => p.isIn && css`
        opacity: 1;
        visibility: visible;
    `}

    ${(p: ContainerStyleProps) => p.isDragging && css`
        border-radius: 3px;
        box-shadow:
            0 0px 4.8px rgba(0, 0, 0, 0.052),
            0 0px 13.4px rgba(0, 0, 0, 0.069),
            0 0px 32.3px rgba(0, 0, 0, 0.088),
            0 0px 107px rgba(0, 0, 0, 0.16)
        ;
    `}

    @media (max-width: 900px) {
        font-size: 14px;
    }

    @media (max-width: 700px) {
        font-size: 12px;
    }
`

interface PaletteControlsStyleProps {
    showing: boolean;
    color: string;
}

const PaletteControls = styled.div`
    position: absolute;
    z-index: 1000;
    top: -100%;
    padding: .35rem;
    transition: all .3s ease;
    display: flex;
    justify-content: space-between;
    color: ${(p: PaletteControlsStyleProps) => p.color};

    ${(p: PaletteControlsStyleProps) => p.showing && css`
        top: 0;
    `}
`;

const VerticalMenu = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;
`;

interface ScrollButtonStyleProps {
    showing: boolean;
    color: string;
    bottom?: boolean;
}

const ScrollButton = styled.div`
    color: ${(p: ScrollButtonStyleProps) => p.color};
    position: absolute;
    transition: all .3s ease;
    z-index: 1000;
    right: 0;
    padding: .35rem;

    ${(p: ScrollButtonStyleProps) => p.bottom && css`
        bottom: -100%;
    `}
    
    ${(p: ScrollButtonStyleProps) => !p.bottom && css`
        top: -100%;
    `}

    ${(p: ScrollButtonStyleProps) => p.showing && css`
        opacity: 1;

        ${(p: ScrollButtonStyleProps) => !p.bottom && css`
            top: 0;
        `}

        ${(p: ScrollButtonStyleProps) => p.bottom && css`
            bottom: 0;
        `}
    `}
`;

interface LockIndicatorStyleProps {
    showing: boolean;
    color: string;
}

const LockIndicator = styled.div`
    position: absolute;
    opacity: 0;
    transition: opacity .3s ease;
    top: 0;
    padding: .5rem;
    z-index: 1000;
    visibility: hidden;
    color: ${(p: LockIndicatorStyleProps) => p.color}; 

    ${(p: LockIndicatorStyleProps) => p.showing && css`
        opacity: 1;
        visibility: visible;
    `}
`
