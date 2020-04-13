import { RangeSetRequest, RANGE_SET, LuminenceStepSetRequest, LUMINENCE_STEP_SET, MinPaletteSetRequest, MIN_PALETTE_SET, PreferredColorTypeSetRequest, PREFERRED_COLOR_TYPE_SET } from "../types"

export const setRange = (range: number) : RangeSetRequest => ({
    type: RANGE_SET,
    range
});

export const setLuminenceStep = (luminenceStep: number) : LuminenceStepSetRequest => ({
    type: LUMINENCE_STEP_SET,
    luminenceStep
});

export const setMinPalette = (minPalette: number) : MinPaletteSetRequest => ({
    type: MIN_PALETTE_SET,
    minPalette
});

export const setPreferredColorType = (preferredColorType: string) : PreferredColorTypeSetRequest => ({
    type: PREFERRED_COLOR_TYPE_SET,
    preferredColorType
});

