import React, { useState, useEffect, ChangeEvent, useRef} from "react";
import styled, { css } from "styled-components";
import { getContrastYIQ, White, HSLToHex, convertToTypeString, hexToHSL, convertStringToHSL, RGBToHSL, convertStringToRGB } from "../utils/colors";
import { FaPen, FaTimes, FaExclamation, FaCheck } from "react-icons/fa";
import CircularIconButton from "./style/circular-icon-button";
import useClickOutside from "../hooks/use-click-outside";
import useKeyPress from "../hooks/use-key-press";
import { HSL } from "../types";

export interface PaletteColorProps {
    color: HSL;
    colorType: string;
    editable: boolean;
    onEdited?: (value: HSL) => void;
}

const PaletteColor: React.FC<PaletteColorProps> = ({ color, editable, onEdited, colorType }) => {
    const [editing, setEditing] = useState(false);
    const [newColor, setNewColor] = React.useState(White);
    const [stringColor, setStringColor] = useState("");

    const inputRef = useRef<HTMLInputElement>(null);
    const clickOutSideRef = useClickOutside(() => editing && setEditing(false));

    const enter = useKeyPress("Enter");
    const escape = useKeyPress("Escape");

    useEffect(() => {
        if(enter && editing) {
            saveEditButtonClickHandler();
        }
    }, [enter]);

    useEffect(() => {
        if(escape && editing) {
            cancelEditButtonClickHandler();
        }
    }, [escape]);

    useEffect(() => {
        if(editing) {
            inputRef.current.select();
            inputRef.current.setSelectionRange(0, inputRef.current.value.length);
        }
    }, [editing]);

    useEffect(() => {
        let newHSL: HSL;
        switch(colorType) {
            case "hex": {
                newHSL = hexToHSL(stringColor);
                break;
            }
            case "hsl": {
                newHSL = convertStringToHSL(stringColor);
                break;
            }
            case "rgb": {
                newHSL = RGBToHSL(convertStringToRGB(stringColor));
                break;
            }
        }
        setNewColor(newHSL);
    }, [stringColor]);

    const editButtonClickHandler = () => {
        if(editable && !editing) {
            setEditing(true);
            setStringColor(convertToTypeString(color, colorType));
        }
    }

    const cancelEditButtonClickHandler = () => {
        setEditing(false);
    }

    const saveEditButtonClickHandler = () => {
        if(newColor) {
            setEditing(false);
            onEdited(newColor);
        }
    }

    const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setStringColor(event.target.value);
    }

    const contrastColor = getContrastYIQ(color);
    const colorHex = HSLToHex(color);

    return (
        <Container background={colorHex} ref={clickOutSideRef}>
            <ColorName color={contrastColor} editable={editable} showing={!editing} onDoubleClick={editButtonClickHandler}>{convertToTypeString(color, colorType)}</ColorName>
            <ColorInput ref={inputRef} color={contrastColor} type="text" showing={editing} value={stringColor} onChange={inputChangeHandler} />

            <EditIconContainer showing={editable && !editing} color={contrastColor}>
                <CircularIconButton titleDisplayDirection="left" title="Edit source color" onClick={editButtonClickHandler}>
                    <FaPen />
                </CircularIconButton>
            </EditIconContainer>

            <EditIconContainer showing={editable && editing} color={contrastColor}>
                <CircularIconButton titleDisplayDirection="left" title={!!newColor ? "Confirm" : "Color invalid"} onClick={saveEditButtonClickHandler}>
                    {!!newColor ? <FaCheck /> : <FaExclamation />}
                </CircularIconButton>
                <CircularIconButton titleDisplayDirection="left" title="Cancel" onClick={cancelEditButtonClickHandler}>
                    <FaTimes />
                </CircularIconButton>
            </EditIconContainer>
        </Container>
    );
}

export default PaletteColor;

interface ColorNameStyleProps {
    color: string;
    editable: boolean;
    showing: boolean;
}

const ColorName = styled.span`
    color: ${(p: ColorNameStyleProps) => p.color};
    cursor: ${(p: ColorNameStyleProps) => p.editable && "pointer !important"};
    opacity: 0;
    visibility: hidden;
    font-weight: 500;
    font-size: 16px;

    ${(p: ColorNameStyleProps) => p.showing && css`
        opacity: 1;
        visibility: visible;
    `}
`

interface ContainerStyleProps {
    background: string;
}

const Container = styled.div`
    background-color: ${(p: ContainerStyleProps) => p.background};
    flex-grow: 1;
    display:flex;
    position: relative;
    justify-content: center;
    align-items: center;
`

interface EditIconContainerStyleProps {
    showing: boolean;
    color: string;
}

const EditIconContainer = styled.div`
    position: absolute;
    right: 0;
    opacity: 0;
    visibility: hidden;
    padding: .35rem;
    transition: all .3s ease;
    display:flex;
    color: ${(p: EditIconContainerStyleProps) => p.color};

    ${(p: EditIconContainerStyleProps) => p.showing && css`
        opacity: 1;
        visibility: visible;
    `}
`

interface ColorInputStyleProps {
    showing: boolean;
    color: string;
}

const ColorInput = styled.input`
    font-size: 16px;
    position: absolute;
    padding: .35rem;
    text-align: center;
    opacity: 0;
    visibility: hidden;
    background: transparent;
    outline: none;
    border: none;
    color: ${(p: ColorInputStyleProps) => p.color};
    font-family: 'Roboto';

    ${(p: ColorInputStyleProps) => p.showing && css`
        opacity: 1;
        visibility: visible;
    `}
`;
