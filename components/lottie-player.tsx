import lottie, { AnimationItem } from 'lottie-web';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface ILottiePlayerProps {
  src: string;
}

const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';

export function LottiePlayer({ src }: ILottiePlayerProps) {
  const animationRef = useRef<AnimationItem | null>(null);
  const [isVisible, setVisible] = useState(hasIntersectionObserver ? false : true);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    animationRef.current?.destroy();
    const hostEl = hostRef.current;
    if (src && isVisible && hostEl) {
      animationRef.current = lottie.loadAnimation({
        container: hostEl,
        path: src,
        autoplay: false,
      });
    } else {
      animationRef.current = null;
    }
  }, [src, isVisible]);

  const setRefs = useCallback((node: HTMLDivElement) => {
    hostRef.current = node;
    if (node && hasIntersectionObserver && !isVisible) {
      const intersection = new IntersectionObserver((entry) => {
        if (entry.some((f) => f.intersectionRatio > 0)) {
          setVisible(true);
          intersection.disconnect();
        }
      });
      intersection.observe(node);
    }
  }, []);

  return (
    <div
      onMouseEnter={() => animationRef.current?.play()}
      onMouseLeave={() => animationRef.current?.stop()}
      ref={setRefs}
    />
  );
}
