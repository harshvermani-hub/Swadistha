/* Swadistha Bill Style Customization */
(function(){
  'use strict';
  const KEY='swadisthaBillStyle';
  const defaults={
    logo:'assets/swadistha-logo-white.png',
    logoSize:'medium',logoAlign:'center',
    name:'Swadistha',address:'',phone:'',gstin:'',tagline:'',
    showName:true,showAddress:true,showPhone:true,showGstin:true,showTagline:true,
    showCustomer:true,showOrderType:true,showSubtotal:true,showDiscount:true,showGst:true,
    footer:'Thank You! Visit Again',footer2:'',
    nameSize:'large',itemSize:'normal',totalSize:'large'
  };
  function load(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return Object.assign({},defaults);}}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function logoCss(s){return s==='small'?'70px':s==='large'?'115px':'90px';}
  function sizeCss(s){return s==='small'?'11px':s==='large'?'16px':'13px';}
  function totalCss(s){return s==='medium'?'15px':s==='xlarge'?'21px':'18px';}
  function buildHeader(s){
    let h='<div class="bs-header" style="text-align:'+esc(s.logoAlign)+';font-family:Arial,sans-serif;margin-bottom:8px">';
    if(s.logo) h+='<img class="bs-logo" src="'+esc(s.logo)+'" style="display:block;margin:'+(s.logoAlign==='center'?'0 auto':s.logoAlign==='right'?'0 0 0 auto':'0')+';width:auto;max-width:'+logoCss(s)+';max-height:'+logoCss(s)+';object-fit:contain">';
    if(s.showName&&s.name) h+='<div class="bs-name" style="font-weight:800;font-size:'+sizeCss(s.nameSize)+';margin-top:4px">'+esc(s.name)+'</div>';
    if(s.showTagline&&s.tagline) h+='<div>'+esc(s.tagline)+'</div>';
    if(s.showAddress&&s.address) h+='<div>'+esc(s.address)+'</div>';
    if(s.showPhone&&s.phone) h+='<div>'+esc(s.phone)+'</div>';
    if(s.showGstin&&s.gstin) h+='<div>GSTIN: '+esc(s.gstin)+'</div>';
    return h+'</div><hr class="bs-rule">';
  }
  function buildFooter(s){
    if(!s.footer&&!s.footer2)return '';
    return '<div class="bs-footer" style="text-align:center;font-family:Arial,sans-serif;margin-top:12px;font-size:11px">'+esc(s.footer)+(s.footer2?'<br>'+esc(s.footer2):'')+'</div>';
  }
  function applyStyleToReceipt(html,s){
    if(typeof html!=='string')return html;
    let out=html;
    const css='<style id="swadistha-bill-style-css">.bs-logo{border:0}.bs-rule{border:0;border-top:1px solid #222;margin:7px 0}.bs-footer{line-height:1.45}.bs-items-custom{font-size:'+sizeCss(s.itemSize)+'}.bs-total-custom{font-size:'+totalCss(s.totalSize)+'!important}.bs-hide-subtotal .bs-subtotal-row{display:none!important}.bs-hide-discount .bs-discount-row{display:none!important}.bs-hide-gst .bs-gst-row{display:none!important}.bs-hide-customer .bs-customer-row{display:none!important}.bs-hide-order .bs-order-row{display:none!important}</style>';
    if(/<\/head>/i.test(out))out=out.replace(/<\/head>/i,css+'</head>'); else out=css+out;
    const bodyTag=/<body[^>]*>/i.exec(out);
    if(bodyTag){out=out.replace(bodyTag[0],bodyTag[0]+buildHeader(s));}
    else out=buildHeader(s)+out;
    out=out.replace(/<img([^>]*?)src=["'][^"']*["']([^>]*?)>/i,function(_,a,b){
      if(!s.logo)return '';
      return '<img'+a+'src="'+esc(s.logo)+'"'+b+' class="bs-logo" style="width:auto;max-width:'+logoCss(s)+';max-height:'+logoCss(s)+';object-fit:contain">';
    });
    if(!s.showCustomer)out=out.replace(/(<[^>]*class=["'][^"']*(?:customer|cust)[^"']*["'][^>]*>[\s\S]*?<\/[^>]+>)/ig,'');
    if(!s.showOrderType)out=out.replace(/(<[^>]*class=["'][^"']*order[^"']*["'][^>]*>[\s\S]*?<\/[^>]+>)/ig,'');
    if(!s.showSubtotal)out=out.replace(/(<[^>]*>\s*(?:Subtotal|SUBTOTAL)[\s\S]*?<\/[^>]+>)/ig,'');
    if(!s.showDiscount)out=out.replace(/(<[^>]*>\s*(?:Discount|DISCOUNT)[\s\S]*?<\/[^>]+>)/ig,'');
    if(!s.showGst)out=out.replace(/(<[^>]*>\s*(?:GST|Tax|TAX)[\s\S]*?<\/[^>]+>)/ig,'');
    out=out.replace(/<body([^>]*)>/i,function(m,a){
      let c='';
      if(!s.showCustomer)c+='bs-hide-customer ';
      if(!s.showOrderType)c+='bs-hide-order ';
      if(!s.showSubtotal)c+='bs-hide-subtotal ';
      if(!s.showDiscount)c+='bs-hide-discount ';
      if(!s.showGst)c+='bs-hide-gst ';
      return '<body'+a+' class="'+c.trim()+'">';
    });
    out=out.replace(/<\/body>/i,buildFooter(s)+'</body>');
    return out;
  }
  function hookReceipt(){
    if(window.__swadisthaBillStyleHooked||typeof window.receiptHTML!=='function')return false;
    const original=window.receiptHTML;
    window.receiptHTML=function(bill){return applyStyleToReceipt(original.call(this,bill),load());};
    window.__swadisthaBillStyleHooked=true;
    return true;
  }
  function preview(){
    const s=readForm();
    const p=document.getElementById('bsPreview');
    if(!p)return;
    p.innerHTML='<div style="max-width:330px;margin:auto;padding:14px;border:1px solid #ddd;background:#fff;font-family:Arial,sans-serif;text-align:center">'+buildHeader(s)+'<div style="text-align:left;font-size:'+sizeCss(s.itemSize)+'"><div>1 × Sample Item <span style="float:right">₹100</span></div><div>2 × Sample Item <span style="float:right">₹200</span></div></div><hr><div style="text-align:right;font-size:'+totalCss(s.totalSize)+';font-weight:800">TOTAL ₹300</div>'+buildFooter(s)+'</div>';
  }
  function readForm(){
    const s=load();
    [['Name','name'],['Address','address'],['Phone','phone'],['Gstin','gstin'],['Tagline','tagline'],['Footer','footer'],['Footer2','footer2']].forEach(function(x){const e=document.getElementById('bs'+x[0]);if(e)s[x[1]]=e.value;});
    ['LogoSize','LogoAlign','NameSize','ItemSize','TotalSize'].forEach(function(k){const e=document.getElementById('bs'+k);if(e)s[k.charAt(0).toLowerCase()+k.slice(1)]=e.value;});
    const map={bsShowName:'showName',bsShowAddress:'showAddress',bsShowPhone:'showPhone',bsShowGstin:'showGstin',bsShowTagline:'showTagline',bsShowCustomer:'showCustomer',bsShowOrder:'showOrderType',bsShowSubtotal:'showSubtotal',bsShowDiscount:'showDiscount',bsShowGst:'showGst'};
    Object.keys(map).forEach(function(id){const e=document.getElementById(id);if(e)s[map[id]]=e.checked;});
    return s;
  }
  function render(){
    const box=document.getElementById('billStyleBox');
    if(!box)return;
    const s=load();
    box.innerHTML='<div class="panel"><div class="modal-head"><div><b>Bill Style</b><div class="status">Customize the printed bill. Changes apply to new bills and Reports reprints.</div></div><button class="close" onclick="resetBillStyle()">Reset</button></div><div class="formgrid" style="margin-top:10px"><div class="field"><label>Restaurant Name</label><input id="bsName"></div><div class="field"><label>Address</label><input id="bsAddress"></div><div class="field"><label>Phone</label><input id="bsPhone"></div><div class="field"><label>GSTIN</label><input id="bsGstin"></div><div class="field"><label>Tagline</label><input id="bsTagline"></div><div class="field"><label>Change Logo</label><input id="bsLogo" type="file" accept="image/*"></div><div class="field"><label>Logo Size</label><select id="bsLogoSize"><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></div><div class="field"><label>Logo Alignment</label><select id="bsLogoAlign"><option value="left">Left</option><option value="center">Centre</option><option value="right">Right</option></select></div><div class="field"><label>Footer Line 1</label><input id="bsFooter"></div><div class="field"><label>Footer Line 2</label><input id="bsFooter2"></div></div><div style="margin-top:10px"><b>Show / Hide</b><div class="tools" style="margin-top:7px"><label><input type="checkbox" id="bsShowName"> Restaurant name</label><label><input type="checkbox" id="bsShowAddress"> Address</label><label><input type="checkbox" id="bsShowPhone"> Phone</label><label><input type="checkbox" id="bsShowGstin"> GSTIN</label><label><input type="checkbox" id="bsShowTagline"> Tagline</label><label><input type="checkbox" id="bsShowCustomer"> Customer details</label><label><input type="checkbox" id="bsShowOrder"> Order type</label><label><input type="checkbox" id="bsShowSubtotal"> Subtotal</label><label><input type="checkbox" id="bsShowDiscount"> Discount</label><label><input type="checkbox" id="bsShowGst"> GST</label></div></div><div style="margin-top:10px"><b>Font Sizes</b><div class="formgrid" style="margin-top:7px"><div class="field"><label>Restaurant Name</label><select id="bsNameSize"><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></div><div class="field"><label>Items</label><select id="bsItemSize"><option value="small">Small</option><option value="normal">Normal</option><option value="large">Large</option></select></div><div class="field"><label>Total</label><select id="bsTotalSize"><option value="medium">Medium</option><option value="large">Large</option><option value="xlarge">Extra Large</option></select></div></div></div><div class="tools" style="margin-top:10px"><button class="btn orange" onclick="saveBillStyle()">Save Bill Style</button><button class="btn light" onclick="previewBillStyle()">Preview</button></div><div id="bsPreview" style="margin-top:12px"></div></div>';
    [['Name','name'],['Address','address'],['Phone','phone'],['Gstin','gstin'],['Tagline','tagline'],['Footer','footer'],['Footer2','footer2']].forEach(function(x){document.getElementById('bs'+x[0]).value=s[x[1]]||'';});
    ['LogoSize','LogoAlign','NameSize','ItemSize','TotalSize'].forEach(function(k){document.getElementById('bs'+k).value=s[k.charAt(0).toLowerCase()+k.slice(1)];});
    const map={bsShowName:'showName',bsShowAddress:'showAddress',bsShowPhone:'showPhone',bsShowGstin:'showGstin',bsShowTagline:'showTagline',bsShowCustomer:'showCustomer',bsShowOrder:'showOrderType',bsShowSubtotal:'showSubtotal',bsShowDiscount:'showDiscount',bsShowGst:'showGst'};
    Object.keys(map).forEach(function(id){document.getElementById(id).checked=!!s[map[id]];});
    preview();
  }
  window.saveBillStyle=function(){
    const s=readForm();
    const f=document.getElementById('bsLogo').files[0];
    if(f){const r=new FileReader();r.onload=function(){s.logo=r.result;save(s);hookReceipt();render();if(typeof toast==='function')toast('Bill style saved.');};r.readAsDataURL(f);}
    else{save(s);hookReceipt();render();if(typeof toast==='function')toast('Bill style saved.');}
  };
  window.previewBillStyle=function(){preview();};
  window.resetBillStyle=function(){localStorage.removeItem(KEY);render();if(typeof toast==='function')toast('Bill style reset.');};
  window.swadisthaBillStyle={get:load,set:function(s){save(Object.assign(load(),s));hookReceipt();},reset:function(){localStorage.removeItem(KEY);render();}};
  function init(){
    const sec=document.getElementById('settings');
    if(sec&&!document.getElementById('billStyleBox'))sec.insertAdjacentHTML('beforeend','<div id="billStyleBox" style="margin-top:10px"></div>');
    render();hookReceipt();
    let tries=0;const t=setInterval(function(){hookReceipt();if(++tries>40)clearInterval(t);},250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
