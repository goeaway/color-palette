import Tooltip from "react-tooltip-lite";
import React, { FC } from "react";
import { TooltipPosition } from "../../types";

interface AppTooltipProps {
    content: string;
    position: TooltipPosition;
}

const AppTooltip : FC<AppTooltipProps> = ({ content, position, children }) => {
    return (
        <Tooltip 
        tagName="div" 
        arrow={false} 
        direction={position.toString()} 
        background="#212121" 
        color="#e0e0e0" 
        padding=".2rem .3rem" 
        content={(
            <div>{content}</div>
        )}>
            {children}
        </Tooltip>
    )
};

export default AppTooltip;