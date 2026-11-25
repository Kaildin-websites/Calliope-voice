"use client";
import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { sectors, volumes, agents } from "../lib/trial";

export default function Trial() {
  const form = useRef<HTMLFormElement>(null);
  const requestId = useRef("");
  const [service, setService] = useState("");
  const [state, setState] = useState<"ready"|"busy"|"done"|"error">("ready");
  const [error, setError] = useState("");
  useEffect(()=>{
    function choose(e: MouseEvent){const link=(e.target as Element).closest<HTMLAnchorElement>("a[data-agent]");if(link&&agents.some(n=>n===link.dataset.agent))setService(link.dataset.agent!);}
    document.addEventListener("click", choose); return ()=>document.removeEventListener("click",choose);
  },[]);
  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault(); if(state==="busy"||!form.current)return;
    const values=Object.fromEntries(new FormData(form.current));
    if(!requestId.current)requestId.current=crypto.randomUUID();
    setState("busy");
    try {
      const res=await fetch("/api/prova",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...values,id:requestId.current,agent:service||undefined})});
      const data=await res.json() as {saved?:boolean;error?:string};if(!res.ok||!data.saved)throw new Error(data.error||"Invio non riuscito. Riprova tra poco.");
      setState("done");
    }catch(err){setError(err instanceof Error?err.message:"Errore di connessione. Riprova.");setState("error");}
  }
  if(state==="done")return <div className="success" role="status"><Check size={34} strokeWidth={1.4}/><h3>Richiesta ricevuta.</h3><p>Ti ricontatteremo ai recapiti che hai indicato per organizzare le cinque chiamate di prova.</p><a className="text-link" href="#home">Torna all’inizio</a></div>;
  return <form ref={form} onSubmit={submit} className="lead-form">
    {service&&<div className="chosen"><span>Calliope {service}</span><button type="button" aria-label="Rimuovi agente selezionato" onClick={()=>setService("")}><X size={15}/></button></div>}
    <div className="fields">{([["Nome","name","text","name"],["Azienda","business","text","organization"],["Telefono","phone","tel","tel"],["Email","email","email","email"]] as const).map(([label,key,type,auto])=><label key={key}>{label}<input type={type} name={key} autoComplete={auto} required maxLength={key==="phone"?32:key==="email"?254:100} placeholder={label==="Nome"?"Il tuo nome":label==="Azienda"?"Nome azienda":label==="Telefono"?"+39":"nome@azienda.it"}/></label>)}
    <label>Settore<select name="sector" defaultValue="" required><option value="" disabled>Seleziona settore</option>{sectors.map(s=><option key={s}>{s}</option>)}</select></label>
    <label>Lead ricevuti al mese<select name="monthlyLeads" required defaultValue=""><option value="" disabled>Seleziona fascia</option>{volumes.map(s=><option key={s}>{s}</option>)}</select></label>
    <label className="whole">Gestionale o CRM <small>(facoltativo)</small><input type="text" id="crm" name="crm" maxLength={160} placeholder="Il nome del tuo strumento"/></label></div>
    {state==="error"&&<p className="error" role="alert">{error}</p>}
    <button className="btn form-submit" type="submit" disabled={state==="busy"}>{state==="busy"?"Invio in corso…":"Richiedi la prova"}</button><small className="form-note">Ti ricontattiamo per organizzare la prova. Nessun impegno.</small>
  </form>;
}
