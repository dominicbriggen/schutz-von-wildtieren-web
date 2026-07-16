import sharp from "sharp";
import path from "node:path";

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/process-logo.mjs <input> <output.png>");
  process.exit(1);
}

const WHITE_TOLERANCE = 18; // how close to pure white counts as "background"

async function run() {
  const image = sharp(inputPath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const visited = new Uint8Array(width * height);
  const stack = [];

  function isWhiteish(idx) {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return 255 - r < WHITE_TOLERANCE && 255 - g < WHITE_TOLERANCE && 255 - b < WHITE_TOLERANCE;
  }

  // Seed the flood fill from every border pixel so we catch the whole
  // connected background region regardless of shape.
  for (let x = 0; x < width; x++) {
    stack.push([x, 0], [x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    stack.push([0, y], [width - 1, y]);
  }

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const pos = y * width + x;
    if (visited[pos]) continue;
    const idx = pos * channels;
    if (!isWhiteish(idx)) continue;

    visited[pos] = 1;
    data[idx + 3] = 0; // set alpha to 0

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);

  console.log(`Wrote ${outputPath} (${width}x${height})`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
