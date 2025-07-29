import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';
import { env } from '@shared/env/env';

@Injectable()
export class GoogleAuthController extends Controller<GoogleAuthController.Response> {
  protected override async handle(): Promise<Controller.Response<GoogleAuthController.Response>> {
    // Usar URLSearchParams para encoding correto
    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: env.GOOGLE_CALLBACK_URL,
      response_type: 'code',
      scope: 'profile email',
      access_type: 'offline',
      prompt: 'consent',
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    return {
      statusCode: 200,
      body: {
        authUrl: googleAuthUrl,
        message: 'Redirect to this URL to authenticate with Google',
      },
    };
  }
}

export namespace GoogleAuthController {
  export type Response = {
    authUrl: string;
    message: string;
  };
}
