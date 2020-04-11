import * as React from "react";
import { PaletteDTO, HSL, TooltipPosition } from "../types";
import styled, { css } from "styled-components";
import PaletteColor from "./palette-color";
import { hexToHSL, HSLToHex, getContrastYIQ } from "../utils/color-converter";
import { FaTrash, FaLock, FaLockOpen, FaCopy, FaArrowUp, FaArrowDown } from "react-icons/fa";
import CircularIconButton from "./style/buttons";
import {Draggable} from "react-beautiful-dnd";
import Tooltip from "react-tooltip-lite";
import "../utils/extend-array";
import AppTooltip from "./style/tooltip";

export interface PaletteProps {
    palette: PaletteDTO;
    index: number;
    onDelete: (id: number) => void;
    onShiftPalette: (index: number, newColor: string) => void;
    onLockPalette: (index: number, lock: boolean) => void;
}

const Palette: React.FC<PaletteProps> = ({ palette, index, onDelete, onShiftPalette, onLockPalette }) => {
    const [colors, setColors] = React.useState<Array<string>>([]);
    const [showControls, setShowControls] = React.useState(false);
    const [copiedToClipboard, setCopiedToClipboard] = React.useState(false);
    const copyButtonRef = React.useRef(null);

    React.useEffect(() => {
        const hsl = hexToHSL(palette.normalColor);

        const lightHSLs: Array<HSL> = [];
        const darkHSLs: Array<HSL> = [];

        for(let i = 0; i < palette.range; i++) {
            const dSource = i === 0 ? hsl.l : darkHSLs[i-1].l;
            const lSource = i === 0 ? hsl.l : lightHSLs[i-1].l;

            const dL = dSource - palette.luminenceStep;
            const lL = lSource + palette.luminenceStep;

            lightHSLs.push({ h: hsl.h, s: hsl.s, l: lL > 100 ? 100 : lL });
            darkHSLs.push({ h: hsl.h, s: hsl.s, l: dL < 0 ? 0 : dL });
        }

        const lightHex = lightHSLs.map(hsl => HSLToHex(hsl));
        const darkHex = darkHSLs.map(hsl => HSLToHex(hsl)).reverse();

        const newColors = [...darkHex, palette.normalColor, ...lightHex];
        if(!colors.equals(newColors)) {
            setColors(newColors);
        }
    }, [palette.normalColor]);

    React.useEffect(() => {
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
        onDelete(palette.id);
    }

    function onScrollUp () {
        if(colors && colors.length && colors[0] !== "#000000" && !palette.locked) {
            // shift to the middle index - 1
            onShiftPalette(index, colors[(colors.length / 2 | 0) - 1]);
        }
    }

    function onScrollDown () {
        if(colors && colors.length && colors[colors.length -1] !== "#ffffff" && !palette.locked) {
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
        await navigator.clipboard.writeText(colors.join("\n"));
        setCopiedToClipboard(true);
    }

    function paletteNormalColorEditedHandler(value: string) {
        onShiftPalette(index, value);
    }

    function getCopyTooltipContent(dataTip: any) {
        if(!dataTip) {
            return "";
        }

        return copiedToClipboard ? "Copied!" : "Copy palette to clipboard";
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
                    isDragging={snapshot.isDragging}
                    onWheel={onScrollHandler}
                >
                    <PaletteControls showing={showControls && !snapshot.isDragging} color={getContrastYIQ(colors[0])}>
                        <VerticalMenu>
                            <AppTooltip position={TooltipPosition.right} content={palette.locked ? "Unlock palette" : "Lock palette"}>
                                <CircularIconButton onClick={lockButtonClickHandler}>{palette.locked ? <FaLock /> : <FaLockOpen /> }</CircularIconButton>
                            </AppTooltip>
                            <AppTooltip position={TooltipPosition.right} content="Remove palette">
                                <CircularIconButton onClick={deleteButtonClickHandler}><FaTrash /></CircularIconButton>
                            </AppTooltip>
                            <AppTooltip position={TooltipPosition.right} content={copiedToClipboard ? "Copied!" : "Copy palette to clipboard"}>
                                <CircularIconButton onClick={copyButtonClickHandler}><FaCopy /></CircularIconButton>
                            </AppTooltip>
                        </VerticalMenu>
                    </PaletteControls>

                    <ScrollButton showing={showControls && !snapshot.isDragging && colors[0] !== "#000000" && !palette.locked} color={getContrastYIQ(colors[0])}>
                        <AppTooltip position={TooltipPosition.left} content="Scroll up for darker tints">
                            <CircularIconButton onClick={onScrollUp}><FaArrowUp/></CircularIconButton>
                        </AppTooltip>
                    </ScrollButton>
                    
                    <ScrollButton bottom showing={showControls && !snapshot.isDragging && colors[colors.length -1] !== "#ffffff" && !palette.locked} color={getContrastYIQ(colors[colors.length -1])}>
                        <AppTooltip position={TooltipPosition.left} content="Scroll down for lighter tints">
                            <CircularIconButton onClick={onScrollDown}><FaArrowDown/></CircularIconButton>
                        </AppTooltip>
                    </ScrollButton>
                    
                    <LockIndicator showing={palette.locked && !showControls} color={getContrastYIQ(colors[0])}><FaLock /></LockIndicator>
                    {colors.map((c, index) => <PaletteColor key={index} editable={c === palette.normalColor && showControls && !snapshot.isDragging && !palette.locked} onEdited={paletteNormalColorEditedHandler} color={c} />)}
                </Container>
            )}
        </Draggable>
    );
}

export default Palette;

interface ContainerStyleProps {
    isDragging: boolean;
}

const Container = styled.div`
    cursor: pointer;
    flex-grow: 1;
    display:flex;
    z-index: 900;
    flex-direction: column;
    position: relative;
    overflow:hidden;
    transition: font-size .3s ease;

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
    width: 100%;
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
