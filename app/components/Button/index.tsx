"use client";

type ButtonProps = {
    children: React.ReactNode
    onClick?: () => void
    variant?: "primary" | "ghost"
    disabled?: boolean
    className?: string
    type?: "button" | "submit" | "reset"
  }
  
  export default function Button({
    children,
    onClick,
    variant = "primary",
    disabled = false,
    className = "",
    type = "button",
  }: ButtonProps) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={` flex items-center justify-center gap-[0px]
          min-w-[162px] px-6 py-[10px] rounded-[24px]
          border-2 border-[#655E4C]
          font-thai text-2xl font-bold text-black
          transition-colors duration-150
          disabled:opacity-40 disabled:cursor-not-allowed
          ${variant === "primary"
            ? "bg-[#FFFAF0] hover:bg-[#EEE5D0] active:bg-[#DDD4BC]"
            : "bg-transparent hover:bg-[#655E4C]/10 active:bg-[#655E4C]/20"
          }
          ${className}
        `}
      >
        {children}
      </button>
    )
  }