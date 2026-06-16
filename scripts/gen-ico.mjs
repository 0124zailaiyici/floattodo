import { readFileSync, writeFileSync } from "fs";

const png = readFileSync("src-tauri/icons/32x32.png");
// ICO header: reserved(2) + type=1(2) + count=1(2) = 6 bytes
// Entry: w(1) + h(1) + colors(1) + reserved(1) + planes(2) + bpp(2) + size(4) + offset(4) = 16 bytes
const buf = Buffer.alloc(6 + 16 + png.length);
buf.writeUInt16LE(0, 0);       // reserved
buf.writeUInt16LE(1, 2);       // type: 1=ICO
buf.writeUInt16LE(1, 4);       // count: 1 image
buf.writeUInt8(32, 6);         // width
buf.writeUInt8(32, 7);         // height
buf.writeUInt8(0, 8);          // colors
buf.writeUInt8(0, 9);          // reserved
buf.writeUInt16LE(1, 10);      // planes
buf.writeUInt16LE(32, 12);     // bpp
buf.writeUInt32LE(png.length, 14);  // image size
buf.writeUInt32LE(22, 18);     // offset (6+16)
png.copy(buf, 22);
writeFileSync("src-tauri/icons/icon.ico", buf);
console.log("generated icon.ico");
