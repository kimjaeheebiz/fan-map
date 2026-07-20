export const MAX_REPORT_IMAGES = 5;
export const MAX_IMAGE_LONG_EDGE = 1280;
export const MAX_IMAGE_QUALITY = 0.82;

export class ImageProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageProcessingError";
  }
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageProcessingError("이미지를 불러올 수 없습니다."));
    };
    image.src = url;
  });
}

function canvasToDataUrl(canvas: HTMLCanvasElement, quality: number) {
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  if (!dataUrl.startsWith("data:image/")) {
    throw new ImageProcessingError("이미지 변환에 실패했습니다.");
  }
  return dataUrl;
}

export async function compressImageToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new ImageProcessingError("이미지 파일만 선택할 수 있습니다.");
  }

  const image = await loadImageFromFile(file);
  const longEdge = Math.max(image.width, image.height);
  const scale =
    longEdge > MAX_IMAGE_LONG_EDGE ? MAX_IMAGE_LONG_EDGE / longEdge : 1;

  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new ImageProcessingError("이미지를 처리할 수 없습니다.");
  }

  context.drawImage(image, 0, 0, width, height);
  return canvasToDataUrl(canvas, MAX_IMAGE_QUALITY);
}

export async function compressImages(files: File[]): Promise<string[]> {
  const results: string[] = [];
  for (const file of files) {
    results.push(await compressImageToDataUrl(file));
  }
  return results;
}

export function estimateDataUrlBytes(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.ceil((base64.length * 3) / 4);
}
