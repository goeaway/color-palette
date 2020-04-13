import React, { FC, useState, useEffect } from "react";
import { Settings } from "../types";
import styled, {css} from "styled-components";

export interface SettingsPopoverProps {
    settings: Settings;
    onChange: (settings: Settings) => void;
}

const SettingsPopover: FC<SettingsPopoverProps> = ({ settings, onChange }) => {
    const [range, setRange] = useState(settings.range);
    const [step, setStep] = useState(settings.luminenceStep);
    const [type, setType] = useState(settings.preferredColorType);

    useEffect(() => {
        onChange({ luminenceStep: step, range: range, preferredColorType: type });
    }, [range, step, type]);

    const rangeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRange(parseInt(event.target.value));
    }

    const stepChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStep(parseInt(event.target.value));
    }

    const typeChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value);
    }

    return (
        <Container>
            <InputWrapper>
                <InputLabel>Luminence Range</InputLabel>
                <Input min="0" max="10" type="number" value={settings.range} onChange={rangeChangeHandler} />
                <InputHelp></InputHelp>
            </InputWrapper>
            <InputWrapper>
                <InputLabel>Luminence Step</InputLabel>
                <Input min="1" max="10" type="number" value={settings.luminenceStep} onChange={stepChangeHandler} />
                <InputHelp></InputHelp>
            </InputWrapper>
            <InputWrapper>
                <InputLabel>Color Type</InputLabel>
                <Select value={settings.preferredColorType} onChange={typeChangeHandler}>
                    <option value="hex">Hex</option>
                    <option value="rgb">RGB</option>
                    <option value="hsl">HSL</option>
                </Select>
                <InputHelp></InputHelp>
            </InputWrapper>
        </Container>
    )
};

export default SettingsPopover;

const Container = styled.div`
    display:flex;
    flex-direction: column;
`

const InputWrapper = styled.div`
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
`

const InputLabel = styled.label`
    font-size: 12px;
    margin-bottom: .25rem;
    
`

const Input = styled.input`
    border-radius: 3px;
    width: 100%;
    padding: .5rem;
    outline: none;
    transition: color .3s ease;
    border: 1px solid #ccc;
`;

const Select = styled.select`
    border-radius: 3px;
    padding: .5rem;
    outline: none;
    transition: color .3s ease;
    border: 1px solid #ccc;
`;

const InputHelp = styled.div``;