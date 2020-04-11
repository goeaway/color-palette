export interface PaletteDTO {
    id: number;
    normalColor: string;
    luminenceStep: number;
    range: number;
    name: string;
    locked: boolean;
    index: number;
}

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface HSL {
    h: number;
    s: number;
    l: number;
}

export enum TooltipPosition {
    left = "left",
    top = "up",
    right = "right",
    bottom = "bottom"
}