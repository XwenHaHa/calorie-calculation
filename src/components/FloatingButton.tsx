interface FloatingButtonProps {
  onClick: () => void;
  className?: string;
}

export function FloatingButton({ onClick, className = '' }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-20 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
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