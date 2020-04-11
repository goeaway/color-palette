import * as React from "react";
import { FaRainbow } from "react-icons/fa";
import styled from "styled-components";

const Backdrop : React.FC = () => {
    return (
        <BackdropDiv>
            <FaRainbow />
        </BackdropDiv>
    )
}

export default Backdrop;

const BackdropDiv = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    color: rgba(0,0,0,0.05);
    font-size: 40rem;
    display:flex;
    justify-content: center;
    align-items: center;
`;
