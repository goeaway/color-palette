import React, { FC, useState, useEffect, ReactNode } from "react";
import styled, { css } from "styled-components";
import useClickOutside from "../hooks/use-click-outside";

export interface PopoverProps {
    show: boolean;
    content: ReactNode;
    transitionMS?: number;
    position?: string;
    onClose?: () => void;
    disabled?: boolean;
}

const dummy = () => {};

const Popover : FC<PopoverProps> = ({ disabled, show, content, children, transitionMS, onClose, position }) => {
    const tranMS = transitionMS || 300;

    const [innerShow, setInnerShow] = useState(false);
    const [transitioned, setTransitioned] = useState(false);
    

    const clickOutSideRef = useClickOutside(onClose || dummy);

    useEffect(() => {
        if(!transitioned) {
            const timeout = setTimeout(() => {
                setInnerShow(false);
            }, tranMS);
        
            return () => clearTimeout(timeout);
        } 
    }, [transitioned]);

    useEffect(() => {
        if(innerShow) {
            const timeout = setTimeout(() => {
                setTransitioned(true);
            }, tranMS);
        
            return () => clearTimeout(timeout);
        }
    }, [innerShow]);

    useEffect(() => {
        if(show) {
            setInnerShow(true);
        } else {
            setTransitioned(false);
        }
    }, [show]);

    return (
        <>{!disabled && 
            <PopoverWrapper ref={clickOutSideRef}>
                {innerShow && <PopoverContent position={position} transitionMS={tranMS} show={transitioned}>{content}</PopoverContent>}
                {children}
            </PopoverWrapper>}
        </>
    );
}

export default Popover;

const PopoverWrapper = styled.div`
    position: relative;
    z-index: 2000;
`

interface PopoverContentStyleProps {
    show: boolean;
    transitionMS: number;
    position: string;
}

const PopoverContent = styled.div`
    white-space: nowrap;
    position: absolute;
    opacity: 0;
    visibility: hidden;
    transition: all ${(p: PopoverContentStyleProps) => p.transitionMS}ms ease;
    z-index: 2000;
    display:flex;
    align-items: center;
    justify-content: center;

    ${(p: PopoverContentStyleProps) => p.show && css`
        opacity: 1;
        visibility: visible;
    `}

    ${(p: PopoverContentStyleProps) => p.position === "top" && css`
        top: -100%;
        left: 50%;
        right: 50%;
    `}

    ${(p: PopoverContentStyleProps) => p.position === "bottom" && css`
        bottom: 100%;
        left: 50%;
        right: 50%;
    `}

    ${(p: PopoverContentStyleProps) => p.position === "left" && css`
        top: 50%;
        right: 110%;
        bottom: 50%;
    `}

    ${(p: PopoverContentStyleProps) => p.position === "left-top" && css`
        top: 0;
        right: 110%;
    `}

    ${(p: PopoverContentStyleProps) => p.position === "right" && css`
        top: 50%;
        left: 110%;
        bottom: 50%;
    `}
`