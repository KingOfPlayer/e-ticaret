'use client';

import React, { useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

interface Particle {
  from: string;
  to: string;
  progress: number;
  speed: number;
}

const nodes: Node[] = [
  { id: 'gateway', name: 'Gateway', x: 100, y: 175, color: '#6366f1' },
  { id: 'auth', name: 'Auth Service', x: 400, y: 75, color: '#3b82f6' },
  { id: 'product', name: 'Product Service', x: 400, y: 175, color: '#10b981' },
  { id: 'order', name: 'Order Service', x: 400, y: 275, color: '#8b5cf6' },
];

export function TrafficFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1;
      nodes.slice(1).forEach((node) => {
        ctx.beginPath();
        ctx.strokeStyle = '#334155';
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Update and draw particles
      if (Math.random() < 0.05) {
        const targetIndex = Math.floor(Math.random() * (nodes.length - 1)) + 1;
        particles.current.push({
          from: 'gateway',
          to: nodes[targetIndex].id,
          progress: 0,
          speed: 0.01 + Math.random() * 0.02,
        });
      }

      particles.current = particles.current.filter((p) => p.progress < 1);
      particles.current.forEach((p) => {
        p.progress += p.speed;
        const targetNode = nodes.find((n) => n.id === p.to)!;
        const x = nodes[0].x + (targetNode.x - nodes[0].x) * p.progress;
        const y = nodes[0].y + (targetNode.y - nodes[0].y) * p.progress;

        ctx.beginPath();
        ctx.fillStyle = targetNode.color;
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 10;
        ctx.shadowColor = targetNode.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw nodes
      nodes.forEach((node) => {
        // Node circle
        ctx.beginPath();
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Node Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + 25);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[350px] flex items-center justify-center">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Canlı Trafik Akışı
        </span>
      </div>
      <canvas ref={canvasRef} width={500} height={350} className="w-full h-auto max-w-[500px]" />
    </div>
  );
}
