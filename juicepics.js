const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const CACHE_DIR = path.join(__dirname, "juicepics_cache");
const PICS_DIR = path.join(__dirname, "juicepics");

const JUICE_PIC_URLS = [
  // === Juice WRLD actual photos (not album art) ===
  "https://i.scdn.co/image/ab6761610000e5eb23a60030944f7853c21565ef",
  "https://i.scdn.co/image/ab67618600001016580580ecfee3454ddf01c6d2",
  "https://i.scdn.co/image/ab6761610000f17823a60030944f7853c21565ef",
];

const cachedFiles = [];

function scanPicsDir() {
  if (!fs.existsSync(PICS_DIR)) return;
  for (const f of fs.readdirSync(PICS_DIR)) {
    const fp = path.join(PICS_DIR, f);
    try { if (fs.statSync(fp).size > 0) cachedFiles.push(fp); } catch {}
  }
}

function download(url) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("md5").update(url).digest("hex");
    let ext = path.extname(new URL(url).pathname) || ".jpg";
    if (ext === ".webp") ext = ".jpg";
    const filePath = path.join(CACHE_DIR, hash + ext);

    if (fs.existsSync(filePath)) {
      cachedFiles.push(filePath);
      return resolve();
    }

    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.headers.location) {
          https
            .get(res.headers.location, { headers: { "User-Agent": "Mozilla/5.0" } }, (res2) => {
              const ws = fs.createWriteStream(filePath);
              res2.pipe(ws);
              ws.on("finish", () => { if (fs.statSync(filePath).size > 0) cachedFiles.push(filePath); resolve(); });
            }).on("error", reject);
          return;
        }
        const ws = fs.createWriteStream(filePath);
        res.pipe(ws);
        ws.on("finish", () => { if (fs.statSync(filePath).size > 0) cachedFiles.push(filePath); resolve(); });
      })
      .on("error", reject);
  });
}

async function init() {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  await Promise.allSettled(JUICE_PIC_URLS.map(download));
  scanPicsDir();
  if (cachedFiles.length === 0) {
    console.warn("No juice pics could be cached, falling back to URLs");
  }
}

function randomPic() {
  const valid = cachedFiles.filter((f) => { try { return fs.statSync(f).size > 0; } catch { return false; } });
  if (valid.length > 0) {
    return valid[Math.floor(Math.random() * valid.length)];
  }
  return JUICE_PIC_URLS[Math.floor(Math.random() * JUICE_PIC_URLS.length)];
}

module.exports = { init, randomPic, cachedFiles };