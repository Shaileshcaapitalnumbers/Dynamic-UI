
import { create } from 'zustand';
import { Widget } from './types';

const STORAGE_KEY = 'canvas-widgets';

interface WidgetState {
  widgets: Widget[];
  history: Widget[][];
  currentIndex: number;
  addWidget: (widget: Widget) => void;
  updateWidget: (id: string, widget: Partial<Widget>) => void;
  deleteWidget: (id: string) => void;
  clearWidgets: () => void;
  undo: () => void;
  redo: () => void;
}

// Load initial state from localStorage
const loadFromStorage = (): Widget[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading widgets from localStorage:', error);
    return [];
  }
};

const saveToStorage = (widgets: Widget[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  } catch (error) {
    console.error('Error saving widgets to localStorage:', error);
  }
};

const useWidgetStore = create<WidgetState>((set) => ({
  widgets: loadFromStorage(),
  history: [loadFromStorage()],
  currentIndex: 0,
  addWidget: (widget) =>
    set((state) => {
      const newWidgets = [...state.widgets, widget];
      const newHistory = state.history.slice(0, state.currentIndex + 1);
      saveToStorage(newWidgets);
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
      saveToStorage(newWidgets);
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
      saveToStorage(newWidgets);
      return {
        widgets: newWidgets,
        history: [...newHistory, newWidgets],
        currentIndex: state.currentIndex + 1,
      };
    }),
  clearWidgets: () =>
    set((state) => {
      const newHistory = state.history.slice(0, state.currentIndex + 1);
      localStorage.removeItem(STORAGE_KEY);
      return {
        widgets: [],
        history: [...newHistory, []],
        currentIndex: state.currentIndex + 1,
      };
    }),
  undo: () =>
    set((state) => {
      if (state.currentIndex <= 0) return state;
      const newWidgets = state.history[state.currentIndex - 1];
      saveToStorage(newWidgets);
      return {
        widgets: newWidgets,
        currentIndex: state.currentIndex - 1,
      };
    }),
  redo: () =>
    set((state) => {
      if (state.currentIndex >= state.history.length - 1) return state;
      const newWidgets = state.history[state.currentIndex + 1];
      saveToStorage(newWidgets);
      return {
        widgets: newWidgets,
        currentIndex: state.currentIndex + 1,
      };
    }),
}));

export default useWidgetStore;
