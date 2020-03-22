import * as React from "react";
import styled from "styled-components";
import Palette from "./palette";
import Controls from "./controls";
import { PaletteDTO } from "../types";
import { getRandomPalettes, getPalettesFromStorage } from "../services/palette-service";
import "../utils/extend-array";

const getPalettes = () => {
    const fromStorage = getPalettesFromStorage();
    return fromStorage && fromStorage.length ? fromStorage : getRandomPalettes(5);
}

const App: React.FC = () => {
    const [palettes, SetPalettes] = React.useState<Array<PaletteDTO>>(getPalettes);

    const addPaletteHandler = () => {
        SetPalettes(p => [...p, getRandomPalettes(1)[0]]);
    }

    const deletePaletteHandler = (paletteId: number) => {
        SetPalettes(ps => ps.filter(p => p.id !== paletteId));
    }

    return (
        <AppContainer>
            <PaletteContainer>
                {palettes.map(p => <Palette palette={p} key={p.id} onDelete={deletePaletteHandler} />)}
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