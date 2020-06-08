export default function calculateGalleryPage(imageNumber: number) {
  const minimumItemNumber = imageNumber - 1;
  return Math.floor(minimumItemNumber / 25);
}
