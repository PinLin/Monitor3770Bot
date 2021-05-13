import { sendNoPermissionView } from '../views/no-permission-view';

export const allowList = (userIds: number[]) => {
  return (ctx, next) => {
    const id = ctx.from.id;

    if (userIds.includes(id)) {
      next();
    } else {
      const username = ctx.from.username ?? ctx.from.first_name + " " + ctx.from.last_name;
      
      console.log(`Denied actions by ${username} (${id})`);
      sendNoPermissionView(ctx, { id });
    }
  }
};
