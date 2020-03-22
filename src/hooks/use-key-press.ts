import * as React from "react";

const useKeyPress = (targetKey: React.Key) => {
    const [keyPressed, setKeyPressed] = React.useState(false);

    React.useEffect(() => {
        const downHandler = (event: KeyboardEvent) => {
            if(event.key == targetKey) {
                setKeyPressed(true);
            }
        };

        const upHandler = (event: KeyboardEvent) => {
            if(event.key == targetKey) {
                setKeyPressed(false);
            }
        }

        document.addEventListener('keydown', downHandler);
        document.addEventListener('keyup', upHandler);

        return () => {
            document.removeEventListener('keydown', downHandler);
            document.addEventListener('keyup', upHandler);
        }
    }, []);

    return keyPressed;
};

export default useKeyPress;