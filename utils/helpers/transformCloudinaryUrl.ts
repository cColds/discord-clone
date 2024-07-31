export function transformCloudinaryUrl(url: string, transformation: string) {
  const parts = url.split("/upload/");
  return parts[0] + "/upload/" + transformation + "/" + parts[1];
}
