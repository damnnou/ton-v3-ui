import { ChevronDown } from "lucide-react";
import { JettonLogo } from "src/components/common/JettonLogo";
import { Input } from "src/components/ui/Input";
import { Jetton } from "src/sdk/src/entities/Jetton";
import { useTokenMenuState } from "src/state/tokenMenuStore";
import { MenuState } from "src/types/token-menu";

interface TokenSwapCardProps {
    handleValueChange?: (value: string) => void;
    value: string;
    currency: Jetton | null | undefined;
    menuType: MenuState;
    disabled?: boolean;
}

const TokenCard = ({ handleValueChange, value, currency, disabled, menuType }: TokenSwapCardProps) => {
    const {
        actions: { setMenuState },
    } = useTokenMenuState();

    const handleInput = (value: string) => {
        if (value === ".") value = "0.";
        handleValueChange?.(value);
    };

    return (
        <label className="flex w-full gap-4 items-center h-[104px] border-2 border-border-light rounded-2xl bg-dark">
            <div
                onClick={() => setMenuState(menuType)}
                className="flex w-full p-2 sm:p-4 ml-3 rounded-xl h-3/4 hover:bg-light items-center gap-4 cursor-pointer transition-all ease-in-out duration-300"
            >
                {currency && <JettonLogo jetton={currency} size={40} />}
                <p className="font-semibold text-token-select">{currency?.symbol}</p>
                <ChevronDown />
            </div>
            <Input
                disabled={disabled}
                type={"text"}
                value={value}
                id={`amount-${currency?.symbol}`}
                onUserInput={(v) => handleInput(v)}
                className="w-full h-3/4 p-4 mr-2 md:mr-4 ml-auto text-token-select outline-none bg-transparent text-right rounded-xl"
                placeholder={"0.0"}
                maxDecimals={currency?.decimals}
            />
        </label>
    );
};

export default TokenCard;
