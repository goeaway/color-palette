import { HSL } from "../types";
import { getRandomNumberInRange, getRandomNumberBy } from "./get-random-number";

export const getRandomColor = (h?: number, s?: number, l?: number) : HSL => ({
    h: h || getRandomNumberBy(360),
    s: s || getRandomNumberBy(100),
    l: l || getRandomNumberInRange(15, 75) // make sure we don't get really dark or really light
});