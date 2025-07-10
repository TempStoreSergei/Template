export interface KeyboardKeyProps {
  action?: string;
  isSpecial?: boolean;
  letter: string;
  width?: number;
}

export interface KeyboardRowProps {
  keys: KeyboardKeyProps[];
}

export interface SuggestionItem {
  name: string;
  type: 'dish' | 'category';
}

export interface VirtualKeyboardProps {
  disabled?: boolean;
  isNumberMode?: boolean;
  maxLength?: number;
  modelValue: string;
  placeholder?: string;
  returnButtonText?: string;
  suggestions?: SuggestionItem[];
  visible: boolean;
}

export interface KeyboardEmits {
  close: [];
  enter: [value: string];
  'update:modelValue': [value: string];
  'update:visible': [visible: boolean];
}
