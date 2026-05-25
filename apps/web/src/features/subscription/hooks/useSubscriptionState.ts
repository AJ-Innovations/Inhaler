import { useEffect, useRef, useState } from "react";

import { BillingCycle } from "../types";

export function useSubscriptionState(numPlans: number) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [activeIndex, setActiveIndex] = useState(1); // Default to the Pro plan (index 1)
  const touchStart = useRef<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    const threshold = 50; // swipe threshold in px

    if (diff > threshold) {
      // Swipe left -> Next card
      setActiveIndex((prev) => Math.min(prev + 1, numPlans - 1));
    } else if (diff < -threshold) {
      // Swipe right -> Previous card
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }

    touchStart.current = null;
  };

  return {
    billingCycle,
    setBillingCycle,
    activeIndex,
    setActiveIndex,
    isDesktop,
    handleTouchStart,
    handleTouchEnd,
  };
}
