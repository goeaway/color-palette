import { Action } from "redux";
import { RANGE_SET, LUMINENCE_STEP_SET, MIN_PALETTE_SET, PREFERRED_COLOR_TYPE_SET, SettingsState, RangeSetRequest, LuminenceStepSetRequest, MinPaletteSetRequest, PreferredColorTypeSetRequest } from "../types";

const DEFAULT_STATE : SettingsState = {
    range: 5,
    minPalette: 5,
    luminenceStep: 4,
    preferredColorType: "hex"
}

export function settingsMutator(state: SettingsState = DEFAULT_STATE, action: Action) {
    switch(action.type) {
        case RANGE_SET: {
            return Object.assign({}, state, {
                range: (action as RangeSetRequest).range
            });
        }
        case LUMINENCE_STEP_SET: {
            return Object.assign({}, state, {
                luminenceStep: (action as LuminenceStepSetRequest).luminenceStep
            });
        }
        case MIN_PALETTE_SET: {
            return Object.assign({}, state, {
                minPalette: (action as MinPaletteSetRequest).minPalette
            });
        }
        case PREFERRED_COLOR_TYPE_SET: {
            return Object.assign({}, state, {
                preferredColorType: (action as PreferredColorTypeSetRequest).preferredColorType                
            });
        }
        default: {
            return state;
        }
    }
}