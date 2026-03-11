module.exports = {
  clickElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector, { timeout: 10000 });
      await page.click(selector);
    } catch (error) {
      throw new Error(`Selector is not clickable: ${selector}`);
    }
  },
  getText: async function (page, selector) {
    try {
      await page.waitForSelector(selector, { timeout: 10000 });
      return await page.$eval(selector, el => el.textContent.trim());
    } catch (error) {
      throw new Error(`Text is not available for selector: ${selector}`);
    }
  }
};
