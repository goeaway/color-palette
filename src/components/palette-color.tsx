import * as React from "react";
import styled from "styled-components";
import useClickOutside from "../hooks/use-click-outside";
import useKeyPress from "../hooks/use-key-press";

export interface PaletteColorProps {
    color: string;
    main: boolean;
    onChangeSaved: (newColor: string) => void;
}

const PaletteColor: React.FC<PaletteColorProps> = ({ color, main, onChangeSaved }) => {
    const [editable, setEditable] = React.useState(false);
    const [newColor, setNewColor] = React.useState(color);
    const outsideClickRef = useClickOutside(() => {
        setEditable(false);
    });

    const enter = useKeyPress("Enter");
    const escape = useKeyPress("Escape");

    React.useEffect(() => {
        if(enter && editable) {      
            onChangeSaved(newColor);
            setEditable(false);
        }
    }, [enter]);

    React.useEffect(() => {
        if(escape && editable) {
            setEditable(false);
        }
    })

    const doubleClickHandler = () => {
        if(main && !editable) {
            setEditable(true);
        } 
    }

    const inputChangeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setNewColor(ev.target.value);
    }

    return (
        <Container background={color} ref={outsideClickRef} onDoubleClick={doubleClickHandler}>
            {!editable && <ColorName>{newColor}</ColorName>}
            {editable && <Input type='text' value={newColor} onChange={inputChangeHandler} placeholder="hex code" autoFocus />}
            <BorderBox bordered={main} />
        </Container>
    );
}

export default PaletteColor;

interface ContainerStyleProps {
    background: string;
}

const ColorName = styled.span`
    color: gray;
`
interface BorderBoxStyleProps {
    bordered: boolean;
}

const BorderBox = styled.span`
    border: ${(p: BorderBoxStyleProps) => p.bordered && "2px solid white"};
    border-left: none;
    border-right: none;
    position: absolute;
    background: transparent;
    width: 100%;
    height: 100%;
`

const Container = styled.div`
    background-color: ${(p: ContainerStyleProps) => p.background};
    flex-grow: 1;
    display:flex;
    position: relative;
    justify-content: center;
    align-items: center;
`

const Input = styled.input`
    border-radius: 2px;
    border: none;
    z-index: 2;
    padding: .5rem;
    max-width: 120px;
`