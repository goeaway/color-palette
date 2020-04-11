import styled from "styled-components";

export interface CircularIconButtonStyleProps {
    lg?: boolean;
    sm?: boolean;
}

const CircularIconButton = styled.button`
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
    margin: 0 .15rem;
    cursor: pointer !important;

    &:hover {
        background: rgba(0,0,0,0.2);
    }

    &:first-child {
        margin-left: 0;
    }

    &:last-child {
        margin-right: 0;
    }
`

export default CircularIconButton;