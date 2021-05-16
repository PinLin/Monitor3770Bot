export interface MachineNameViewProps {
  machineName: string;
}

export function getMachineNameView(props: MachineNameViewProps) {
  return {
    text: `🖥 *${props.machineName}*`,
  };
}
