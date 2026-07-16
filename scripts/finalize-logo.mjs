import sharp from "sharp";
import fs from "node:fs";

const srcDir = process.argv[2];
const outDir = process.argv[3];
fs.mkdirSync(outDir, { recursive: true });

async function run() {
  const src = sharp(`${srcDir}/logo-transparent.png`);
  const trimmed = sharp(await src.trim({ threshold: 5 }).png().toBuffer());
  const meta = await trimmed.metadata();
  console.log(`Trimmed size: ${meta.width}x${meta.height}`);

  // Header logo: tall enough for retina display at ~56px CSS height.
  await trimmed
    .clone()
    .resize({ height: 224, withoutEnlargement: false })
    .png({ compressionLevel: 9 })
    .toFile(`${outDir}/logo-header.png`);

  // Square, padded version for favicons / app icons.
  const side = Math.max(meta.width, meta.height);
  const padded = await sharp({
    create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: await trimmed.clone().png().toBuffer(), gravity: "center" }])
    .png()
    .toBuffer();

  await sharp(padded).resize(512, 512).png().toFile(`${outDir}/logo-square-512.png`);
  await sharp(padded).resize(180, 180).png().toFile(`${outDir}/apple-icon.png`);
  await sharp(padded).resize(32, 32).png().toFile(`${outDir}/icon-32.png`);
  await sharp(padded).resize(16, 16).png().toFile(`${outDir}/icon-16.png`);

  console.log("done");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
