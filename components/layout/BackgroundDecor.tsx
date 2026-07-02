/** Fixed ambient background — cyan glow top-left, violet bottom-right, light film grain. */
export default function BackgroundDecor() {
  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(1100px 720px at 12% -8%, rgba(125,211,252,0.16), transparent 60%), radial-gradient(1000px 700px at 108% 112%, rgba(200,160,240,0.16), transparent 58%), radial-gradient(700px 600px at 88% 8%, rgba(136,180,204,0.07), transparent 60%), #0a0e1a',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          opacity: 0.045,
          mixBlendMode: 'soft-light',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}
