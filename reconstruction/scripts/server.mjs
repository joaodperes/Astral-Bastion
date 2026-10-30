import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json'};
const port=Number(process.env.PORT)||8123;
createServer(async(req,res)=>{
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
 const file=path.resolve(root,'.'+pathname,(pathname==='/'?'index.html':''));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 try{const contents=await readFile(file);res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream','x-content-type-options':'nosniff'}).end(contents)}
 catch{res.writeHead(404,{'content-type':'text/plain'}).end('Not found')}
}).listen(port,()=>console.log(`Astral Bastion preview at http://localhost:${port}`));