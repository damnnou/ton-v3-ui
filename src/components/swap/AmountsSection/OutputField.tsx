import React from "react";
import { InputField } from "./InputField";
import { Jetton } from "../../../constants/jettons";

export const OutputField: React.FC<OutputFieldProps> = ({ isLoading, onClick, selectedToken, className, value }) => {
    return (
        <InputField isLoading={isLoading} className={className} disabled onClick={onClick} selectedToken={selectedToken} value={value} />
    );
};

interface OutputFieldProps {
    isLoading?: boolean;
    className?: string;
    selectedToken: Jetton;
    onClick: () => void;
    value: number | undefined;
}
