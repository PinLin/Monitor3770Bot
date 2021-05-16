export function getStartInputCommandView() {
  const text = '🖥️ 命令\n' +
    '\n' +
    '請輸入您的命令。';
  const keyboard = [
    [{ text: '🔙 取消' }],
  ];

  return { text, keyboard };
}
