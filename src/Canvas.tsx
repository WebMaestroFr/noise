import React, { useRef, useEffect, useCallback, FC, HTMLProps } from "react";

export const useCanvas = (
  onUpdate?: (context: CanvasRenderingContext2D, frameCount: number) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      return canvas.getContext("2d");
    }
    return null;
  }, []);

  useEffect(() => {
    const context = getContext();
    let frameCount = 0;
    let animationFrameId: number;

    const render = () => {
      frameCount++;
      if (context && onUpdate) {
        onUpdate(context, frameCount);
      }
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [getContext, onUpdate]);

  return canvasRef;
};

const Canvas: FC<
  HTMLProps<HTMLCanvasElement> & {
    onUpdate?: (context: CanvasRenderingContext2D, frameCount: number) => void;
  }
> = (props) => {
  const { onUpdate, ...rest } = props;
  const canvasRef = useCanvas(onUpdate);

  return <canvas ref={canvasRef} {...rest} />;
};

export default Canvas;
