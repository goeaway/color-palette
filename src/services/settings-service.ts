import { get, set } from "./storage-service";
import { Settings } from "../types";

const SETTINGS_KEY = "settings";

export const getSettings = () : Settings => {
    return get<Settings>(SETTINGS_KEY) || {
        luminenceStep: 5,
        range: 5,
        preferredColorType: "hex"
    }
}

export const storeSettings = (settings: Settings) => {
    set(SETTINGS_KEY, settings);
}