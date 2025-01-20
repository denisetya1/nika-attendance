import sharp from "sharp";

export const resizeBase64 = async (imgBase64: string) => {
  let output = imgBase64;

  const parts = imgBase64.split(';');
  const mimType = parts[0].split(':')[1];
  const imageData = parts[1].split(',')[1];

  const img = Buffer.from(imageData, 'base64');

  output = await sharp(img)
    .resize(200, 200, { fit: 'outside' })
    .toBuffer()
    .then(resizedImageBuffer => {
      const resizedImageData = resizedImageBuffer.toString('base64');
      const resizedBase64 = `data:${mimType};base64,${resizedImageData}`;

      return resizedBase64
    }).catch((error) => {
      console.error('resize image', error);

      throw error
    })

  return output;
}