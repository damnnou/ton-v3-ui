import { Dialog, DialogContent, DialogHeader, DialogTitle } from "src/components/ui/Dialog";
import { useEffect, useState } from "react";
import { ExtendedPosition } from "src/hooks/position/useAllPositions";
import { JettonLogo } from "src/components/common/JettonLogo";
import { ManageLiquidity } from "src/types/manage-liquidity";
import { ActionButton, Button } from "src/components/ui/Button";
import { IDerivedMintInfo, useMintActionHandlers, useMintState } from "src/state/mintStore";
import { Field } from "src/sdk/src";
import { Input } from "src/components/ui/Input";
import { useBurnCallback } from "src/hooks/position/useBurnCallback";

export function ManageLiquidityModal({
    position,
    isOpen,
    setIsOpen,
    mintInfo,
}: {
    position: ExtendedPosition;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    mintInfo: IDerivedMintInfo;
}) {
    const [manageLiquidity, setManageLiquidity] = useState<ManageLiquidity>(ManageLiquidity.REMOVE);

    const { independentField, typedValue } = useMintState();

    const { onFieldAInput, onFieldBInput } = useMintActionHandlers(false);

    const formattedAmounts = {
        [independentField]: typedValue,
        [mintInfo.dependentField]: mintInfo.parsedAmounts[mintInfo.dependentField]?.toSignificant(6) ?? "",
    };

    const { callback: burnCallback } = useBurnCallback({ nftAddress: position.nftAddress });

    useEffect(() => {
        return () => {
            onFieldAInput("");
            onFieldBInput("");
        };
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-[500px] rounded-3xl bg-light border-border-light animate-fade-in">
                <DialogHeader>
                    <DialogTitle className="flex w-full font-normal gap-2 items-center p-4 rounded-2xl border border-border-light">
                        <div className="flex justify-center">
                            <JettonLogo size={36} jetton={position.position.pool.jetton0} />
                            <JettonLogo size={36} className="-ml-2" jetton={position.position.pool.jetton1} />
                        </div>
                        <div className="flex flex-col items-start">
                            <p>
                                {position.position.pool.jetton0.symbol} / {position.position.pool.jetton1.symbol}
                            </p>
                            <p className="opacity-50 text-sm">
                                #{position?.tokenId} / {position.position.pool.fee / 100}% Fee
                            </p>
                        </div>
                        <div className="ml-auto bg-green-600 rounded-xl w-fit h-fit p-2 px-4">In range</div>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 w-full h-fit">
                    <div className="flex gap-1 p-1 w-full rounded-2xl border border-border-light items-center justify-between">
                        <Button
                            className={"w-1/2 rounded-xl"}
                            onClick={() => setManageLiquidity(ManageLiquidity.ADD)}
                            variant={manageLiquidity === ManageLiquidity.ADD ? "outlineActive" : "ghost"}
                        >
                            Add Liquidity
                        </Button>
                        <Button
                            className={"w-1/2 rounded-xl"}
                            onClick={() => setManageLiquidity(ManageLiquidity.REMOVE)}
                            variant={manageLiquidity === ManageLiquidity.REMOVE ? "outlineActiveRed" : "ghost"}
                        >
                            Remove Liquidity
                        </Button>
                    </div>
                    {manageLiquidity === ManageLiquidity.ADD ? (
                        <>
                            <h3>Amounts</h3>
                            <div className="flex relative w-full h-fit items-center">
                                <Input
                                    value={formattedAmounts[Field.CURRENCY_A]}
                                    onUserInput={onFieldAInput}
                                    placeholder="Enter amount"
                                    className="w-full rounded-2xl h-12 outline-none text-[18px] px-6"
                                />
                                <div className="absolute right-0 border-l border-border-light px-4 text-opacity-50">
                                    {position.position.pool.jetton0.symbol}
                                </div>
                            </div>
                            <div className="flex relative w-full h-fit items-center">
                                <Input
                                    value={formattedAmounts[Field.CURRENCY_B]}
                                    onUserInput={onFieldBInput}
                                    placeholder="Enter amount"
                                    className="w-full rounded-2xl h-12 outline-none text-[18px] px-6"
                                />
                                <div className="absolute right-0 border-l border-border-light px-4 text-opacity-50">
                                    {position.position.pool.jetton1.symbol}
                                </div>
                            </div>
                        </>
                    ) : null}

                    <h3>Selected Range</h3>
                    <div className="grid grid-cols-2 grid-rows-2 gap-4">
                        <div className="col-span-1 flex flex-col items-center justify-center border rounded-2xl py-4 border-border-light">
                            <p className="opacity-50 text-sm">Min Price</p>
                            <p>{position.position.token0PriceLower.toFixed(4)}</p>
                            <p className="opacity-80 text-sm">
                                {position.position.pool.jetton1.symbol} per {position.position.pool.jetton0.symbol}
                            </p>
                        </div>
                        <div className="col-span-1 flex flex-col items-center justify-center border rounded-2xl py-4 border-border-light">
                            <p className="opacity-50 text-sm">Max Price</p>
                            <p>{position.position.token0PriceUpper.toFixed(4)}</p>
                            <p className="opacity-80 text-sm">
                                {position.position.pool.jetton1.symbol} per {position.position.pool.jetton0.symbol}
                            </p>
                        </div>
                        <div className="col-span-2 flex flex-col items-center justify-center border rounded-2xl py-4 border-border-light">
                            <p className="opacity-50 text-sm">Current Price</p>
                            <p>{position.position.pool.jetton0Price.toFixed(4)}</p>
                            <p className="opacity-80 text-sm">
                                {position.position.pool.jetton1.symbol} per {position.position.pool.jetton0.symbol}
                            </p>
                        </div>
                    </div>
                    {manageLiquidity === ManageLiquidity.ADD ? (
                        <ActionButton>Add liquidity</ActionButton>
                    ) : (
                        <ActionButton onClick={burnCallback} className="bg-primary-red hover:bg-primary-red/80">
                            Remove liquidity
                        </ActionButton>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
