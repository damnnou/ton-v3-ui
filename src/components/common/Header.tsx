import { CHAIN, TonConnectButton } from "@tonconnect/ui-react";
import Navigation from "./Navigation";
import { useTonConnect } from "src/hooks/common/useTonConnect";

const Header = () => (
    <header className="sticky top-4 z-10 flex justify-between items-center p-2 bg-light border-2 border-border-light rounded-2xl gap-4">
        <Algebra />
        <Navigation />
        <Account />
    </header>
);

const Algebra = () => (
    <div className="flex items-center gap-2 w-1/3">
        <div className="flex items-center gap-6 py-1 px-4 bg-card text-xl rounded-3xl hover:bg-card-hover duration-200">
            <img className="rotate-180 scale-x-[-1]" width={32} src="/algebra-icon.png" />
            <p className="max-md:hidden">Algebra x TON</p>
        </div>
    </div>
);

const Account = () => {
    const { network } = useTonConnect();
    return (
        <div className="flex justify-end items-center gap-4 whitespace-nowrap w-1/3">
            {network && <div className="max-md:hidden">{network === CHAIN.MAINNET ? "Mainnet" : "Testnet"}</div>}
            <TonConnectButton />
        </div>
    );
};

export default Header;
