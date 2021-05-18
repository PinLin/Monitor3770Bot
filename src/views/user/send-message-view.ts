export interface SendMessageViewProps {
  success: boolean;
}

export function getSendMessageView(props: SendMessageViewProps) {
  return {
    text: props.success ? "✉️ 訊息傳送成功！" : "✉️ 訊息傳送失敗...",
    keyboard: [
      [{ text: '📊 總覽' }],
    ],
  };
}
