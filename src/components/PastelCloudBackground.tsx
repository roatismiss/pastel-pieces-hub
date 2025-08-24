import React, { useEffect, useRef } from 'react';

interface Cloud {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulseOffset: number;
  color: string;
}

const PastelCloudBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cloudsRef = useRef<Cloud[]>([]);
  const animationRef = useRef<number>();

  // Soft pastel colors for clouds
  const cloudColors = [
    'rgba(255, 248, 240, 0.7)', // cream
    'rgba(240, 255, 248, 0.6)', // soft mint
    'rgba(255, 240, 245, 0.6)', // pale peach
    'rgba(240, 248, 255, 0.7)', // soft teal
    'rgba(250, 245, 255, 0.5)', // lavender
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const isMobile = window.innerWidth < 768;
    const cloudCount = isMobile ? 8 : 15; // Fewer clouds on mobile for performance

    const createClouds = () => {
      const clouds: Cloud[] = [];

      for (let i = 0; i < cloudCount; i++) {
        clouds.push({
          x: Math.random() * (canvas.width + 400) - 200,
          y: Math.random() * (canvas.height + 200) - 100,
          size: Math.random() * (isMobile ? 60 : 120) + (isMobile ? 40 : 80),
          speedX: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
          speedY: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
          opacity: Math.random() * 0.4 + 0.3,
          pulseOffset: Math.random() * Math.PI * 2,
          color: cloudColors[Math.floor(Math.random() * cloudColors.length)],
        });
      }
      cloudsRef.current = clouds;
    };

    const drawNeumorphicCloud = (cloud: Cloud) => {
      const { x, y, size, opacity, color } = cloud;
      
      // Create neumorphic effect with multiple shadow layers
      const time = Date.now() * 0.001;
      const currentOpacity = opacity * (0.7 + Math.sin(time + cloud.pulseOffset) * 0.3);
      
      // Outer shadow (darker)
      ctx.shadowColor = 'rgba(200, 200, 220, 0.4)';
      ctx.shadowBlur = size * 0.3;
      ctx.shadowOffsetX = size * 0.1;
      ctx.shadowOffsetY = size * 0.1;
      
      ctx.globalAlpha = currentOpacity * 0.8;
      ctx.fillStyle = color;
      
      // Main cloud body with multiple circles for organic shape
      const circles = [
        { offsetX: 0, offsetY: 0, scale: 0.6 },
        { offsetX: -size * 0.25, offsetY: -size * 0.1, scale: 0.45 },
        { offsetX: size * 0.3, offsetY: -size * 0.15, scale: 0.5 },
        { offsetX: size * 0.1, offsetY: -size * 0.35, scale: 0.35 },
        { offsetX: -size * 0.15, offsetY: size * 0.2, scale: 0.3 },
        { offsetX: size * 0.25, offsetY: size * 0.25, scale: 0.4 },
      ];
      
      circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(
          x + circle.offsetX,
          y + circle.offsetY,
          size * circle.scale,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
      
      // Inner highlight for neumorphic effect
      ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = size * 0.2;
      ctx.shadowOffsetX = -size * 0.05;
      ctx.shadowOffsetY = -size * 0.05;
      ctx.globalAlpha = currentOpacity * 0.3;
      
      // Smaller highlight circles
      circles.slice(0, 3).forEach(circle => {
        ctx.beginPath();
        ctx.arc(
          x + circle.offsetX,
          y + circle.offsetY,
          size * circle.scale * 0.7,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
    };

    const drawBackground = () => {
      // Create soft gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'hsl(195, 100%, 98%)'); // very light teal
      gradient.addColorStop(0.3, 'hsl(25, 100%, 97%)'); // cream
      gradient.addColorStop(0.7, 'hsl(15, 100%, 96%)'); // pale peach
      gradient.addColorStop(1, 'hsl(180, 50%, 98%)'); // soft mint
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      drawBackground();
      
      // Reset shadows
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      const clouds = cloudsRef.current;
      
      clouds.forEach(cloud => {
        // Update position with slow, gentle movement
        cloud.x += cloud.speedX;
        cloud.y += cloud.speedY;
        
        // Gentle floating motion
        const time = Date.now() * 0.001;
        cloud.y += Math.sin(time * 0.5 + cloud.pulseOffset) * 0.1;
        
        // Wrap around screen with padding
        if (cloud.x > canvas.width + cloud.size) {
          cloud.x = -cloud.size;
        }
        if (cloud.x < -cloud.size) {
          cloud.x = canvas.width + cloud.size;
        }
        if (cloud.y > canvas.height + cloud.size) {
          cloud.y = -cloud.size;
        }
        if (cloud.y < -cloud.size) {
          cloud.y = canvas.height + cloud.size;
        }
        
        drawNeumorphicCloud(cloud);
      });
      
      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createClouds();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createClouds();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          filter: 'blur(0.3px)',
          background: 'linear-gradient(135deg, hsl(195, 100%, 98%) 0%, hsl(25, 100%, 97%) 30%, hsl(15, 100%, 96%) 70%, hsl(180, 50%, 98%) 100%)'
        }}
      />
      
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20 backdrop-blur-[0.5px]" />
    </div>
  );
};

export default PastelCloudBackground;