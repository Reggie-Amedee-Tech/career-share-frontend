interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className = "" }: ShimmerProps) {
  return <div className={`shimmer ${className}`} aria-hidden="true" />;
}
