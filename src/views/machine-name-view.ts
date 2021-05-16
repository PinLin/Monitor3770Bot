import { KeyboardButton } from 'telegraf/typings/telegram-types';
import { BotContext } from '../models/bot-context';

export interface MachineNameViewProps {
  machineName: string;
  keyboard?: KeyboardButton[][]; // TODO: Remove it.
}

// TODO: Remove it.
export function sendMachineNameView(ctx: BotContext, props: MachineNameViewProps) {
  return ctx.reply(`🖥 *${props.machineName}*`, {
    parse_mode: 'Markdown',
    reply_markup: {
      resize_keyboard: true,
      keyboard: props.keyboard,
    },
  });
}

export function getMachineNameView(props: MachineNameViewProps) {
  return {
    text: `🖥 *${props.machineName}*`,
  };
}
