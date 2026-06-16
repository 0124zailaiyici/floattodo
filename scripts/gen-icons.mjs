import sharp from "sharp";
import { writeFileSync, readFileSync } from "fs";

const svg = readFileSync("src-tauri/icons/icon.svg");

async function gen() {
  const sizes = [
    { name: "32x32.png", size: 32 },
    { name: "128x128.png", size: 128 },
    { name: "128x128@2x.png", size: 256 },
  ];
  for (const s of sizes) {
    await sharp(svg)
      .resize(s.size, s.size)
      .png()
      .toFile("src-tauri/icons/" + s.name);
    console.log("generated", s.name);
  }
}
gen().catch(console.error);
