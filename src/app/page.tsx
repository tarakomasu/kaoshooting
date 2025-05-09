// pages/index.tsx

'use client'
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [accel, setAccel] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [orientation, setOrientation] = useState<{ alpha: number; beta: number; gamma: number }>({ alpha: 0, beta: 0, gamma: 0 });
  const [position, setPosition] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });

  const lastTimestamp = useRef<number | null>(null);

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.acceleration;
      const timestamp = event.timeStamp;

      if (acc && acc.x != null && acc.y != null && acc.z != null) {
        setAccel({ x: acc.x, y: acc.y, z: acc.z });

        if (lastTimestamp.current !== null) {
          const dt = (timestamp - lastTimestamp.current) / 100;

          setPosition((prev) => ({
            x: prev.x + (acc?.x ?? 0) * dt * dt / 2,
            y: prev.y + (acc?.y ?? 0) * dt * dt / 2,
            z: prev.z + (acc?.z ?? 0) * dt * dt / 2,
          }));
        }

        lastTimestamp.current = timestamp;
      }
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha ?? 0,
        beta: event.beta ?? 0,
        gamma: event.gamma ?? 0,
      });
    };

    window.addEventListener('devicemotion', handleMotion);
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>センサー情報</h1>

      <h2>現在の加速度 (m/s²)</h2>
      <p>X: {accel.x.toFixed(2)}</p>
      <p>Y: {accel.y.toFixed(2)}</p>
      <p>Z: {accel.z.toFixed(2)}</p>

      <h2>移動距離の推定 (m)</h2>
      <p>X: {position.x.toFixed(4)}</p>
      <p>Y: {position.y.toFixed(4)}</p>
      <p>Z: {position.z.toFixed(4)}</p>

      <h2>現在の角度</h2>
      <p>α (z軸回転): {orientation.alpha.toFixed(2)}°</p>
      <p>β (x軸傾き): {orientation.beta.toFixed(2)}°</p>
      <p>γ (y軸傾き): {orientation.gamma.toFixed(2)}°</p>
    </main>
  );
}
