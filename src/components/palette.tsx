import * as React from "react";
import { PaletteDTO, HSL } from "../types";
import styled from "styled-components";
import PaletteColor from "./palette-color";
import { hexToHSL, HSLToHex } from "../utils/color-converter";
import useClickOutside from "../hooks/use-click-outside";

export interface PaletteProps {
    palette: PaletteDTO;
    onDelete: (id: number) => void;
}

const Palette: React.FC<PaletteProps> = ({ palette, onDelete }) => {
    const [baseColor, setBaseColor] = React.useState(palette.normalColor);
    const [colors, setColors] = React.useState<Array<string>>([]);
    const [focused, setFocused] = React.useState(false);
    const [editable, setEditable] = React.useState(false);
    const [showControls, setShowControls] = React.useState(false);

    const outsideClickRef = useClickOutside(() => {
        setFocused(false);
    });

    React.useEffect(() => {
        const hsl = hexToHSL(baseColor);

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

        setColors([...darkHex, baseColor, ...lightHex]);
    }, [baseColor]);

    const containerClickHandler = () => {
        setFocused(true);
    }

    const colorChangeSavedHandler = (newColor: string) => {
        setBaseColor(newColor);
    }

    const onMouseEnterHandler = () => {
        setShowControls(true);
    }

    const onMouseLeaveHandler = () => {
        setShowControls(false);
    }

    const deleteButtonClickHandler = () => {
        onDelete(palette.id);
    }

    return (
        <Container onClick={containerClickHandler} ref={outsideClickRef} onMouseOver={onMouseEnterHandler} onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
            {showControls && 
                <PaletteControls>
                    <button type="button" onClick={deleteButtonClickHandler}>Delete</button>
                </PaletteControls>
            }
            <Title>{palette.name}</Title>
            {colors.map((c, index) => <PaletteColor onChangeSaved={colorChangeSavedHandler} main={c == baseColor} key={index} color={c} />)}
        </Container>
    );
}

export default Palette;

const Container = styled.div`
    flex-grow: 1;
    display:flex;
    flex-direction: column;
    position: relative;
`

const Title = styled.span`
    position: absolute;
    width: 100%;
    display:flex;
    justify-content: center;
`

const PaletteControls = styled.div`
    position: absolute;
    z-index: 1000;
`