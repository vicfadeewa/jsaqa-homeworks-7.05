const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  });
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
});

describe('Ticket Booking Test Suite', () => {
  async function selectMovie(movieTitle) {
    await page.waitForSelector('h2.movie__title', { timeout: 25000 });
    await page.click(`text=${movieTitle}`);
  }

  async function selectHall(hallTitle) {
    await page.waitForSelector('h3.movie-seances__hall-title', { timeout: 20000 });
    await page.click(`text=${hallTitle}`);
  }

  async function selectSessionTime(time) {
    await page.waitForSelector('a.movie-seances__time', { timeout: 20000 });
    await page.click(`text=${time}`);
  }

  async function clickBookButton() {
    await page.waitForSelector('button.acceptin-button', { timeout: 15000 });
    const bookButton = await page.$('button.acceptin-button');
    const buttonText = await bookButton.evaluate(el => el.textContent.trim());

    if (buttonText === 'Забронировать') {
      await bookButton.click();
    } else {
      throw new Error(`Expected button "Забронировать", but found: "${buttonText}"`);
    }
  }

  it('Загрузка главной страницы и отображение фильмов', async () => {
    await page.goto('https://qamid.tmweb.ru/client/index.php', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    const movieTitles = await page.$$('h2.movie__title');
    const movieContainers = await page.$$('.movie');

    expect(movieTitles.length).toBeGreaterThanOrEqual(1);
    expect(movieContainers.length).toBeGreaterThanOrEqual(1);
  }, 30000);

  it('Успешное бронирование билета, переход на страницу оплаты', async () => {
    await page.goto('https://qamid.tmweb.ru/client/index.php', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    await selectMovie('Ведьмак');
    await selectHall('Современный зал');
    await selectSessionTime('17:00');

    await page.waitForSelector('.buying-scheme__chair:not(.buying-scheme__chair_occupied)', { timeout: 15000 });
    const availableSeat = await page.$('.buying-scheme__chair:not(.buying-scheme__chair_occupied)');
    await availableSeat.click();

    await clickBookButton();

    await page.waitForNavigation({ timeout: 10000 });

    const currentUrl = await page.url();
    expect(currentUrl).toBe('https://qamid.tmweb.ru/client/payment.php');

    await page.waitForSelector('h2.ticket__check-title', { timeout: 5000 });
    const titleText = await page.$eval('h2.ticket__check-title', el => el.textContent.trim());
    expect(titleText).toBe('Вы выбрали билеты:');
  }, 40000);

  it('Проверка кнопки "Забронировать" при клике на занятое место', async () => {
    await page.goto('https://qamid.tmweb.ru/client/index.php', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    await selectMovie('wadawd');
    await selectHall('"зал 5"');
    await selectSessionTime('20:00');

    await page.waitForSelector('.buying-scheme__chair', { timeout: 15000 });

    const disabledSeats = await page.$$('.buying-scheme__chair_disabled');
    expect(disabledSeats.length).toBeGreaterThanOrEqual(1);

    await page.click('.buying-scheme__chair_disabled', { timeout: 2000 });

    await new Promise(resolve => setTimeout(resolve, 500));

    const bookButton = await page.$('button.acceptin-button');
    const isDisabled = await bookButton.evaluate(el =>
      el.disabled || el.classList.contains('disabled') || el.getAttribute('disabled') !== null
    );
    expect(isDisabled).toBe(true);
  }, 40000);
});
