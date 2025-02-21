
import { create } from 'zustand';
import { Widget } from './types';

interface WidgetState {
  widgets: Widget[];
  history: Widget[][];
  currentIndex: number;
  addWidget: (widget: Widget) => void;
  updateWidget: (id: string, widget: Partial<Widget>) => void;
  deleteWidget: (id: string) => void;
  undo: () => void;
  redo: () => void;
}

const useWidgetStore = create<WidgetState>((set) => ({
  widgets: [],
  history: [[]],
  currentIndex: 0,
  addWidget: (widget) =>
    set((state) => {
      const newWidgets = [...state.widgets, widget];
      const newHistory = state.history.slice(0, state.currentIndex + 1);
      return {
        widgets: newWidgets,
        history: [...newHistory, newWidgets],
        currentIndex: state.currentIndex + 1,
      };
    }),
  updateWidget: (id, updates) =>
    set((state) => {
      const newWidgets = state.widgets.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      );
      const newHistory = state.history.slice(0, state.currentIndex + 1);
      return {
        widgets: newWidgets,
        history: [...newHistory, newWidgets],
        currentIndex: state.currentIndex + 1,
      };
    }),
  deleteWidget: (id) =>
    set((state) => {
      const newWidgets = state.widgets.filter((w) => w.id !== id);
      const newHistory = state.history.slice(0, state.currentIndex + 1);
      return {
        widgets: newWidgets,
        history: [...newHistory, newWidgets],
        currentIndex: state.currentIndex + 1,
      };
    }),
  undo: () =>
    set((state) => {
      if (state.currentIndex <= 0) return state;
      return {
        widgets: state.history[state.currentIndex - 1],
        currentIndex: state.currentIndex - 1,
      };
    }),
  redo: () =>
    set((state) => {
      if (state.currentIndex >= state.history.length - 1) return state;
      return {
        widgets: state.history[state.currentIndex + 1],
        currentIndex: state.currentIndex + 1,
      };
    }),
}));

export default useWidgetStore;
