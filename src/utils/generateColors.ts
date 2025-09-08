export function generateColors(count: number) {
  return Array.from(
    { length: count },
    (_, i) => `hsl(${(i * 360) / count}, 65%, 55%)`
  );
}
