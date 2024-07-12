import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import Navigation from "./Navigation";
import { useTonConnect } from "src/hooks/common/useTonConnect";
import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => (
    <header className="sticky top-4 z-10 flex justify-between items-center p-2 bg-light border-2 border-border-light rounded-2xl gap-4">
        <Algebra />
        <Navigation />
        <Account />
    </header>
);

const Algebra = () => (
    <div className="flex items-center gap-2 w-1/3">
        <Link to={"/"}>
            <div className="flex items-center gap-4 py-1 px-4 bg-card text-xl rounded-xl hover:bg-border-light duration-200">
                <img className="rotate-180 scale-x-[-1]" width={32} src="/algebra-icon.png" />
                <p className="max-md:hidden">TONCO</p>
            </div>
        </Link>
    </div>
);

const Account = () => {
    const { connected } = useTonConnect();
    const [tonConnectUI] = useTonConnectUI();

    return (
        <div className="flex justify-end items-center gap-4 whitespace-nowrap w-1/3">
            <div>Testnet</div>
            <TonConnectButton className="max-md:hidden" />
            <Wallet
                onClick={() => (connected ? tonConnectUI.disconnect() : tonConnectUI.openModal())}
                size={32}
                className="md:hidden w-10 h-10 p-2 hover:bg-border-light rounded-xl cursor-pointer"
            />
        </div>
    );
};

export default Header;
