import { MutableRefObject, useEffect, useState } from 'react';

/**
 * For a given Map of elements, sets up an intersection observer for each one, and returns a mapping of
 * the Map key, to an intersection ratio (i.e. roughly how much of the element is on screen)
 */
const useVisibleElements = (
  /**
   * Reference to a map of index -> element. Each element in the map will be observed
   * for intersections with the root element of the page
   */
  ref: MutableRefObject<Map<number | string, HTMLDivElement>>,
  /**
   * Offset to apply to the top of the margin of the intersection observers.
   * Used to account for any heading elements above the elements being observed
   */
  offsetTop: number
) => {
  /**
   * How much of each HTML element is currently on screen?
   */
  const [elementsVisibility, setElementsVisibility] = useState<Record<number, number>>({});

  /**
   * Higher-order method to get an intersection handler for a given element.
   *
   * Done this way so we can more easily track a specific element appearing on screen,
   * as a single intersection observer for all of the elements would make it tricky to
   * work out which index we need to use
   */
  const getIntersectCallback: (index: number | string) => IntersectionObserverCallback =
    (index) =>
    ([entry]) => {
      setElementsVisibility((prevActiveSections) => ({
        ...prevActiveSections,
        [index]: entry.intersectionRatio,
      }));
    };

  /**
   * Setup individual intersection observers for each section, so we can
   * more easily update the "active" section based on scroll activity
   */
  useEffect(() => {
    const cleanupMethods = new Map<number | string, IntersectionObserver['disconnect']>();

    ref.current.forEach((element, key) => {
      const handler = getIntersectCallback(key);
      const observer = new IntersectionObserver(handler, {
        rootMargin: `-${offsetTop}px 0px 0px 0px`,
        threshold: [0, 0.5, 1],
      });
      observer.observe(element);

      // Setup a cleanup method for this observer so we can clean everything up at the end
      cleanupMethods.set(key, () => observer.disconnect());
    });

    return () => {
      cleanupMethods.forEach((cleanupObserver) => cleanupObserver());
    };
  }, [offsetTop, ref]);

  return elementsVisibility;
};

export default useVisibleElements;
