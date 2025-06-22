// File: src/components/GameBoard.jsx
import React, { useEffect, useRef, useState } from 'react';
import './GameBoard.css';              // ← ensure this import is present


/* -------------------------------------------------------------
   Level table  (tweak steps / hold times as you like)
--------------------------------------------------------------*/
const LEVEL = {
  novice:    { size: 4, steps: 5, hold: 3300 },
  journeyer: { size: 5, steps: 8, hold: 3000 },
  expert:    { size: 6, steps: 12, hold: 2600 },
};

/* Pixels per millisecond for the yellow trail */
const SPEED_PX_MS = 0.20;

/* -------------------------------------------------------------
   GameBoard component
--------------------------------------------------------------*/
export default function GameBoard({ config, onComplete, onStep, onRecallStart }) {

  const { size, steps, hold } = LEVEL[config.difficulty];

  /* ---------- state ---------- */
  const [path, setPath]   = useState([]);
  const [phase,setPhase]  = useState('watch');      // watch | recall
  const [glow, setGlow]   = useState([]);
  const [segs, setSegs]   = useState([]);
  const [dragIdx,setDI]   = useState([]);
  const [dragPts,setDP]   = useState([]);
  const [dragging,setDrag]= useState(false);

  const gridRef = useRef(null);

  /* ---------- build path + animate WATCH phase ---------- */
  useEffect(() => {
    const p = buildPath(size, steps);
    setPath(p); setGlow([]); setSegs([]);
    setDI([]);  setDP([]);   setPhase('watch');

    let t = 0;                               
    p.forEach((idx,i)=>{
      setTimeout(()=>setGlow(g=>[...g,idx]), t);

      if(i < p.length-1){
        const s = makeSeg(p[i],p[i+1], t);
        setSegs(segs => [...segs, s]);
        t += s.dur;
      }
    });

    const total = t;
    setTimeout(()=>setGlow(p), total+120);
    setTimeout(()=>{
      setGlow([]); setSegs([]); setPhase('recall');
    }, total + hold);
  }, [config]);

  /* ---------- global pointer up ends drag ---------- */
  useEffect(()=>{
    const end=()=>finishDrag();
    window.addEventListener('mouseup',end);
    window.addEventListener('touchend',end);
    return()=>{window.removeEventListener('mouseup',end);
               window.removeEventListener('touchend',end);};
  });

  /* ---------- helper functions ---------- */
  const idx = (n,r,c)=> r*n+c;

  function buildPath(n,len){
    const dir=[[1,0],[-1,0],[0,1],[0,-1]];
    let r=(n>>1), c=(n>>1);
    const out=[idx(n,r,c)];
    while(out.length<len){
      const opts=dir.map(([dr,dc])=>[r+dr,c+dc])
        .filter(([R,C])=>R>=0&&C>=0&&R<n&&C<n)
        .map(([R,C])=>idx(n,R,C))
        .filter(i=>!out.includes(i));
      if(!opts.length) break;
      const next=opts[Math.random()*opts.length|0];
      out.push(next); r=next/n|0; c=next%n;
    }
    return out;
  }

  function center(i){
    const btn=document.getElementById(`cell-${i}`);
    const grid=gridRef.current;
    if(!btn||!grid) return null;
    const b=btn.getBoundingClientRect(), g=grid.getBoundingClientRect();
    return { x:b.left-g.left+b.width/2,
             y:b.top -g.top +b.height/2 };
  }

  /* build one segment object */
  function makeSeg(a,b,delay){
    const p1=center(a), p2=center(b); if(!p1||!p2) return {};
    const len=Math.hypot(p2.x-p1.x,p2.y-p1.y);
    const dur=len / SPEED_PX_MS;
    return { x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y,
             len:len.toFixed(1), delay, dur };
  }

  /* ---------- drag logic ---------- */
  const begin = (i) => {
  if (phase !== 'recall') return;

  if (!dragging) {
    onRecallStart?.(); 
  }

  setDrag(true);
  setDI([i]);
  setDP([center(i)]);
  onStep?.(1);
};


  const extend = i => {
    if(!dragging || phase!=='recall') return;
    setDI(prev=>{
      if(prev.includes(i)) return prev;
      setDP(pts=>[...pts, center(i)]);
      onStep?.(prev.length+1);
      return [...prev, i];
    });
  };

  const finishDrag = () => {
    if(!dragging) return;
    setDrag(false);
    if(phase!=='recall') return;
    const win=dragIdx.length===path.length &&
              path.every((v,k)=>v===dragIdx[k]);
    onComplete({ success: win, score: win ? path.length : dragIdx.length });
  };

  const bluePoly = dragPts.map(p=>`${p.x},${p.y}`).join(' ');

  /* ---------- render ---------- */
  return (
    <section className="game-board">
      <h2>{phase==='watch' ? 'Watch the trail…' : 'Drag to recreate it!'}</h2>

      <div
        ref={gridRef}
        className="grid"
        style={{ gridTemplateColumns:`repeat(${size},1fr)` }}
      >
        {/* yellow segments (inline animation) */}
        {segs.map((s,k)=>(
          <svg key={k} className="trail-svg">
            <line
              x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              style={{
                stroke:'#ffcc00',
                strokeWidth:6,
                strokeLinecap:'round',
                strokeLinejoin:'round',
                fill:'none',
                strokeDasharray:s.len,
                strokeDashoffset:s.len,
                animation:`gb-drawSeg ${s.dur}ms linear ${s.delay}ms forwards`,
              }}
            />
          </svg>
        ))}

        {/* blue (accent) drag trail */}
        {dragPts.length>1 && phase==='recall' && (
          <svg className="trail-svg">
            <polyline
              points={bluePoly}
              stroke="var(--accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{ filter:'drop-shadow(0 0 6px var(--accent))' }}
            />
          </svg>
        )}

        {/* grid buttons */}
        {Array.from({ length:size*size }).map((_,i)=>(
          <button
            key={i}
            id={`cell-${i}`}
            className={[
              'cell',
              i===path[0]     ? 'start-node' : '',
              glow.includes(i)? 'glowing'    : '',
              dragIdx.includes(i)? 'selected': '',
            ].join(' ')}
            disabled={phase!=='recall'}
            onMouseDown={()=>begin(i)}
            onMouseEnter={()=>extend(i)}
            onTouchStart={()=>begin(i)}
            onTouchMove={e=>{
              const el=document.elementFromPoint(
                e.touches[0].clientX,e.touches[0].clientY);
              if(el?.id?.startsWith('cell-')) extend(+el.id.slice(5));
            }}
          />
        ))}
      </div>
    </section>
  );
}
