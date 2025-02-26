export type WidgetType = 'text' | 'image' | 'button' | 'table';

export interface TextStyle {
  fontSize?: string;
  color?: string;
  isBold?: boolean;
  isItalic?: boolean;
  textAlign?: 'left' | 'center' | 'right';
}

export interface TextContent {
  text: string;
  style?: TextStyle;
}

export interface ImageContent {
  url: string;
  alt: string;
}

export interface ButtonContent {
  text: string;
  variant: 'primary' | 'secondary' | 'outline';
  url?: string;
}

export interface TableContent {
  rows: Array<Array<{ type: 'text' | 'image'; content: string }>>;
  columns: number;
}

export interface WidgetStyle {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  padding: string;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: string;
  fontWeight?: 'normal' | 'bold';
}

export interface Widget {
  id: string;
  type: WidgetType;
  content: TextContent | ImageContent | ButtonContent | TableContent;
  position: { x: number; y: number };
  size?: { w: number; h: number };
  isEditing?: boolean;
  style?: WidgetStyle;
}
