import React, { useEffect, useState } from "react";
import ArrowBtn from "src/assets/arrow.svg";
import { MenuState } from "src/types/token-menu";
import { cn } from "src/lib/cn";
import { Jetton } from "src/constants/jettons";
import { useTokensState } from "src/state/tokensStore";
import { JettonLogo } from "src/components/common/JettonLogo";
import { Input } from "src/components/ui/Input";
import { Check, Copy, Search } from "lucide-react";
import { Address } from "ton-core";
import { useJetton } from "src/hooks/jetton/useJetton";
import { useJettonBalance } from "src/hooks/jetton/useJettonBalance";
import { formatUnits } from "src/utils/common/formatUnits";
import { Skeleton } from "src/components/ui/Skeleton";

const TokenSelectMenu: React.FC<TokenSelectMenuProps> = ({ onClick, onSelect, selectedToken }) => {
    const [searchValue, setSearchValue] = useState("");
    const [tokenToImport, setTokenToImport] = useState("");

    const {
        importedTokens,
        actions: { importToken },
    } = useTokensState();

    const allTokens = Object.values(importedTokens);

    const newToken = useJetton(tokenToImport);

    const handleClose = () => {
        onClick(MenuState.CLOSED);
    };

    const handleJettonSelect = (jetton: Jetton) => {
        onSelect(jetton);
        onClick(MenuState.CLOSED);
    };

    const handleImportToken = () => {
        if (!newToken) return;
        importToken(newToken);
    };

    useEffect(() => {
        if (!searchValue || !allTokens) return;
        if (Address.isFriendly(searchValue) && !allTokens.find((jetton) => jetton.address.toString(true) === searchValue)) {
            setTokenToImport(searchValue);
        }
    }, [searchValue, allTokens]);

    return (
        <div className="w-[calc(100%+32px)] h-[600px] self-center">
            <div className="flex flex-col gap-4 p-6 pt-2 border-0 border-border-light">
                <div onClick={handleClose} className="flex items-center gap-2 cursor-pointer w-fit">
                    <img alt="Arrow" width={14} height={14} className="rotate-90" src={ArrowBtn} />
                    <p className="text-token-select">Select a token</p>
                </div>
                <div className="relative flex items-center">
                    <Input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full mx-auto rounded-xl h-14 text-xl pl-12"
                        placeholder="Search name or address"
                    />
                    <Search className="absolute left-4 text-border" size={20} />
                </div>
            </div>
            <div className="overflow-auto h-[414px]">
                <ul className="empty:after:content-['No_results_found.'] empty:after:text-border-light empty:after:text-xl empty:pt-10">
                    {newToken && (
                        <JettonRow
                            key={newToken.symbol}
                            onSelect={() => {
                                handleImportToken();
                                handleJettonSelect(newToken);
                            }}
                            isSelected={false}
                            jetton={newToken}
                        />
                    )}
                    {allTokens.map((jetton) => {
                        if (
                            !jetton.symbol.toLowerCase().includes(searchValue.toLowerCase()) &&
                            !jetton.name.toLowerCase().includes(searchValue.toLowerCase())
                        ) {
                            return null;
                        }
                        const isTokenSelected = selectedToken.address === jetton.address;
                        return <JettonRow key={jetton.symbol} onSelect={handleJettonSelect} isSelected={isTokenSelected} jetton={jetton} />;
                    })}
                </ul>
            </div>
        </div>
    );
};

const JettonRow = ({ onSelect, isSelected, jetton }: { onSelect: (jetton: Jetton) => void; isSelected: boolean; jetton: Jetton }) => {
    const [isCopied, setIsCopied] = useState(false);
    const balance = useJettonBalance(jetton.address);

    const handleCopy = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(jetton.address.toString(true)).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 3000);
        });
    };

    return (
        <li
            onClick={() => !isSelected && onSelect(jetton)}
            className={cn(
                "flex items-center gap-4 w-full px-8 py-3 transition-all ease-in-out duration-300 group",
                isSelected ? "bg-div-disabled text-text-disabled cursor-not-allowed hover:bg-div-disabled" : "hover:bg-dark cursor-pointer"
            )}
            key={jetton.symbol}
        >
            <JettonLogo jetton={jetton} size={32} />
            <span className="text-token-select">{jetton.symbol}</span>
            <button className="invisible group-hover:visible" onClick={handleCopy}>
                {isCopied ? <Check opacity={0.5} size={16} /> : <Copy opacity={0.8} size={16} />}
            </button>
            {balance === undefined ? (
                <Skeleton className="ml-auto w-12 h-6" />
            ) : (
                balance && <span className="ml-auto text-lg">{formatUnits(Number(balance), jetton.decimals).toLocaleString()}</span>
            )}
        </li>
    );
};

interface TokenSelectMenuProps {
    onClick: (state: MenuState) => void;
    onSelect: (token: Jetton) => void;
    selectedToken: Jetton;
}

export default TokenSelectMenu;
