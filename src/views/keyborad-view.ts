import { KeyboardButton } from 'telegraf/typings/telegram-types';
import { BotContext } from '../interfaces/bot-context';

export interface KeyboardViewProps {
  computerName: string;
  keyboard: KeyboardButton[][];
}

export function sendKeyboardView(ctx: BotContext, props: KeyboardViewProps) {
  return ctx.reply(`🖥 *${props.computerName}*`, {
    parse_mode: 'Markdown',
    reply_markup: {
      resize_keyboard: true,
      keyboard: props.keyboard,
    },
  });
}
