import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "src/lib/cn";

const buttonVariants = cva(
    "inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-light hover:bg-light/90",
                action: "bg-primary-red text-white font-bold hover:bg-primary-red/80 duration-200",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80 font-semibold",
                outline: "border border-border-light hover:bg-border-light",
                outlineActive: "border border-primary-green bg-primary-green/10",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-border-light",
                link: "text-primary underline-offset-4 hover:underline",
                icon: "font-semibold transition-all duration-200 hover:bg-border-light",
                iconActive: "font-semibold  bg-primary-purple hover:bg-primary-purple",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-xl px-3",
                md: "h-6 rounded-xl p-4 py-6",
                lg: "text-md p-4",
                icon: "h-10 w-10 rounded-xl",
            },
        },
        defaultVariants: {
            variant: "action",
            size: "lg",
        },
    }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
