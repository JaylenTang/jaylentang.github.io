const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const images = path.join(root, "images");

async function generateSocialCard() {
  const portrait = await sharp(path.join(images, "profile-photo-2026.jpg"))
    .resize(390, 390, { fit: "cover", position: "north" })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();
  const calligraphy = await sharp(path.join(images, "name-calligraphy-transparent.png"))
    .resize({ width: 300 })
    .png()
    .toBuffer();
  const base = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#f7f8fa"/>
      <rect width="12" height="630" fill="#0066cc"/>
      <rect x="732" y="112" width="406" height="406" fill="#ffffff" stroke="#d8dde5" stroke-width="2"/>
      <text x="72" y="145" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" fill="#111315">Jialin (Jaylen) Tang</text>
      <text x="72" y="350" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="#20252b">Ph.D. Student in Computational Science</text>
      <text x="72" y="398" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#3f4650">University of California, Irvine</text>
      <text x="72" y="530" font-family="Arial, Helvetica, sans-serif" font-size="25" fill="#0066cc">jaylentang.github.io</text>
    </svg>
  `);

  await sharp(base)
    .composite([
      { input: calligraphy, left: 80, top: 190 },
      { input: portrait, left: 740, top: 120 },
    ])
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(path.join(images, "social-card.jpg"));
}

generateSocialCard().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
