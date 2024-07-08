const puppeteer = require("puppeteer");
require("dotenv").config();

const getBio = async (u) => {
  // const username = "circles_verification";
  // const password = "gtaisgta5555";

  // let launchOptions = { headless: false, args: ["--start-maximized"] };

  const browser = await puppeteer.launch({
    args: ["--disable-setuid-sandbox", "--no-sandbox", "--no-zygote"],
    headless: true,
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();

  // await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  // await page.goto("https://www.instagram.com/accounts/login/");

  // await page.waitForSelector('input[name="username"]');
  // await page.type('input[name="username"]', username);
  // await page.type('input[name="password"]', password);

  // await Promise.all([page.click('button[type="submit"]')]);

  await page.goto(`https://www.instagram.com/${u}`);
  await page.waitForSelector("header");

  let bio = await page.evaluate(() => {
    let bioElement = document.querySelector("header section div span._ap3a");
    return bioElement ? bioElement.innerText : "";
  });

  await browser.close();
  return bio;
};

module.exports = getBio;
