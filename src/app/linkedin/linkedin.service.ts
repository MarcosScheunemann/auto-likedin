
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LinkedInService {
  constructor() {}

  // Exemplo de método para publicar postagens agendadas
  async publishScheduledPosts(): Promise<void> {
    // const db = this.firebaseService.getFirestore();

    // 1. Recuperar postagens pendentes do Firestore
    // const scheduledPostsRef = db.collection('scheduledPosts');
    // const snapshot = await scheduledPostsRef
    //   .where('status', '==', 'pending')
    //   .get();

    // 2. Para cada postagem, vamos publicar no LinkedIn
    // const batch = db.batch(); // usar batch se quisermos atualizar tudo de uma vez

    // for (const doc of snapshot.docs) {
    //   const postData = doc.data();
    //   try {
    //     // 3. Chama método para realmente postar
    //     await this.postToLinkedIn(postData);

    //     // 4. Marca como publicado
    //     batch.update(doc.ref, {
    //       status: 'published',
    //       publishedAt: new Date(),
    //     });
    //   } catch (error) {
    //     console.error('Erro ao publicar postagem:', error);
    //     // opcionalmente, você pode atualizar o status como 'error'
    //     batch.update(doc.ref, {
    //       status: 'error',
    //       errorMessage: error.message || 'Erro desconhecido',
    //     });
    //   }
    // }

    // 5. Executa batch do Firestore
    // await batch.commit();
  }

  /**
   * Método que efetivamente faz a chamada à API do LinkedIn
   * para criar um post. Você precisará adaptar conforme a
   * API e o tipo de conteúdo.
   */
  private async postToLinkedIn(postData: any): Promise<void> {
    // Aqui você precisa ter o token do LinkedIn
    // Caso seja um token por usuário, cada postData teria um
    // userId, e você buscaria o token correspondente no Firestore
    // const db = this.firebaseService.getFirestore();

    // const userTokenDoc = await db
    //   .collection('linkedinTokens')
    //   .doc(postData.userId) // adaptado para seu caso
    //   .get();

    // if (!userTokenDoc.exists) {
    //   throw new Error('Token do LinkedIn não encontrado para este usuário');
    // }

    // const tokenData = userTokenDoc.data();
    // const accessToken = tokenData.accessToken;

    // Exemplo de chamada
    // (Verifique a documentação oficial do LinkedIn Marketing / V2 / UGC Post)
    const url = 'https://api.linkedin.com/v2/ugcPosts';
    const requestBody = {
      author: `urn:li:person:${'tokenData.linkedinId'}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: postData.message,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        // Exemplo de post público
        'com.linkedin.ugc.MemberNetworkVisibility': 'CONNECTIONS',
      },
    };

    await axios.post(url, requestBody, {
      headers: {
        // 'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    // Se chegar até aqui, deu tudo certo
  }

  /**
   * Exemplo de método para obter o token via OAuth e salvar no Firestore.
   * Você teria um endpoint em um AuthController para chamar isso.
   */
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<void> {
    // Endpoint para trocar code por token
    const url = 'https://www.linkedin.com/oauth/v2/accessToken';

    // Pegue do .env ou config
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    const params = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    };

    const response = await axios.post(url, null, { params });

    const { access_token, expires_in } = response.data;
    // Salvar no Firebase
    // const db = this.firebaseService.getFirestore();
    // Você precisará identificar o usuário de alguma forma
    // ou salvar tokens de modo que consiga recuperá-los depois
    const userId = '...'; // ID do seu usuário no banco

    // await db.collection('linkedinTokens').doc(userId).set({
    //   accessToken: access_token,
    //   expiresIn: expires_in,
    //   createdAt: new Date(),
    //   // adicional: refresh token, se aplicável
    // });
  }
}
