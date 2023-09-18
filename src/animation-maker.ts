import Lottie from 'lottie-web';
import { asyncImage, createSVGUrl } from './image-utils';
import bmp, { BitsPerPixel } from '@wokwi/bmp-ts';

export interface IExportOptions {
  size?: number;
  background?: string;
  invert?: boolean;
}

export interface IExportedFrame {
  index: number;
  data: ImageData;
  framesPerSecond: number;
}
export async function* extractFrames(animationData: any, options: IExportOptions = {}) {
  const target = document.createElement('div');
  const size = options.size ?? 50;
  const anim = Lottie.loadAnimation({
    container: target,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData,
  });

  const framesPerSecond = anim.getDuration(true) / anim.getDuration(false);
  const svg = target.firstElementChild as SVGElement;
  for (let frame = 0; frame < anim.getDuration(true); frame++) {
    anim.goToAndStop(frame, true);
    svg.setAttribute('width', size.toString());
    svg.setAttribute('height', size.toString());
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    const image = await asyncImage(createSVGUrl(svg.outerHTML || ''));
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    if (options.background) {
      context.fillStyle = options.background;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (options.invert) {
      context.filter = 'invert(1)';
    }
    context.drawImage(image, 0, 0);
    yield {
      index: frame,
      framesPerSecond,
      data: context?.getImageData(0, 0, size, size),
    } as IExportedFrame;
  }
}

export function exportOLED(imageData: ImageData) {
  const lineBytes = Math.floor((imageData.width + 7) / 8);
  const result = new Uint8Array(lineBytes * imageData.height);
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      if (
        imageData.data[(y * imageData.height + x) * 4 + 3] > 0x7f &&
        imageData.data[(y * imageData.height + x) * 4 + 2] > 0x80
      ) {
        result[y * lineBytes + (x >> 3)] |= 1 << (7 - (x & 0x7));
      }
    }
  }
  return result;
}

export function exportTiles(imageData: ImageData) {
  const lineBytes = imageData.width;
  const result = new Uint8Array(Math.floor((lineBytes * imageData.height) / 8));
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      if (imageData.data[(y * imageData.height + x) * 4 + 3] > 0x7f) {
        result[(y >> 3) * lineBytes + x] |= 1 << (y & 0x7);
      }
    }
  }
  return result;
}

export function exportBitmap(frame: IExportedFrame, bpp: BitsPerPixel = 24) {
  const imageData = frame.data;
  const bitmapData = new Uint8Array(4 * imageData.height * imageData.width);
  const inputView = new DataView(imageData.data.buffer);
  const outputView = new DataView(bitmapData.buffer);
  for (let i = 0; i < imageData.data.length; i += 4) {
    outputView.setUint32(i, inputView.getUint32(i, true));
  }
  const { data } = bmp.encode({
    data: bitmapData,
    bitPP: bpp,
    width: frame.data.width,
    height: frame.data.height,
  });
  return data;
}
