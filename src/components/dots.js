import {useEffect, useRef} from "react";

const Dots = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({x: 0, y: 0});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      mouse.current = {x: e.clientX, y: e.clientY};
    };

    window.addEventListener("mousemove", onMouseMove);

    const dotSpacing = 20;
    const radius = 250;
    const minOpacity = 0.2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < canvas.height; y += dotSpacing) {
        for (let x = 0; x < canvas.width; x += dotSpacing) {
          const dx = x - mouse.current.x;
          const dy = y - mouse.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let opacity = 0.1;
          let color = "246, 246, 246"; // default light gray

          if (distance <= radius) {
            opacity = Math.max(1 - distance / radius, minOpacity);
            color = "219, 193, 112"; // orange glow
          }

          ctx.fillStyle = `rgba(${color}, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 -z-10 bg-black pointer-events-none"
      style={{width: "100%", height: "100%"}}
    ></canvas>
  );
};

export default Dots;
