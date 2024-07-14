import { useCallback, useEffect, useState } from "react";
import { Button } from "src/components/ui/Button";
import { Input } from "src/components/ui/Input";
import { Jetton, Price } from "src/sdk/src";
import { useMintState } from "src/state/mintStore";

export interface RangeSelectorPartProps {
    value: string;
    onUserInput: (value: string) => void;
    decrement: () => string;
    increment: () => string;
    decrementDisabled?: boolean;
    incrementDisabled?: boolean;
    label?: string;
    width?: string;
    locked?: boolean;
    initialPrice: Price<Jetton, Jetton> | undefined;
    disabled: boolean;
    title: string;
}

const RangeSelectorPart = ({
    value,
    decrement,
    increment,
    decrementDisabled = false,
    incrementDisabled = false,
    locked,
    onUserInput,
    disabled,
    title,
}: RangeSelectorPartProps) => {
    const [localUSDValue, setLocalUSDValue] = useState("");
    const [localTokenValue, setLocalTokenValue] = useState("");

    const {
        initialTokenPrice,
        actions: { updateSelectedPreset },
    } = useMintState();

    const handleOnBlur = useCallback(() => {
        onUserInput(localTokenValue);
    }, [localTokenValue, localUSDValue, onUserInput]);

    const handleDecrement = useCallback(() => {
        onUserInput(decrement());
    }, [decrement, onUserInput]);

    const handleIncrement = useCallback(() => {
        onUserInput(increment());
    }, [increment, onUserInput]);

    useEffect(() => {
        if (value) {
            setLocalTokenValue(value);
            if (value === "∞") {
                setLocalUSDValue(value);
                return;
            }
        } else if (value === "") {
            setLocalTokenValue("");
            setLocalUSDValue("");
        }
    }, [initialTokenPrice, value]);

    useEffect(() => {
        return () => updateSelectedPreset(null);
    }, []);

    return (
        <div>
            <div className="font-bold text-xs mb-3">{title.toUpperCase()}</div>
            <div className="flex relative">
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={handleDecrement}
                    disabled={decrementDisabled || disabled}
                    className="border border-card-border rounded-xl rounded-r-none"
                >
                    -
                </Button>

                <Input
                    type={"text"}
                    value={localTokenValue}
                    id={title}
                    onBlur={handleOnBlur}
                    disabled={disabled || locked}
                    onUserInput={(v) => {
                        setLocalTokenValue(v);
                        updateSelectedPreset(null);
                    }}
                    placeholder={"0.00"}
                    className="w-full bg-card-dark border-y border-x-0 border-card-border rounded-none text-sm h-[36px]"
                />

                <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={handleIncrement}
                    disabled={incrementDisabled || disabled}
                    className="border border-card-border rounded-xl rounded-l-none"
                >
                    +
                </Button>
            </div>
        </div>
    );
};

export default RangeSelectorPart;
