import * as React from "react";
import styled, { css } from "styled-components";
import { getContrastYIQ } from "../utils/color-converter";
import { FaPen, FaTimes, FaCheck } from "react-icons/fa";
import CircularIconButton from "./style/buttons";
import useClickOutside from "../hooks/use-click-outside";
import useKeyPress from "../hooks/use-key-press";
import AppTooltip from "./style/tooltip";
import { TooltipPosition } from "../types";

export interface PaletteColorProps {
    color: string;
    editable: boolean;
    onEdited?: (value: string) => void;
}

const PaletteColor: React.FC<PaletteColorProps> = ({ color, editable, onEdited }) => {
    const [editing, setEditing] = React.useState(false);
    const [newColor, setNewColor] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const clickOutSideRef = useClickOutside(() => editing && setEditing(false));

    const enter = useKeyPress("Enter");
    const escape = useKeyPress("Escape");

    React.useEffect(() => {
        if(enter && editing) {
            saveEditButtonClickHandler();
        }
    }, [enter]);

    React.useEffect(() => {
        if(escape && editing) {
            cancelEditButtonClickHandler();
        }
    }, [escape]);

    React.useEffect(() => {
        if(editing) {
            inputRef.current.select();
            if(inputRef.current.value.length > 1) {
                inputRef.current.setSelectionRange(1, inputRef.current.value.length);
            }
        }
    }, [editing]);

    const editButtonClickHandler = () => {
        if(editable && !editing) {
            setEditing(true);
            setNewColor(color);
        }
    }

    const cancelEditButtonClickHandler = () => {
        setEditing(false);
    }

    const saveEditButtonClickHandler = () => {
        setEditing(false);
        onEdited(newColor);
    }

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value.length < 8) {
            setNewColor(event.target.value);
        }
    }

    const contrastColor = getContrastYIQ(color);

    return (
        <Container background={color} ref={clickOutSideRef}>
            <ColorName color={contrastColor} editable={editable} showing={!editing} onDoubleClick={editButtonClickHandler} >{color}</ColorName>
            <ColorInput ref={inputRef} color={contrastColor} type="text" showing={editing} value={newColor} onChange={inputChangeHandler} />

            <EditIconContainer showing={editable && !editing} color={contrastColor}>
                <AppTooltip position={TooltipPosition.top} content="Edit source color">
                    <CircularIconButton onClick={editButtonClickHandler}>
                        <FaPen />
                    </CircularIconButton>
                </AppTooltip>
            </EditIconContainer>

            <EditIconContainer showing={editable && editing} color={contrastColor}>
                <AppTooltip position={TooltipPosition.top} content="Save">
                    <CircularIconButton onClick={saveEditButtonClickHandler}>
                        <FaCheck />
                    </CircularIconButton>
                </AppTooltip>
                <AppTooltip position={TooltipPosition.top} content="Cancel">
                    <CircularIconButton onClick={cancelEditButtonClickHandler}>
                        <FaTimes />
                    </CircularIconButton>
                </AppTooltip>
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

    ${(p: ColorNameStyleProps) => p.showing && css`
        opacity: 1;
        visibility: visible;
    `}
`

interface ColorInputStyleProps {
    showing: boolean;
    color: string;
}

const ColorInput = styled.input`
    max-width: 80px;
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