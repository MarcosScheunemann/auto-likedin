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
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      );
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      try {
        await page.waitForSelector(
          'article, .post-content, .news-body, .entry-content, .page-content, .sdc-article-body--story, .entry-main-content, .mainArea, .art-content',
          { timeout: 60000 },
        );
      } catch (error) {
        console.error('Não encontrou nenhum seletor esperado:', error);
      }

      const content = await page.evaluate(() => {
        const paragraphs = Array.from(
          document.querySelectorAll(
            'article p, .post-content p, .news-body p, .entry-content p, .page-content p, .sdc-article-body--story p, .entry-main-content p, .mainArea p, .art-content p',
          ),
        );
        return paragraphs.map((p) => p.textContent?.trim() || '');
      });

      return this.filterContent(content);
    } catch (error: any) {
      throw new BadRequestException(
        `[ER103] Erro ao realizar scraping: ${error.message}`,
      );
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  filterContent(content: string[]): string {
    const undesiredKeywords = [
      'READ MORE',
      'Read more »',
      'Read the full story',
      'Click here to continue reading',
      'Click here',
      'Open Settings >',
      'logout',
      'login',

      'This is a modal window',
      'Beginning of dialog window',
      'Escape will cancel and close the window',
      'End of dialog window',
      'Please use Chrome browser for a more accessible video player',

      'Our community members are treated to special offers',
      'Sign up to',
      'Subcribe:',
      'Join the',
      'Read the latest',
      'Follow him on',
      'A weekly newsletter by David Pierce',
      'Become a Motley Fool member today',
      'Sponsored content',
      'Sign up for exclusive updates',

      'The writer is the chair of Amnesty International India',
      'Twitter: @',
      'Follow our channel and never miss an update',
      'Be the first to get Breaking News',
      'Google and Apple changed the name of the body of water',
      'Get instant access',

      'article was originally',
      'All figures quoted in US dollars unless otherwise stated',
      'Returns as of',
      'Authorised by',
      'Editing by ',
      'MORE: ',
    ];

    const cleaned = content
      .filter((text) => text.length > 35)
      .filter((text) => {
        return !undesiredKeywords.some((keyword) =>
          text?.toLowerCase().includes(keyword.toLowerCase()),
        );
      })
      .join('\n\n');

    if (cleaned.length < 120) {
      return '';
    }
    return cleaned;
  }
}
