import type { ReactNode } from "react";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "filter"
    | "danger-soft"
    | "edit"
    | "delete";

type ButtonProps = {
    children: ReactNode;
    type?: "button" | "submit" | "reset";
    variant?: ButtonVariant;
    onClick?: () => void;
};

export function Button({
    children,
    type = "button",
    variant = "primary",
    onClick,
}: ButtonProps) {
    return (
        <button
            className={`btn btn-${variant}`}
            type={type}
            onClick={onClick}
        >
            {children}
        </button>
    );
}