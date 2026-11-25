"use client";
import { useState } from "react";
import { ClipboardList, PhoneCall, ListChecks, CalendarDays, PhoneForwarded } from "lucide-react";

const steps = [
  { title: "Arriva il lead.", text: "Da form, campagna o telefonata.", icon: ClipboardList, heading: "Richiesta di preventivo", fields: [["Servizio","Impianto fotovoltaico"],["Provenienza","Modulo del sito"]], result: "Richiesta ricevuta" },
  { title: "Calliope chiama o risponde in meno di un minuto.", text: "Si presenta subito come assistente virtuale.", icon: PhoneCall, heading: "Chiamata in uscita", quote: "Buongiorno, sono Calliope, l’assistente virtuale dell’installatore. Ha chiesto un preventivo per il fotovoltaico.", result: "Conversazione avviata" },
  { title: "Fa le domande giuste.", text: "Proprietà, tetto, consumi, quando è libero il cliente.", icon: ListChecks, heading: "Scheda del contatto", fields: [["Immobile","Villetta di proprietà"],["Tetto","A falde"],["Consumo annuo","4.000 kWh"]], result: "Qualifica completata" },
  { title: "Il sopralluogo finisce in agenda.", text: "Tu ricevi riepilogo e trascrizione.", icon: CalendarDays, heading: "Sopralluogo fotovoltaico", fields: [["Quando","Giovedì, ore 10:00"],["Intervento","Verifica sul posto"]], result: "Appuntamento confermato" },
  { title: "Se il cliente vuole una persona, passa a te.", text: "Senza perdere il filo della conversazione.", icon: PhoneForwarded, heading: "Passaggio al tecnico", quote: "Le passo il tecnico che si occuperà del sopralluogo. Ha già il riepilogo della nostra conversazione.", result: "Riepilogo disponibile" },
];
export default function Flow(){
 const [curr,setCurr] = useState(0);
 const s = steps[curr]; const Icon = s.icon;
 return <div className="flow-layout"><div className="steps">{steps.map((x,i)=><button key={x.title} id={"flow-step-"+i} aria-controls="flow-example" aria-pressed={i===curr} className={i===curr?"selected":""} onClick={()=>setCurr(i)}><i aria-hidden="true"/><span><strong>{x.title}</strong><small>{x.text}</small></span></button>)}</div>
 <div id="flow-example" className="flow-board" aria-labelledby={"flow-step-"+curr} aria-live="polite"><div className="blueprint-top"><span className="label">Esempio di percorso</span><img src="/assets/meandro.webp" alt=""/></div><div className="specimen" key={curr}><div className="specimen-header"><Icon size={30} strokeWidth={1.3}/><span className="label">Calliope Voice</span></div><h3>{s.heading}</h3>{s.fields ? <dl>{s.fields.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl> : <blockquote>«{s.quote}»</blockquote>}<div className="specimen-result"><span aria-hidden="true">✓</span>{s.result}</div></div><div className="flow-track" aria-hidden="true">{steps.map((_,i)=><i key={i} className={i===curr?"current":""}/>)}</div></div></div>;
}
