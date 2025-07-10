export interface IIosSelect {
  source: Array<{ text: string; value: any }>;
  count: number;
  value: any;
  sensitivity: number;
  minScrollValue?: number;
  maxScrollValue?: number;
}

export { default as TimePicker } from './ui/TimePicker.vue'; 