export default function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 z-0 bg-noise opacity-[0.025] mix-blend-overlay pointer-events-none"
      aria-hidden="true"
    />
  );
}
