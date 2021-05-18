export interface PowerOffViewProps {
  success: boolean;
  minutes?: number;
}

export function getPowerOffView(props: PowerOffViewProps) {
  let text: string;
  if (props.success) {
    if (props.minutes > 0) {
      text = `🌆 關機請求已送出，電腦將在 ${props.minutes} 分鐘後關機`;
    } else {
      text = "🌆 關機請求已送出，電腦將立即關機";
    }
  } else {
    text = "🌆 關機請求送出失敗...";
  }

  return {
    text,
    keyboard: [
      [{ text: '📊 總覽' }],
    ],
  };
}
