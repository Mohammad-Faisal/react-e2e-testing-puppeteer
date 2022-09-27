const launch = require("puppeteer").launch;

jest.setTimeout(20000);
describe("Google", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await launch({ headless: false });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should display "google" text on page', async () => {
    await page.goto("https://google.com");
    await page.waitForSelector('input[title="Search"]');
    await page.type('input[title="Search"]', "puppeteer");
    await page.keyboard.press("Enter");
    await page.waitForNavigation();
    const html = await page.$eval("body", (e) => e.innerHTML);
    expect(html).toMatch("puppeteer");
  });
});
