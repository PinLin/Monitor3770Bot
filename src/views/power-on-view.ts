import { TelegrafContext } from 'telegraf/typings/context';

export interface PowerOnViewProps {
  success: boolean;
}

export function sendPowerOnView(ctx: TelegrafContext, props: PowerOnViewProps) {
  if (props.success) {
    return ctx.reply('🏙 開機請求已送出，請等候電腦開機完成');
  } else {
    return ctx.reply('🏙 開機請求送出失敗...');
  }
}
