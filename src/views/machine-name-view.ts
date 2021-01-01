import { KeyboardButton } from 'telegraf/typings/telegram-types';
import { BotContext } from '../interfaces/bot-context';

export interface MachineNameViewProps {
  machineName: string;
  keyboard: KeyboardButton[][];
}

export function sendMachineNameView(ctx: BotContext, props: MachineNameViewProps) {
  return ctx.reply(`🖥 *${props.machineName}*`, {
    parse_mode: 'Markdown',
    reply_markup: {
      resize_keyboard: true,
      keyboard: props.keyboard,
    },
  });
}
