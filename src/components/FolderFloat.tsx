import{useState}from'react';
import{ChevronRight}from'lucide-react';

type Item=string|{name:string;sub?:string;value?:string};
type Props={items:Item[];label?:string;sublabel?:string;trigger?:'hover'|'click';closeOnSelect?:boolean;physics?:boolean;drift?:number;active?:string;onSelect?:(value:string,index:number)=>void};

const read=(item:Item)=>typeof item==='string'?{name:item,sub:'',value:item}:{name:item.name,sub:item.sub??'',value:item.value??item.name};

export default function FolderFloat({items,label='Necesidades',sublabel='',trigger='click',closeOnSelect=true,active,onSelect}:Props){
 const[open,setOpen]=useState(false);
 const data=items.map(read);
 const toggle=()=>setOpen(v=>!v);
 return <div className={'folder-float '+(open?'is-open':'')} onMouseEnter={()=>trigger==='hover'&&setOpen(true)} onMouseLeave={()=>trigger==='hover'&&setOpen(false)}>
  <div className="folder-float-orbit" aria-hidden="true"/>
  <div className="folder-float-cloud">
   {data.map((item,i)=><button type="button" key={item.value} className={'folder-float-pill '+(active===item.value?'active':'')} onClick={()=>{onSelect?.(item.value,i);if(closeOnSelect)setOpen(false)}} style={{opacity:open?1:0,pointerEvents:open?'auto':'none'}}>
    <b>{item.name}</b>{item.sub&&<small>{item.sub}</small>}
   </button>)}
  </div>
  <button type="button" className="folder-float-base" onClick={trigger==='click'?toggle:undefined} aria-expanded={open}>
   <span className="folder-float-tab"/>
   <span className="folder-float-label">{label}</span>
   {sublabel&&<small>{sublabel}</small>}
   <ChevronRight size={16}/>
  </button>
 </div>;
}
