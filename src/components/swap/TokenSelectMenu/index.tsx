import React from "react";
import ArrowBtn from "src/assets/arrow.svg";
import { MenuState } from "../../../types/token-menu";
import { cn } from "../../../lib/cn";
import { Jetton, jettons } from "src/constants/jettons";

const TokenSelectMenu: React.FC<TokenSelectMenuProps> = ({ onClick, onSelect, selectedToken }) => {
    return (
        <fieldset className="w-[500px] h-[400px] -m-4">
            <label onClick={() => onClick(MenuState.CLOSED)} className="flex items-center gap-2 cursor-pointer px-8 py-6">
                <img alt="Arrow" width={14} height={14} className="rotate-90" src={ArrowBtn} />
                <p className="text-token-select">Select a token</p>
            </label>
            <ul>
                {Object.keys(jettons).map((token) => {
                    const isTokenSelected = selectedToken.address === jettons[token as keyof typeof jettons].address;
                    return (
                        <li
                            onClick={() => !isTokenSelected && onSelect(token)}
                            className={cn(
                                "flex items-center gap-4 w-full px-8 py-3 transition-all ease-in-out duration-300 ",
                                isTokenSelected
                                    ? "bg-div-disabled text-text-disabled cursor-not-allowed hover:bg-div-disabled"
                                    : "hover:bg-dark cursor-pointer"
                            )}
                            key={token}
                            value={token}
                        >
                            <img alt={`${token} Logo`} width={32} height={32} src={jettons[token as keyof typeof jettons].logo} />
                            <span className="text-token-select">{token}</span>
                        </li>
                    );
                })}
            </ul>
        </fieldset>
    );
};

interface TokenSelectMenuProps {
    onClick: (state: MenuState) => void;
    onSelect: (token: string) => void;
    selectedToken: Jetton;
}

export default TokenSelectMenu;
