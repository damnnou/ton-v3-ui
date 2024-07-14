import { memo } from "react";
import { cn } from "src/lib/cn";
import { Jetton } from "src/sdk/src/entities/Jetton";
import { Skeleton } from "../ui/Skeleton";

export const JettonLogo = memo(({ jetton, size, className }: { jetton: Jetton | null | undefined; size: number; className?: string }) => {
    if (!jetton)
        return (
            <Skeleton
                className={cn(`flex rounded-full bg-card-dark`, className)}
                style={{ minWidth: `${size}px`, minHeight: `${size}px`, width: `${size}px`, height: `${size}px` }}
            />
        );

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
