const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const CACHE_DIR = path.join(__dirname, "juicepics_cache");
const PICS_DIR = path.join(__dirname, "juicepics");

const JUICE_PIC_URLS = [
  // === Juice WRLD actual photos ===
  "https://i.scdn.co/image/ab6761610000e5eb23a60030944f7853c21565ef",
  "https://i.scdn.co/image/ab67618600001016580580ecfee3454ddf01c6d2",
  "https://i.scdn.co/image/ab6761610000f17823a60030944f7853c21565ef",
  // === Pinterest Juice WRLD Photos ===
  "https://i.pinimg.com/736x/a1/7c/3a/a17c3a65d0c5050e4f05c4e24b5f0f31.jpg",
  "https://i.pinimg.com/736x/cb/a7/73/cba7739b0e4b1420ba219bcec481f52e.jpg",
  "https://i.pinimg.com/236x/0a/5a/b9/0a5ab9c8141faa41eb05e59736f70961.jpg",
  "https://i.pinimg.com/236x/3d/42/5b/3d425b1124f4460743e282a8903c9b19.jpg",
  "https://i.pinimg.com/236x/2d/58/9b/2d589b924971c4208fba3bc12973efb3.jpg",
  "https://i.pinimg.com/236x/30/6a/04/306a0468934fdcd8510e1ef55b37c4ea.jpg",
  "https://i.pinimg.com/236x/02/c3/a3/02c3a3f37a175bf4e5b0cb22d8857e94.jpg",
  "https://i.pinimg.com/236x/87/eb/a5/87eba51f9cbb176430fc4495f3f51dce.jpg",
  "https://i.pinimg.com/236x/bf/8b/06/bf8b069cb3f102ce75f8ed645150a203.jpg",
  "https://i.pinimg.com/236x/af/38/6c/af386ce52b8897e7527ff8f18e2b8443.jpg",
  "https://i.pinimg.com/236x/c5/6a/4f/c56a43fb597e0d09649219e031af12a8.jpg",
  "https://i.pinimg.com/236x/b6/3b/77/b63b77b756a41473e6c71c3e5bda03e9.jpg",
  "https://i.pinimg.com/236x/ed/88/5c/ed885cc0ab4e2cd62a5c15e670a0e6ed.jpg",
  "https://i.pinimg.com/236x/7c/f8/3a/7cf83ab3a664f8dbeacf52617bd71018.jpg",
  "https://i.pinimg.com/236x/47/71/f0/4771f0cad59e38c1e933ad07ec6684f3.jpg",
  "https://i.pinimg.com/236x/37/09/58/3709588482b516ffe9e2acee903dac30.jpg",
  "https://i.pinimg.com/236x/3d/cf/71/3dcf712e4733c93f89e3c647231aff6d.jpg",
  "https://i.pinimg.com/236x/cf/2a/95/cf2a95ec448f2e26f68d7a18086037d0.jpg",
  "https://i.pinimg.com/236x/37/99/a5/3799a5e7e3c8f8ca073318c0abf5aedb.jpg",
  "https://i.pinimg.com/236x/d5/99/ab/d599ab86840a6163c1bbc72c69fb789e.jpg",
  "https://i.pinimg.com/236x/a2/ee/4f/a2ee4fffead858803c3a86429653ba7c.jpg",
  "https://i.pinimg.com/236x/0e/52/09/0e52b09e52b3bcd36161bc4636413bc66f3af.jpg",
  "https://i.pinimg.com/236x/81/b7/c0/81b7c08b8c671dad51734efa61f5777a.jpg",
  "https://i.pinimg.com/236x/42/57/e0/4257e0c91a1a61fd6c3dcdaf3ae1d942.jpg",
  "https://i.pinimg.com/236x/9b/d4/8d/9bd48d6485e3057b3ef1fa8ea48df4be.jpg",
  "https://i.pinimg.com/236x/0c/18/b0/0c18b09509cbd18a9d59596641634ce3.jpg",
  "https://i.pinimg.com/236x/a2/7b/08/a27b08ef8adcd75c645f8e1b498f3ffb.jpg",
  "https://i.pinimg.com/236x/6f/03/df/6f03df22f1f2a4e8704f6f49e56f4280.jpg",
  "https://i.pinimg.com/236x/6e/9c/46/6e9c4682399df36746ad1abf1637c040.jpg",
  "https://i.pinimg.com/236x/1b/49/05/1b4905e9bceb232f056e3692e13b4e75.jpg",
  "https://i.pinimg.com/236x/b7/e8/b0/b7e8b0312830ad6b62191290c6bc26bb.jpg",
  "https://i.pinimg.com/236x/db/4d/dd/db4dddbfcc862e3d37c1adde277a6bbf.jpg",
  "https://i.pinimg.com/236x/3f/7d/c2/3f7dc26465f118e12488309f8209b081.jpg",
  "https://i.pinimg.com/236x/c7/d5/ac/c7d5aca210eb1366263b4d6164b860f3.jpg",
  "https://i.pinimg.com/236x/39/df/d3/395dfd80e215ae07f13b872.jpg",
  "https://i.pinimg.com/236x/0e/79/ee/0e79eed64a76f27d14a936e.jpg",
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