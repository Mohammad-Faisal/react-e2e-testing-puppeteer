Today we will learn how to do end-to-end testing with Jest and Puppeteer in a ReactJS application.

## Create the boilerplate project

First, we need to create a new ReactJS project. We will use the create-react-app tool to do that.

```bash
npx create-react-app e2e-react --language typescript
```

## Setup with Create react app

To setup Puppeteer with Create React App, we need to install the following dependencies:

```bash
npm install --save-dev jest-puppeteer puppeteer
```

And add the following script to the package.json file:

```json
"scripts": {
  "test": "react-scripts test --env=jsdom --watchAll=false"
}
```

And that's it! We are ready to start writing our tests.

## Other ReactJS/NodeJS projects

We will need to install the following dependencies:

- Jest - Our test runner
- Puppeteer - Our browser automation tool
- Jest-Puppeteer - A Jest plugin to run Puppeteer tests

Run the following command to install them:

```bash
cd e2e-react
npm install --save jest puppeteer jest-puppeteer
```

## Configure Jest

Then first we need to add the jest configuration file. Create a file called jest.config.js in the root of the project and add the following content:

```js
module.exports = {
  preset: "jest-puppeteer",
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,
};
```

Here we are telling Jest to use the jest-puppeteer preset and to look for tests in the tests folder.

Then we need to add the following script to the package.json file:

```json
"scripts": {
  "test": "jest"
}
```

## Configure Puppeteer

Then, we need to create a new file called jest-puppeteer.config.js in the root of the project. This file will contain the configuration for Puppeteer.

```js
module.exports = {
  launch: {
    headless: process.env.HEADLESS !== "false",
    slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO, 10) : 0,
    devtools: process.env.DEVTOOLS === "true",
    product: "chrome",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920,1080",
    ],
  },
};
```

Here we are telling Puppeteer to run in headless mode, to not use the sandbox, to disable the GPU and to set the window size to 1920x1080.

We are also telling puppeteer to use the Chrome browser. If you want to use the Firefox browser, you can change the `product` property to `firefox`.

We can also set the slowMo option to slow down the execution of the tests. This is useful to see what is happening in the browser.

We can set this option by setting the SLOWMO environment variable. For example, to set the slowMo to 100ms, we can run the following command:

```bash
SLOWMO=100 npm test
```

## Create the test

We will create a simple test that will open the browser, navigate to the Google homepage, and search for the word "puppeteer".

```javascript
// __tests__/google.test.js
const puppeteer = require("puppeteer");

describe("Google", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
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
```

So this was a generic example of how to use Puppeteer with Jest. You can use this as a starting point to write your own tests.

Now let's focus on a real-world example.

## Real-world example

We will create a form that will allow a user to log in. The form will have two fields: username and password. Let's create the form component.

```jsx
// src/components/LoginForm.tsx
import React, { useState } from "react";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username: " + username + " Password: " + password);
    setIsLoggedIn((prev) => !prev);
  };

  return (
    <div>
      <h1 id="page-title">{isLoggedIn ? "Logged In" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button type="submit" id="btn-submit">
          Login
        </button>
      </form>
    </div>
  );
};
```

Notice when the user clicks the submit button the text "Logged In" will be displayed. This is because we are using the useState hook to set the isLoggedIn state to true.

Now let's create the test. Create a new test file called login.test.js in the tests folder.

First import the launch function from the jest-puppeteer package.

```js
const launch = require("puppeteer").launch;
```

Then setup the beforeAll and afterAll hooks.

```js
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
```

Here we are telling Puppeteer to run in headless mode and to set the slowMo to 100ms.

Then we need to create a test that will check if the login form is displayed.

```js
it("should display the login form", async () => {
  await page.goto("http://localhost:3000");
  await page.waitForSelector("#page-title");
  const pageTitle = await page.$eval("#page-title", (e) => e.innerHTML);
  expect(pageTitle).toMatch("Login");
});
```

This test will navigate to the root of the application, wait for the page title to be displayed, and then check if the page title is "Login".

Now let's create a test that will check if the user can log in.

```js
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
```

To find a particular item on the screen:

    ```js
    await page.waitForSelector("#username");
    ```

Here username is the id field of the input element.

Also we can emulate user action like typing and clicking.

```js
await page.type("#username", "test");
await page.type("#password", "test");
await page.click("#btn-submit");
```

This test will navigate to the root of the application, wait for the username field to be displayed, type the username and password, click the submit button, wait for the page title to be displayed, and then check if the page title is "Logged In".

The final code for the test is as follows:

```js
// __tests__/login.test.js

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
```

## Conclusion

In this article, we learned how to use Puppeteer with Jest. We also created a real-world example that will allow us to test a login form.

We learned how to navigate to a page, find an element, and emulate user actions like typing and clicking.

We also learned how to use the beforeAll and afterAll hooks to setup and teardown the browser.

## Resources

- [Puppeteer](https://pptr.dev/)
- [Jest](https://jestjs.io/)
