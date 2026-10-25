"use client";

import { cn } from "@/lib/utils";

export function StarRating({
  stars,
  animate = false,
  size = "lg",
}: {
  stars: number;
  animate?: boolean;
  size?: "sm" | "lg";
}) {
  const dim = size === "lg" ? "size-9 sm:size-11" : "size-4";

  return (
    <div
      className="flex items-center justify-center gap-1.5"
      role="img"
      aria-label={`${stars} de 5 estrellas`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < stars;
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className={cn(
              dim,
              "transition-colors",
              filled ? "text-[var(--mark)]" : "text-[#c5ced6]",
              animate && "star-pop",
            )}
            style={animate ? { animationDelay: `${i * 90}ms` } : undefined}
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M12 2.6 14.7 9l6.8.6-5.2 4.5 1.6 6.6L12 17.8 6.1 20.7l1.6-6.6L2.5 9.6 9.3 9 12 2.6Z"
            />
          </svg>
        );
      })}
    </div>
  );
}
