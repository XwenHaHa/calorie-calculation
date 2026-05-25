interface FloatingButtonProps {
  onClick: () => void;
  className?: string;
}

export function FloatingButton({ onClick, className = '' }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-green-500 shadow-2xl flex items-center justify-center transition-transform active:scale-95 z-50 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
}