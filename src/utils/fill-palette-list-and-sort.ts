import { PaletteDTO } from "../types";
import { v1 } from "uuid";
import { getRandomColor } from "./get-random-color";

function getRandomPalette(index: number) : PaletteDTO {
    return {
        id: v1(),
        normalColor: getRandomColor(),
        luminenceStep: 4,
        range: 5,
        locked: false,
        index: index
    }
}

export function fillPaletteListAndSort(existingPalettes: Array<PaletteDTO>, min: number) : Array<PaletteDTO> {
    if(existingPalettes.length >= min) {
        return existingPalettes.sort((a, b) => a.index - b.index);
    }

    const existingIndexes = existingPalettes.map(fs => fs.index);

    if(existingIndexes.indexOf(0) < 0) {
        existingIndexes.push(0);
        existingPalettes.push(getRandomPalette(0));
    }

    if(existingIndexes.indexOf(min - 1) < 0) {
        existingIndexes.push(min - 1);
        existingPalettes.push(getRandomPalette(min - 1));
    }

    const sortedIndexes = existingIndexes.sort();

    for(let i = 1; i < sortedIndexes.length; i++) {
        // if gap between this and last is greater than one, we have a missing index
        const difference = sortedIndexes[i] - sortedIndexes[i - 1];
        if(difference != 1) {
            for(let j = 1; j < difference; j++) {
                existingPalettes.push(getRandomPalette(sortedIndexes[i - 1] + j));
            }
        }
    }

    return existingPalettes.sort((a, b) => a.index - b.index);
}