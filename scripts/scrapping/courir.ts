import puppeteer from "puppeteer";
import fs from "node:fs/promises";
import { Logger } from "@/lib/utils/logger";
import { execute } from "@/lib/utils/execute";

const logger = new Logger("scrapping:courir");

async function scrapCategory(categorySlug: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const url = `https://www.courir.com/fr/c/${categorySlug}/chaussures/`;

  logger.log(url);

  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  let allProducts = [];
  const existingUrls = new Set<string>();

  while (allProducts.length < 100) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const productChunk = await page.evaluate(() => {
      const items = document.querySelectorAll(".product__tile__container");
      return Array.from(items).map((item) => ({
        brand: item
          .querySelector(".product__name__brand.js-product-name_brand")
          ?.textContent.trim(),
        name: item
          .querySelector(".product__name__product.js-product-name_product")
          ?.textContent.trim(),
        price: Math.floor(
          parseFloat(
            item
              .querySelector(".default-price")
              ?.textContent?.replace(/€[A-Z][a-z]\//g, "")
              .trim()
              .replace(",", ".") ?? "0",
          ) * 100,
        ),
        image: item.querySelector<HTMLImageElement>(".product__image img")?.src,
        detailUrl:
          item.querySelector<HTMLAnchorElement>("a.product__link")?.href,
      }));
    });

    logger.log("existing urls", existingUrls);

    for (const product of productChunk) {
      if (
        product.detailUrl &&
        !existingUrls.has(product.detailUrl) &&
        allProducts.length < 100
      ) {
        existingUrls.add(product.detailUrl);
        allProducts.push(product);
      }
    }

    logger.info(`Found ${allProducts.length} products`);

    if (allProducts.length >= 100) {
      logger.info("100 products found, stopping");
      break;
    }

    const moreButtonVisible = await page
      .$eval(
        "button.display-more-products",
        (btn) => btn && btn.offsetParent !== null,
      )
      .catch(() => false);
    if (!moreButtonVisible) {
      logger.warn("No more products to load");
      break;
    }

    logger.info("Loading more products");
    await page.click("button.display-more-products");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  for (const sneaker of allProducts) {
    logger.info(`Processing product ${sneaker.name} ${sneaker.detailUrl}`);
    if (!sneaker.detailUrl) {
      logger.warn("Product detail URL missing, skipping");
      continue;
    }

    const productPage = await browser.newPage();

    try {
      const response = await productPage.goto(sneaker.detailUrl, {
        waitUntil: "networkidle2",
        timeout: 15000,
      });
      if (!response || !response.ok()) {
        logger.warn(
          `error while trying to load product page ${sneaker.detailUrl}`,
        );
        await productPage.close();
        continue;
      }

      const details = await productPage.evaluate(() => {
        const sizeElements =
          document.querySelectorAll(".swatches .swatchanchor") || [];
        const sizes = Array.from(sizeElements)
          .map((el) => el.textContent.trim())
          .filter(Boolean);

        const colorLinks =
          document.querySelectorAll(
            ".productlinks-link-container .productlink-link a",
          ) || [];
        const colors = Array.from(colorLinks).map((el) => ({
          colorName:
            el.getAttribute("title")?.replace("Couleur :", "").trim() || "",
          colorUrl: el.querySelector("img")?.getAttribute("src") || "",
        }));

        const description =
          document
            .querySelector(".product-short-description")
            ?.textContent.trim() || "";
        const sku =
          document.querySelector(".product-sku")?.textContent.trim() || "";

        return { sizes, colors, description, sku };
      });

      Object.assign(sneaker, details);
    } catch (error) {
      logger.error(error);
    }

    await productPage.close();
    // await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  try {
    const fileName = `sneakers_courir_${categorySlug}.json`;
    await fs.writeFile(fileName, JSON.stringify(allProducts, null, 2), "utf-8");

    logger.info(`All sneakers saved in file ${fileName}`);
  } catch (writeError) {
    logger.error(writeError);
  }

  await browser.close();
}

async function main() {
  await scrapCategory("femme");
  await scrapCategory("homme");
}

execute(main, "scrapping:courir");
