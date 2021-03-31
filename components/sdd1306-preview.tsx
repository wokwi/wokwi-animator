import type { SSD1306Element } from '@wokwi/elements';
import { useEffect, useRef } from 'react';
import { IAnimationParams } from '../src/animation';
import { asyncImage } from '../src/image-utils';

export interface ISSD1306Preview {
  animation?: IAnimationParams;
}

export function SSD1306Preview({ animation }: ISSD1306Preview) {
  const ssd1306Ref = useRef<SSD1306Element>(null);

  useEffect(() => {
    // elements + SSR don't play nicely, so only
    // import the on the client side
    import('@wokwi/elements');
  }, []);

  const drawFrame = async (imageUrl: string) => {
    const image = await asyncImage(imageUrl);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const element = ssd1306Ref.current;
    if (element && ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, (canvas.width - image.width) / 2, (canvas.height - image.height) / 2);
      element.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    if (!animation || !animation.frames.length) {
      return;
    }
    let index = 0;
    const interval = setInterval(() => {
      drawFrame(animation.frameUrls[index]);
      index = (index + 1) % animation.frames.length;
    }, animation.delay);
    return () => clearInterval(interval);
  }, [animation]);

  return <wokwi-ssd1306 ref={ssd1306Ref} />;
}
