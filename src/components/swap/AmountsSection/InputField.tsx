import React from "react";
import ArrowBtn from "src/assets/arrow.svg";
import SpinnerSVG from "src/assets/spinner.svg";
import { Jetton } from "src/constants/jettons";

export const InputField: React.FC<InputFieldProps> = ({ isLoading, onClick, onChange, selectedToken, disabled, value }) => {
    return (
        <label className="flex w-full items-center min-h-[104px] h-full border-2 border-border-light rounded-2xl bg-dark">
            <div
                onClick={onClick}
                className="flex w-1/2 p-4 ml-3 rounded-xl h-3/4 hover:bg-light items-center gap-4 cursor-pointer transition-all ease-in-out duration-300"
            >
                <img className="rounded-full" width={40} height={40} src={selectedToken.logo} />
                <p className="font-semibold text-token-select">{selectedToken.symbol}</p>
                <img src={ArrowBtn} />
            </div>
            {!isLoading ? (
                <input
                    onChange={(e) => onChange && onChange(Number(e.target.value))}
                    disabled={disabled}
                    value={value}
                    type="number"
                    placeholder={disabled ? "" : "0.00"}
                    className="w-1/2 h-3/4 p-4 mr-4 ml-auto text-token-select outline-none bg-transparent text-right"
                />
            ) : (
                <div className="flex items-center justify-end w-1/2 h-3/4 p-4 mr-2 ml-auto bg-transparent ">
                    <img className="p-0 m-0" width={42} height={42} src={SpinnerSVG} />
                </div>
            )}
        </label>
    );
};

interface InputFieldProps {
    isLoading?: boolean;
    className?: string;
    onClick: () => void;
    onChange?: (value: number) => void;
    selectedToken: Jetton;
    disabled?: boolean;
    value: number | undefined;
}
