export function transformCloudinaryUrl(url: string, transformation: string) {
  // Split the URL at "/upload/"
  const parts = url.split("/upload/");
  // Insert the transformation string between the two parts
  return parts[0] + "/upload/" + transformation + "/" + parts[1];
}
