import { IAnimationParams } from './animation';
import { exportBitmap, exportOLED, extractFrames } from './animation-maker';
import { createBitmapUrl } from './image-utils';

function animationName(url: string) {
  const path = new URL(url).pathname;
  if (path.toLowerCase().endsWith('.json')) {
    const pathParts = path.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart.length > 5) {
      const dot = lastPart.lastIndexOf('.');
      return `${lastPart.substr(0, dot)}`.replace(/[-_\s]+/g, ' ');
    }
  }
  return '';
}

export async function loadAnimation(url: string, size: number): Promise<IAnimationParams> {
  const res = await fetch(url);
  const lottie = await res.json();
  const frameUrls = [];
  const exported = [];
  let delay = 100;
  for await (const frame of extractFrames(lottie, {
    size,
    invert: true,
  })) {
    const bitmap = exportBitmap(frame, 1);
    frameUrls.push(createBitmapUrl(bitmap));
    exported.push(exportOLED(frame.data));
    delay = Math.round(1000 / frame.framesPerSecond);
  }
  return {
    name: animationName(url),
    width: size,
    height: size,
    delay,
    frames: exported,
    frameUrls,
  };
}
