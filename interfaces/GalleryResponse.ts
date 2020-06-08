import { CRZImage } from './CRZImage';

export interface GalleryResponse {
  canGallery: boolean;
  folderName: string;
  totalImagesCount: number;
  images: CRZImage[];
}
