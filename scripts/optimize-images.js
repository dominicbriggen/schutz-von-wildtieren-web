const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const dir = process.argv[2];
const outDir = path.join(dir, "optimized");
fs.mkdirSync(outDir, { recursive: true });

async function run() {
  const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f));
  for (const f of files) {
    const inPath = path.join(dir, f);
    const base = f.replace(/\.(jpe?g|png)$/i, "");
    const outPath = path.join(outDir, base + ".jpg");
    const meta = await sharp(inPath).metadata();
    await sharp(inPath)
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(outPath);
    const outSize = fs.statSync(outPath).size;
    console.log(`${f} (${meta.width}x${meta.height}) -> ${base}.jpg (${(outSize / 1024).toFixed(0)} KB)`);
  }
  console.log("DONE", files.length);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
