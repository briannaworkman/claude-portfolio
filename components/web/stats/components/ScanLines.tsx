export function ScanLines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.8) 2px,rgba(0,0,0,.8) 4px)',
      }}
    />
  );
}
