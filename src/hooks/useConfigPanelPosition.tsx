
import { useEffect, useState, RefObject } from 'react';

interface Position {
  left: number;
  top: number;
}

export const useConfigPanelPosition = (
  buttonRef: RefObject<HTMLDivElement>,
  panelRef: RefObject<HTMLDivElement>,
  padding: number = 16
) => {
  const [position, setPosition] = useState<Position>({ left: -9999, top: -9999 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set initial position off-screen
    setPosition({ left: -9999, top: -9999 });
    
    // Add small delay to allow for initial render
    const timer = setTimeout(() => {
      if (!buttonRef.current || !panelRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const panelRect = panelRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Check space in all directions
      const spaceRight = viewportWidth - buttonRect.right;
      const spaceLeft = buttonRect.left;
      const spaceBelow = viewportHeight - buttonRect.top;
      const spaceAbove = buttonRect.bottom;

      // Calculate horizontal position
      let left: number;
      if (spaceRight >= panelRect.width + padding) {
        // Position on the right
        left = buttonRect.right + padding;
      } else if (spaceLeft >= panelRect.width + padding) {
        // Position on the left
        left = buttonRect.left - panelRect.width - padding;
      } else {
        // Center horizontally if no space on either side
        left = Math.max(padding, (viewportWidth - panelRect.width) / 2);
      }

      // Calculate vertical position
      let top: number;
      if (spaceBelow >= panelRect.height + padding) {
        // Position below
        top = buttonRect.top;
      } else if (spaceAbove >= panelRect.height + padding) {
        // Position above
        top = buttonRect.bottom - panelRect.height;
      } else {
        // If no ideal space, position at top of viewport with padding
        top = padding;
      }

      // Ensure the panel stays within viewport bounds
      top = Math.max(padding, Math.min(top, viewportHeight - panelRect.height - padding));
      left = Math.max(padding, Math.min(left, viewportWidth - panelRect.width - padding));

      setPosition({ left, top });
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [buttonRef, padding]);

  return { position, isVisible };
};
