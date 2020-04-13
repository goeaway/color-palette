import React, { FC, ReactNode } from "react";
import Popover from "../popover";
import styled from "styled-components";

export interface InfoPopoverProps {
    show: boolean;
    content: ReactNode;
    onClose?: () => void;
}

const InfoPopover : FC<InfoPopoverProps> = ({ children, show, content, onClose }) => {
    return (
        <Popover position="left-top" content={<InfoPopoverContent>{content}</InfoPopoverContent>} show={show} onClose={onClose}>
            {children}
        </Popover>
    )
}

export default InfoPopover;

const InfoPopoverContent = styled.div`
    padding: 2rem;
    border-radius: 3px;
    background: white;
    box-shadow:
        0 2.8px 2.2px rgba(0, 0, 0, 0.02),
        0 6.7px 5.3px rgba(0, 0, 0, 0.028),
        0 12.5px 10px rgba(0, 0, 0, 0.035),
        0 22.3px 17.9px rgba(0, 0, 0, 0.042),
        0 41.8px 33.4px rgba(0, 0, 0, 0.05),
        0 100px 80px rgba(0, 0, 0, 0.07)
    ;
`
