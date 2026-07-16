import sharp from "sharp";
const dir = process.argv[2];
const bg = process.argv[3] || "#1e3a2f";

await sharp({ create: { width: 500, height: 500, channels: 3, background: bg } })
  .composite([{ input: `${dir}/logo-transparent.png`, gravity: "center" }])
  .png()
  .toFile(`${dir}/preview-on-${bg.replace("#", "")}.png`);

console.log("done");
