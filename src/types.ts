export interface PaletteDTO {
    id: number;
    normalColor: HSL;
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

export interface Settings {
    preferredColorType: string;
    luminenceStep: number;
    range: number;
}