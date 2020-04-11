import { PaletteDTO } from "../types";
import { getRandomColor } from "../utils/get-random-color";
import { v1 } from "uuid";
import getRandomPaletteName from "../utils/get-random-palette-name";
import { getMatchingKey, set, remove } from "./storage-service";

const PALETTE_KEY_BASE = "palette_";

export function removePaletteFromStorage(paletteId: any) {
    remove(PALETTE_KEY_BASE + paletteId);
}

export function storePalette(palette: PaletteDTO) {
    set(PALETTE_KEY_BASE + palette.id, palette);
}

export function getPalettesFromStorage() : Array<PaletteDTO> {
    return getMatchingKey<PaletteDTO>(PALETTE_KEY_BASE + "*");
}

export function getRandomPalette(index: number) : PaletteDTO {
    return {
        name: getRandomPaletteName(), 
        id: v1(),
        normalColor: getRandomColor(),
        luminenceStep: 4,
        range: 5,
        locked: false,
        index: index
    }
}

export function getPalettes (min: number) : Array<PaletteDTO> {
    const fromStorage = getPalettesFromStorage();
    if(fromStorage.length >= min) {
        return fromStorage.sort((a, b) => a.index - b.index);
    }

    const existingIndexes = fromStorage.map(fs => fs.index);

    if(existingIndexes.indexOf(0) < 0) {
        existingIndexes.push(0);
        fromStorage.push(getRandomPalette(0));
    }

    if(existingIndexes.indexOf(min - 1) < 0) {
        existingIndexes.push(min - 1);
        fromStorage.push(getRandomPalette(min - 1));
    }

    const sortedIndexes = existingIndexes.sort();

    for(let i = 1; i < sortedIndexes.length; i++) {
        // if gap between this and last is greater than one, we have a missing index
        const difference = sortedIndexes[i] - sortedIndexes[i - 1];
        if(difference != 1) {
            for(let j = 1; j < difference; j++) {
                fromStorage.push(getRandomPalette(sortedIndexes[i - 1] + j));
            }
        }
    }

    return fromStorage.sort((a, b) => a.index - b.index);
}