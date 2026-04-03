import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
  className?: string;
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  numSquares = 30,
  maxOpacity = 0.1,
  duration = 3,
  repeatDelay = 1,
  className,
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState<Array<{ id: number; pos: [number, number] }>>([]);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const newSquares = Array.from({ length: numSquares }, (_, i) => ({
        id: i,
        pos: [
          Math.floor(Math.random() * (dimensions.width / width)),
          Math.floor(Math.random() * (dimensions.height / height)),
        ] as [number, number],
      }));
      setSquares(newSquares);
    }
  }, [dimensions, numSquares, width, height]);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/20 stroke-gray-400/20 dark:fill-gray-600/20 dark:stroke-gray-600/20",
        className
      )}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={0}
          y={0}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={0}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={0} y={0} className="overflow-visible">
        {squares.map(({ pos: [x, y], id }, index) => (
          <rect
            key={`${id}-${index}`}
            width={width - 1}
            height={height - 1}
            x={x * width + 1}
            y={y * height + 1}
            fill="currentColor"
            strokeWidth={0}
          >
            <animate
              attributeName="opacity"
              values={`0;${maxOpacity};0`}
              dur={`${duration}s`}
              begin={`${index * 0.1}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </svg>
    </svg>
  );
}
