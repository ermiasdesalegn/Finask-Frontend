import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "#60A5FA",
  width,
  height,
  className,
  maxOpacity = 0.3,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = width || rect.width;
      canvas.height = height || rect.height;
    };

    updateCanvasSize();

    const cols = Math.floor(canvas.width / (squareSize + gridGap));
    const rows = Math.floor(canvas.height / (squareSize + gridGap));

    const squares = Array.from({ length: cols * rows }, () => ({
      opacity: Math.random() * maxOpacity,
      targetOpacity: Math.random() * maxOpacity,
      flickering: false,
    }));

    let animationFrameId: number;

    const render = () => {
      if (!isInView) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      squares.forEach((square, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = col * (squareSize + gridGap);
        const y = row * (squareSize + gridGap);

        if (Math.random() < flickerChance) {
          square.flickering = !square.flickering;
          square.targetOpacity = square.flickering
            ? Math.random() * maxOpacity
            : Math.random() * (maxOpacity * 0.3);
        }

        square.opacity += (square.targetOpacity - square.opacity) * 0.1;

        ctx.fillStyle = color;
        ctx.globalAlpha = square.opacity;
        ctx.fillRect(x, y, squareSize, squareSize);
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(canvas);
    render();

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [
    squareSize,
    gridGap,
    flickerChance,
    color,
    width,
    height,
    maxOpacity,
    isInView,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none",
        className
      )}
    />
  );
}
