import { memo } from "react";
import { Jetton } from "src/constants/jettons";
import { cn } from "src/lib/cn";

export const JettonLogo = memo(({ jetton, size, className }: { jetton: Jetton; size: number; className?: string }) => {
    const mockSymbol = jetton.symbol.slice(0, 2);

    return (
        <div
            className={cn("rounded-full overflow-clip flex items-center justify-center text-black", className)}
            style={{
                backgroundColor: jetton.image ? "transparent" : "white",
                minWidth: size,
                minHeight: size,
                width: size,
                height: size,
                fontSize: size / 2,
            }}
        >
            {jetton.image ? <img alt={`${jetton.image} image`} src={jetton.image} /> : mockSymbol}
        </div>
    );
});
