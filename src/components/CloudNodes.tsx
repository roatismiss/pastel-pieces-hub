import React, { useEffect, useRef } from 'react';

interface CloudNode {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

const CloudNodes: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cloudsRef = useRef<CloudNode[]>([]);
  const animationRef = useRef<number>();

  const colors = [
    'rgba(255, 179, 132, 0.8)', // healio-orange
    'rgba(132, 204, 191, 0.8)', // healio-turquoise  
    'rgba(179, 255, 204, 0.8)', // healio-mint
    'rgba(255, 255, 255, 0.9)', // soft white
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

    const createClouds = () => {
      const clouds: CloudNode[] = [];
      const cloudCount = 12;

      for (let i = 0; i < cloudCount; i++) {
        clouds.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 80 + 40,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.6 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      cloudsRef.current = clouds;
    };

    const drawCloud = (cloud: CloudNode) => {
      const { x, y, size, opacity, color } = cloud;
      
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      
      // Create cloud shape with multiple circles
      ctx.beginPath();
      
      // Main body
      ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
      ctx.fill();
      
      // Left puff
      ctx.beginPath();
      ctx.arc(x - size * 0.3, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      
      // Right puff
      ctx.beginPath();
      ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Top puff
      ctx.beginPath();
      ctx.arc(x + size * 0.1, y - size * 0.4, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Bottom left
      ctx.beginPath();
      ctx.arc(x - size * 0.2, y + size * 0.2, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Bottom right
      ctx.beginPath();
      ctx.arc(x + size * 0.2, y + size * 0.3, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawClouds = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(179, 255, 204, 0.1)');
      gradient.addColorStop(1, 'rgba(132, 204, 191, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      cloudsRef.current.forEach(cloud => {
        drawCloud(cloud);
      });
      
      ctx.globalAlpha = 1;
    };

    const updateClouds = () => {
      const clouds = cloudsRef.current;
      
      clouds.forEach(cloud => {
        // Horizontal movement
        cloud.x += cloud.speed;
        
        // Gentle vertical floating
        cloud.y += Math.sin(Date.now() * 0.001 + cloud.x * 0.01) * 0.2;
        
        // Wrap around screen
        if (cloud.x > canvas.width + cloud.size) {
          cloud.x = -cloud.size;
          cloud.y = Math.random() * canvas.height;
        }
        
        // Subtle opacity pulsing
        cloud.opacity = 0.4 + Math.sin(Date.now() * 0.002 + cloud.x * 0.005) * 0.3;
      });
    };

    const animate = () => {
      updateClouds();
      drawClouds();
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
    <div className="relative w-full h-64 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'blur(0.5px)' }}
      />
      
      {/* Floating text overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="/lovable-uploads/04188e45-459c-4460-9ceb-204a5bd38ec3.png"
          alt="Community support - people connecting and helping each other"
          className="w-full h-full object-contain max-w-2xl animate-fade-in"
        />
      </div>
    </div>
  );
};

export default CloudNodes;