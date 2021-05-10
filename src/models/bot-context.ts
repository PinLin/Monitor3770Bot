import { Context } from 'telegraf';

export interface BotSession {
  state?: string;
  sendMessageUser?: string;
}

export interface BotContext extends Context {
  session: BotSession;
}
