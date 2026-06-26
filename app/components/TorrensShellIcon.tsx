export function TorrensShellIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Nautilus shell - simplified version */}
      <path
        d="M50 15C30 15 15 30 15 50C15 70 30 85 50 85C55 85 60 83 64 80C60 75 58 68 58 60C58 45 68 35 78 32C75 22 63 15 50 15Z"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="68"
        cy="42"
        r="12"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="75"
        cy="28"
        r="8"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M50 30C40 30 32 38 32 48C32 58 40 66 50 66"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
