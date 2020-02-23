import * as React from "react";
import styled from "styled-components";
import Palette from "./palette";
import Controls from "./controls";
import { PaletteDTO } from "../types";
import { getRandomPalettes } from "../services/palette-service";
import "../utils/extend-array";

const App: React.FC = () => {
    const [palettes, SetPalettes] = React.useState<Array<PaletteDTO>>(getRandomPalettes(5));

    const addPaletteHandler = () => {
        SetPalettes(p => [...p, getRandomPalettes(1)[0]]);
    }

    return (
        <AppContainer>
            <PaletteContainer>
                {palettes.map(p => <Palette palette={p} key={p.id} />)}
            </PaletteContainer>
            <ControlsContainer>
                <Controls onAddPalette={addPaletteHandler} />
            </ControlsContainer>
        </AppContainer>
    );
}

export default App;

const AppContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display:flex;
`

const PaletteContainer = styled.div`
    flex-grow: 1;
    display:flex;
    
`

const ControlsContainer = styled.div`
`