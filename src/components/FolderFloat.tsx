import{motion}from'framer-motion';
import{ChevronRight,type LucideIcon}from'lucide-react';
type Item={name:string;sub:string;Icon:LucideIcon};
type Props={items:Item[];active:string;onSelect:(name:string)=>void};
export default function FolderFloat({items,active,onSelect}:Props){
return <div className="folder-float">{items.map(({name,sub,Icon},i)=><motion.button type="button" key={name} className={'folder-float-card '+(active===name?'active':'')} onClick={()=>onSelect(name)} initial={{opacity:0,y:30,rotate:i%2?2:-2}} whileInView={{opacity:1,y:0,rotate:0}} viewport={{once:true}} transition={{delay:i*.07}} whileHover={{y:-8,rotate:i%2?1:-1}} whileTap={{scale:.97}}><span className="folder-float-icon"><Icon size={18}/></span><span className="folder-float-copy"><b>{name}</b><small>{sub}</small></span><ChevronRight size={15}/></motion.button>)}</div>;
}