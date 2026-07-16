import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
const outDir = path.join(dir, "optimized");
fs.mkdirSync(outDir, { recursive: true });

const files = [
  ["fawn-soil.jpg", "hero-rehkitz.jpg"],
  ["hedgehog-candidate2.jpg", "hero-igel.jpg"],
];

async function run() {
  for (const [src, out] of files) {
    const inPath = path.join(dir, src);
    const meta = await sharp(inPath).metadata();
    const outPath = path.join(outDir, out);
    await sharp(inPath)
      .resize({ width: 2880, height: 2880, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(outPath);
    const stat = fs.statSync(outPath);
    console.log(`${src} (${meta.width}x${meta.height}) -> ${out} (${(stat.size / 1024).toFixed(0)} KB)`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
