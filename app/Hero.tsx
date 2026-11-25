"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Play, Pause, PhoneCall } from "lucide-react";

import { mountBinaryGrid } from "./binary-grid";

const nav = [
  ["Home", "#home"], ["Launchpad", "#agenti"], ["Protocol", "#percorso"], ["Incognito", "#trasparenza"], ["Accedi", "/richieste"]
];
const script = [
  "Buongiorno, sono Calliope, l’assistente virtuale dell’installatore. Ha chiesto un preventivo per il fotovoltaico. Ha un minuto?",
  "Sì, certo.",
  "L’abitazione è di sua proprietà?",
  "Sì. È una villetta, con il tetto a falde.",
  "Sa dirmi più o meno quanta energia consuma in un anno?",
  "Siamo sui quattromila chilowattora.",
  "Grazie. Il tecnico può passare giovedì alle dieci per il sopralluogo. Le torna?",
  "Sì, giovedì va bene.",
  "Allora le confermo giovedì alle dieci. Buona giornata!"
];
export default function Hero() {
  const grid = useRef<HTMLDivElement>(null);
  useEffect(() => { if (grid.current) return mountBinaryGrid(grid.current); }, []);
  const dialog = useRef<HTMLDialogElement>(null);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const sequence = useRef(0);
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const update = () => setVoices(synth.getVoices().filter(v => /^it([_-]|$)/i.test(v.lang)));
    update(); synth.addEventListener("voiceschanged", update);
    return () => { sequence.current++; synth.removeEventListener("voiceschanged", update); synth.cancel(); };
  }, []);
  function stop() {
    sequence.current++;
    window.speechSynthesis?.cancel();
    setPlaying(false);
  }
  function start(pos: number) {
    stop();
    setMessage("");
    setActive(pos);
    if (!voices.length) return;
    const token = sequence.current;
    setPlaying(true);
    function read(i: number) {
      if (token !== sequence.current) return;
      if (i === script.length) { setPlaying(false); setActive(0); return; }
      setActive(i);
      const u = new SpeechSynthesisUtterance(script[i]);
      u.lang = "it-IT"; u.rate = 1; u.voice = voices[i % 2] || voices[0];
      u.onend = () => read(i + 1);
      u.onerror = () => { if (sequence.current === token) { setPlaying(false); setMessage("La lettura vocale non è disponibile. Puoi leggere la conversazione qui sotto."); } };
      window.speechSynthesis.speak(u);
    }
    read(pos);
  }
  function openDemo() { setMenu(false); setActive(0); setMessage(""); dialog.current?.showModal(); }
  return <>
    <header className="hero" id="home">
      <div className="binary-bg" ref={grid} aria-hidden="true"><canvas/></div>
      <div className="desktop-hero">
        <img className="hero-original" src="/assets/hero.svg" alt="" fetchPriority="high" width="1440" height="800" />
        <h1 className="sr">Crea il tuo assistente H24 per rispondere ai tuoi clienti e salvare il tuo tempo</h1>
        <p className="sr">Calliope risponde alle chiamate dei tuoi clienti 24 ore su 24, fornisce informazioni, prenota appuntamenti e aggiorna automaticamente il calendario con tutte le informazioni raccolte.</p>
        <a className="hit hero-logo" aria-label="Calliope Voice, home" href="#home"></a>
        <nav aria-label="Navigazione principale" className="hero-navigation">
          {nav.map(([name,href]) => <a key={name} href={href} aria-label={name}><span className="sr">{name}</span></a>)}
        </nav>
        <button className="hit hero-listen" onClick={openDemo} aria-label="Ascoltala ora"></button>
        <a className="hit hero-book" href="#prova" aria-label="Prenota una demo"></a>
        <button className="hit hero-player" onClick={openDemo} aria-label="Apri il player della chiamata dimostrativa"></button>
      </div>
      <div className="mobile-hero">
        <div className="mobile-nav"><a className="wordmark" href="#home"><img src="/assets/calliope-muse.webp" alt=""/>Calliope-voice</a><button type="button" aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu?"Chiudi menu":"Apri menu"} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div>
        {menu&&<nav id="mobile-menu" aria-label="Navigazione mobile">{nav.map(([n,h])=><a key={n} href={h} onClick={()=>setMenu(false)}>{n}</a>)}</nav>}
        <div className="mobile-scene"><div className="mobile-title"><h1>Crea il tuo assistente H24 per rispondere ai tuoi <mark>clienti</mark> e salvare il tuo <mark>tempo</mark></h1></div></div>
        <div className="mobile-intro"><p>Calliope risponde alle chiamate dei tuoi clienti 24 ore su 24, fornisce informazioni, prenota appuntamenti e aggiorna automaticamente il calendario con tutte le informazioni raccolte.</p><div className="mobile-actions"><button className="btn blue" onClick={openDemo}><PhoneCall size={17}/>Ascoltala ora</button><a className="btn line" href="#prova">Prenota una demo</a></div><small>Primi 50 minuti completamente gratuiti per un periodo limitato.</small></div>
        <button className="mobile-player" onClick={openDemo} aria-label="Apri l’esempio di chiamata"><Play fill="currentColor" size={17}/><span>00 : 00</span><i/></button>
      </div>
    </header>
    <dialog ref={dialog} className="demo-dialog" onClose={stop} onClick={e=>{if(e.target===dialog.current)dialog.current?.close()}}>
      <div className="demo-inside"><div className="dialog-top"><span className="label">Esempio di chiamata</span><button onClick={()=>dialog.current?.close()} aria-label="Chiudi esempio"><X size={21}/></button></div>
      <h2>Calliope <em>Lead.</em></h2><p>Una richiesta di preventivo per il fotovoltaico. La lettura usa una voce italiana del dispositivo.</p>
      <div className="demo-controls"><button className="btn" disabled={!voices.length} onClick={()=>playing?stop():start(active)}>{playing?<Pause size={16}/>:<Play size={16}/>} {playing?"Pausa":"Ascolta"}</button>
      <span aria-live="polite">{message || (!voices.length ? "Voce italiana non disponibile su questo dispositivo." : "Seleziona una battuta per ripartire da lì.")}</span></div>
      <ol className="dialogue">{script.map((s,i)=><li key={s} className={playing&&active===i?"speaking":""}><button onClick={()=>{if(voices.length)start(i);else setActive(i)}} disabled={!voices.length}><b>{i%2?"Cliente":"Calliope"}</b><span>{s}</span></button></li>)}</ol></div>
    </dialog>
  </>;
}
