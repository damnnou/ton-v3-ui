import TokenSelectMenu from "src/components/swap/TokenSelectMenu";
import { SwapButton } from "src/components/swap/SwapButton";
import SwapPair from "src/components/swap/SwapPair";
import { SettingsButton } from "src/components/ui/Button/SettingsButton";
import { UpdateButton } from "src/components/ui/Button/UpdateButton";
import { cn } from "src/lib/cn";
import { useTokenMenuState } from "src/state/tokenMenuStore";
import { MenuState } from "src/types/token-menu";

export function SwapPage() {
    const { menuState } = useTokenMenuState();

    return (
        <div className="py-20 animate-fade-in">
            <section className="sm:w-[500px] mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl">Swap</h2>
                    <div className="flex gap-4">
                        <UpdateButton onClick={() => null} />
                        <SettingsButton onClick={() => null} />
                    </div>
                </div>
                <div
                    className={cn(
                        "relative w-full rounded-2xl transition-all duration-300 bg-light delay-50 overflow-hidden shadow-2xl shadow-purple-500/20 flex flex-col sm:gap-4 gap-2 border border-border-light sm:p-4 sm:rounded-3xl sm:bg-light p-2",
                        menuState === MenuState.CLOSED ? "h-[318px] sm:h-[350px]" : "h-[600px]"
                    )}
                >
                    <div className={cn("flex flex-col sm:gap-4 gap-2", menuState === MenuState.CLOSED ? "" : "hidden")}>
                        <SwapPair />
                        <SwapButton />
                    </div>
                    {menuState !== MenuState.CLOSED && <TokenSelectMenu />}
                </div>
            </section>
        </div>
    );
}
