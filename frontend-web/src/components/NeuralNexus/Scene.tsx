'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';

interface Skill {
  id: number;
  name: string;
  category: 'hard' | 'soft';
  level: number;
}

interface Props {
  skills: Skill[];
  isSecretMode: boolean;
}

function Word({ children, ...props }: any) {
  const color = new THREE.Color();
  const fontProps = { fontSize: 1.1, letterSpacing: 0.05, lineHeight: 1, 'material-toneMapped': false };
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const over = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
  }
  const out = () => {
    setHovered(false);
    if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
  }

  useFrame(({ camera }) => {
    if (ref.current) {
        ref.current.quaternion.copy(camera.quaternion);
        // @ts-ignore
        ref.current.material.color.lerp(color.set(hovered ? props.hoverColor : props.baseColor), 0.1);
    }
  });

  return (
    <Float floatIntensity={2} rotationIntensity={1}>
        <group {...props}>
            <Text ref={ref as any} onPointerOver={over} onPointerOut={out} {...fontProps} children={children} />
            {/* Esfera atrás do texto para destaque */}
            <mesh onPointerOver={over} onPointerOut={out}>
                <sphereGeometry args={[0.15, 32, 32]} />
                <meshStandardMaterial 
                    color={hovered ? props.hoverColor : props.baseColor} 
                    emissive={hovered ? props.hoverColor : props.baseColor}
                    emissiveIntensity={props.emissiveInt || 2}
                    toneMapped={false}
                />
            </mesh>
        </group>
    </Float>
  )
}

function Cloud({ skills, isSecretMode }: { skills: Skill[], isSecretMode: boolean }) {
  const { theme } = useTheme();

  // Cores dinâmicas
  // Dark: Emerald/Pink | Light: Slate-700/Indigo
  const baseColor = theme === 'dark' 
    ? (isSecretMode ? '#ec4899' : '#10b981') 
    : '#334155'; // Cinza escuro para contraste no branco

  const hoverColor = theme === 'dark' ? '#ffffff' : '#4f46e5'; // Branco ou Indigo

  const words = useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    const count = skills.length || 1; 

    for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const vec = new THREE.Vector3().setFromSpherical(spherical.set(11, phi, theta));
        
        if (skills[i]) {
            temp.push({ pos: vec, word: skills[i].name, level: skills[i].level });
        }
    }
    return temp;
  }, [skills]);

  return (
    <>
      {words.map((item, i) => (
        <Word key={i} position={item.pos} baseColor={baseColor} hoverColor={hoverColor} emissiveInt={theme === 'dark' ? 2 : 0.5}>
            {item.word}
        </Word>
      ))}
      {/* Linhas de conexão mais sutis no light mode */}
      <Lines points={words.map(w => w.pos)} color={baseColor} opacity={theme === 'dark' ? 0.15 : 0.05} />
    </>
  )
}

function Lines({ points, color, opacity }: { points: THREE.Vector3[], color: string, opacity: number }) {
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const linePoints = [];
        for(let i=0; i<points.length; i++) {
            const next = (i + 1) % points.length;
            const skip = (i + 3) % points.length;
            linePoints.push(points[i]);
            linePoints.push(points[next]);
            if(points.length > 5 && i % 2 === 0) {
                 linePoints.push(points[i]);
                 linePoints.push(points[skip]);
            }
        }
        geo.setFromPoints(linePoints);
        return geo;
    }, [points]);

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial color={color} transparent opacity={opacity} />
        </lineSegments>
    );
}

export default function NeuralScene({ skills, isSecretMode }: Props) {
  const { theme } = useTheme();

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 22], fov: 50 }}>
      {/* Fog para profundidade: Preto no Dark, Branco no Light */}
      <fog attach="fog" args={[theme === 'dark' ? '#020617' : '#f8fafc', 20, 45]} />
      
      <group rotation={[10, 10.5, 10]}>
        <Cloud skills={skills} isSecretMode={isSecretMode} />
      </group>
      
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      
      {/* Estrelas apenas no modo Dark, pois não aparecem bem no branco */}
      {theme === 'dark' && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
    </Canvas>
  )
}
