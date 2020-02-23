import * as React from "react";
import styled from "styled-components";

export interface ControlsProps {
    onAddPalette: () => void;
}

const Controls : React.FC<ControlsProps> = ({ onAddPalette }) => {
    return (
        <ControlsDiv>
            <button type="button" onClick={onAddPalette}>Add</button>
        </ControlsDiv>
    );
}

export default Controls;

const ControlsDiv = styled.div`
`