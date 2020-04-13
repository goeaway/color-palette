import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/app";

const root = document.createElement("div");
root.id = "color-palette-root";

document.body.append(root);


ReactDOM.render(
    <App />,
    root
);