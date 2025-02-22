import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { EChatGptModel, EChatGptRole } from 'scheunemann-interfaces';

@Injectable()
export class GptService {
  constructor() {}
  public async execute(noticias: string[] | null) {
    if (!noticias) {
      throw new BadRequestException('Sem noticias para tratar!');
    }
    const notes: {
      name?: string;
      role: EChatGptRole;
      content: string;
    }[] = noticias.map((noticia, index) => ({
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
        content: `Você é um especialista em tecnologia e jornalismo. Sua tarefa é analisar um conjunto de notícias sobre tecnologia 
        e selecionar a mais relevante, considerando impacto na sociedade, inovação e relevância global. Após escolher, 
        você deve fornecer um resumo detalhado da notícia, mantendo os pontos mais importantes.`,
      },
      ...notes,
      {
        name: 'Marcos',
        role: EChatGptRole.USER,
        content:
          'Agora, escolha a notícia mais relevante e forneça um resumo detalhado.',
      },
    ];
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { messages, model: EChatGptModel.GPT_4O },
      {
        headers: {
          Authorization: process.env.OPENAI_API_KEY,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  }
}
