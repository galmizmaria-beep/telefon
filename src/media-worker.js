import gifsicle from '../vendor/gifsicle/gifsicle.min.js';
// The upstream type helper references DOM Element; workers intentionally have no DOM.
gifsicle.tool.testType=value=>Object.prototype.toString.call(value).slice(8,-1).toLowerCase();
self.onunhandledrejection=e=>{e.preventDefault();self.postMessage({error:String(e.reason?.message||e.reason)});};
self.onmessage=async({data})=>{try{const {buffer,type,max}=data;let result=new Blob([buffer],{type});if(type==='image/gif'){
 const output=await gifsicle.run({input:[{file:buffer,name:'input.gif'}],command:[`-O1 --lossy=30 --resize-fit ${max}x${max} input.gif -o /out/optimized.gif`]});
 if(!output?.[0])throw Error('Не удалось сжать GIF.');if(output[0].size<result.size)result=output[0];
}else if(type.startsWith('image/')){
 const image=await createImageBitmap(result);const ratio=Math.min(1,max/Math.max(image.width,image.height));const canvas=new OffscreenCanvas(Math.max(1,Math.round(image.width*ratio)),Math.max(1,Math.round(image.height*ratio)));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);image.close();const output=await canvas.convertToBlob({type:'image/webp',quality:.84});if(output.size<result.size)result=output;
}const out=await result.arrayBuffer();self.postMessage({buffer:out,type:result.type},[out]);}catch(e){self.postMessage({error:String(e?.message||e)});}};
