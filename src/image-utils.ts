export async function asyncImage(url: string) {
  const image = new Image();
  image.src = url;
  await new Promise((resolve, reject) => ((image.onload = resolve), (image.onerror = reject)));
  return image;
}

export function createBitmapUrl(data: Uint8Array) {
  return URL.createObjectURL(new Blob([data], { type: 'image/bitmap' }));
}

export function createSVGUrl(data: string) {
  return URL.createObjectURL(new Blob([data], { type: 'image/svg+xml;charset=utf-8' }));
}
