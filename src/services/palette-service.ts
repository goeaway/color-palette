import { PaletteDTO } from "../types";
import { getRandomColor } from "../utils/get-random-color";
import { v1 } from "uuid";
import getRandomPaletteName from "../utils/get-random-palette-name";

export function getPalettesFromStorage() {

}

export function getRandomPalettes(count: number) : Array<PaletteDTO> {
    const returnList: Array<PaletteDTO> = [];

    for(let i = 0; i < count; i++) {
        returnList.push({
            name: getRandomPaletteName(), 
            id: v1(),
            normalColor: getRandomColor(),
            luminenceStep: 30,
            range: 10,
        })
    }

    return returnList;
}