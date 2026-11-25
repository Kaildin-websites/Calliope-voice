import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {renderToString} from 'react-dom/server';
import {createElement} from 'react';

const hosted='https://calliope-voice-studio.deftflounder4.chatgpt.site';
const pages={
  name:'github-pages',
  setup(builder){
    builder.onLoad({filter:/[/\\]app[/\\](page|Hero|Flow|Trial)\.tsx$/},async({path})=>{
      if(path.endsWith('Trial.tsx'))return {loader:'tsx',contents:`export default function Trial(){return <div className="lead-form" id="crm"><h3>Richiedi la prova</h3><p>Il modulo si apre sul sito privato di Calliope Voice. Per accedere serve l’account abilitato.</p><a className="btn form-submit" href="${hosted}/#prova">Apri il modulo</a></div>}`};
      const contents=(await readFile(path,'utf8')).replaceAll('"/assets/','"./public/assets/').replaceAll('"/richieste"',JSON.stringify(hosted+'/richieste'));
      return {contents,loader:'tsx'};
    });
  }
};
const settings={bundle:true,minify:true,jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},plugins:[pages],logLevel:'warning'};
await build({...settings,stdin:{contents:'import {hydrateRoot} from "react-dom/client";import Page from "./app/page";hydrateRoot(document.getElementById("app"),<Page/>);',loader:'tsx',resolveDir:process.cwd()},outfile:'pages.js'});
const module=await build({...settings,entryPoints:['app/page.tsx'],platform:'node',format:'cjs',external:['react','react/jsx-runtime','react-dom'],write:false});
const exportsObject={exports:{}};
new Function('require','module','exports',module.outputFiles[0].text)(createRequire(resolve('package.json')),exportsObject,exportsObject.exports);
const body=renderToString(createElement(exportsObject.exports.default));
const css=(await readFile('app/globals.css','utf8')).replaceAll("'/assets/","'./public/assets/");
await writeFile('index.html',`<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Calliope Voice · L’assistente vocale per chi vende impianti</title><link rel="icon" href="./public/assets/calliope-muse.webp"><style>${css}</style></head><body><div id="app">${body}</div><script defer src="./pages.js"></script></body></html>`);
