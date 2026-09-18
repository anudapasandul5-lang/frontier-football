export function TickRule({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`tick-rule ${className}`} />;
}
