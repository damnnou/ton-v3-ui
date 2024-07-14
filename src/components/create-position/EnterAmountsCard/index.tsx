import { useCallback } from "react";
import { JettonLogo } from "src/components/common/JettonLogo";
import { Input } from "src/components/ui/Input";
import { useTonConnect } from "src/hooks/common/useTonConnect";
import { useJettonBalance } from "src/hooks/jetton/useJettonBalance";
import { Jetton } from "src/sdk/src";

interface EnterAmountsCardProps {
    currency: Jetton | undefined;
    value: string;
    handleChange: (value: string) => void;
}

const EnterAmountsCard = ({ currency, value, handleChange }: EnterAmountsCardProps) => {
    const { wallet: account } = useTonConnect();

    const balance = useJettonBalance(currency?.address, account);

    const handleInput = useCallback((value: string) => {
        if (value === ".") value = "0.";
        handleChange(value);
    }, []);

    function setMax() {
        handleChange(balance || "0");
    }

    return (
        <div className="flex w-full bg-card-dark p-3 rounded-2xl">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <JettonLogo jetton={currency} size={35} />
                    <span className="font-bold text-lg">{currency ? currency.symbol : "Select a token"}</span>
                </div>
                {currency && account && (
                    <div className={"flex text-sm whitespace-nowrap"}>
                        <div>
                            <span className="font-semibold">Balance: </span>
                            <span>{balance}</span>
                        </div>
                        <button className="ml-2 text-[#63b4ff]" onClick={setMax}>
                            Max
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-end w-full">
                <Input
                    value={value}
                    id={`amount-${currency?.symbol}`}
                    onUserInput={(v) => handleInput(v)}
                    className={`text-right border-none text-xl font-bold w-9/12 p-0`}
                    placeholder={"0.0"}
                    maxDecimals={currency?.decimals}
                />
                {/* <div className="text-sm">{fiatValue && formatUSD.format(fiatValue)}</div> */}
            </div>
        </div>
    );

    // return (
    //   <div
    //       className="flex flex-col justify-between w-full relative">
    //     <div
    //     className="absolute text-right">
    //       {/* // {`Balance: ${displayNumber(balance)}`} */}
    //       {`Balance: ${balance.toString()}`}
    //     </div>

    //     <div
    //     className="flex items-center justify-between">
    //       <div className="flex items-center p-2">
    //         {/* <EquilibreAvatar
    //           src={asset?.logoURI || ''}
    //           size={'md'}
    //           ml={1}
    //           mr={4}
    //         /> */}
    //         <Input value={value} onChange={v => handleChange(v.target.value)} />
    //         {/* <InputGroup flexDirection={'column'}>
    //           <NumberInput
    //             step={0.1}
    //             colorScheme="white"
    //             variant={'unstyled'}
    //             value={value}
    //             onChange={handleChange}>
    //             <NumberInputField
    //               fontSize={'2xl'}
    //               placeholder="0"
    //               textAlign={'left'}
    //             />
    //           </NumberInput>
    //         </InputGroup> */}
    //       </div>
    //       <Button
    //         onClick={setMax}>
    //         MAX
    //       </Button>
    //     </div>
    //     <div className="mt-4">
    //       {error ? (
    //         <div className="flex flex-col absolute">
    //           {error}
    //         </div>
    //       ) : needApprove ? (
    //         <Button
    //           disabled={!approve || isApprovalLoading}
    //           onClick={() => approve()}>
    //           {isApprovalLoading ? 'Loading...' : `Approve ${currency?.symbol}`}
    //         </Button>
    //       ) : valueForApprove ? (
    //         <div className="absolute">
    //           {/* <CheckIcon /> */}
    //           Approved
    //         </div>
    //       ) : null}
    //     </div>
    //   </div>
    // );
};

export default EnterAmountsCard;
