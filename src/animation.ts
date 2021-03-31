export interface IAnimationParams {
  name: string;
  height: number;
  width: number;
  delay: number;
  frames: Uint8Array[];
  frameUrls: string[];
}
