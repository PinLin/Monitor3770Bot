export interface PowerOnViewProps {
  success: boolean;
}

export function getPowerOnView(props: PowerOnViewProps) {
  const text = props.success ? "🏙 開機請求已送出，請等候電腦開機完成" : "🏙 開機請求送出失敗...";
  const keyboard = [
    [{ text: '📊 總覽' }],
  ];

  return { text, keyboard };
}
