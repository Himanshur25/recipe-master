import { useRef, useEffect } from "react";
import type React from "react";

interface InfiniteScrollProps {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

/**
 * InfiniteScroll is a React functional component that provides infinite scrolling functionality.
 * It observes a target element and triggers the `fetchNextPage` function when the element
 * becomes visible in the viewport, enabling seamless loading of additional content.
 *
 * @template InfiniteScrollProps - The props type for the InfiniteScroll component.
 *
 * @param {React.PropsWithChildren<InfiniteScrollProps>} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components or elements to render.
 * @param {() => void} props.fetchNextPage - A function to fetch the next page of data.
 * @param {boolean} props.hasNextPage - A boolean indicating whether there are more pages to load.
 * @param {boolean} props.isFetchingNextPage - A boolean indicating whether the next page is currently being fetched.
 *
 * @returns {JSX.Element} The rendered InfiniteScroll component.
 *
 * @remarks
 * - The component uses the Intersection Observer API to detect when the target element
 *   (a small div at the bottom) is visible in the viewport.
 * - The `fetchNextPage` function is called when the target element is intersecting and
 *   there are more pages to load (`hasNextPage` is true).
 * - The observer is cleaned up when the component unmounts or when dependencies change.
 */

const InfiniteScroll: React.FC<React.PropsWithChildren<InfiniteScrollProps>> = ({
  children,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      {children}
      <div ref={observerRef} style={{ height: "10px" }} />
    </>
  );
};

export default InfiniteScroll;
