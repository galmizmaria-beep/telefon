import gifsicle from '../vendor/gifsicle/gifsicle.min.js';
gifsicle.tool.testType=value=>Object.prototype.toString.call(value).slice(8,-1).toLowerCase();
self.onunhandledrejection=e=>{e.preventDefault();self.postMessage({error:String(e.reason?.message||e.reason)});};
self.onmessage=async({data})=>{try{const {buffer,type,max,targetBytes=80*1024}=data;let result=new Blob([buffer],{type});if(type==='image/gif'){
 // Keep every frame and its timing. Each pass starts with the original GIF.
 for(const [scale,lossy,colors] of [[1,40,192],[.8,65,128],[.6,85,96]]){const side=Math.max(96,Math.round(max*scale));const output=await gifsicle.run({input:[{file:buffer,name:'input.gif'}],command:[`-O2 --lossy=${lossy} --colors ${colors} --resize-fit ${side}x${side} input.gif -o /out/optimized.gif`]});if(!output?.[0])throw Error('Не удалось сжать GIF.');if(output[0].size<result.size)result=new Blob([output[0]],{type:'image/gif'});if(result.size<=targetBytes)break;}
}else if(type.startsWith('image/')){
 const image=await createImageBitmap(result);try{for(const [scale,quality] of [[1,.8],[1,.65],[.8,.6],[.6,.55]]){const ratio=Math.min(1,max*scale/Math.max(image.width,image.height));const canvas=new OffscreenCanvas(Math.max(1,Math.round(image.width*ratio)),Math.max(1,Math.round(image.height*ratio)));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);const output=await canvas.convertToBlob({type:'image/webp',quality});if(output.size<result.size)result=output;if(result.size<=targetBytes)break;}}finally{image.close();}
}const out=await result.arrayBuffer();self.postMessage({buffer:out,type:result.type},[out]);}catch(e){self.postMessage({error:String(e?.message||e)});}};
