/* eslint-disable @typescript-eslint/no-explicit-any */
import { GalleryView } from '@i/GalleryView';

export function isGalleryView(obj: any): obj is GalleryView {
  return obj && 'gallery' in obj;
}
