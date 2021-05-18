export interface UpTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const UpTimeDefaultValue: UpTime = {
  days: NaN,
  hours: NaN,
  minutes: NaN,
  seconds: NaN,
}
