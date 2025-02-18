import { Injectable, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class ScrapingService {
  constructor() {}

  /**
   * Este método faz scraping completo usando Puppeteer,
   * inclusive se a página renderizar conteúdo via JavaScript.
   *
   * @param url URL da notícia
   * @returns Conteúdo da notícia
   */
  async execute(url: string): Promise<string> {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true, // Usa o navegador em modo headless (sem interface gráfica)
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      // Espera o conteúdo principal renderizar (ajuste o seletor conforme necessário)
      await page
        .waitForSelector('article, .post-content, .news-body, .entry-content', {
          timeout: 10000,
        })
        .catch(() => {});

      // Extrai o conteúdo da página
      const content = await page.evaluate(() => {
        const paragraphs = Array.from(
          document.querySelectorAll(
            'article p, .post-content p, .news-body p, .entry-content p',
          ),
        );
        return paragraphs
          .map((p) => p.textContent?.trim())
          .filter(Boolean)
          .join('\n\n');
      });

      if (!content) {
        return '';
      }

      return content;
    } catch (error: any) {
      throw new BadRequestException(`[ER103] Erro ao realizar scraping: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
