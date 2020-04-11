import * as React from "react";
import styled from "styled-components";
import { getContrastYIQ } from "../utils/color-converter";

export interface PaletteColorProps {
    color: string;
}

const PaletteColor: React.FC<PaletteColorProps> = ({ color }) => {
    return (
        <Container background={color}>
            <ColorName color={getContrastYIQ(color)}>{color}</ColorName>
            <BorderBox />
        </Container>
    );
}

export default PaletteColor;

interface ContainerStyleProps {
    background: string;
}

interface ColorNameStyleProps {
    color: string;
}

const ColorName = styled.span`
    color: ${(p: ColorNameStyleProps) => p.color};
`
const BorderBox = styled.span`
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