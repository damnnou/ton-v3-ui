import React from "react";
import ArrowBtn from "src/assets/arrow.svg";
import { MenuState } from "../../../types/token-menu";
import { cn } from "../../../lib/cn";
import { Jetton, jettons } from "src/constants/jettons";
import { useTonConnect } from "src/hooks/common/useTonConnect";
import { CHAIN } from "@tonconnect/ui-react";

const TokenSelectMenu: React.FC<TokenSelectMenuProps> = ({ onClick, onSelect, selectedToken }) => {
    const { network } = useTonConnect();

    const handleClose = () => {
        onClick(MenuState.CLOSED);
    };

    const handleJettonSelect = (jetton: Jetton) => {
        onSelect(jetton);
        onClick(MenuState.CLOSED);
    };
    return (
        <fieldset className="w-[500px] h-[400px] -m-4">
            <label onClick={handleClose} className="flex items-center gap-2 cursor-pointer px-8 py-6">
                <img alt="Arrow" width={14} height={14} className="rotate-90" src={ArrowBtn} />
                <p className="text-token-select">Select a token</p>
            </label>
            <ul>
                {Object.entries(jettons[network || CHAIN.MAINNET]).map((token) => {
                    const isTokenSelected = selectedToken.address === token[1].address;
                    return (
                        <li
                            onClick={() => !isTokenSelected && handleJettonSelect(token[1])}
                            className={cn(
                                "flex items-center gap-4 w-full px-8 py-3 transition-all ease-in-out duration-300 ",
                                isTokenSelected
                                    ? "bg-div-disabled text-text-disabled cursor-not-allowed hover:bg-div-disabled"
                                    : "hover:bg-dark cursor-pointer"
                            )}
                            key={token[0]}
                        >
                            <img className="rounded-full" alt={`${token} Logo`} width={32} height={32} src={token[1].logo} />
                            <span className="text-token-select">{token[0]}</span>
                        </li>
                    );
                })}
            </ul>
        </fieldset>
    );
};

interface TokenSelectMenuProps {
    onClick: (state: MenuState) => void;
    onSelect: (token: Jetton) => void;
    selectedToken: Jetton;
}

export default TokenSelectMenu;
