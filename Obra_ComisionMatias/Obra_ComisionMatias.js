let listaLineas = []; 
let colorCielo, colorOcaso, colorNoche; 
let paletaColores; 
let animacionActiva = false;  
let lineaActual; 
 
function setup() { 
  createCanvas(windowWidth, windowHeight); 
  pixelDensity(1);  
  strokeCap(ROUND); 
 
  colorCielo = color(255, 185, 80);  
  colorOcaso = color(255, 90, 60);   
  colorNoche = color(110, 20, 160);   
 
  paletaColores = [ 
    [color(120, 210, 255), color(10, 30, 160)],  
    [color(255, 170, 30), color(255, 80, 0)],    
    [color(255, 160, 160), color(230, 30, 70)], 
    [color(0), color(0)], 
    [color(255), color(255)] 
  ]; 
  noCursor(); 
} 
 
function draw() { 
  pintarFondo(); 
 
  for (let l of listaLineas) { 
    l.dibujar(); 
  } 
 
  if (lineaActual) { 
    lineaActual.crecer(); 
    lineaActual.dibujar(); 
  } 
} 
 
class Linea { 
  constructor() { 
    this.x1 = random(-100, width * 0.8); 
    this.y1 = random(-100, height * 0.5); 
    this.cx1 = this.x1 + random(50, 400); 
    this.cy1 = this.y1 + random(-100, 200); 
    this.cx2 = this.x1 + random(100, 600); 
    this.cy2 = this.y1 + random(50, 400); 
    this.x2 = this.x1 + random(250, 550);  
    this.y2 = this.y1 + random(200, 500); 
 
    this.grosorMax = random(8, 18); 
    let par = random(paletaColores); 
    this.c1 = par[0]; 
    this.c2 = par[1]; 
     
    this.brillo = random() > 0.4; 
    this.progreso = 0;  
    this.velocidad = 0.06; 
    this.fase = random(6.28); 
  } 
 
  crecer() { 
    if (this.progreso < 1.0) { 
      this.progreso += this.velocidad; 
    } 
  } 
 
  dibujar() { 
    let largo = max(this.progreso, 0.25); 
     
    push(); 
    if (this.brillo) { 
      drawingContext.shadowBlur = this.grosorMax * 0.4; 
      drawingContext.shadowColor = lerpColor(this.c1, color(255), 0.2); 
    } 
     
    noFill(); 
    let pasos = 200;  
    for (let i = 0; i < largo * pasos; i++) { 
      let t1 = i / pasos; 
      let t2 = (i + 1.5) / pasos;  
 
      let onda1 = animacionActiva ? sin(frameCount * 0.15 + t1 * 6 + this.fase) * (25 * t1) : 0; 
      let onda2 = animacionActiva ? sin(frameCount * 0.15 + t2 * 6 + this.fase) * (25 * t2) : 0; 
 
      let ax1 = bezierPoint(this.x1, this.cx1, this.cx2, this.x2, t1); 
      let ay1 = bezierPoint(this.y1, this.cy1, this.cy2, this.y2, t1) + onda1; 
      let ax2 = bezierPoint(this.x1, this.cx1, this.cx2, this.x2, t2); 
      let ay2 = bezierPoint(this.y1, this.cy1, this.cy2, this.y2, t2) + onda2; 
 
      stroke(lerpColor(this.c1, this.c2, t1)); 
      let g = map(-4 * pow((t1/largo) - 0.5, 2) + 1, 0, 1, 1, this.grosorMax); 
      strokeWeight(max(0.5, g)); 
      line(ax1, ay1, ax2, ay2); 
    } 
    pop(); 
  } 
} 
 
function pintarFondo() { 
  for (let y = 0; y < height; y += 4) { 
    let n = map(y, 0, height, 0, 1); 
    let c = n < 0.5 ? lerpColor(colorCielo, colorOcaso, n * 2) : lerpColor(colorOcaso, 
colorNoche, (n - 0.5) * 2); 
    stroke(c); 
    strokeWeight(5); 
    line(0, y, width, y); 
  } 
} 
 
function keyPressed() { 
  if (key === 'l' || key === 'L') lineaActual = new Linea();  
  if (key === ' ') animacionActiva = !animacionActiva; 
} 
 
function keyReleased() { 
  if ((key === 'l' || key === 'L') && lineaActual) { 
    listaLineas.push(lineaActual);  
    lineaActual = null;  
  } 
} 
 
function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
} 
