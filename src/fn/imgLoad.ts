export const changeImgToWebP = (
  reader: FileReader,
  changeImg: (src: string) => void
) => {
  const result = reader.result as string;
  const image = new Image();
  image.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(image, 0, 0);
      const webPDataURL = canvas.toDataURL("image/webp", 0.8);
      changeImg(webPDataURL);
      canvas.parentNode?.removeChild(canvas);
      image.parentNode?.removeChild(image);
    }
  };
  // 이미지의 src 속성에 데이터 URL을 할당하여 이미지 로드 시작
  image.src = result;
};

export const changeImgToJpeg = (src: string, getUrl: (url: string) => void) => {
  const image = new Image();
  image.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(image, 0, 0);
      const jpegDataURL = canvas.toDataURL("image/jpeg", 0.8);
      getUrl(jpegDataURL);
      canvas.parentNode?.removeChild(canvas);
      image.parentNode?.removeChild(image);
    }
  };
  image.src = src;
};
