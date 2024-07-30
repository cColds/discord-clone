export const uploadFileToCloudinary = async (formData: FormData) => {
  const authCloudinary = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/sign-cloudinary-params`,
    {
      method: "POST",
      body: formData,
    }
  );

  const authResponse = await authCloudinary.json();

  return authResponse.imgUrl;
};
