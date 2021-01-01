import { Context } from 'telegraf';
import { BotSession } from './bot-session';

export interface BotContext extends Context {
  session: BotSession;
}
