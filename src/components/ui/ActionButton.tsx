import React, { ButtonHTMLAttributes } from "react";
import { cn } from "src/lib/cn";

export const ActionButton: React.FC<ActionButtonProps> = React.memo(({ className, children, ...props }) => {
    const defaultStyles =
        "w-full h-[74px] rounded-xl cursor-pointer font-bold text-2xl bg-primary-green/80 hover:bg-primary-green/60 duration-200 disabled:hover:bg-primary-green/80 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <button {...props} className={cn(defaultStyles, className)}>
            {children}
        </button>
    );
});

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children: React.ReactNode;
}
