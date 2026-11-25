import { AudioLines, BookOpen, CalendarCheck, CalendarDays, Check, ClipboardList, FileText, Headphones, MapPin, Phone, PhoneForwarded, ShieldCheck, SlidersHorizontal, UserRoundCheck, BellRing } from "lucide-react";
import Hero from "./Hero";
import Flow from "./Flow";
import Trial from "./Trial";

const asset = "/assets/";
const services = [
  { name: "Risposta", image: "risposta", lead: "Risponde quando tu non puoi.", copy: "Riceve le chiamate mentre sei in cantiere o fuori orario, capisce cosa serve, fissa il sopralluogo e ti manda il riepilogo. Se serve una persona, ti passa la chiamata.", alt: "Una cliente al telefono e Calliope che risponde con le cuffie." },
  { name: "Lead", image: "lead", lead: "Richiama il lead entro un minuto.", copy: "Il cliente compila il form, Calliope lo chiama subito, verifica proprietà, tetto e consumi e mette il sopralluogo in agenda.", alt: "Una richiesta inviata dal telefono arriva a Calliope." },
  { name: "Promemoria", image: "promemoria", lead: "Meno sopralluoghi saltati.", copy: "Conferma l’appuntamento, lo ricorda il giorno prima e, se il cliente non può, lo sposta.", alt: "Una cliente conferma l’appuntamento e un operatore lo segna sul calendario." }
];
const reasons = [
  [SlidersHorizontal,"Configurato da noi.","Non devi scrivere prompt né imparare strumenti: ci racconti come lavori e lo impostiamo noi."],
  [MapPin,"Un solo installatore per provincia.","I lead della tua zona non finiscono ai tuoi concorrenti."],
  [Headphones,"Chiamate che puoi ascoltare.","Ogni conversazione ha trascrizione ed esito: controlli tu cosa dice Calliope."],
  [Check,"Prima provi, poi decidi.","5 chiamate vere, nessun vincolo."]
] as const;
const features = [
  [AudioLines,"Risponde e richiama in italiano, con una voce naturale."],
  [ClipboardList,"Qualifica il lead con le domande che usi tu."],
  [CalendarDays,"Fissa il sopralluogo direttamente nel tuo calendario."],
  [PhoneForwarded,"Trasferisce la chiamata a una persona quando serve."],
  [FileText,"Ti manda trascrizione ed esito di ogni chiamata."],
  [BellRing,"Conferma e ricorda l’appuntamento al cliente."]
] as const;
const faqs = [
  ["Sembrerà un robot?", "Parla in italiano e si presenta sempre come assistente virtuale. Nel player della home trovi un esempio di conversazione. Con le cinque chiamate di prova puoi sentire come risponde ai tuoi clienti."],
  ["Cosa succede se non sa rispondere?", "Dice al cliente che un collega lo richiamerà oppure ti trasferisce la chiamata, e ti manda il riepilogo."],
  ["Posso tenere il mio numero?", "Sì. Con la deviazione di chiamata, il cliente continua a comporre il tuo numero aziendale. In fase di configurazione decidiamo quando inoltrare le chiamate a Calliope."],
  ["Si collega al mio CRM e al mio calendario?", "Collega il calendario e i moduli del sito. Per il CRM, dicci quale usi e lo verifichiamo insieme."],
  ["Quanto ci vuole per partire?", "Quando ci indichi il calendario, i moduli e il gestionale che usi, concordiamo con te la data della prova."],
  ["Come vengono trattati i dati?", "Per ogni chiamata sono disponibili registrazione e trascrizione. Puoi richiedere l’accordo sul trattamento dei dati, con le modalità di accesso e conservazione."],
  ["Posso ascoltare le chiamate?", "Sì, ogni chiamata ha registrazione e trascrizione."],
  ["Cosa succede dopo le 5 chiamate?", "Ricevi il riepilogo. Se vuoi continuare, scegli l’agente che ti serve. Se no, finisce lì."]
];
function Wordmark(){return <a className="wordmark" href="#home"><img src={asset+"calliope-muse.webp"} alt=""/>Calliope-voice</a>;}
function Solar(){
 return <div className="solar-drawing" aria-hidden="true"><svg viewBox="0 0 500 310" fill="none" preserveAspectRatio="xMidYMid meet">
   <defs><pattern id="cells" width="39" height="43" patternUnits="userSpaceOnUse"><rect x="1.3" y="1.4" width="36.4" height="40.2" rx="2" fill="#446077" stroke="#aec2ca" strokeWidth=".95"/>{[6,12,18,24,30,36].map(y=><path key={y} d={'M3 '+y+'h33'} stroke="#a7b5ad" strokeWidth=".5"/>)}</pattern></defs>
   <g stroke="#d8bea0"><circle cx="363" cy="62" r="29"/><circle cx="363" cy="62" r="39" strokeDasharray="1 5"/>{Array.from({length:12},(_,i)=><path key={i} d="M363 13v8" transform={'rotate('+i*30+' 363 62)'}/>)}</g>
   <g stroke="#95a7b5" strokeWidth="1"><path d="m30 262 258 43 183-94M71 262l6-32m147 64 8-43m147-64v58l-157 52M77 240l146 55M85 224l136 60M367 220l-119 62"/><path d="m55 241 219 38 154-80-218-38z" opacity=".45"/></g>
   <g transform="matrix(.91 .159 -.382 .606 129 81)" stroke="#dce1db"><rect x="-5" y="-5" width="322" height="225" fill="#213d54" strokeWidth="3"/><rect width="312" height="215" fill="url(#cells)" strokeWidth="2"/><path d="M156 0v215" strokeWidth="4"/></g>
   <g stroke="#b8c9d0" opacity=".5" strokeWidth=".8" strokeDasharray="3 4"><path d="m122 68 306 53m-308-44-57 91M36 222l-20 29m281 31 13-26"/></g></svg></div>;
}
export default function Page(){return <>
  <a href="#agenti" className="skip">Vai ai servizi</a>
  <Hero/>
  <main>
    <section className="problem"><div className="wrap problem-inner"><h2>Ogni lead che non richiami subito è un <em>sopralluogo</em> che va a qualcun altro.</h2><p>Il cliente compila il form mentre tu sei su un tetto o in riunione. Due ore dopo ha già parlato con un altro installatore. <strong>Non perdi un contatto: perdi un impianto.</strong></p></div></section>

    <section id="agenti" className="services section"><div className="wrap"><h2>Scegli cosa deve fare<br/><em>Calliope</em> per te.</h2>
    <div className="agent-grid">{services.map(s=><article className="agent" key={s.name}><div className="agent-art"><img src={asset+s.image+".webp"} alt={s.alt} loading="lazy" width="920" height="1150"/></div><div className="agent-info"><h3>Calliope <em>{s.name}</em></h3><p><strong>{s.lead}</strong> {s.copy}</p><a href="#prova" data-agent={s.name} className="text-link">Prova con 5 chiamate</a></div></article>)}</div></div></section>

    <aside className="trial-ribbon"><div className="wrap ribbon-inner"><img src={asset+"calliope-muse.webp"} alt=""/><div><h2>Prova Calliope su 5 chiamate vere.</h2><p>Le facciamo partire noi, sui tuoi contatti reali. Per ogni chiamata ricevi trascrizione, esito ed eventuale sopralluogo fissato. Nessun vincolo.</p></div><a className="btn" href="#prova">Richiedi la prova</a></div></aside>

    <section id="percorso" className="section flow"><div className="wrap"><h2>Dal lead al sopralluogo,<br/><em>senza che tu muova un dito.</em></h2><Flow/><p className="flow-foot">Tu ci dai accesso a form e calendario. Al resto pensiamo noi.</p></div></section>

    <section id="settori" className="sector"><div className="wrap sector-inner"><div><span className="label">Per chi lavora Calliope</span><h2>Fotovoltaico<span>.</span></h2><p>Ogni richiesta di preventivo richiamata subito, qualificata e trasformata in sopralluogo.</p></div><Solar/></div></section>

    <section className="section why"><div className="wrap"><div className="section-title center"><h2>Non un centralino generico.<br/><em>Un assistente fatto per chi vende impianti.</em></h2></div><div className="reason-grid">{reasons.map(([Icon,title,txt])=><article key={title}><Icon size={32} strokeWidth={1.3}/><h3>{title}</h3><p>{txt}</p></article>)}</div></div></section>

    <section className="section features"><div className="wrap features-inner"><div className="feature-cover"><img src={asset+"calliope-hero.webp"} alt="" loading="lazy"/><h2>Cosa fa<br/><em>Calliope</em><br/>al posto tuo.</h2></div><ul className="feature-list">{features.map(([Icon,txt])=><li key={txt}><Icon size={23} strokeWidth={1.4}/><span>{txt}</span></li>)}</ul></div></section>

    <section id="trasparenza" className="section transparency"><div className="wrap"><div className="section-title"><h2>Trasparente con il cliente,<br/><em>in regola con la legge.</em></h2></div><div className="trust-grid">
    <article><UserRoundCheck/><h3>Si presenta sempre come assistente virtuale.</h3><p>Il cliente sa fin dall’inizio con chi parla.</p></article><article><Phone/><h3>Chiama solo chi ha chiesto di essere ricontattato.</h3><p>Nessuna lista fredda.</p></article><article><ShieldCheck/><h3>Dati trattati secondo GDPR.</h3><p>Accordo sul trattamento dei dati disponibile su richiesta.</p></article><article><BookOpen/><h3>Registrazioni e trascrizioni sotto il tuo controllo.</h3><p>Puoi riascoltare la chiamata e consultarne l’esito.</p></article></div></div></section>

    <section id="integrazioni" className="integrations section"><div className="wrap integrate-inner"><div className="integration-drawing" aria-hidden="true"><div className="conduits"><i/><i/><i/></div><img src={asset+"calliope-muse.webp"} alt="" loading="lazy"/><div className="integration-icons"><span><CalendarCheck/></span><span><FileText/></span><span><Phone/></span></div></div><div className="integration-text"><h2>Si collega a quello che <em>usi già.</em></h2><p>Il tuo calendario, i moduli del sito e il numero di telefono aziendale tramite deviazione.</p><p>Usi un altro strumento? <a className="text-link" href="#crm">Dicci quale.</a></p></div></div></section>

    <section id="prezzi" className="section pricing"><div className="wrap price-inner"><h2>Parti con 5 chiamate.<br/><em>Poi decidi.</em></h2><div className="price-card"><div className="price-main"><div className="label">Prova gratuita</div><div className="price-amount">0 <span>€</span></div><p>5 chiamate vere sui tuoi contatti.<br/>Riepilogo e trascrizione di ogni chiamata.</p><a className="btn" href="#prova">Richiedi la prova</a></div><div className="price-extra"><h3>Dopo la prova</h3>{services.map(s=><span key={s.name}>Calliope {s.name}</span>)}<small>Scegli l’agente che ti serve e richiedi la proposta per la tua azienda.</small></div></div></div></section>

    <section id="faq" className="section faq"><div className="wrap faq-inner"><h2>Domande <br/><em>frequenti.</em></h2><div className="faq-list">{faqs.map(([q,a])=><details key={q} name="domande"><summary>{q}<span aria-hidden="true"/></summary><p>{a}</p></details>)}</div></div></section>

    <section id="prova" className="section contact"><div className="wrap contact-inner"><div className="contact-title"><img src={asset+"meandro.webp"} alt=""/><h2>Prova Calliope <br/>su <em>5 chiamate</em> <br/>vere.</h2><p>Sui tuoi contatti reali.<br/>Per ogni chiamata ricevi trascrizione ed esito.</p></div><Trial/></div></section>
  </main>
  <footer><div className="wrap"><div className="footer-main"><Wordmark/><nav aria-label="Link a fondo pagina"><a href="#agenti">Agenti</a><a href="#percorso">Come funziona</a><a href="#integrazioni">Integrazioni</a><a href="#faq">FAQ</a><a href="#prova">Contatti</a></nav></div><div className="footer-bottom"><span>Calliope è un assistente virtuale.</span><a href="#trasparenza">Privacy e dati</a></div></div></footer>
</>;}
