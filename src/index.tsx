import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/app";
import { Provider } from "react-redux"
import { createStore } from "redux";
import { settingsMutator } from "./state/mutator/settings-mutator";
import { loadState, storeState } from "./state/local-storage";

const root = document.createElement("div");
root.id = "color-palette-root";

document.body.append(root);

const store = createStore(settingsMutator, loadState());

store.subscribe(() => storeState(store.getState()))

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    root
);