import { useState, useEffect, SetStateAction, Dispatch } from "react";

const useResetFlagAfter = (resetMS: number) : [boolean, Dispatch<SetStateAction<boolean>>] => {
    const [value,setValue] = useState(false);

    useEffect(() => {
        if(value) {
            const timeout = setTimeout(() => {
                setValue(false);
            }, resetMS);

            return () => clearTimeout(timeout);
        }
    }, [value]);

    return [value, setValue];
}

export default useResetFlagAfter;