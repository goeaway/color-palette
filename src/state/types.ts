import { Action } from "redux";

export const RANGE_SET =  "RANGE_SET";
export const LUMINENCE_STEP_SET =  "LUMINENCE_STEP_SET";
export const MIN_PALETTE_SET = "MIN_PALETTE_SET";
export const PREFERRED_COLOR_TYPE_SET = "PREFERRED_COLOR_TYPE_SET";

export interface RangeSetRequest extends Action {
    range: number;
}

export interface LuminenceStepSetRequest extends Action {
    luminenceStep: number
}

export interface MinPaletteSetRequest extends Action {
    minPalette: number;
}

export interface PreferredColorTypeSetRequest extends Action {
    preferredColorType: string;
}

export interface SettingsState {
    range: number;
    luminenceStep: number;
    minPalette: number;
    preferredColorType: string;
}