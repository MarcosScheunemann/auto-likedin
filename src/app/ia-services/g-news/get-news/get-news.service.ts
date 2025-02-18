import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import {
  factoryEnvelope,
  factoryEnvelopeArray,
  IEnvelope,
  IEnvelopeArray,
  IGNewsResponse,
  IGNewsResponseArticles,
} from 'scheunemann-interfaces';
import { ScrapingService } from '../scraping/scraping.service';

@Injectable()
export class GetNewsService {
  private gnewsApiKey = process.env.G_NEWS_API_KEY;

  constructor(private readonly scrapingService: ScrapingService) {}

  async execute(topic: string | null = null): Promise<IEnvelope<string>> {
    const sources = await this.sourceSearch(topic);
    let contents = [];
    for (let news of sources.items) {
      let content = '';
      try {
        content = await this.scrapingService.execute(news.url);
      } catch (error) {}
      if (content) {
        news.description = content;
        contents.push(news);
      }
    }

    return factoryEnvelope(this.factoryNews(contents));
  }
  /**
   * Este método busca 10 notícias mais recentes sobre tecnologia ou um tópico específico, dos últimos 60 dias.
   * @param topic
   * @returns
   */
  async sourceSearch(
    topic: string | null = null,
  ): Promise<IEnvelopeArray<IGNewsResponseArticles>> {
    if (!this.gnewsApiKey) {
      throw new UnauthorizedException(
        'G_NEWS_API_KEY não configurada. [ER100]',
      );
    }
    try {
      const today = new Date();
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - 60);
      const newsResponse = await axios.get<IGNewsResponse>(
        'https://gnews.io/api/v4/search',
        {
          params: {
            category: 'technology',
            lang: 'en',
            q: topic || 'artificial intelligence',
            sortby: 'publishedAt',
            apikey: this.gnewsApiKey,
            max: 10,
            from: pastDate.toISOString().split('.')[0] + 'Z',
            nullable: 'image',
          },
        },
      );
      const articles = newsResponse.data.articles;
      if (!articles.length) {
        throw new BadRequestException('Nenhuma notícia encontrada. [ER101]');
      }
      return factoryEnvelopeArray(articles);
    } catch (error) {
      throw new BadRequestException('Erro ao buscar notícias. [ER102]');
    }
  }
  private factoryNews(news: IGNewsResponseArticles[]): string {
    const noticiasTexto = news
      .map(
        (noticia, index) =>
          `${index + 1}. **${noticia.title}**\n\n` +
          `Publicado em: ${new Date(noticia.publishedAt).toLocaleString('pt-BR', { timeZone: 'UTC' })}\n` +
          `Fonte: ${noticia.source.name} (${noticia.source.url})\n` +
          `Descrição: ${noticia.description}\n`,
      )
      .join('\n\n');

    return `Aqui estão algumas notícias recentes:\n\n${noticiasTexto}`;
  }
}
