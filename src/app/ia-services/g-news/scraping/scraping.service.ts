import { Injectable, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

@Injectable()
export class ScrapingService {
  private browser: Browser | null = null;
  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return this.browser;
  }

  /**
   * Este método faz scraping completo usando Puppeteer,
   * inclusive se a página renderizar conteúdo via JavaScript.
   *
   * @param url URL da notícia
   * @returns Conteúdo da notícia
   */
  async execute(url: string): Promise<string> {
    let page: Page | null = null;
    try {
      const browser = await this.getBrowser();
      page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
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

      return content || '';
    } catch (error: any) {
      throw new BadRequestException(`[ER103] Erro ao realizar scraping: ${error.message}`,);
    } finally {
      // Fecha a página para liberar recursos
      if (page) {
        await page.close();
      }
    }
  }
}
