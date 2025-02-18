import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { factoryEnvelope, IEnvelope, IGNewsResponse, IGNewsResponseArticles } from 'scheunemann-interfaces';

@Injectable()
export class GetNewsService {
  private gnewsApiKey = process.env.G_NEWS_API_KEY;

  constructor() {}
  /**
   * Este método busca 10 notícias mais recentes sobre tecnologia ou um tópico específico, dos últimos 60 dias.
   * @param topic
   * @returns
   */
  async execute(topic: string | null = null): Promise<IEnvelope<IGNewsResponseArticles[]>> {
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
      return factoryEnvelope(articles);
    } catch (error) {
      throw new BadRequestException('Erro ao buscar notícias. [ER102]');
    }
  }
  private factoryNews(news: IGNewsResponse): string {
    const noticiasTexto = news.articles
      .map(
        (noticia, index) =>
          `${index + 1}. **${noticia.title}**\n\n` +
          `Publicado em: ${new Date(noticia.publishedAt).toLocaleString('pt-BR', { timeZone: 'UTC' })}\n` +
          `Fonte: ${noticia.source.name} (${noticia.source.url})\n` +
          `Link: ${noticia.url}\n` +
          `Descrição: ${noticia.description || 'Descrição não disponível.'}\n` +
          `Conteúdo: ${noticia.content ? noticia.content.replace(/\[.*?\]/g, '') : 'Conteúdo não disponível.'}`,
      )
      .join('\n\n');

    return `Aqui estão algumas notícias recentes:\n\n${noticiasTexto}`;
  }
}
