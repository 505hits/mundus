import { ImageResponse } from "next/og";

export const runtime="edge";
export const alt="Mundus Languages — online language lessons";
export const size={width:1200,height:630};
export const contentType="image/png";

export default function Image(){
 return new ImageResponse(
  <div style={{height:"100%",width:"100%",display:"flex",background:"#171A2B",color:"white",fontFamily:"sans-serif",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",width:720,height:720,borderRadius:9999,background:"rgba(70,82,194,.42)",filter:"blur(90px)",top:-340,right:-120}}/>
    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",padding:"78px",maxWidth:960,zIndex:2}}>
      <div style={{fontSize:28,fontWeight:700,letterSpacing:"0.02em",color:"#C7D2FE"}}>MUNDUS LANGUAGES</div>
      <div style={{fontSize:74,lineHeight:1.03,fontWeight:700,letterSpacing:"-0.04em",marginTop:24}}>Learn a language around your life.</div>
      <div style={{fontSize:30,lineHeight:1.35,color:"#D8DBE8",marginTop:28}}>1:1 lessons · private groups · company training · flexible online scheduling</div>
      <div style={{display:"flex",gap:16,marginTop:40}}>
        {["45 / 60 min","100+ students","SK · EN"].map(x=><div key={x} style={{padding:"12px 20px",borderRadius:9999,border:"1px solid rgba(255,255,255,.18)",background:"rgba(255,255,255,.08)",fontSize:22}}>{x}</div>)}
      </div>
    </div>
  </div>,
  size
 );
}
