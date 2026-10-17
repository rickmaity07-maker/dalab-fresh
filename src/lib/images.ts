// Cloudinary delivery URLs. Only the cloud name is needed to show images; uploading needs the API key and secret
// (see scripts/upload-images.mjs). f_auto/q_auto serve WebP or AVIF at a sensible quality for each browser.
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const imagesEnabled = Boolean(CLOUD);

export function productImage(publicId: string | undefined, width = 480) {
  if (!CLOUD || !publicId) return null;
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_fill,g_auto,ar_4:3,w_${width}/${publicId}`;
}
