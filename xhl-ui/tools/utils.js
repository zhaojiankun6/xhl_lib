function r(c,n="children",t=1/0){let a=[];return t<0||(a=a.concat(c),c.forEach((c=>{Array.isArray(c[n])&&(a=a.concat(r(c[n],n,t-1)))}))),a}export{r as flattenObjectArray};
