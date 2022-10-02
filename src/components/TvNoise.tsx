import { CSSProperties, FC, useEffect, useRef } from 'react';

interface Props {
  style?: CSSProperties;
}

/**
 * Ctrl+C & Ctrl+V from https://stackoverflow.com/a/23572465
 */
const TvNoise: FC<Props> = ({ style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return;
    }
    let time = 0;
    setInterval(() => {
      const image = context.createImageData(canvas.width, canvas.height);
      const pix = image.data;

      for (let i = 0, n = pix.length; i < n; i += 4) {
        let c = 7 + Math.sin(i / 50000 + time / 7); // A sine wave of the form sin(ax + bt)
        pix[i] = pix[i + 1] = pix[i + 2] = 40 * Math.random() * c; // Set a random gray
        pix[i + 3] = 255; // 100% opaque
      }

      context.putImageData(image, 0, 0);
      time = (time + 1) % canvas.height;
    }, 50);
  }, []);

  return <canvas ref={canvasRef} style={style} />;
};

export default TvNoise;
