import { useEffect, useRef, useState, type RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T | null>,
  RefObject<T | null>,
  () => void, // Added a manual scroll function
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Function to manually scroll to bottom
  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (!container || !end) return;

    // Function to determine if user is near bottom to maintain auto-scroll
    const checkIfUserIsNearBottom = () => {
      if (!container) return false;
      
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      // If user is within 100px of bottom, we'll continue auto-scrolling
      return distanceFromBottom < 100;
    };

    // Set up scroll listener to determine if we should auto-scroll
    const handleScroll = () => {
      setShouldAutoScroll(checkIfUserIsNearBottom());
    };
    
    container.addEventListener('scroll', handleScroll);

    // Set up mutation observer to scroll when content changes
    const observer = new MutationObserver(() => {
      // Only auto-scroll if user is already near the bottom
      if (shouldAutoScroll) {
        // Use requestAnimationFrame to ensure content is rendered
        requestAnimationFrame(() => {
          end.scrollIntoView({ behavior: 'auto', block: 'end' });
        });
      }
    });

    observer.observe(container, {
      childList: true, // Watch for new messages being added
      subtree: true,   // Watch for changes within messages
    });

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, [shouldAutoScroll]);

  return [containerRef, endRef, scrollToBottom];
}