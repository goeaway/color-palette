import * as React from "react";

const useClickOutside = (callback: () => void) => {
    const ref = React.useRef();

    React.useEffect(() => {
        const clickHandler = (ev: MouseEvent) => {
            if(ref && ref.current && !(ref.current as any).contains(ev.target)) {
                callback();
            }
        }

        document.addEventListener("mousedown", clickHandler);

        return () => document.removeEventListener("mousedown", clickHandler);
    });

    return ref;
};

export default useClickOutside;