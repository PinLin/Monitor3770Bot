export interface NoPermissionViewProps {
  id: number;
}

export function getNoPermissionView(props: NoPermissionViewProps) {
  return {
    text: `🔒 此帳號（ \`${props.id}\` ）不在允許清單內，沒有權限使用。`,
  };
}
