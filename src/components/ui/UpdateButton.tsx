import React from "react";
import UpdateBtn from "src/assets/update-btn.svg";
import { cn } from "src/lib/cn";

export const UpdateButton: React.FC<UpdateButtonProps> = React.memo(({ onClick, className }) => {
    return (
        <button className={cn(className)} onClick={onClick}>
            <img src={UpdateBtn} />
        </button>
    );
});

interface UpdateButtonProps {
    className?: string;
    onClick: () => void;
}
