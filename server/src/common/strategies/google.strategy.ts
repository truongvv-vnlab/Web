import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from 'src/config/google-oauth.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleOauthConfiguration: ConfigType<typeof googleOauthConfig>,
  ) {
    super({
      clientID: googleOauthConfiguration.clientID!,
      clientSecret: googleOauthConfiguration.clientSecret!,
      callbackURL: googleOauthConfiguration.callbackURL!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    console.log({ profile });
    done(null, { profile, accessToken });
  }
}
