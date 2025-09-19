const puppeteer = require('puppeteer');
const fs = require('fs').promises;

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.courir.com/fr/c/femme/chaussures/', { waitUntil: 'networkidle2' });

  let allSneakers = [];

  while (allSneakers.length < 100) {
    // Scroll en bas pour chargement
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Récupérer tous les produits visibles
    const sneakersBatch = await page.evaluate(() => {
      const cleanPrice = (priceStr) => {
        if (!priceStr) return '';
        return priceStr.replace(/\s*S\/O\s*$/, '').trim();
      };
      const items = document.querySelectorAll('.product__tile__container');
      return Array.from(items).map(item => ({
        brand: item.querySelector('.product__name__brand.js-product-name_brand')?.textContent.trim(),
        name: item.querySelector('.product__name__product.js-product-name_product')?.textContent.trim(),
        price: cleanPrice(item.querySelector('.default-price')?.textContent),
        promotionalprice: cleanPrice(item.querySelector('.promotional-price')?.textContent),
        image: item.querySelector('.product__image img')?.src,
        detailUrl: item.querySelector('a.product__link')?.href
      }));
    });

    // Ajouter uniquement les nouveaux produits
    const existingUrls = new Set(allSneakers.map(p => p.detailUrl));
    for (const p of sneakersBatch) {
      if (p.detailUrl && !existingUrls.has(p.detailUrl) && allSneakers.length < 100) {
        allSneakers.push(p);
      }
    }
    console.log(`Total produits collectés : ${allSneakers.length}`);

    // [Si atteint 50], stoppe la boucle
    if (allSneakers.length >= 100) {
      console.log("Limite de 50 produits atteinte, arrêt de la collecte.");
      break;
    }

    // Vérifier présence bouton "Afficher plus de produits"
    const moreButtonVisible = await page.$eval('button.display-more-products', btn => btn && btn.offsetParent !== null).catch(() => false);
    if (!moreButtonVisible) {
      console.log("Bouton 'Afficher plus de produits' non visible ou absent, fin de chargement.");
      break;
    }

    console.log("Clic sur 'Afficher plus de produits'...");
    await page.click('button.display-more-products');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Scrapping des infos complémentaires
  for (const sneaker of allSneakers) {
    console.log(`\n--- Traitement : ${sneaker.name} ---`);
    if (!sneaker.detailUrl) {
      console.log('URL de produit manquante, passage au suivant');
      continue;
    }

    const productPage = await browser.newPage();

    try {
      const response = await productPage.goto(sneaker.detailUrl, { waitUntil: 'networkidle2', timeout: 15000 });
      if (!response || !response.ok()) {
        console.log(`Erreur chargement page produit : ${sneaker.detailUrl}`);
        await productPage.close();
        continue;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));

      const details = await productPage.evaluate(() => {
        const sizeElements = document.querySelectorAll('.swatches .swatchanchor') || [];
        const sizes = Array.from(sizeElements).map(el => el.textContent.trim()).filter(Boolean);

        const colorLinks = document.querySelectorAll('.productlinks-link-container .productlink-link a') || [];
        const colors = Array.from(colorLinks).map(el => ({
          colorName: el.getAttribute('title')?.replace('Couleur :', '').trim() || '',
          colorUrl: el.getAttribute('href') || ''
        }));

        const description = document.querySelector('.product-short-description')?.textContent.trim() || '';
        const sku = document.querySelector('.product-sku')?.textContent.trim() || '';

        return { sizes, colors, description, sku };
      });

      Object.assign(sneaker, details);
    } catch (error) {
      console.log(`Erreur lors du traitement de la page produit ${sneaker.detailUrl} :`, error.message);
    }

    await productPage.close();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n=== Tous les produits enrichis ===");
  console.log(allSneakers);

  // Sauvegarde dans JSON
  try {
    await fs.writeFile('sneakers femmes.json', JSON.stringify(allSneakers, null, 2), 'utf-8');
    console.log('Résultats sauvegardés dans sneakers.json');
  } catch (writeError) {
    console.error('Erreur sauvegarde fichier JSON :', writeError);
  }

  await browser.close();
})();
