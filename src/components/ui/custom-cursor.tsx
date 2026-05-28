import { GraduationCap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const followerRef = useRef<HTMLDivElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const followerPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      setIsVisible(true);
    };

    const onLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const step = () => {
      const dot = dotRef.current;
      const follower = followerRef.current;
      const target = targetRef.current;
      const followerPos = followerPosRef.current;

      if (dot) {
        dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }

      const dx = target.x - followerPos.x;
      const dy = target.y - followerPos.y;
      const distance = Math.hypot(dx, dy);
      const speed = distance > 60 ? 0.28 : 0.2;

      followerPos.x += dx * speed;
      followerPos.y += dy * speed;

      if (follower) {
        follower.style.transform = `translate3d(${followerPos.x}px, ${followerPos.y}px, 0) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main Cursor Dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{ left: 0, top: 0, willChange: "transform" }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>

      {/* Follower with Graduation Cap */}
      <div
        ref={followerRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: 0,
          top: 0,
          willChange: "transform",
        }}
      >
        <div className="w-8 h-8 rounded-full bg-brand-blue/20 backdrop-blur-sm border border-brand-blue/30 flex items-center justify-center">
          <GraduationCap size={16} className="text-brand-blue" />
        </div>
      </div>
    </>
  );
}
