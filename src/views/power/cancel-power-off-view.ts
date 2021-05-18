export interface CancelPowerOffViewProps {
  success: boolean;
}

export function getCancelPowerOffView(props: CancelPowerOffViewProps) {
  return {
    text: props.success ? "🔄 重設關機請求已送出，電腦將會保持開機狀態" : "🔄 重設關機請求送出失敗...",
    keyboard: [
      [{ text: '📊 總覽' }],
    ],
   };
}
