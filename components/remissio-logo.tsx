export function RemissioLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Simple wave/curve symbol representing health tracking over time */}
      <path
        d="M8 25C8 25 12 15 18 15C24 15 26 35 32 35C38 35 42 25 42 25"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />

      {/* "remissio" text */}
      <text
        x="55"
        y="32"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="20"
        fontWeight="500"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        remissio
      </text>
    </svg>
  )
}

export function RemissioIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Just the wave symbol for icon usage */}
      <path
        d="M6 20C6 20 10 10 16 10C22 10 24 30 30 30C36 30 40 20 40 20"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
