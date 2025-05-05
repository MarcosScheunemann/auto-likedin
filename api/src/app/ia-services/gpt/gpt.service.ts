import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import axios from 'axios';
import {
  ChatGptResponseEntity,
  EChatGptModel,
  EChatGptRole,
} from 'scheunemann-interfaces';

@Injectable()
export class GptService {
  private gptUrl: string;
  private gptKey?: string;
  constructor() {
    this.gptUrl = 'https://api.openai.com/v1/chat/completions';
    this.gptKey = process.env.OPENAI_API_KEY;
  }
  public async makeResume(news: string[] | null): Promise<string> {
    if (!news) {
      throw new BadRequestException('Sem noticias para tratar!');
    }
    const notes: {
      name?: string;
      role: EChatGptRole;
      content: string;
    }[] = news.map((noticia, index) => ({
      name: 'Marcos',
      role: EChatGptRole.USER,
      content: `Notícia ${index + 1}: ${noticia}`,
    }));
    const messages: {
      name?: string;
      role: EChatGptRole;
      content: string;
    }[] = [
        {
          role: EChatGptRole.SYSTEM,
          content: `You are a technology and journalism expert. Your task is to analyze a set of technology news articles and select the most relevant one, considering societal impact, innovation, and global relevance. After choosing, you must provide a detailed summary of the news, keeping the most important points.`,
        },
        ...notes,
        {
          name: 'Marcos',
          role: EChatGptRole.USER,
          content:
            'Now, choose the most relevant news and provide a detailed summary.',
        },
      ];
    try {
      const response = await axios.post<ChatGptResponseEntity>(
        this.gptUrl,
        { messages, model: EChatGptModel.GPT_4O },
        {
          headers: {
            Authorization: this.gptKey,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.choices[0].message.content;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || error.message,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async makePostText(text: string, inspiration?: string, job?: string): Promise<string> {
    if (!text) {
      throw new BadRequestException('Sem texto para tratar!');
    }
    const messages = [
      {
        role: EChatGptRole.SYSTEM,
        content: `You are an experienced 5 years ${job || 'developer NestJs Backend'}. Your task is to create a LinkedIn post about technology based on the text the "user" sends. 
        The post should be engaging, put human feelings subtly, add some of your own experience to the post only if it makes sense with the news. 
        Avoid using emojis. The post must have a maximum of 1500 characters and be written in Portuguese. ATENTION! the post cannot contain special characters like )({}@ ,ALWAYS add "Segue pra mais!" at the end of the post.`,
      },
    ];
    if (inspiration) {
      messages.push({
        role: EChatGptRole.USER,
        content: `Este é um exemplo de post para se inspirar no estilo de escrita:\n\n${inspiration}`,
      });
    }
    messages.push(
      {
        role: EChatGptRole.USER,
        content: text,
      }
    )
    try {
      const response = await axios.post<ChatGptResponseEntity>(
        this.gptUrl,
        { messages, model: EChatGptModel.GPT_4O },
        {
          headers: {
            Authorization: this.gptKey,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.choices[0].message.content.replace(/[^a-zA-Z0-9\s!]/g, '');
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || error.message,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
