export interface PowerOnViewProps {
  success: boolean;
}

export function getPowerOnView(props: PowerOnViewProps) {
  return {
    text: props.success ? "🏙 開機請求已送出，請等候電腦開機完成" : "🏙 開機請求送出失敗...",
    keyboard: [
      [{ text: '📊 總覽' }],
    ],
  };
}
