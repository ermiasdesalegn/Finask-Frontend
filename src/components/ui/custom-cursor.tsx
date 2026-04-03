import { GraduationCap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      setFollowerPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        
        // Smooth easing with higher speed when far away
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = distance > 50 ? 0.25 : 0.2;
        
        return {
          x: prev.x + dx * speed,
          y: prev.y + dy * speed,
        };
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main Cursor Dot */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>

      {/* Follower with Graduation Cap */}
      <div
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: `${followerPosition.x}px`,
          top: `${followerPosition.y}px`,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="w-8 h-8 rounded-full bg-brand-blue/20 backdrop-blur-sm border border-brand-blue/30 flex items-center justify-center">
          <GraduationCap size={16} className="text-brand-blue" />
        </div>
      </div>
    </>
  );
}
