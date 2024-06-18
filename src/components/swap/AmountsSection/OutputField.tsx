import React from "react";
import { InputField } from "./InputField";
import { Jetton } from "../../../constants/jettons";

export const OutputField: React.FC<OutputFieldProps> = ({ isLoading, onClick, selectedToken, className, value, onChange }) => {
    return (
        <InputField
            onChange={onChange}
            disabled
            isLoading={isLoading}
            className={className}
            onClick={onClick}
            selectedToken={selectedToken}
            value={value}
        />
    );
};

interface OutputFieldProps {
    isLoading?: boolean;
    className?: string;
    selectedToken: Jetton;
    onClick: () => void;
    value: number | undefined;
    onChange?: (value: number) => void;
}
