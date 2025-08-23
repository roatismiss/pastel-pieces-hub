import { useEffect, useState } from 'react';

interface FloatingNode {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  animation: string;
  delay: number;
}

export const FloatingNodes = () => {
  const [nodes, setNodes] = useState<FloatingNode[]>([]);

  useEffect(() => {
    const colors = [
      'bg-healio-orange/20',
      'bg-healio-turquoise/20', 
      'bg-healio-mint/20',
      'bg-gradient-to-br from-healio-orange/10 to-healio-turquoise/10',
      'bg-gradient-to-br from-healio-turquoise/10 to-healio-mint/10',
      'bg-gradient-to-br from-healio-mint/10 to-healio-orange/10'
    ];

    const animations = ['animate-float', 'animate-float-reverse', 'animate-float-slow'];

    const generateNodes = () => {
      const newNodes: FloatingNode[] = [];
      for (let i = 0; i < 12; i++) {
        newNodes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 60 + 20, // 20-80px
          color: colors[Math.floor(Math.random() * colors.length)],
          animation: animations[Math.floor(Math.random() * animations.length)],
          delay: Math.random() * 4 // 0-4s delay
        });
      }
      setNodes(newNodes);
    };

    generateNodes();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {nodes.map((node) => (
        <div
          key={node.id}
          className={`absolute rounded-full ${node.color} ${node.animation} blur-sm`}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: `${node.size}px`,
            height: `${node.size}px`,
            animationDelay: `${node.delay}s`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {/* Extra gradient orbs for more depth */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-healio-orange/10 to-transparent rounded-full animate-pulse-glow" />
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-healio-turquoise/10 to-transparent rounded-full animate-float" />
      <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-br from-healio-mint/10 to-transparent rounded-full animate-float-reverse" />
    </div>
  );
};