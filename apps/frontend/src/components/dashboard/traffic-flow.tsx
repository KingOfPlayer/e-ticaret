'use client';

import React, { useEffect, useRef } from 'react';

export function TrafficFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Services positions
    const gateway = { x: 60, y: 150, label: 'GATEWAY' };
    const services = [
      { id: 'auth', x: 280, y: 60, label: 'AUTH', color: '#8b5cf6' },
      { id: 'product', x: 280, y: 150, label: 'PRODUCT', color: '#6366f1' },
      { id: 'order', x: 280, y: 240, label: 'ORDER', color: '#a855f7' },
    ];

    const particles: any[] = [];

    const createParticle = (targetIndex: number) => {
      particles.push({
        x: gateway.x,
        y: gateway.y,
        target: services[targetIndex],
        progress: 0,
        speed: 0.008 + Math.random() * 0.012,
        size: 3 + Math.random() * 2,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Paths with glow
      services.forEach((service) => {
        ctx.beginPath();
        ctx.moveTo(gateway.x, gateway.y);
        ctx.lineTo(service.x, service.y);
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw Gateway Node
      ctx.beginPath();
      ctx.arc(gateway.x, gateway.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#6366f1';
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.textAlign = 'center';
      ctx.fillText(gateway.label, gateway.x, gateway.y + 20);

      // Draw Service Nodes
      services.forEach((service) => {
        ctx.beginPath();
        ctx.arc(service.x, service.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = service.color;
        ctx.fill();

        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.textAlign = 'left';
        ctx.fillText(service.label, service.x + 12, service.y + 4);
      });

      // Update and Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        const eased =
          p.progress < 0.5 ? 2 * p.progress * p.progress : 1 - Math.pow(-2 * p.progress + 2, 2) / 2;

        const currentX = gateway.x + (p.target.x - gateway.x) * eased;
        const currentY = gateway.y + (p.target.y - gateway.y) * eased;

        ctx.beginPath();
        ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.target.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.target.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (Math.random() < 0.06) createParticle(Math.floor(Math.random() * services.length));

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-indigo-500/[0.02] rounded-2xl overflow-hidden animate-in fade-in duration-700">
      <canvas ref={canvasRef} width={350} height={300} className="w-full h-full opacity-80" />
    </div>
  );
}
