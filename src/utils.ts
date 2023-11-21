export function dataURItoFile(
  dataURI: string,
  fileName: string,
  mimeType: string = "image/png",
): File {
  const byteString = atob(dataURI.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([new Blob([ia], { type: mimeType })], fileName, {
    type: mimeType,
  });
}
