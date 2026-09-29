import{useState}from'react';
import{ArrowUpRight,Check,Compass,Heart,Home,Utensils,Shield,Sun,Sparkles,BookOpen}from'lucide-react';

type Item=string|{name:string;sub?:string;value?:string};
type Props={items:Item[];label?:string;sublabel?:string;trigger?:'hover'|'click';closeOnSelect?:boolean;physics?:boolean;drift?:number;active?:string;onSelect?:(value:string,index:number)=>void};

const icons=[Compass,Sun,Utensils,Home,Shield,Sparkles,Heart,BookOpen];
const read=(item:Item)=>typeof item==='string'?{name:item,sub:'',value:item}:{name:item.name,sub:item.sub??'',value:item.value??item.name};

export default function FolderFloat({items,label='Explorar',sublabel='',active,onSelect}:Props){
 const[hovered,setHovered]=useState<number|null>(null);
 const data=items.map(read);
 return <div className="folder-float" aria-label={label}>
  <div className="folder-float-orbit" aria-hidden="true"/>
  <div className="folder-float-header">
   <div><span>{label}</span>{sublabel&&<small>{sublabel}</small>}</div>
   <div className="folder-float-line"/>
   <span className="folder-float-count">{String(data.length).padStart(2,'0')} opciones</span>
  </div>
  <div className="folder-float-cloud">
   {data.map((item,i)=>{const Icon=icons[i%icons.length];const selected=active===item.value;const hot=hovered===i;return <button type="button" key={item.value} className={'folder-float-pill '+(selected?'active ':'')+(hot?'hovered':'')} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(i)} onBlur={()=>setHovered(null)} onClick={()=>onSelect?.(item.value,i)} aria-pressed={active!==undefined?selected:undefined}>
    <span className="folder-float-index">{String(i+1).padStart(2,'0')}</span>
    <span className="folder-float-icon"><Icon size={17}/></span>
    <span className="folder-float-copy"><b>{item.name}</b>{item.sub&&<small>{item.sub}</small>}</span>
    <span className="folder-float-arrow">{selected?<Check size={14}/>:<ArrowUpRight size={14}/>}</span>
   </button>})}
  </div>
 </div>;
}