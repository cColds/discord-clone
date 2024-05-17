export const uploadFileToCloudinary = async (formData: FormData) => {
  const authCloudinary = await fetch(
    `${process.env.NEXT_URL}/api/sign-cloudinary-params`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const { signature, timestamp } = await authCloudinary.json();

  const upload = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload?api_key=${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}&timestamp=${timestamp}&signature=${signature}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const { secure_url } = await upload.json();

  return secure_url;
};
