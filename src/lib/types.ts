
export type WidgetType = 'text' | 'image' | 'button' | 'table';

export interface Widget {
  id: string;
  type: WidgetType;
  content: any;
  position: { x: number; y: number };
  size?: { w: number; h: number };
  isEditing?: boolean;
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
