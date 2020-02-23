export interface PaletteDTO {
    id: number;
    normalColor: string;
    luminenceStep: number;
    range: number;
    name: string;
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