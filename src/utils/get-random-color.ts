import { HSL } from "../types";

export const getRandomColor = () : HSL => ({
    h: Math.floor(Math.random() * 360),
    s: Math.floor(Math.random() * 100),
    l: Math.floor(Math.random() * (90 - 10) + 10) // make sure we don't get really dark or really light
});