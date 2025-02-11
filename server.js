const app = require("express")();

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.get("/:u", async (req, res) => {
  const u = req.params.u;
  if (!u) return res.status(404);
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();

    // await page.setViewport({ width: 1366, height: 768 });

    await page.goto(`https://www.instagram.com/${u}`, {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector("header", { timeout: 100 });

    let bio = await page.evaluate(() => {
      let bioElement = document.querySelector("header section div span._ap3a");
      return bioElement ? bioElement.innerText : "";
    });
    await browser.close();
    res.json({ bio: bio });
  } catch (err) {
    console.error(err);
    return null;
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
