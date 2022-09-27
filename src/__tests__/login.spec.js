const launch = require("puppeteer").launch;

describe("Login", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await launch({
      headless: false,
      slowMo: 100,
      devtools: true,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should display the login form", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("#page-title");
    const pageTitle = await page.$eval("#page-title", (e) => e.innerHTML);
    expect(pageTitle).toMatch("Login");
  });

  it("should allow the user to log in", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("#username");
    await page.type("#username", "test");
    await page.type("#password", "test");
    await page.click("#btn-submit");
    await page.waitForSelector("#page-title");
    const pageTitle = await page.$eval("#page-title", (e) => e.innerHTML);
    expect(pageTitle).toMatch("Logged In");
  });
});
