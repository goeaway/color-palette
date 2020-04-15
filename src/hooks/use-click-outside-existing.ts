import React, { useEffect, MutableRefObject } from "react";

const useClickOutsideExisting = (ref: MutableRefObject<any>, callback: () => void) => {
    useEffect(() => {
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

export default useClickOutsideExisting;