import styled from "styled-components";
import React, { FC, useState, useEffect, useRef } from "react";
import Popover from "../popover";

export interface CircularIconButtonProps {
    onClick?: () => void;
    lg?: boolean;
    sm?: boolean;
    title?: string;
    titleDisplayDirection?: string;
    disableTitle?: boolean;
    disabled?: boolean;
}

const CircularIconButton: FC<CircularIconButtonProps> = ({ children, lg, sm, title, titleDisplayDirection, onClick, disabled, disableTitle }) => {
    const [hovering, setHovering] = useState(false);
    const [show, setShow] = useState(false);

    // creates delay so tooltip only shows if user is lingering on this button
    useEffect(() => {
        if(hovering) {
            const timeout = setTimeout(() => {
                if(hovering) {
                    setShow(true);
                }
            }, 500);

            return () => clearTimeout(timeout);
        } else if(show) {
            setShow(false);
        }
    }, [hovering]);

    const mouseEnterHandler = () => {
        setHovering(true);
    }

    const mouseLeaveHandler = () => {
        setHovering(false);
    }

    return (
        <Popover transitionMS={100} content={title && !disableTitle && (<Tooltip>{title}</Tooltip>)} show={!disableTitle && show} position={titleDisplayDirection}>
            <CircularIconButtonStyle 
                onMouseOver={mouseEnterHandler} 
                onMouseEnter={mouseEnterHandler} 
                onMouseLeave={mouseLeaveHandler}
                lg={lg}
                sm={sm}
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </CircularIconButtonStyle>
        </Popover>
    );
}

export default CircularIconButton;

export interface CircularIconButtonStyleProps {
    lg?: boolean;
    sm?: boolean;
}

const CircularIconButtonStyle = styled.button`
    outline: none;
    color: inherit;
    background: none;
    border: none;
    transition: background .3s ease;
    display:flex;
    justify-content: center;
    align-items: center;
    width: ${(p: CircularIconButtonStyleProps) => p.lg ? "36px" : p.sm ? "20px" : "30px"};
    height: ${(p: CircularIconButtonStyleProps) => p.lg ? "36px" : p.sm ? "20px" : "30px"};
    font-size: ${(p: CircularIconButtonStyleProps) => p.lg ? "18px" : p.sm ? "10px" : ""};
    border-radius: 50%;
    cursor: pointer !important;

    &:hover {
        background: rgba(0,0,0,0.2);
    }

    &:disabled {
        cursor: default !important;
    }
`

const Tooltip = styled.div`
    z-index: 2000;
    background: white;
    display:flex;
    font-size: 12px;
    opacity: .9;
    padding: .25rem .35rem;
    background: #131313;
    color: #e0e0e0;
    border-radius: 3px;
    box-shadow:
        0 2.8px 2.2px rgba(0, 0, 0, 0.02),
        0 6.7px 5.3px rgba(0, 0, 0, 0.028),
        0 12.5px 10px rgba(0, 0, 0, 0.035),
        0 22.3px 17.9px rgba(0, 0, 0, 0.042),
        0 41.8px 33.4px rgba(0, 0, 0, 0.05),
        0 100px 80px rgba(0, 0, 0, 0.07)
    ;
`