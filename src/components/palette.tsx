import * as React from "react";
import { PaletteDTO, HSL } from "../types";
import styled from "styled-components";
import PaletteColor from "./palette-color";
import { hexToHSL, HSLToHex } from "../utils/color-converter";

export interface PaletteProps {
    palette: PaletteDTO;
}

const Palette: React.FC<PaletteProps> = ({ palette }) => {
    const [colors, setColors] = React.useState<Array<string>>([]);

    React.useEffect(() => {
        const hsl = hexToHSL(palette.normalColor);

        const lightHSLs: Array<HSL> = [];
        const darkHSLs: Array<HSL> = [];

        for(let i = 0; i < palette.range; i++) {
            const dSource = i === 0 ? hsl.l : darkHSLs[i-1].l;
            const lSource = i === 0 ? hsl.l : lightHSLs[i-1].l;

            const dL = dSource - palette.luminenceStep;
            const lL = lSource + palette.luminenceStep;

            lightHSLs.push({ h: hsl.h, s: hsl.s, l: lL });
            darkHSLs.push({ h: hsl.h, s: hsl.s, l: dL });
        }

        const lightHex = lightHSLs.map(hsl => HSLToHex(hsl));
        const darkHex = darkHSLs.map(hsl => HSLToHex(hsl));

        setColors([...lightHex, palette.normalColor, ...darkHex]);
    }, []);

    return (
        <Container>
            <Title>{palette.name}</Title>
            {colors.map((c, index) => <PaletteColor key={index} color={c} />)}
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