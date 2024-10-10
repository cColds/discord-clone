export const getTransformedPreview = (base64Image: string) => {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const size = 250;
      canvas.width = size;
      canvas.height = size;

      const scale = Math.max(size / img.width, size / img.height);

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      const xOffset = (newWidth - size) / 2;
      const yOffset = (newHeight - size) / 2;

      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      ctx?.drawImage(img, -xOffset, -yOffset, newWidth, newHeight);

      const transformedImage = canvas.toDataURL("image/jpeg");
      resolve(transformedImage);
    };
  });
};
