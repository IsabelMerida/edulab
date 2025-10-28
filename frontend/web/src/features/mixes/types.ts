export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface Reagents {
  A: number;
  B: number;
  C: number;
}

export interface EstadoMatraz {
  level: number;
  color: ColorRGB;
  totalVolume: number;
  reagents: Reagents;
  bubbles: number;
  pouring: string | null;
  mode: 'drop' | 'stream';
  amount: number;
  temp: number;
  agitate: number;
  time: number;
  exploded: boolean;
  explosionCooldown: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

export interface Flash {
  x: number;
  y: number;
  life: number;
  max: number;
  size: number;
}