import { get, set } from "../services/storage-service";
import { SettingsState } from "./types";

const STATE_KEY = "app_state_palette";

export const loadState = () : SettingsState => {
    return get<SettingsState>(STATE_KEY);
}

export const storeState = (state: SettingsState) => {
    set(STATE_KEY, state);
}