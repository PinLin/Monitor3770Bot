import { BotContext } from '../models/bot-context';
import { getNoPermissionView } from '../views/no-permission-view';

export const allowList = (userIds: number[]) => {
  return (ctx: BotContext, next: () => Promise<void>) => {
    const id = ctx.from.id;

    if (userIds.includes(id)) {
      next();
    } else {
      const username = ctx.from.username ?? ctx.from.first_name + " " + ctx.from.last_name;

      console.log(`Denied actions by ${username} (${id})`);

      const noPermissionView = getNoPermissionView({ id });

      ctx.reply(noPermissionView.text, {
        parse_mode: 'Markdown',
        reply_markup: {
          remove_keyboard: true,
        },
      })
    }
  };
};
