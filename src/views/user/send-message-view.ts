export interface SendMessageViewProps {
  success: boolean;
}

export function getSendMessageView(props: SendMessageViewProps) {
  const text = props.success ? "✉️ 訊息傳送成功！" : "✉️ 訊息傳送失敗...";
  const keyboard = [
    [{ text: '📊 總覽' }],
  ];

  return { text, keyboard };
}
