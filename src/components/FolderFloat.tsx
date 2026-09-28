import{useEffect,useRef,useState}from'react';
import{Engine,Bodies,Body,Composite}from'matter-js';
import{ChevronRight}from'lucide-react';

type Item=string|{name:string;sub?:string;value?:string};
type Props={items:Item[];label?:string;sublabel?:string;trigger?:'hover'|'click';closeOnSelect?:boolean;physics?:boolean;drift?:number;active?:string;onSelect?:(value:string,index:number)=>void};

const read=(x:Item)=>typeof x==='string'?{name:x,sub:'',value:x}:{name:x.name,sub:x.sub||'',value:x.value||x.name};

export default function FolderFloat({items,label='Necesidades',sublabel='',trigger='click',closeOnSelect=true,physics=true,drift=.5,active,onSelect}:Props){
 const root=useRef<HTMLDivElement>(null),nodes=useRef<(HTMLButtonElement|null)[]>([]),engine=useRef<Engine>(),bodies=useRef<any[]>([]),frame=useRef<number>();
 const [open,setOpen]=useState(false);const data=items.map(read);
 useEffect(()=>{if(!physics||!root.current)return;const e=Engine.create({enableSleeping:false});e.gravity.scale=0;engine.current=e;const w=root.current.clientWidth||900;
  bodies.current=data.map((_,i)=>Bodies.rectangle(w/2+(i%3-1)*155,145+Math.floor(i/3)*52,145,40,{frictionAir:.09,restitution:.65}));
  Composite.add(e.world,bodies.current);const tick=()=>{Engine.update(e,16.67);bodies.current.forEach((b,i)=>{if(open)Body.applyForce(b,b.position,{x:Math.sin(performance.now()/900+i)*drift*.00004,y:Math.cos(performance.now()/1100+i)*drift*.00004});const n=nodes.current[i];if(n)n.style.transform=`translate3d(${b.position.x-72}px,${b.position.y-20}px,0) rotate(${b.angle}rad)`;});frame.current=requestAnimationFrame(tick)};tick();
  return()=>{if(frame.current)cancelAnimationFrame(frame.current);Composite.clear(e.world,false);Engine.clear(e)};},[physics,data.length,open,drift]);
 const toggle=()=>setOpen(v=>!v);
 return <div ref={root} className={'folder-float '+(open?'is-open':'')} onMouseEnter={()=>trigger==='hover'&&setOpen(true)} onMouseLeave={()=>trigger==='hover'&&setOpen(false)}>
  <div className="folder-float-orbit"/>
  <button type="button" className="folder-float-base" onClick={trigger==='click'?toggle:undefined}><span className="folder-float-tab"/><span className="folder-float-label">{label}</span>{sublabel&&<small>{sublabel}</small>}<ChevronRight size={16}/></button>
  <div className="folder-float-cloud">{data.map((x,i)=><button ref={n=>nodes.current[i]=n} type="button" key={x.value} className={'folder-float-pill '+(active===x.name?'active':'')} onClick={()=>{onSelect?.(x.value,i);if(closeOnSelect)setOpen(false)}} style={{opacity:open?1:0,pointerEvents:open?'auto':'none'}}><b>{x.name}</b>{x.sub&&<small>{x.sub}</small>}</button>)}</div>
 </div>;
}