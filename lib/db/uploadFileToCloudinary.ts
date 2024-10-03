export const uploadFileToCloudinary = async (formData: FormData) => {
  const authCloudinary = await fetch(`/api/sign-cloudinary-params`, {
    method: "POST",
    body: formData,
  });

  const authResponse = await authCloudinary.json();

  return authResponse.imgUrl;
};
