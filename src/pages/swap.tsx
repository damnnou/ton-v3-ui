import { AmountsSection } from "src/components/swap/AmountsSection";
import { SettingsButton } from "src/components/ui/SettingsButton";
import { UpdateButton } from "src/components/ui/UpdateButton";

export function SwapPage() {
    return (
        <div className="py-20">
            <section className="sm:w-[500px] mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl">Swap</h2>
                    <div className="flex gap-4">
                        <UpdateButton onClick={() => null} />
                        <SettingsButton onClick={() => null} />
                    </div>
                </div>
                <AmountsSection />
            </section>
        </div>
    );
}
