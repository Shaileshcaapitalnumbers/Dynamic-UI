
export type WidgetType = 'text' | 'image' | 'button' | 'table';

export interface WidgetStyle {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  padding: string;
}

export interface Widget {
  id: string;
  type: WidgetType;
  content: any;
  position: { x: number; y: number };
  size?: { w: number; h: number };
  isEditing?: boolean;
  style?: WidgetStyle;
}

export interface TextContent {
  text: string;
}

export interface ImageContent {
  url: string;
  alt: string;
}

export interface ButtonContent {
  text: string;
  variant: 'primary' | 'secondary' | 'outline';
}

export interface TableContent {
  rows: Array<Array<{ type: 'text' | 'image'; content: string }>>;
  columns: number;
}
