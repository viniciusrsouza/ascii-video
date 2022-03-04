const root = document.getElementById("root");

function map(
  value: number,
  leftMin: number,
  leftMax: number,
  rightMin: number,
  rightMax: number
) {
  const leftSpan = leftMax - leftMin;
  const rightSpan = rightMax - rightMin;
  const valueScaled = (value - leftMin) / leftSpan;

  return rightMin + valueScaled * rightSpan;
}

function getCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  return [canvas, ctx] as const;
}

function grayScale(buff: Uint8ClampedArray): Uint8ClampedArray {
  for (let i = 0; i < buff.length; i += 4) {
    const avg = (buff[i] + buff[i + 1] + buff[i + 2]) / 3;
    buff[i] = avg;
    buff[i + 1] = avg;
    buff[i + 2] = avg;
  }
  return buff;
}

const [width, height] = [24, 24];
const density = "@@@@@@@@@@@@%%%%%%%%#########********+++++++++=======";
const div = document.createElement("div");
div.style.fontFamily = "monospace";
div.style.fontSize = "12px";
div.style.whiteSpace = "pre";
div.style.lineHeight = "0.9";
// div.style.backgroundColor = "black";
// div.style.color = "white";
root.appendChild(div);

function getImageData(image: HTMLImageElement) {
  const [, mainCtx] = getCanvas(width, height);
  mainCtx.drawImage(image, 0, 0, width, height);

  const imgData = mainCtx.getImageData(0, 0, width, height);
  const { data } = imgData;

  const [, grayCtx] = getCanvas(width, height);
  const grayImgData = grayCtx.createImageData(width, height);
  const grayBuffer = grayScale(data);
  grayImgData.data.set(grayBuffer);
  grayCtx.putImageData(grayImgData, 0, 0);
  return grayBuffer;
}

function showBuffer(buffer: Uint8ClampedArray) {
  div.innerHTML = "";
  let text = "";
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const index = (i * width + j) * 4;
      const rgb = buffer[index];
      const value = map(rgb, 0, 255, 0, density.length - 1);
      const char = density[Math.floor(value)];
      text += char;
      // const span = document.createElement("span");
      // span.style.backgroundColor = `rgb(${rgb}, ${rgb}, ${rgb})`;
      // span.innerText = density[Math.floor(value)];
      // div.appendChild(span);
    }
    text += "\n";
    // div.appendChild(document.createElement("br"));
  }
  div.innerHTML = text;
}

async function showImage(image: HTMLImageElement) {
  const data = getImageData(image);
  showBuffer(data);
}

function getImage(callback: (image: HTMLImageElement) => void) {
  const img = new Image();
  img.src = "images/source6.jpg";

  img.onload = () => {
    callback(img);
  };
}

function getVideo() {
  const [canvas, backCtx] = getCanvas(width, height);
  const [, grayCtx] = getCanvas(width, height);

  const computeFrame = (video: HTMLVideoElement) => {
    backCtx.drawImage(video, 0, 0, width, height);
    const imgData = backCtx.getImageData(0, 0, width, height);
    const { data } = imgData;

    const grayBuffer = grayScale(data);
    showBuffer(grayBuffer);
  };

  const timerCallback = (video: HTMLVideoElement) => {
    if (video.paused || video.ended) {
      return;
    }
    computeFrame(video);
    setTimeout(() => timerCallback(video), 0);
  };

  const video = document.createElement("video");
  video.autoplay = true;
  video.playsInline = true;
  video.loop = true;
  // video.muted = true;
  video.width = width;
  video.height = height;
  video.style.display = "none";
  video.addEventListener(
    "play",
    () => {
      timerCallback(video);
    },
    false
  );
  // video.src = "videos/source.mp4";

  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
  });
}

function main() {
  getImage(showImage);
  // getVideo();
}

main();
