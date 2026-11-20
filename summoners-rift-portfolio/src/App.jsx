import React, { Suspense, useMemo, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Html, OrbitControls, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { ArrowLeft, Compass, Github, ExternalLink, Sparkles as SparkleIcon, Map as MapIcon } from 'lucide-react'
import { usePortfolio } from './store'

// aqui esta el texto que aparece cuando abres la zona de mi perfil
const profileText = `¡Hola, invocador! Bienvenido a mi perfil.

Soy Laura Lucia Jaramillo Yah, estudiante de Ingeniería en Tecnología de Software y una desarrolladora en formación que busca abrirse camino en el mundo de la tecnología.

Durante mi recorrido académico he tenido la oportunidad de explorar diferentes áreas del desarrollo de software, desde la programación y las bases de datos hasta el desarrollo web y las aplicaciones móviles.

Me gusta experimentar con nuevas herramientas, enfrentar desafíos y transformar ideas en proyectos funcionales. Cada proyecto representa una nueva oportunidad para aprender, mejorar mis habilidades y descubrir todo lo que puedo crear mediante el código.

Mi aventura en el mundo del desarrollo apenas comienza, y todavía quedan muchos desafíos por superar.

¡Nos vemos en la Grieta, invocador!`

// aqui se guarda la informacion de cada zona y de los proyectos que contiene
const zones = [
  { id:'TOP', name:'Top Lane', subtitle:'Programación avanzada', color:'#d9b56d', position:[-0.15,1.0,-7.55], description:'En este carril reúno proyectos donde he trabajado la lógica, la programación y la construcción de aplicaciones.', tags:['Java','JavaFX','CRUD'], projects:[
    { title:'MiniDBeaver: CRUDCODILE', description:'Aplicación de escritorio inspirada en herramientas de administración de bases de datos. Proyecto enfocado en operaciones CRUD y manejo de información.', tech:['Java','JavaFX'], links:[{label:'Ver repositorio',url:'https://github.com/alDillrock/MiniDBeaver'}] }
  ] },
  { id:'JUNGLE', name:'Jungla', subtitle:'Desarrollo de aplicaciones', color:'#75c5a0', position:[-3.55,1.0,-0.15], description:'En la jungla encontrarás proyectos de aplicaciones y experimentación con tecnologías y servicios externos.', tags:['Flutter','Dart','API REST'], projects:[
    { title:'Hyrule-Dex', description:'Aplicación móvil inspirada en The Legend of Zelda: Tears of the Kingdom. Permite explorar información de monstruos del juego mediante una API.', tech:['Flutter','Dart','API REST'], links:[{label:'Ver repositorio',url:'https://github.com/LucyJY-68636/hyrule-dex'}] }
  ] },
  { id:'MID', name:'Mid Lane', subtitle:'Sobre mí · Perfil de invocadora', color:'#78c8e8', position:[0.15,0.95,0.15], description:profileText, tags:['Ingeniería en Tecnología de Software','Desarrollo de software','Aprendizaje continuo'], profile:true },
  { id:'ADC', name:'Bot Lane · ADC', subtitle:'Desarrollo web · Pokédex', color:'#d8a76c', position:[2.35,1.0,6.85], description:'Proyectos web donde la información y la interacción son protagonistas.', tags:['HTML','CSS','JavaScript','PokéAPI'], projects:[
    { title:'Pokédex HTML', description:'Proyecto web que consulta y presenta información del universo Pokémon. Una práctica de desarrollo frontend y consumo de datos.', tech:['HTML','CSS','JavaScript','PokéAPI'], links:[{label:'Ver repositorio',url:'https://github.com/LucyJY-68636/pokedex-html'}] }
  ] },
  { id:'SUPPORT', name:'Bot Lane · Support', subtitle:'Guías y recursos web', color:'#b5a0e8', position:[4.55,1.0,6.85], description:'Este espacio reúne contenido web de consulta y recursos que acompañan la experiencia de los jugadores.', tags:['HTML','CSS','JavaScript','Guías'], projects:[
    { title:'Plants vs. Zombies Guide', description:'Guía web dedicada a Plants vs. Zombies, creada para reunir información útil del juego en un solo lugar.', tech:['HTML','CSS','JavaScript'], links:[{label:'Visitar página',url:'https://lucyjy-68636.github.io/plants-vs-zombies-guide/'},{label:'Ver repositorio',url:'https://github.com/LucyJY-68636/plants-vs-zombies-guide'}] }
  ] }
]

function Terrain() {
  const trees = useMemo(() => Array.from({length:155},(_,i)=>{
    const x=(Math.sin(i*91.7)*0.5+0.5)*18-9
    const z=(Math.cos(i*43.2)*0.5+0.5)*18-9
    const nearMid=Math.abs(x-z)<1.25
    const nearTop=(x < -5.8 && z > -5.8) || (z < -6.2 && x > -5.8)
    const nearBot=(z > 6.3 && x < 6.2) || (x > 6.3 && z < 6.2)
    const safeZone=Math.hypot(x+7.8,z-7.8)<2.0 || Math.hypot(x-7.8,z+7.8)<2.0
    return {x,z,scale:0.48+(i%6)*0.11,visible:!nearMid&&!nearTop&&!nearBot&&!safeZone&&Math.hypot(x,z)>2.1}
  }).filter(t=>t.visible),[])
  const bushes = useMemo(()=>[
    [-5.5,1.0],[-4.8,-2.2],[-2.8,4.5],[-1.6,-4.8],[1.8,4.7],[3.8,-1.7],[5.2,2.5],[0.7,-5.8],[-6.3,-3.8],[6.2,4.1]
  ],[])
  const rocks = useMemo(()=>[[-6,3],[-3,-5],[2,5],[5,-2],[-1,6],[6,1],[-4,-3],[3,3]],[])
  return <group>
    <Ground/>
    <TerrainRidge/>
    <Pit position={[-5.1,0.1,-2.5]} label="BARÓN" color="#b58be8"/>
    <Pit position={[5.1,0.1,2.7]} label="DRAGÓN" color="#e6a66b"/>
    {/* aqui se dibujan los tres carriles principales de la grieta */}
    <Lane points={[[-8,0.10,7.6],[-8.1,0.10,4.8],[-8.0,0.10,1.5],[-7.7,0.10,-2.0],[-6.3,0.10,-5.1],[-3.7,0.10,-7.3],[-0.5,0.10,-7.9],[3.3,0.10,-8.0],[6.2,0.10,-8.0],[7.8,0.10,-7.7]]} width={0.42}/>
    <Lane points={[[-8,0.10,7.6],[-5.8,0.10,5.6],[-3.6,0.10,3.5],[-1.5,0.10,1.4],[0,0.10,0],[2.0,0.10,-2.0],[4.1,0.10,-4.1],[6.1,0.10,-6.1],[7.8,0.10,-7.7]]} width={0.43}/>
    <Lane points={[[-8,0.10,7.6],[-5.0,0.10,7.9],[-1.5,0.10,8.0],[2.2,0.10,8.0],[5.4,0.10,7.8],[7.4,0.10,6.2],[7.9,0.10,3.2],[8.0,0.10,-0.2],[7.8,0.10,-3.8],[7.8,0.10,-7.7]]} width={0.42}/>
    {/* aqui va el rio que divide las zonas de la jungla */}
    <River points={[[-7.2,0.065,1.1],[-5.2,0.065,0.2],[-3.4,0.065,-0.8],[-1.5,0.065,-1.2],[0.4,0.065,-0.5],[2.1,0.065,0.8],[3.8,0.065,1.5],[5.3,0.065,0.7],[6.8,0.065,-0.8]]}/>
    {trees.map((t,i)=><Tree key={i} {...t}/>) }
    {bushes.map(([x,z],i)=><Bush key={i} position={[x,0.08,z]}/>)}
    {rocks.map(([x,z],i)=><Rock key={i} position={[x,0.08,z]}/>)}
    <Camp position={[-4.4,0.1,-2.5]} color="#75c5a0" type="blue"/>
    <Camp position={[4.0,0.1,2.8]} color="#75c5a0" type="blue"/>
    <Camp position={[-2.5,0.1,4.7]} color="#d9b56d" type="red"/>
    <Camp position={[2.8,0.1,-4.8]} color="#d9b56d" type="red"/>
    <Camp position={[-1.9,0.1,-4.4]} color="#75c5a0" type="small"/>
    <Camp position={[2.0,0.1,4.6]} color="#75c5a0" type="small"/>
    <Base position={[-8,0.12,8]} color="#62b9e9"/>
    <Base position={[8,0.12,-8]} color="#e7a85c"/>
    {[-5.7,-3.0,3.0,5.7].map((v,i)=><Tower key={'top'+i} position={[-v,0.1,-7.6]} color="#74c9ed"/>)}
    {[-5.7,-3.0,3.0,5.7].map((v,i)=><Tower key={'bot'+i} position={[v,0.1,7.6]} color="#e7b56e"/>)}
    {[-5.0,5.0].map((v,i)=><Tower key={'mid'+i} position={[v,0.1,-v]} color={i?'#e7b56e':'#74c9ed'}/>)}
    <Inhibitor position={[-7.15,0.1,7.1]} color="#62b9e9"/>
    <Inhibitor position={[7.15,0.1,-7.1]} color="#e7a85c"/>
    <Sparkles count={190} scale={[18,2.8,18]} size={1.35} speed={0.3} opacity={0.48} color="#c6eadb"/>
  </group>
}
function River({points}) {
  const curve=useMemo(()=>new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),[points])
  const geometry=useMemo(()=>new THREE.TubeGeometry(curve,120,0.48,10,false),[curve])
  return <mesh geometry={geometry}><meshStandardMaterial color="#286d7b" roughness={0.2} metalness={0.22} emissive="#123a48" emissiveIntensity={0.35}/></mesh>
}
function Bush({position}) {
  return <group position={position}>
    {[[-.22,0,0],[.12,.04,.08],[0,.08,-.18],[.2,.02,-.16]].map((p,i)=><mesh key={i} position={p} scale={i===0?1:0.8} castShadow><dodecahedronGeometry args={[0.34,0]}/><meshStandardMaterial color={i%2?'#315d42':'#244b37'} roughness={1}/></mesh>)}
  </group>
}
function Rock({position}) {
  return <mesh position={position} rotation={[0.1,0.4,0.1]} scale={[0.55,0.35,0.48]} castShadow><dodecahedronGeometry args={[0.65,0]}/><meshStandardMaterial color="#59665e" roughness={0.95}/></mesh>
}
function Ground() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(20,20,70,70)
    const p = g.attributes.position
    for (let i=0;i<p.count;i++) {
      const x=p.getX(i), z=p.getY(i)
      const hills = Math.sin(x*0.72)*Math.cos(z*0.61)*0.13 + Math.sin((x+z)*0.42)*0.10
      const edge = Math.max(0, (Math.max(Math.abs(x),Math.abs(z))-7.2))*0.16
      p.setZ(i, hills + edge)
    }
    g.computeVertexNormals()
    return g
  },[])
  return <mesh geometry={geometry} rotation={[-Math.PI/2,0,0]} receiveShadow><meshStandardMaterial color="#315744" roughness={1}/></mesh>
}
function TerrainRidge() {
  return <group>
    {Array.from({length:12},(_,i)=><mesh key={i} position={[-8.6+i*1.55,-0.02,-8.7]} rotation={[0,0,0]}><coneGeometry args={[0.9+(i%3)*0.25,0.55+(i%4)*0.18,5]}/><meshStandardMaterial color="#203d34" roughness={1}/></mesh>)}
  </group>
}
function Pit({position,label,color}) {
  return <group position={position}>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.025,0]}><circleGeometry args={[1.05,24]}/><meshStandardMaterial color="#182e30" roughness={0.9}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.045,0]}><ringGeometry args={[0.82,1.08,24]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.42}/></mesh>
    {Array.from({length:7},(_,i)=>{const a=i*Math.PI*2/7;return <mesh key={i} position={[Math.cos(a)*0.92,0.24,Math.sin(a)*0.92]} rotation={[0,a,0]}><dodecahedronGeometry args={[0.22,0]}/><meshStandardMaterial color="#66756c" roughness={0.95}/></mesh>})}
    <Html position={[0,1.05,0]} center distanceFactor={15}><span className="world-caption">{label}</span></Html>
  </group>
}
function Inhibitor({position,color}) {
  return <group position={position}>
    <mesh position={[0,0.18,0]}><cylinderGeometry args={[0.55,0.7,0.36,8]}/><meshStandardMaterial color="#6d786e" metalness={0.3}/></mesh>
    <Float speed={1.1} floatIntensity={0.1}><mesh position={[0,0.85,0]}><octahedronGeometry args={[0.48,1]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} metalness={0.4}/></mesh></Float>
    <pointLight position={[0,0.9,0]} color={color} intensity={1.2} distance={3}/>
  </group>
}
function Camp({position,color,type='small'}) {
  const size=type==='blue'?0.48:type==='red'?0.43:0.28
  return <group position={position}>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.025,0]}><ringGeometry args={[size*1.25,size*1.55,8]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.32}/></mesh>
    {Array.from({length:type==='small'?2:3},(_,i)=><mesh key={i} position={[(i-1)*size*0.75,size*(0.65+(i%2)*0.2),i%2?size*0.2:-size*0.2]} rotation={[0,i*0.7,0]} castShadow><dodecahedronGeometry args={[size*(i===1?0.8:1),0]}/><meshStandardMaterial color={type==='red'?'#795f45':'#596b5d'} roughness={0.88}/></mesh>)}
    <mesh position={[0,size*1.65,0]}><octahedronGeometry args={[size*0.3,0]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.3}/></mesh>
  </group>
}
function Lane({points,width=0.38}) {
  const curve=useMemo(()=>new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),[points])
  const geometry=useMemo(()=>new THREE.TubeGeometry(curve,120,width,10,false),[curve,width])
  return <mesh geometry={geometry} castShadow><meshStandardMaterial color="#827c69" roughness={0.92}/></mesh>
}
function Tree({x,z,scale}) {
  const variant=Math.abs(Math.sin(x*2.7+z*1.9))
  const leaf=variant>.55?'#285b43':'#1d4939'
  return <group position={[x,0,z]} scale={scale} rotation={[0,variant*2,0]}>
    <mesh position={[0,0.42,0]} castShadow><cylinderGeometry args={[0.10,0.19,0.9,7]}/><meshStandardMaterial color="#493d2d"/></mesh>
    <mesh position={[0,1.0,0]} castShadow><coneGeometry args={[0.66,1.35,variant>.5?7:9]}/><meshStandardMaterial color={leaf} roughness={1}/></mesh>
    <mesh position={[0,1.55,0]} castShadow><coneGeometry args={[0.48,1.05,variant>.5?7:9]}/><meshStandardMaterial color="#32684b" roughness={1}/></mesh>
    {variant>.72&&<mesh position={[0,2.0,0]} castShadow><coneGeometry args={[0.27,.75,7]}/><meshStandardMaterial color="#3b7653" roughness={1}/></mesh>}
  </group>
}
function Tower({position,color}) {
  return <group position={position}>
    <mesh position={[0,0.12,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[0.36,0.52,8]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35}/></mesh>
    <mesh position={[0,0.55,0]} castShadow><cylinderGeometry args={[0.25,0.43,1.05,8]}/><meshStandardMaterial color="#777d76" metalness={0.38} roughness={0.5}/></mesh>
    <mesh position={[0,1.08,0]} castShadow><coneGeometry args={[0.35,0.38,8]}/><meshStandardMaterial color="#9b9a83" metalness={0.28}/></mesh>
    <mesh position={[0,1.35,0]}><octahedronGeometry args={[0.22,0]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8}/></mesh>
    <pointLight position={[0,1.35,0]} color={color} intensity={0.75} distance={2.7}/>
  </group>
}
function Base({position,color}) {
  return <group position={position}>
    <mesh position={[0,0.12,0]} rotation={[-Math.PI/2,0,0]}><cylinderGeometry args={[1.2,1.35,0.24,8]}/><meshStandardMaterial color="#68766d" metalness={0.55} roughness={0.45}/></mesh>
    <mesh position={[0,0.27,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[0.82,1.05,8]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7}/></mesh>
    <Float speed={1.2} floatIntensity={0.18}><mesh position={[0,1.0,0]}><octahedronGeometry args={[0.62,1]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.7} metalness={0.35} roughness={0.2}/></mesh></Float>
    <pointLight position={[0,1,0]} color={color} intensity={2} distance={4}/>
  </group>
}
function ZoneMarker({zone,onClick,active}) {
  const ref=useRef(); const [hovered,setHovered]=useState(false)
  useFrame(({clock})=>{
    if(ref.current){
      const pulse=1+Math.sin(clock.elapsedTime*2.1+(zone.position[0]+5))*0.035
      ref.current.scale.setScalar(pulse*(hovered?1.10:1))
    }
  })
  const activate=(e)=>{e.stopPropagation();onClick(zone)}
  return <group position={zone.position}>
    {/* este es el emblema que se puede seleccionar en el mapa */}
    <mesh position={[0,-0.72,0]} rotation={[-Math.PI/2,0,0]}>
      <ringGeometry args={[0.40,0.55,8]}/>
      <meshStandardMaterial color={zone.color} emissive={zone.color} emissiveIntensity={active?2.0:hovered?1.7:0.85} transparent opacity={active?1:0.88} depthWrite={false}/>
    </mesh>
    <mesh position={[0,-0.34,0]}>
      <cylinderGeometry args={[0.035,0.055,0.62,8]}/>
      <meshStandardMaterial color={zone.color} emissive={zone.color} emissiveIntensity={active||hovered?1.4:0.7} transparent opacity={0.72} depthWrite={false}/>
    </mesh>
    <group ref={ref}>
      <mesh position={[0,-0.02,0]} onClick={activate} onPointerOver={(e)=>{e.stopPropagation();setHovered(true);document.body.style.cursor='pointer'}} onPointerOut={()=>{setHovered(false);document.body.style.cursor='auto'}}>
        <cylinderGeometry args={[0.39,0.46,0.13,8]}/>
        <meshStandardMaterial color={zone.color} emissive={zone.color} emissiveIntensity={active?2.2:hovered?1.8:0.9} metalness={0.42} roughness={0.25} depthWrite={false}/>
      </mesh>
      <mesh position={[0,0.16,0]} onClick={activate} onPointerOver={()=>setHovered(true)} onPointerOut={()=>setHovered(false)}>
        <octahedronGeometry args={[0.205,0]}/>
        <meshStandardMaterial color="#fff1d0" emissive={zone.color} emissiveIntensity={active||hovered?2.6:1.65} depthWrite={false}/>
      </mesh>
    </group>
    <Html position={[0,0.68,0]} center distanceFactor={12} style={{pointerEvents:'none',zIndex:50}}>
      <div className={`map-label ${active?'is-active':''} ${hovered?'is-hovered':''}`} style={{'--zone':zone.color}}>{zone.id}</div>
    </Html>
    <pointLight position={[0,0.35,0]} color={zone.color} intensity={active?2.2:hovered?1.8:0.65} distance={3.3}/>
  </group>
}
function CameraRig({active}) {
  const controls=useRef()
  const target=active?new THREE.Vector3(...active.position):new THREE.Vector3(0,0,0)
  useFrame(({camera},delta)=>{
    const focus=active?new THREE.Vector3(active.position[0],active.position[1],active.position[2]):new THREE.Vector3(0,0,0)
    const offset=active?new THREE.Vector3(0,4.8,3.8):new THREE.Vector3(0,14.2,15.2)
    const desired=focus.clone().add(offset)
    const smooth=1-Math.exp(-delta*(active?1.75:1.05))
    camera.position.lerp(desired,smooth)
    camera.lookAt(focus)
    if(controls.current){controls.current.target.lerp(target,1-Math.exp(-delta*1.25));controls.current.update()}
  })
  return <OrbitControls ref={controls} enablePan={false} enableZoom={!active} enableRotate={!active} minPolarAngle={0.68} maxPolarAngle={1.18} minDistance={10} maxDistance={23} rotateSpeed={0.45}/>
}
function World({active,onSelect}) {
  return <Canvas shadows dpr={[1,1.7]} camera={{position:[0,13,14],fov:42}} gl={{antialias:true,alpha:false}}>
    <color attach="background" args={['#07151b']}/>
    <fog attach="fog" args={['#07151b',17,32]}/>
    <ambientLight intensity={0.8}/>
    <directionalLight position={[-7,12,8]} intensity={2.1} castShadow shadow-mapSize={[2048,2048]}/>
    <pointLight position={[0,5,0]} intensity={1.1} color="#65c5d8"/>
    <Suspense fallback={null}>
      <Terrain/>
      {zones.map(z=><ZoneMarker key={z.id} zone={z} onClick={onSelect} active={active?.id===z.id}/>)}
      <Environment preset="sunset"/>
    </Suspense>
    <CameraRig active={active}/>
    <EffectComposer><Bloom intensity={0.8} luminanceThreshold={0.55} luminanceSmoothing={0.25}/><Vignette eskil={false} offset={0.15} darkness={0.65}/></EffectComposer>
  </Canvas>
}
function MiniMap({active,onSelect}) {
  // estos puntos marcan donde queda cada zona dentro del minimapa
  const points=[['TOP',70,13],['JUNGLE',32,36],['MID',51,51],['ADC',62,84],['SUPPORT',77,80]]

  return <div className="mini-map">
    <div className="mini-title"><MapIcon size={12}/> NAVEGACIÓN</div>
    <div className="mini-board">
      {/* aqui se dibuja el mapa visto desde arriba, con sus tres carriles y el rio */}
      <svg className="mini-map-art" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="mini-road-edge" d="M 8 18 C 35 13, 64 12, 91 8" />
        <path className="mini-road" d="M 8 18 C 35 13, 64 12, 91 8" />
        <path className="mini-road-edge" d="M 8 91 C 34 87, 66 88, 91 8" />
        <path className="mini-road" d="M 8 91 C 34 87, 66 88, 91 8" />
        <path className="mini-road-edge" d="M 8 91 C 34 96, 66 91, 91 82" />
        <path className="mini-road" d="M 8 91 C 34 96, 66 91, 91 82" />
        <path className="mini-river-line" d="M 16 56 C 31 47, 42 44, 53 49 S 73 57, 86 39" />
        <path className="mini-river-glow" d="M 16 56 C 31 47, 42 44, 53 49 S 73 57, 86 39" />
      </svg>
      {points.map(([id,x,y])=><button key={id} aria-label={`Ir a ${id}`} title={id} className={`mini-point ${active?.id===id?'selected':''}`} style={{left:`${x}%`,top:`${y}%`}} onClick={()=>onSelect(zones.find(z=>z.id===id))}>{id==='SUPPORT'?'S':id==='JUNGLE'?'J':id==='TOP'?'T':id==='MID'?'M':'A'}</button>)}
    </div>
    <small>SELECCIONA UNA ZONA</small>
  </div>
}
// este componente junta el mapa, la navegacion y las fichas de cada proyecto
function App() {
  const {active,select,reset}=usePortfolio()
  useEffect(()=>{const onKey=e=>{if(e.key==='Escape')reset()};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[reset])
  return <main className="app-shell">
    <header className="topbar">
      <div className="brand"><span className="crest">✦</span><div><strong>SUMMONER'S PORTFOLIO</strong><small>LAURA LUCIA JARAMILLO YAH · SOFTWARE ENGINEERING</small></div></div>
      <div className="top-actions"><span className="status-dot"/> <span>MAPA DE EXPLORACIÓN</span></div>
    </header>
    <section className="scene-wrap">
      <World active={active} onSelect={select}/>
      <div className="scene-vignette"/>
      <AnimatePresence mode="wait">
        {!active && <motion.div className="intro" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.5}}>
          <span className="eyebrow"><Compass size={14}/> EXPLORA MI UNIVERSO</span>
          <h1>Bienvenido a<br/><em>la Grieta</em></h1>
          <p>Selecciona un carril para descubrir mi trayectoria, habilidades y proyectos.</p>
          <div className="hint"><span className="pulse"/> HAZ CLIC EN UN EMBLEMA DEL MAPA</div>
        </motion.div>}
      </AnimatePresence>
      <AnimatePresence>
        {active && <motion.aside className="info-panel" initial={{opacity:0,x:55,filter:'blur(8px)'}} animate={{opacity:1,x:0,filter:'blur(0px)'}} exit={{opacity:0,x:35,filter:'blur(5px)'}} transition={{duration:.45}}>
          <button className="back-button" onClick={reset}><ArrowLeft size={16}/> VOLVER AL MAPA</button>
          <div className="panel-kicker" style={{color:active.color}}>ZONA DESCUBIERTA · {active.id}</div>
          <h2>{active.name}</h2>
          <p className="panel-subtitle">{active.subtitle}</p>
          <div className="gold-rule"/>
          <p className={`panel-description ${active.profile?'profile-description':''}`}>{active.description}</p>
          {active.profile && <div className="profile-links"><a href="https://github.com/LucyJY-68636" target="_blank" rel="noreferrer"><Github size={15}/> GitHub</a><a href="mailto:al068636@uacam.mx">✉ Correo electrónico</a></div>}
          <h3>{active.profile?'HABILIDADES Y ÁREAS DE INTERÉS':'TECNOLOGÍAS / CONTENIDO'}</h3>
          <div className="tags">{active.tags.map(t=><span key={t}>{t}</span>)}</div>
          {active.projects?.length>0 && <div className="project-list">{active.projects.map(project=><article className="project-card" key={project.title}>
            <div className="project-card-heading"><SparkleIcon size={16}/><strong>{project.title}</strong></div>
            <p>{project.description}</p>
            <div className="tags project-tags">{project.tech.map(t=><span key={t}>{t}</span>)}</div>
            <div className="project-links">{project.links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<ExternalLink size={12}/></a>)}</div>
          </article>)}</div>}
          <div className="panel-footer"><span>SUMMONER'S RIFT</span><span>ESC PARA CERRAR</span></div>
        </motion.aside>}
      </AnimatePresence>
      <MiniMap active={active} onSelect={select}/>
      <div className="map-legend"><span><i className="legend-blue"/> BASE AZUL</span><span><i className="legend-gold"/> BASE ROJA</span><span><i className="legend-green"/> JUNGLA</span></div>
    </section>
    <footer className="footer"><span>PORTAFOLIO INTERACTIVO · 2026</span><span>HECHO CON REACT + THREE.JS</span></footer>
  </main>
}
export default App
