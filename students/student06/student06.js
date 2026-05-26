import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const cfg = { paused: false, activePaletteIndex: 0, currentFormation: 0, numFormations: 3, densityFactor: 1 };
const palettes = [
    [new THREE.Color(0x0084ff), new THREE.Color(0x00a8ff), new THREE.Color(0x00d4ff), new THREE.Color(0x00f2fe), new THREE.Color(0x4facfe)],
    [new THREE.Color(0xf857a6), new THREE.Color(0xff5858), new THREE.Color(0xfeca57), new THREE.Color(0xff6348), new THREE.Color(0xff9068)],
    [new THREE.Color(0x4facfe), new THREE.Color(0x00f2fe), new THREE.Color(0x43e97b), new THREE.Color(0x38f9d7), new THREE.Color(0x4484ce)]
];

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.002);
const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 8, 28);
const cv = document.getElementById('nn');
const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x000000);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.05; controls.rotateSpeed = 0.6;
controls.minDistance = 8; controls.maxDistance = 80; controls.autoRotate = true; controls.autoRotateSpeed = 0.2; controls.enablePan = false;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 1.8, 0.6, 0.7);
composer.addPass(bloom); composer.addPass(new OutputPass());

function makeStars() {
    const n = 8000, pos = [], col = [], sz = [];
    for (let i = 0; i < n; i++) {
        const r = THREE.MathUtils.randFloat(50, 150);
        const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
        const th = THREE.MathUtils.randFloat(0, Math.PI * 2);
        pos.push(r * Math.sin(phi) * Math.cos(th), r * Math.sin(phi) * Math.sin(th), r * Math.cos(phi));
        const c = Math.random();
        if (c < .7) col.push(1, 1, 1); else if (c < .85) col.push(.7, .8, 1); else col.push(1, .9, .8);
        sz.push(THREE.MathUtils.randFloat(.1, .3));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setAttribute('size', new THREE.Float32BufferAttribute(sz, 1));
    const m = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `attribute float size;attribute vec3 color;varying vec3 vC;uniform float uTime;void main(){vC=color;vec4 mv=modelViewMatrix*vec4(position,1.);float tw=sin(uTime*2.+position.x*100.)*.3+.7;gl_PointSize=size*tw*(300./-mv.z);gl_Position=projectionMatrix*mv;}`,
        fragmentShader: `varying vec3 vC;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);if(d>.5)discard;float a=1.-smoothstep(0.,.5,d);gl_FragColor=vec4(vC,a*.8);}`,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    });
    return new THREE.Points(g, m);
}
const stars = makeStars();
scene.add(stars);

const noise = `vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.zzww*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;

const pulseU = {
    uTime: { value: 0 },
    uPulsePositions: { value: [new THREE.Vector3(1e3, 1e3, 1e3), new THREE.Vector3(1e3, 1e3, 1e3), new THREE.Vector3(1e3, 1e3, 1e3)] },
    uPulseTimes: { value: [-1e3, -1e3, -1e3] },
    uPulseColors: { value: [new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1)] },
    uPulseSpeed: { value: 18 }, uBaseNodeSize: { value: .6 }
};

const nodeVS = noise + `
attribute float nodeSize;attribute float nodeType;attribute vec3 nodeColor;attribute float distanceFromRoot;
uniform float uTime;uniform vec3 uPulsePositions[3];uniform float uPulseTimes[3];uniform float uPulseSpeed;uniform float uBaseNodeSize;
varying vec3 vColor;varying float vNodeType;varying vec3 vPosition;varying float vPulseIntensity;varying float vDistanceFromRoot;varying float vGlow;
float getPulse(vec3 wp,vec3 pp,float pt){if(pt<0.)return 0.;float ts=uTime-pt;if(ts<0.||ts>4.)return 0.;float pr=ts*uPulseSpeed;float dc=distance(wp,pp);return smoothstep(3.,0.,abs(dc-pr))*smoothstep(4.,0.,ts);}
void main(){vNodeType=nodeType;vColor=nodeColor;vDistanceFromRoot=distanceFromRoot;
vec3 wp=(modelMatrix*vec4(position,1.)).xyz;vPosition=wp;
float tp=0.;for(int i=0;i<3;i++)tp+=getPulse(wp,uPulsePositions[i],uPulseTimes[i]);vPulseIntensity=min(tp,1.);
float breathe=sin(uTime*.7+distanceFromRoot*.15)*.15+.85;
float ps=nodeSize*breathe*(1.+vPulseIntensity*2.5);
vGlow=.5+.5*sin(uTime*.5+distanceFromRoot*.2);
vec3 mp=position;
if(nodeType>.5){float nz=snoise(position*.08+uTime*.08);mp+=normal*nz*.15;}
vec4 mv=modelViewMatrix*vec4(mp,1.);
gl_PointSize=ps*uBaseNodeSize*(1000./-mv.z);gl_Position=projectionMatrix*mv;}`;

const nodeFS = `uniform float uTime;uniform vec3 uPulseColors[3];
varying vec3 vColor;varying float vNodeType;varying vec3 vPosition;varying float vPulseIntensity;varying float vDistanceFromRoot;varying float vGlow;
void main(){vec2 c=2.*gl_PointCoord-1.;float d=length(c);if(d>1.)discard;
float g1=1.-smoothstep(0.,.5,d);float g2=1.-smoothstep(0.,1.,d);float gs=pow(g1,1.2)+g2*.3;
float bc=.9+.1*sin(uTime*.6+vDistanceFromRoot*.25);vec3 fc=vColor*bc;
if(vPulseIntensity>0.){vec3 pc=mix(vec3(1.),uPulseColors[0],.4);fc=mix(fc,pc,vPulseIntensity*.8);fc*=(1.+vPulseIntensity*0.6);gs*=(1.+vPulseIntensity*0.5);}
fc+=vec3(1.)*smoothstep(.4,0.,d)*.3;
float a=gs*(.95-.3*d)*smoothstep(100.,15.,length(vPosition-cameraPosition));
if(vNodeType>.5){fc*=1.1;a*=.9;}fc*=(1.+vGlow*.1);gl_FragColor=vec4(fc,a);}`;

const connVS = noise + `
attribute vec3 startPoint;attribute vec3 endPoint;attribute float connectionStrength;attribute float pathIndex;attribute vec3 connectionColor;
uniform float uTime;uniform vec3 uPulsePositions[3];uniform float uPulseTimes[3];uniform float uPulseSpeed;
varying vec3 vColor;varying float vCS;varying float vPI2;varying float vPP;varying float vDC;
float getPulse(vec3 wp,vec3 pp,float pt){if(pt<0.)return 0.;float ts=uTime-pt;if(ts<0.||ts>4.)return 0.;return smoothstep(3.,0.,abs(distance(wp,pp)-ts*uPulseSpeed))*smoothstep(4.,0.,ts);}
void main(){float t=position.x;vPP=t;
vec3 mid=mix(startPoint,endPoint,.5);
vec3 perp=normalize(cross(normalize(endPoint-startPoint),vec3(0.,1.,0.)));
if(length(perp)<.1)perp=vec3(1.,0,0.);
mid+=perp*sin(t*3.14159)*.15;
vec3 p0=mix(startPoint,mid,t);vec3 p1=mix(mid,endPoint,t);vec3 fp=mix(p0,p1,t);
fp+=perp*snoise(vec3(pathIndex*.08,t*.6,uTime*.15))*.12;
vec3 wp=(modelMatrix*vec4(fp,1.)).xyz;
float tp=0.;for(int i=0;i<3;i++)tp+=getPulse(wp,uPulsePositions[i],uPulseTimes[i]);vPI2=min(tp,1.);
vColor=connectionColor;vCS=connectionStrength;vDC=length(wp-cameraPosition);
gl_Position=projectionMatrix*modelViewMatrix*vec4(fp,1.);}`;

const connFS = `uniform float uTime;uniform vec3 uPulseColors[3];
varying vec3 vColor;varying float vCS;varying float vPI2;varying float vPP;varying float vDC;
void main(){float f1=sin(vPP*25.-uTime*4.)*.5+.5;float f2=sin(vPP*15.-uTime*2.5+1.57)*.5+.5;float cf=(f1+f2*.5)/1.5;
vec3 fc=vColor*(.8+.2*sin(uTime*.6+vPP*12.));float fi=.4*cf*vCS;
if(vPI2>0.){vec3 pc=mix(vec3(1.),uPulseColors[0],.3);fc=mix(fc,pc*0.8,vPI2*.5);fi+=vPI2*.4;}
fc*=(.7+fi+vCS*.5);float a=(.7*vCS+cf*.3);a=mix(a,min(1.,a*2.5),vPI2);
gl_FragColor=vec4(fc,a*smoothstep(100.,15.,vDC));}`;

class Node {
    constructor(p, l = 0, t = 0) { this.position = p; this.connections = []; this.level = l; this.type = t; this.size = t === 0 ? THREE.MathUtils.randFloat(.8, 1.4) : THREE.MathUtils.randFloat(.5, 1); this.distanceFromRoot = 0; }
    addConnection(n, s = 1) { if (!this.isConnectedTo(n)) { this.connections.push({ node: n, strength: s }); n.connections.push({ node: this, strength: s }); } }
    isConnectedTo(n) { return this.connections.some(c => c.node === n); }
}

function genNet(fi, df = 1) {
    let nodes = [], root;
    function sphere() {
        root = new Node(new THREE.Vector3(0, 0, 0), 0, 0); root.size = 2; nodes.push(root);
        const gr = (1 + Math.sqrt(5)) / 2;
        for (let l = 1; l <= 5; l++) {
            const r = l * 4, np = Math.floor(l * 12 * df);
            for (let i = 0; i < np; i++) {
                const phi = Math.acos(1 - 2 * (i + .5) / np), th = 2 * Math.PI * i / gr;
                const pos = new THREE.Vector3(r * Math.sin(phi) * Math.cos(th), r * Math.sin(phi) * Math.sin(th), r * Math.cos(phi));
                const node = new Node(pos, l, l === 5 || Math.random() < .3 ? 1 : 0); node.distanceFromRoot = r; nodes.push(node);
                if (l > 1) { const prev = nodes.filter(n => n.level === l - 1 && n !== root).sort((a, b) => pos.distanceTo(a.position) - pos.distanceTo(b.position)); for (let j = 0; j < Math.min(3, prev.length); j++)node.addConnection(prev[j], Math.max(.3, 1 - (pos.distanceTo(prev[j].position) / (r * 2)))); }
                else root.addConnection(node, .9);
            }
            const ln = nodes.filter(n => n.level === l && n !== root);
            for (const node of ln) { const nb = ln.filter(n => n !== node).sort((a, b) => node.position.distanceTo(a.position) - node.position.distanceTo(b.position)).slice(0, 5); for (const nn of nb) if (node.position.distanceTo(nn.position) < r * .8 && !node.isConnectedTo(nn)) node.addConnection(nn, .6); }
        }
        const ou = nodes.filter(n => n.level >= 3);
        for (let i = 0; i < Math.min(20, ou.length); i++) { const a = ou[Math.floor(Math.random() * ou.length)], b = ou[Math.floor(Math.random() * ou.length)]; if (a !== b && !a.isConnectedTo(b) && Math.abs(a.level - b.level) > 1) a.addConnection(b, .4); }
    }
    function helix() {
        root = new Node(new THREE.Vector3(0, 0, 0), 0, 0); root.size = 1.8; nodes.push(root);
        const nh = 4, H = 30, mr = 12, nph = Math.floor(50 * df), ha = [];
        for (let h = 0; h < nh; h++) {
            const hp = (h / nh) * Math.PI * 2, hn = [];
            for (let i = 0; i < nph; i++) {
                const t = i / (nph - 1), y = (t - .5) * H, rs = Math.sin(t * Math.PI) * .7 + .3, r = mr * rs, a = hp + t * Math.PI * 6;
                const node = new Node(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)), Math.ceil(t * 5), i > nph - 5 || Math.random() < .25 ? 1 : 0);
                node.distanceFromRoot = Math.sqrt(r * r + y * y); node.helixIndex = h; node.helixT = t; nodes.push(node); hn.push(node);
            }
            ha.push(hn); root.addConnection(hn[0], 1); for (let i = 0; i < hn.length - 1; i++)hn[i].addConnection(hn[i + 1], .85);
        }
        for (let h = 0; h < nh; h++) { const c = ha[h], nx = ha[(h + 1) % nh]; for (let i = 0; i < c.length; i += 5) { const ti = Math.round(c[i].helixT * (nx.length - 1)); if (ti < nx.length) c[i].addConnection(nx[ti], .7); } }
        for (const hn of ha) { for (let i = 0; i < hn.length; i += 8) { const node = hn[i], inn = nodes.filter(n => n !== node && n !== root && n.distanceFromRoot < node.distanceFromRoot * .5); if (inn.length > 0) node.addConnection(inn.sort((a, b) => node.position.distanceTo(a.position) - node.position.distanceTo(b.position))[0], .5); } }
        const all = nodes.filter(n => n !== root);
        for (let i = 0; i < Math.floor(30 * df); i++) { const n1 = all[Math.floor(Math.random() * all.length)]; const nb = all.filter(n => { const d = n.position.distanceTo(n1.position); return n !== n1 && d < 8 && d > 3 && !n1.isConnectedTo(n); }); if (nb.length > 0) n1.addConnection(nb[Math.floor(Math.random() * nb.length)], .45); }
    }
    function fractal() {
        root = new Node(new THREE.Vector3(0, 0, 0), 0, 0); root.size = 1.6; nodes.push(root);
        function branch(sn, dir, depth, str, sc) {
            if (depth > 4) return; const bl = 5 * sc;
            const ep = new THREE.Vector3().copy(sn.position).add(dir.clone().multiplyScalar(bl));
            const nn = new Node(ep, depth, depth === 4 || Math.random() < .3 ? 1 : 0); nn.distanceFromRoot = root.position.distanceTo(ep); nodes.push(nn); sn.addConnection(nn, str);
            if (depth < 4) { for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; const p1 = new THREE.Vector3(-dir.y, dir.x, 0).normalize(); const p2 = dir.clone().cross(p1).normalize(); const nd = new THREE.Vector3().copy(dir).add(p1.clone().multiplyScalar(Math.cos(a) * .7)).add(p2.clone().multiplyScalar(Math.sin(a) * .7)).normalize(); branch(nn, nd, depth + 1, str * .7, sc * .75); } }
        }
        for (let i = 0; i < 6; i++) { const phi = Math.acos(1 - 2 * (i + .5) / 6), th = Math.PI * (1 + Math.sqrt(5)) * i; branch(root, new THREE.Vector3(Math.sin(phi) * Math.cos(th), Math.sin(phi) * Math.sin(th), Math.cos(phi)).normalize(), 1, .9, 1); }
        const ln = nodes.filter(n => n.level >= 2);
        for (const node of ln) { const nb = ln.filter(n => { const d = n.position.distanceTo(node.position); return n !== node && d < 10 && !node.isConnectedTo(n); }).sort((a, b) => node.position.distanceTo(a.position) - node.position.distanceTo(b.position)).slice(0, 3); for (const nn of nb) if (Math.random() < .5 * df) node.addConnection(nn, .5); }
    }
    switch (fi % 3) { case 0: sphere(); break; case 1: helix(); break; case 2: fractal(); break; }
    if (df < 1) { const tc = Math.ceil(nodes.length * Math.max(.3, df)); const keep = new Set([root]); const sorted = nodes.filter(n => n !== root).sort((a, b) => b.connections.length * (1 / (b.distanceFromRoot + 1)) - a.connections.length * (1 / (a.distanceFromRoot + 1))); for (let i = 0; i < Math.min(tc - 1, sorted.length); i++)keep.add(sorted[i]); nodes = nodes.filter(n => keep.has(n)); nodes.forEach(n => { n.connections = n.connections.filter(c => keep.has(c.node)); }); }
    return { nodes, root };
}

let net = null, nm = null, cm = null;
function build(fi, df = 1) {
    if (nm) { scene.remove(nm); nm.geometry.dispose(); nm.material.dispose(); }
    if (cm) { scene.remove(cm); cm.geometry.dispose(); cm.material.dispose(); }
    net = genNet(fi, df);
    if (!net || !net.nodes.length) return;
    const pal = palettes[cfg.activePaletteIndex];
    const ng = new THREE.BufferGeometry();
    const np = [], nt = [], ns = [], nc = [], nd = [];
    net.nodes.forEach(n => { np.push(n.position.x, n.position.y, n.position.z); nt.push(n.type); ns.push(n.size); nd.push(n.distanceFromRoot); const c = pal[Math.min(n.level, pal.length - 1) % pal.length].clone(); c.offsetHSL(THREE.MathUtils.randFloatSpread(.03), THREE.MathUtils.randFloatSpread(.08), THREE.MathUtils.randFloatSpread(.08)); nc.push(c.r, c.g, c.b); });
    ng.setAttribute('position', new THREE.Float32BufferAttribute(np, 3));
    ng.setAttribute('nodeType', new THREE.Float32BufferAttribute(nt, 1));
    ng.setAttribute('nodeSize', new THREE.Float32BufferAttribute(ns, 1));
    ng.setAttribute('nodeColor', new THREE.Float32BufferAttribute(nc, 3));
    ng.setAttribute('distanceFromRoot', new THREE.Float32BufferAttribute(nd, 1));
    nm = new THREE.Points(ng, new THREE.ShaderMaterial({ uniforms: THREE.UniformsUtils.clone(pulseU), vertexShader: nodeVS, fragmentShader: nodeFS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    scene.add(nm);

    const cg = new THREE.BufferGeometry();
    const cp = [], cs = [], cc = [], sp = [], ep = [], pi = [];
    const done = new Set(); let idx = 0;
    net.nodes.forEach((n, ni) => { n.connections.forEach(conn => { const ci = net.nodes.indexOf(conn.node); if (ci === -1) return; const k = [Math.min(ni, ci), Math.max(ni, ci)].join('-'); if (!done.has(k)) { done.add(k); const S = 20; for (let i = 0; i < S; i++) { const t = i / (S - 1); cp.push(t, 0, 0); sp.push(n.position.x, n.position.y, n.position.z); ep.push(conn.node.position.x, conn.node.position.y, conn.node.position.z); pi.push(idx); cs.push(conn.strength); const al = Math.min(Math.floor((n.level + conn.node.level) / 2), pal.length - 1); const c = pal[al % pal.length].clone(); c.offsetHSL(THREE.MathUtils.randFloatSpread(.03), THREE.MathUtils.randFloatSpread(.08), THREE.MathUtils.randFloatSpread(.08)); cc.push(c.r, c.g, c.b); } idx++; } }); });
    cg.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3));
    cg.setAttribute('startPoint', new THREE.Float32BufferAttribute(sp, 3));
    cg.setAttribute('endPoint', new THREE.Float32BufferAttribute(ep, 3));
    cg.setAttribute('connectionStrength', new THREE.Float32BufferAttribute(cs, 1));
    cg.setAttribute('connectionColor', new THREE.Float32BufferAttribute(cc, 3));
    cg.setAttribute('pathIndex', new THREE.Float32BufferAttribute(pi, 1));
    cm = new THREE.LineSegments(cg, new THREE.ShaderMaterial({ uniforms: THREE.UniformsUtils.clone(pulseU), vertexShader: connVS, fragmentShader: connFS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    scene.add(cm);
    pal.forEach((c, i) => { if (i < 3) { nm.material.uniforms.uPulseColors.value[i].copy(c); cm.material.uniforms.uPulseColors.value[i].copy(c); } });
}

const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
const iPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), iPt = new THREE.Vector3();
let pIdx = 0;
function pulse(x, y) {
    ptr.x = (x / innerWidth) * 2 - 1; ptr.y = -(y / innerHeight) * 2 + 1;
    ray.setFromCamera(ptr, camera);
    iPlane.normal.copy(camera.position).normalize();
    iPlane.constant = -iPlane.normal.dot(camera.position) + camera.position.length() * .5;
    if (ray.ray.intersectPlane(iPlane, iPt) && nm && cm) {
        pIdx = (pIdx + 1) % 3;
        const t = clock.getElapsedTime();
        nm.material.uniforms.uPulsePositions.value[pIdx].copy(iPt); nm.material.uniforms.uPulseTimes.value[pIdx] = t;
        cm.material.uniforms.uPulsePositions.value[pIdx].copy(iPt); cm.material.uniforms.uPulseTimes.value[pIdx] = t;
        const c = palettes[cfg.activePaletteIndex][Math.floor(Math.random() * 5)];
        nm.material.uniforms.uPulseColors.value[pIdx].copy(c); cm.material.uniforms.uPulseColors.value[pIdx].copy(c);
    }
}

const profileCard = document.querySelector('.profile-card');
const rippleContainer = document.querySelector('.ripple-container');
let lastPulseTime = 0;
const pulseCooldown = 1200; // Minimum delay between pulses in ms

function createRipple(event) {
    if (!profileCard || !rippleContainer) return;
    
    const rect = profileCard.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Only create ripple if click is within the card
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (x - size / 2) + 'px';
        ripple.style.top = (y - size / 2) + 'px';
        
        rippleContainer.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 800);
        return true;
    }
    return false;
}

// Canvas click - pulse effect only with cooldown
renderer.domElement.addEventListener('click', e => { 
    const rect = profileCard.getBoundingClientRect();
    const isOnCard = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!cfg.paused && !isOnCard) {
        const now = Date.now();
        if (now - lastPulseTime >= pulseCooldown) {
            pulse(e.clientX, e.clientY);
            lastPulseTime = now;
        }
    } 
});

// Canvas touch - pulse effect only with cooldown
renderer.domElement.addEventListener('touchstart', e => { 
    e.preventDefault(); 
    if (e.touches.length && !cfg.paused) { 
        const rect = profileCard.getBoundingClientRect();
        const touch = e.touches[0];
        const isOnCard = touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom;
        if (!isOnCard) {
            const now = Date.now();
            if (now - lastPulseTime >= pulseCooldown) {
                pulse(touch.clientX, touch.clientY);
                lastPulseTime = now;
            }
        }
    } 
}, { passive: false });

function triggerGlow() {
    if (profileCard) {
        profileCard.classList.remove('glow');
        void profileCard.offsetWidth; // Trigger reflow to restart animation
        profileCard.classList.add('glow');
        setTimeout(() => profileCard.classList.remove('glow'), 600);
    }
}

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    if (!cfg.paused) {
        if (nm) { nm.material.uniforms.uTime.value = t; nm.rotation.y = Math.sin(t * .04) * .05; }
        if (cm) { cm.material.uniforms.uTime.value = t; cm.rotation.y = Math.sin(t * .04) * .05; }
    }
    stars.rotation.y += .0002; stars.material.uniforms.uTime.value = t;
    controls.update(); composer.render();
}

build(2, 1); animate();

window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight);
    bloom.resolution.set(innerWidth, innerHeight);
});


