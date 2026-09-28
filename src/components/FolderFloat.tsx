import{useEffect,useMemo,useRef,useState}from'react';
import{Engine,Bodies,Body,Composite,World}from'matter-js';
import{ChevronRight}from'lucide-react';

type Item=string|{name:string;sub?:string;value?:string};
type Props={items:Item[];label?:string;sublabel?:string;trigger?:'hover'|'click';closeOnSelect?:boolean;physics?:boolean;drift?:number;active?:string;onSelect?:(value:string,index:number)=>void};

const read=(item:Item)=>typeof item==='string'?{name:item,sub:'',value:item}:{name:item.name,sub:item.sub??'',value:item.value??item.name};

export default function FolderFloat({items,label='Necesidades',sublabel='',trigger='click',closeOnSelect=true,physics=true,drift=.5,active,onSelect}:Props){
 const root=useRef<HTMLDivElement>(null);
 const nodes=useRef<(HTMLButtonElement|null)[]>([]);
 const engine=useRef<Engine|null>(null);
 const bodies=useRef<any[]>([]);
 const frame=useRef<number|null>(null);
 const [open,setOpen]=useState(false);
 const data=useMemo(()=>items.map(read),[items]);

 useEffect(()=>{
  if(!physics||!root.current)return;
  const el=root.current;
  const width=Math.max(320,el.clientWidth);
  const height=Math.max(190,el.clientHeight);
  const e=Engine.create({enableSleeping:false});
  e.gravity.scale=0;
  engine.current=e;
  bodies.current=data.map((_,i)=>{
   const cols=Math.min(3,Math.max(1,Math.ceil(Math.sqrt(data.length))));
   const col=i%cols;
   const row=Math.floor(i/cols);
   const gap=Math.min(154,(width-90)/Math.max(1,cols-1));
   const x=width/2+(col-(cols-1)/2)*gap;
   const y=38+row*54;
   return Bodies.rectangle(x,y,145,40,{frictionAir:.12,restitution:.55});
  });
  Composite.add(e.world,bodies.current);
  const tick=()=>{
   Engine.update(e,16.67);
   const now=performance.now();
   bodies.current.forEach((body,i)=>{
    if(open)Body.applyForce(body,body.position,{x:Math.sin(now/900+i)*drift*.000025,y:Math.cos(now/1100+i)*drift*.00002});
    const minX=76,maxX=Math.max(76,width-76),minY=25,maxY=Math.max(25,height-78);
    if(body.position.x<minX)Body.setPosition(body,{x:minX,y:body.position.y});
    if(body.position.x>maxX)Body.setPosition(body,{x:maxX,y:body.position.y});
    if(body.position.y<minY)Body.setPosition(body,{x:body.position.x,y:minY});
    if(body.position.y>maxY)Body.setPosition(body,{x:body.position.x,y:maxY});
    const node=nodes.current[i];
    if(node)node.style.transform=`translate3d(${body.position.x-72.5}px,${body.position.y-20}px,0) rotate(${body.angle}rad)`;
   });
   frame.current=requestAnimationFrame(tick);
  };
  tick();
  return()=>{if(frame.current!==null)cancelAnimationFrame(frame.current);World.clear(e.world,false);Engine.clear(e);engine.current=null};
 },[data,drift,open,physics]);

 return <div ref={root} className={'folder-float '+(open?'is-open':'')} onMouseEnter={()=>trigger==='hover'&&setOpen(true)} onMouseLeave={()=>trigger==='hover'&&setOpen(false)}>
  <div className="folder-float-orbit" aria-hidden="true"/>
  <button type="button" className="folder-float-base" onClick={trigger==='click'?()=>setOpen(v=>!v):undefined} aria-expanded={open}>
   <span className="folder-float-tab"/>
   <span className="folder-float-label">{label}</span>
   {sublabel&&<small>{sublabel}</small>}
   <ChevronRight size={16}/>
  </button>
  <div className="folder-float-cloud" aria-hidden={!open}>
   {data.map((item,i)=><button ref={node=>{nodes.current[i]=node}} type="button" key={item.value} className={'folder-float-pill '+(active===item.value?'active':'')} onClick={()=>{onSelect?.(item.value,i);if(closeOnSelect)setOpen(false)}} style={{opacity:open?1:0,pointerEvents:open?'auto':'none'}}>
    <b>{item.name}</b>{item.sub&&<small>{item.sub}</small>}
   </button>)}
  </div>
 </div>;
}
