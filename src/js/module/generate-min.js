export function generateSerie(t=4,e=3,o=""){const r="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",n=[];for(let o=0;o<e;o++){let e="";for(let o=0;o<t;o++)e+=r.charAt(Math.floor(Math.random()*r.length));n.push(e)}const a=n.join("-");return o?`${o}:${a}`:a}