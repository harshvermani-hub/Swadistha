/* Swadistha Bill Style Customization */
(function(){
  const KEY='swadisthaBillStyle';
  const defaults={
    logo:'assets/swadistha-logo-white.png',logoSize:'medium',logoAlign:'center',
    name:'Swadistha',address:'',phone:'',gstin:'',tagline:'',
    showName:true,showAddress:true,showPhone:true,showGstin:true,showTagline:true,
    showCustomer:true,showOrderType:true,showDiscount:true,showGst:true,showSubtotal:true,
    footer:'Thank You! Visit Again',footer2:'',
    nameSize:'large',itemSize:'normal',totalSize:'large'
  };
  function load(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return Object.assign({},defaults)}}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));}
  function esc(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function logoData(src){return src||defaults.logo;}
  window.swadisthaBillStyle={get:load,set:function(s){save(Object.assign({},load(),s));},reset:function(){localStorage.removeItem(KEY);render();}};
  function render(){
    const s=load(), box=document.getElementById('billStyleBox'); if(!box)return;
    box.innerHTML=`<div class="panel"><div class="modal-head"><div><b>Bill Style</b><div class="status">Customize the printed bill without changing billing or reprint functions.</div></div><button class="close" onclick="swadisthaBillStyle.reset()">Reset</button></div>
    <div class="formgrid" style="margin-top:10px">
      <div class="field"><label>Restaurant Name</label><input id="bsName" value="${esc(s.name)}"></div>
      <div class="field"><label>Address</label><input id="bsAddress" value="${esc(s.address)}"></div>
      <div class="field"><label>Phone</label><input id="bsPhone" value="${esc(s.phone)}"></div>
      <div class="field"><label>GSTIN</label><input id="bsGstin" value="${esc(s.gstin)}"></div>
      <div class="field"><label>Tagline</label><input id="bsTagline" value="${esc(s.tagline)}"></div>
      <div class="field"><label>Logo</label><input id="bsLogo" type="file" accept="image/*"></div>
      <div class="field"><label>Logo Size</label><select id="bsLogoSize"><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></div>
      <div class="field"><label>Logo Alignment</label><select id="bsLogoAlign"><option value="left">Left</option><option value="center">Centre</option><option value="right">Right</option></select></div>
      <div class="field"><label>Footer Line 1</label><input id="bsFooter" value="${esc(s.footer)}"></div>
      <div class="field"><label>Footer Line 2</label><input id="bsFooter2" value="${esc(s.footer2)}"></div>
    </div>
    <div style="margin-top:10px"><b>Show / Hide</b><div class="tools" style="margin-top:7px">
      ${[['bsShowName','Restaurant name','showName'],['bsShowAddress','Address','showAddress'],['bsShowPhone','Phone','showPhone'],['bsShowGstin','GSTIN','showGstin'],['bsShowTagline','Tagline','showTagline'],['bsShowCustomer','Customer details','showCustomer'],['bsShowOrder','Order type','showOrderType'],['bsShowSubtotal','Subtotal','showSubtotal'],['bsShowDiscount','Discount','showDiscount'],['bsShowGst','GST','showGst']].map(x=>`<label style="padding:7px 9px;background:#f0f1f3;border-radius:7px;font-size:10px"><input type="checkbox" id="${x[0]}"> ${x[1]}</label>`).join('')}
    </div></div>
    <div style="margin-top:10px"><b>Font Sizes</b><div class="formgrid" style="margin-top:7px"><div class="field"><label>Restaurant Name</label><select id="bsNameSize"><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></div><div class="field"><label>Items</label><select id="bsItemSize"><option value="small">Small</option><option value="normal">Normal</option><option value="large">Large</option></select></div><div class="field"><label>Total</label><select id="bsTotalSize"><option value="medium">Medium</option><option value="large">Large</option><option value="xlarge">Extra Large</option></select></div></div></div>
    <button class="btn orange" style="margin-top:12px" onclick="saveBillStyle()">Save Bill Style</button>
    <div id="bsPreview" style="margin-top:12px;border:1px dashed #bbb;border-radius:8px;padding:12px;background:#fff;font-family:Arial,sans-serif"></div></div>`;
    ['LogoSize','LogoAlign','NameSize','ItemSize','TotalSize'].forEach(k=>{const id='bs'+k;document.getElementById(id).value=s[k.charAt(0).toLowerCase()+k.slice(1)]||s[k.toLowerCase()]||defaults[k.toLowerCase()];});
    const map={bsShowName:'showName',bsShowAddress:'showAddress',bsShowPhone:'showPhone',bsShowGstin:'showGstin',bsShowTagline:'showTagline',bsShowCustomer:'showCustomer',bsShowOrder:'showOrderType',bsShowSubtotal:'showSubtotal',bsShowDiscount:'showDiscount',bsShowGst:'showGst'};
    Object.keys(map).forEach(id=>document.getElementById(id).checked=!!s[map[id]]);
    document.getElementById('bsPreview').innerHTML=preview(s);
  }
  function current(){const s=load();['Name','Address','Phone','Gstin','Tagline','Footer','Footer2'].forEach(k=>s[k.charAt(0).toLowerCase()+k.slice(1)]=document.getElementById('bs'+k).value);s.logoSize=document.getElementById('bsLogoSize').value;s.logoAlign=document.getElementById('bsLogoAlign').value;s.nameSize=document.getElementById('bsNameSize').value;s.itemSize=document.getElementById('bsItemSize').value;s.totalSize=document.getElementById('bsTotalSize').value;const map={bsShowName:'showName',bsShowAddress:'showAddress',bsShowPhone:'showPhone',bsShowGstin:'showGstin',bsShowTagline:'showTagline',bsShowCustomer:'showCustomer',bsShowOrder:'showOrderType',bsShowSubtotal:'showSubtotal',bsShowDiscount:'showDiscount',bsShowGst:'showGst'};Object.keys(map).forEach(id=>s[map[id]]=document.getElementById(id).checked);return s;}
  window.saveBillStyle=function(){const s=current(),file=document.getElementById('bsLogo').files[0];const done=()=>{save(s);document.getElementById('bsPreview').innerHTML=preview(s);if(typeof toast==='function')toast('Bill style saved');};if(file){const r=new FileReader();r.onload=()=>{s.logo=r.result;done();};r.readAsDataURL(file);}else done();};
  function preview(s){const ls={small:45,medium:70,large:95}[s.logoSize]||70;const ns={small:14,medium:18,large:23}[s.nameSize]||18;const its={small:9,normal:11,large:13}[s.itemSize]||11;const ts={medium:15,large:19,xlarge:23}[s.totalSize]||19;return `<div style="text-align:${s.logoAlign}"><img src="${esc(logoData(s.logo))}" style="max-width:${ls}px;max-height:${ls}px;object-fit:contain"><div style="font-weight:800;font-size:${ns}px">${s.showName?esc(s.name):''}</div>${s.showTagline&&s.tagline?`<div style="font-size:9px">${esc(s.tagline)}</div>`:''}${s.showAddress&&s.address?`<div style="font-size:9px">${esc(s.address)}</div>`:''}${s.showPhone&&s.phone?`<div style="font-size:9px">${esc(s.phone)}</div>`:''}${s.showGstin&&s.gstin?`<div style="font-size:9px">GSTIN: ${esc(s.gstin)}</div>`:''}</div><hr><div style="font-size:${its}px"><div>1 × Sample Item <span style="float:right">₹100</span></div><div>2 × Sample Item <span style="float:right">₹200</span></div></div><hr><div style="font-size:${ts}px;font-weight:800;text-align:right">TOTAL ₹300</div><hr><div style="text-align:center;font-size:9px">${esc(s.footer)}<br>${esc(s.footer2)}</div>`;}
  const oldShow=window.showView; window.showView=function(v){if(typeof oldShow==='function')oldShow(v);if(v==='settings')setTimeout(render,0);};
  document.addEventListener('DOMContentLoaded',()=>{if(document.getElementById('settings')){const sec=document.getElementById('settings');sec.innerHTML='<h1>Bill Style</h1><div class="sub">Customize your printed bill.</div><div id="billStyleBox"></div>';render();}});
})();
