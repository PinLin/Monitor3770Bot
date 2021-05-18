export interface SetMessageTextViewProps {
  username: string;
}

export function getSetMessageTextView(props: SetMessageTextViewProps) {
  return {
    text: '✉️ 訊息傳送\n' +
      '\n' +
      `要傳送什麼訊息給 *${props.username}* 呢？`,
    keyboard: [
      [{ text: '🔙 取消' }],
    ],
  };
}
