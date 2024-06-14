import React from "react";
import ArrowBtn from "src/assets/arrow.svg";
import { JettonLogo } from "src/components/common/JettonLogo";
import { Spinner } from "src/components/ui/Spinner";
import { Jetton } from "src/constants/jettons";

export const InputField: React.FC<InputFieldProps> = ({ isLoading, onClick, onChange, selectedToken, disabled, value }) => {
    const handleOnChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        if (!onChange) return;
        const value = Number(target.value);

        onChange(Math.abs(value));
    };

    return (
        <label className="flex w-full items-center h-[104px] border-2 border-border-light rounded-2xl bg-dark">
            <div
                onClick={onClick}
                className="flex w-1/2 p-2 sm:p-4 ml-3 rounded-xl h-3/4 hover:bg-light items-center gap-4 cursor-pointer transition-all ease-in-out duration-300"
            >
                <JettonLogo jetton={selectedToken} size={40} />
                <p className="font-semibold text-token-select">{selectedToken.symbol}</p>
                <img className="max-sm:hidden" src={ArrowBtn} />
            </div>
            {!isLoading ? (
                <input
                    onChange={handleOnChange}
                    disabled={disabled}
                    value={value ? value.toString() : ""}
                    type="number"
                    placeholder={disabled ? "" : "0.00"}
                    className="w-1/2 h-3/4 p-4 mr-2 md:mr-4 ml-auto text-token-select outline-none bg-transparent text-right rounded-xl"
                />
            ) : (
                <div className="flex items-center justify-end w-1/2 h-3/4 p-4 mr-2 ml-auto bg-transparent ">
                    <Spinner />
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
