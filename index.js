const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const handlebars = require("handlebars");
const path = require("path");
const moment = require("moment");
const data = {
  name: "Aykut",
  surname: "Ateş",
  hometown: "Istanbul",
  games: [
    { name: "Cities Skylines", platform: "PC", genre: "Real Time Strategy" },
    { name: "The Witcher 3", platform: "Play Station", genre: "Action" },
    { name: "Need For Speed No Limits", platform: "Android", genre: "Racing" }
  ]
}

const compile = async function(template, data) {
  const filepath = path.join(process.cwd(), "templates", `${template}.hbs`);
  const html = await fs.readFile(filepath, "utf-8");
  return handlebars.compile(html)(data);
}

const createPDF = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await compile("template", data);

    await page.setContent(content);
    await page.emulateMedia("screen");
    await page.pdf({
      path: "mypdf.pdf",
      format: "A4",
      printBackground: true
    });

    console.log("done");
    await browser.close();
    process.exit();

  } catch (e) {
      console.log("error", e);
  }
};

createPDF();
