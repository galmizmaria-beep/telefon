(function(root){'use strict';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const cache=new Map();
function render(text){text=String(text??'');if(!root.katex)return escape(text);if(cache.has(text))return cache.get(text);const pattern=/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;let result='',last=0,m;while((m=pattern.exec(text))){result+=escape(text.slice(last,m.index));const formula=m[1]??m[2]??m[3]??m[4];try{result+=root.katex.renderToString(formula,{displayMode:!!(m[1]||m[4]),output:'mathml',throwOnError:true,trust:false,strict:'ignore',maxExpand:500,maxSize:20});}catch{result+=`<span class="pg-math-error" title="LaTeX">${escape(m[0])}</span>`;}last=pattern.lastIndex;}result+=escape(text.slice(last));if(cache.size>500)cache.clear();cache.set(text,result);return result;}
root.PhoneMath={render};
})(globalThis);
