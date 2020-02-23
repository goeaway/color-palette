import * as React from "react";
import styled from "styled-components";

export interface PaletteColorProps {
    color: string;
}

const PaletteColor: React.FC<PaletteColorProps> = ({ color }) => {
    return (
        <Container background={color}>
        </Container>
    );
}

export default PaletteColor;

interface ContainerStyleProps {
    background: string;
}

const Container = styled.div`
    background-color: ${(p: ContainerStyleProps) => p.background};
    flex-grow: 1;
`