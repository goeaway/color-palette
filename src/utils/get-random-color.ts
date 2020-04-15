import { HSL } from "../types";
import { getRandomNumberInRange, getRandomNumberBy } from "./get-random-number";

export const getRandomColor = (h?: number, s?: number, l?: number) : HSL => ({
    h: Math.floor(h || getRandomNumberBy(360)),
    s: Math.floor(s || getRandomNumberBy(100)),
    l: Math.floor(l || getRandomNumberInRange(15, 75)) // make sure we don't get really dark or really light
});