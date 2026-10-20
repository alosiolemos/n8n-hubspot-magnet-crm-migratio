// Execute: node tests/validar-codigo.cjs. Sem rede, APIs ou instância n8n.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..');
const inventory=JSON.parse(fs.readFileSync(path.join(__dirname,'inventario-codigo.json'),'utf8'));
const results=[];
function test(name,fn){fn();results.push({teste:name,resultado:'passou'});}
function execute(entry,args={}){const body=fs.readFileSync(path.join(base,entry.path),'utf8');return new Function('$input','$','$items','$thisRunIndex','items','$item',body)(args.input||{all:()=>[]},args.node||(()=>{throw Error('Nó não configurado no mock');}),args.history||(()=>{throw Error('fim');}),args.runIndex||0,args.items||[{json:{after:'cursor-demo'}}],args.item||(()=>({$node:{'Paginação HubSpot':{json:{paging:{next:{after:'cursor-next'}}}}}})));}
const records=[
 {id:'conta-a',updatedAt:'2026-01-01T00:00:00Z',properties:{grupo_economico:'GRUPO DEMO',valor:'100,50',cidade:'Cidade Demo',estado__uf_:'SP',conta_name:'Conta A'}},
 {id:'conta-b',updatedAt:'2026-01-02T00:00:00Z',properties:{grupo_economico:'GRUPO DEMO',valor:'250',cidade:'',estado__uf_:'SP',conta_name:'Conta B'}},
 {id:'conta-c',updatedAt:'2026-01-03T00:00:00Z',properties:{grupo_economico:'OUTRO GRUPO',valor:'10',conta_name:'Conta C'}}
];
for(const variant of inventory){
 const get=name=>variant.codes.find(c=>c.name===name);
 test(variant.variant+': sintaxe dos dez corpos JavaScript',()=>{for(const e of variant.codes)new Function('$input','$','$items','$thisRunIndex','items','$item',fs.readFileSync(path.join(base,e.path),'utf8'));});
 test(variant.variant+': cursor inicial e continuação',()=>{
   assert.equal(execute(get('paginacao3')).after,0);
   assert.equal(execute(get('paginacao3'),{runIndex:1}).after,'cursor-demo');
   assert.equal(execute(get('prox_pag3')).after,'cursor-next');
 });
 test(variant.variant+': agregação das páginas de histórico simuladas',()=>{
   const output=execute(get('All'),{history:(name,index,run)=>{if(run>1)throw Error('fim simulado');return [{json:{results:[{id:'pagina-'+run}]}}];}});
   assert.equal(output.length,2);assert.equal(output[1].id,'pagina-1');
 });
 test(variant.variant+': agrupamento, total e referência por maior valor',()=>{
   const output=execute(get('Extração do Grupo Econômico1'),{input:{all:()=>[{json:{results:structuredClone(records)}}]}});
   const group=output.find(x=>x.json.grupo_economico==='GRUPO DEMO').json;
   assert.equal(output.length,2);assert.equal(group.valor_total,350.5);assert.equal(group.valor_referencia,250);assert.equal(group.qtd_contas,2);assert.equal(group.id,'conta-b');assert.equal(group.cidade_uf,'Cidade Demo - SP');
 });
 test(variant.variant+': entrada vazia sinaliza ausência',()=>{const output=execute(get('Extração do Grupo Econômico1'));assert.equal(output[0].json.mensagem,'Nenhum item encontrado');});
 test(variant.variant+': agrupamento alternativo também soma os valores',()=>{
   const output=execute(get('Obter Grupo Economico'),{input:{all:()=>[{json:{results:structuredClone(records)}}]}});
   assert.equal(output.find(x=>x.json.grupo_economico==='GRUPO DEMO').json.valor_total,350.5);
 });
 test(variant.variant+': seleção de contas respeita o grupo',()=>{
   const node=name=>({first:()=>({json:{grupo_economico:'GRUPO DEMO'}}),all:()=>name==='IF6'?[{json:{results:records}}]:records.map(r=>({json:r}))});
   const output=execute(get('Obetem negócios vinculados'),{node});assert.equal(output.length,2);
 });
 for(const [name,type,limit]of [['Separar Contatos','contacts',variant.variant==='ativos'?5:3],['Separar Notes1','notes',variant.variant==='ativos'?10:3],['Separar E-mail','emails',variant.variant==='ativos'?10:3],['Separar Meet','meetings',5]]){
   test(variant.variant+': '+name+' aplica recorte e sentinela',()=>{
     assert.equal(execute(get(name))[0].json.id,'SemAssociacao');
     const associations=Array.from({length:12},(_,i)=>({id:'associacao-'+i}));
     const output=execute(get(name),{input:{all:()=>[{json:{associations:{[type]:{results:associations}}}}]}});
     assert.equal(output.length,limit);assert.equal(output[0].json.id,'associacao-'+(12-limit));assert.equal(output.at(-1).json.id,'associacao-11');
   });
 }
 test(variant.variant+': estrutura pública e conexões válidas',()=>{
   const file=path.join(base,'workflows','migracao-'+variant.variant+'.template.json');const text=fs.readFileSync(file,'utf8'),w=JSON.parse(text);
   assert.equal(w.nodes.length,variant.total);assert.equal(w.active,false);assert.deepEqual(w.pinData,{});
   assert.equal(w.nodes.filter(n=>n.credentials).length,0);assert.equal(w.nodes.filter(n=>n.disabled).length,variant.disabled);
   const names=new Set(w.nodes.map(n=>n.name));for(const [name,groups]of Object.entries(w.connections)){assert.ok(names.has(name));for(const outputs of Object.values(groups))for(const links of outputs)for(const l of links)assert.ok(names.has(l.node),l.node);}
   for(const n of w.nodes.filter(n=>n.type.endsWith('.httpRequest')||n.type.endsWith('.hubspot')||n.type.includes('langchain')||n.type.endsWith('.scheduleTrigger')))assert.equal(n.disabled,true,n.name);
   assert.equal(/pat-[A-Za-z0-9_-]{10,}|AIza[A-Za-z0-9_-]{20,}|eyJ[A-Za-z0-9_-]{15,}\./.test(text),false);
 });
}
const report={escopo:'JavaScript e estrutura dos templates, sem APIs, n8n ou CRMs reais',total:results.length,testes:results};
fs.writeFileSync(path.join(__dirname,'resultados-testes.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
