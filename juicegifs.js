const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const CACHE_DIR = path.join(__dirname, "juicegifs_cache");

const JUICE_GIF_URLS = [
  // === Lucid Dreams (2018) ===
  "https://media.giphy.com/media/7SQJrkpOyxqWFbCdeu/giphy.gif",
  "https://media.giphy.com/media/2fQGPdrAlW7cqFLTSp/giphy.gif",
  "https://media.giphy.com/media/vvlJz6buF02CKgCy2L/giphy.gif",
  "https://media.giphy.com/media/2uIcCOGxncHrAUhKVB/giphy.gif",
  "https://media.giphy.com/media/iOsqfFbhS4AHonhxMl/giphy.gif",
  // === All Girls Are The Same (2018) ===
  "https://media.giphy.com/media/vN2JMevW2RhzKPiPUj/giphy.gif",
  // === Lean Wit Me (2018) ===
  "https://media.giphy.com/media/jy03IH09g1irv1Vl2P/giphy.gif",
  "https://media.giphy.com/media/2leSKpjmaYZ0cjOPqK/giphy.gif",
  "https://media.giphy.com/media/1ckQSPN3hDbJIgJpzA/giphy.gif",
  // === Armed And Dangerous (2019) ===
  "https://media.giphy.com/media/jsCSOz5UUa7say2AN7/giphy.gif",
  "https://media.giphy.com/media/RfT64atymRdo5y2UeB/giphy.gif",
  "https://media.giphy.com/media/VIibPUl8sF8ICGbWsm/giphy.gif",
  // === No Issue (2019) ===
  "https://media.giphy.com/media/JombpAsL27Kak8Hd0g/giphy.gif",
  // === Fast (2019) ===
  "https://media.giphy.com/media/jb3kNZvjqmqvT3cESg/giphy.gif",
  // === Robbery (2019) ===
  "https://media.giphy.com/media/Ma0eJb53gKd1X6RX4D/giphy.gif",
  // === Hear Me Calling (2019) ===
  "https://media.giphy.com/media/LMVW3EZ2VkwY53tYSI/giphy.gif",
  "https://media.giphy.com/media/SSELuGkD61yO1QovKi/giphy.gif",
  "https://media.giphy.com/media/iFOhjgfHd2Z2FXvc4a/giphy.gif",
  "https://media.giphy.com/media/gISSoJ1XhLPKLyXgGb/giphy.gif",
  "https://media.giphy.com/media/IyxXq3AxVpJwXqqTjy/giphy.gif",
  "https://media.giphy.com/media/S8BjXtWZYxUTEEG94h/giphy.gif",
  "https://media.giphy.com/media/cPArCy6tZom3iZh7Rx/giphy.gif",
  // === Bandit ft. NBA YoungBoy (2019) ===
  "https://media.giphy.com/media/UTjfYBlsfP3wnadI8Q/giphy.gif",
  "https://media.giphy.com/media/kAuN8e31yrGluCTjxk/giphy.gif",
  "https://media.giphy.com/media/QumWJ0jJz4ZDHJOT1y/giphy.gif",
  // === XXXTentacion tribute (2018) ===
  "https://media.giphy.com/media/1qf9BSwuVkxDxynsc7/giphy.gif",
  // === Righteous (2020) ===
  "https://media.giphy.com/media/ekp1vNZ6sagX45z79W/giphy.gif",
  // === Wishing Well (2020) ===
  "https://media.giphy.com/media/gjm7X2tr2ng0FWaH1T/giphy.gif",
  "https://media.giphy.com/media/S5ogwu05a3t4JL9M7D/giphy.gif",
  "https://media.giphy.com/media/horOGiDDdnyYIQNsGq/giphy.gif",
  "https://media.giphy.com/media/KxW3so88q6lHtcwgf5/giphy.gif",
  "https://media.giphy.com/media/QzAnUlHuv27N7u02UD/giphy.gif",
  // === Burn (2021) ===
  "https://media.giphy.com/media/q29CiBG4qyvQI1FYaw/giphy.gif",
  "https://media.giphy.com/media/aQVXvmj9rXvw2vQJJ1/giphy.gif",
  // === The Weeknd Smile collab (2020) ===
  "https://media.giphy.com/media/EccuWCqmpycInw9ZwA/giphy.gif",
  // === Stickers / Art (2018) ===
  "https://media.giphy.com/media/8vpTPfpkWgCGv21yd4/giphy.gif",
  "https://media.giphy.com/media/7vABiwmeaPirqyTHfu/giphy.gif",
  "https://media.giphy.com/media/1qgIVb1FePb5kO0YWh/giphy.gif",
  "https://media.giphy.com/media/Zxn6P6YClbFqo1QuCQ/giphy.gif",
  "https://media.giphy.com/media/2wYVjYJCybwIQxdY1G/giphy.gif",
  "https://media.giphy.com/media/3d73YCUOUq8ptsTzvg/giphy.gif",
  "https://media.giphy.com/media/69C38U7bozG2OkCFqb/giphy.gif",
  "https://media.giphy.com/media/EcOPrYb2AsDE8abajy/giphy.gif",
  // === Misc (2018, 2022) ===
  "https://media.giphy.com/media/SKSTU1xT204eGAGola/giphy.gif",
  "https://media.giphy.com/media/4JXJFVimh11y39DaMD/giphy.gif",
];

const cachedFiles = [];

function download(url) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("md5").update(url).digest("hex");
    const filePath = path.join(CACHE_DIR, hash + ".gif");

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
  await Promise.allSettled(JUICE_GIF_URLS.map(download));
  if (cachedFiles.length === 0) {
    console.warn("No juice GIFs could be cached, falling back to URLs");
  } else {
    console.log("[gifs] Cached", cachedFiles.length, "Juice WRLD GIFs");
  }
}

function randomGif() {
  const valid = cachedFiles.filter((f) => { try { return fs.statSync(f).size > 0; } catch { return false; } });
  if (valid.length > 0) {
    return valid[Math.floor(Math.random() * valid.length)];
  }
  return JUICE_GIF_URLS[Math.floor(Math.random() * JUICE_GIF_URLS.length)];
}

module.exports = { init, randomGif, cachedFiles };
