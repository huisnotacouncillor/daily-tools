import { LabelLevel } from './enum';

export type Label = {
  name: string;
  color: string;
  level: LabelLevel;
  usage?: string;
  created_at?: string;
  id?: string;
};
