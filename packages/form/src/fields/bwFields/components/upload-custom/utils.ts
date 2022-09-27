// @ts-nocheck
export const getImageData = (file): Promise<{ naturalWidth: number; naturalHeight: number; src: string }> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      if (file.type.indexOf('image') >= 0) {
        const src = e.target?.result as string;
        const image = new Image();
        image.src = src;
        image.onload = function () {
          // @ts-ignore
          resolve({ naturalWidth: this.width, naturalHeight: this.height, src });
        };
        image.onerror = reject;
      } else {
        const src = e.target?.result as string;
        const videoElement = document.createElement('video');
        videoElement.src = src;
        videoElement.addEventListener('loadedmetadata', () => {
          resolve({
            naturalHeight: videoElement.videoHeight,
            naturalWidth: videoElement.videoWidth,
            src,
          });
        });
      }
    };
  });

// 图片预览处理
export const handlePreview = async (file) => {
  console.log(file, 'previewFlie++++');
  const { url, originFileObj, type } = file;
  let src = url || '';

  if ((!src || src.indexOf('http') === -1) && type.indexOf('image') !== -1) {
    const image = new Image();
    src = await new Promise((resolve) => {
      const reader: any = new FileReader();
      reader.readAsDataURL(originFileObj);
      reader.onload = () => resolve(reader.result);
    });

    image.src = src;
    const imgWindow = window.open(src);
    if (image.outerHTML) imgWindow?.document.write(image.outerHTML);
  } else {
    window.open(src);
  }
};

// Blob转Image对象
export const blobToImage = (blob: Blob) =>
  new Promise((res) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const img = new Image();
      img.src = reader.result as string;
      img.addEventListener('load', () => res(img));
    });
    reader.readAsDataURL(blob);
  });
