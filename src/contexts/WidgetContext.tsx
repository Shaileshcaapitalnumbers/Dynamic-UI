
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Widget } from '@/lib/types';

interface WidgetContextType {
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

const WidgetContext = createContext<WidgetContextType | null>(null);

const STORAGE_KEY = 'canvas-widgets';

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

export const WidgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [widgets, setWidgets] = useState<Widget[]>(loadFromStorage());
  const [history, setHistory] = useState<Widget[][]>([loadFromStorage()]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const addWidget = useCallback((widget: Widget) => {
    setWidgets(prev => {
      const newWidgets = [...prev, widget];
      const newHistory = history.slice(0, currentIndex + 1);
      saveToStorage(newWidgets);
      setHistory([...newHistory, newWidgets]);
      setCurrentIndex(currentIndex + 1);
      return newWidgets;
    });
  }, [currentIndex, history]);

  const updateWidget = useCallback((id: string, updates: Partial<Widget>) => {
    setWidgets(prev => {
      const newWidgets = prev.map(w => w.id === id ? { ...w, ...updates } : w);
      const newHistory = history.slice(0, currentIndex + 1);
      saveToStorage(newWidgets);
      setHistory([...newHistory, newWidgets]);
      setCurrentIndex(currentIndex + 1);
      return newWidgets;
    });
  }, [currentIndex, history]);

  const deleteWidget = useCallback((id: string) => {
    setWidgets(prev => {
      const newWidgets = prev.filter(w => w.id !== id);
      const newHistory = history.slice(0, currentIndex + 1);
      saveToStorage(newWidgets);
      setHistory([...newHistory, newWidgets]);
      setCurrentIndex(currentIndex + 1);
      return newWidgets;
    });
  }, [currentIndex, history]);

  const clearWidgets = useCallback(() => {
    const newHistory = history.slice(0, currentIndex + 1);
    localStorage.removeItem(STORAGE_KEY);
    setWidgets([]);
    setHistory([...newHistory, []]);
    setCurrentIndex(currentIndex + 1);
  }, [currentIndex, history]);

  const undo = useCallback(() => {
    if (currentIndex <= 0) return;
    const newWidgets = history[currentIndex - 1];
    saveToStorage(newWidgets);
    setWidgets(newWidgets);
    setCurrentIndex(currentIndex - 1);
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1) return;
    const newWidgets = history[currentIndex + 1];
    saveToStorage(newWidgets);
    setWidgets(newWidgets);
    setCurrentIndex(currentIndex + 1);
  }, [currentIndex, history]);

  return (
    <WidgetContext.Provider value={{
      widgets,
      history,
      currentIndex,
      addWidget,
      updateWidget,
      deleteWidget,
      clearWidgets,
      undo,
      redo
    }}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidgets = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgets must be used within a WidgetProvider');
  }
  return context;
};
