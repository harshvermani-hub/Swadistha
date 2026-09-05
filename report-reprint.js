// Navigation and app controls must remain usable even if another script has an error.
window.showView=function(view){
  var target=document.getElementById(view); if(!target)return;
  document.querySelectorAll('.view').forEach(function(x){x.classList.remove('active')});
  target.classList.add('active');
  document.querySelectorAll('.nav[data-view]').forEach(function(x){x.classList.toggle('active',x.getAttribute('data-view')===view)});
  try{
    if(view==='billing'&&typeof renderBilling==='function')renderBilling();
    if(view==='billing'&&typeof renderSaleRange==='function')renderSaleRange();
    if(view==='reports'&&typeof renderReports==='function')renderReports();
    if(view==='inventory'&&typeof renderInventory==='function')renderInventory();
    if(view==='menu'&&typeof renderMenu==='function')renderMenu();
    if(view==='kot'&&typeof renderKOT==='function')renderKOT();
  }catch(e){console.error('Navigation error:',e)}
};
(function(){
  function addReprintButtons(){
    const rows=document.querySelectorAll('#reportRows tr');
    rows.forEach(row=>{if(row.dataset.reprintReady==='1')return;const cells=row.querySelectorAll('td');if(cells.length<7)return;const billNo=cells[1].textContent.trim();if(!billNo||billNo==='—')return;const actions=cells[6];const bill=bills.find(x=>String(x.no)===billNo);if(!bill)return;const billBtn=document.createElement('button');billBtn.className='btn orange';billBtn.textContent='Print Bill';billBtn.onclick=function(){openPrint(receiptHTML(bill),function(){toast('Bill reprinted.')})};actions.appendChild(document.createTextNode(' '));actions.appendChild(billBtn);const kot=kots.slice().reverse().find(function(x){return x.items&&bill.items&&x.items.length===bill.items.length&&x.items.every(function(ki){return bill.items.some(function(bi){return bi.name===ki.name&&Number(bi.qty)===Number(ki.qty)})})});if(kot){const kotBtn=document.createElement('button');kotBtn.className='btn blue';kotBtn.textContent='Print KOT';kotBtn.onclick=function(){openPrint(kotHTML(kot),function(){toast('KOT reprinted.')})};actions.appendChild(document.createTextNode(' '));actions.appendChild(kotBtn)}row.dataset.reprintReady='1'});
  }
  function installNavigationFix(){
    if(window.__swadisthaNavigationFixInstalled)return;window.__swadisthaNavigationFixInstalled=true;
    document.addEventListener('click',function(e){const nav=e.target.closest&&e.target.closest('.nav[data-view]');if(!nav)return;e.preventDefault();e.stopImmediatePropagation();window.showView(nav.getAttribute('data-view'))},true);
  }
  function installAppButtonFix(){
    if(window.__swadisthaAppButtonFixInstalled)return;window.__swadisthaAppButtonFixInstalled=true;
    document.addEventListener('click',function(e){
      const item=e.target.closest&&e.target.closest('.item');
      if(item){e.preventDefault();e.stopImmediatePropagation();const match=(item.getAttribute('onclick')||'').match(/addItem\((\d+)\)/);if(match&&typeof window.addItem==='function'){window.addItem(Number(match[1]));return}const name=item.querySelector('b')?.textContent?.trim();if(name&&Array.isArray(window.menu)&&typeof window.addItem==='function'){const m=window.menu.find(x=>x.name===name);if(m)window.addItem(m.id)}return}
      const addDish=e.target.closest&&e.target.closest('#menu button.btn.orange');
      if(addDish&&typeof window.addMenuItem==='function'){e.preventDefault();e.stopImmediatePropagation();window.addMenuItem()}
    },true);
  }
  function installPrintFix(){
    if(typeof window.printKotAndBill!=='function'||window.__swadisthaPrintFixInstalled)return;window.__swadisthaPrintFixInstalled=true;
    window.printKotAndBill=function(){const b=buildBill();if(!b)return;const k=makeKot(b);const stripScripts=function(html){return html.replace(/<script[\s\S]*?<\/script>/gi,'')};const combined='<!doctype html><html><head><meta charset="utf-8"><title>Swadistha KOT + Bill</title><style>@page{margin:0}html,body{margin:0;padding:0;background:#fff}.print-page{page-break-after:always;break-after:page;width:100%}.print-page:last-child{page-break-after:auto;break-after:auto}</style></head><body><section class="print-page">'+stripScripts(kotHTML(k))+'</section><section class="print-page">'+stripScripts(receiptHTML(b))+'</section></body></html>';const w=window.open('','_blank','width=420,height=720');if(!w){toast('Allow popups for printing. Bill was not saved.');return}w.document.open();w.document.write(combined);w.document.close();const printNow=function(){try{w.focus();w.print();consumeBill(b);toast('KOT + Bill print job sent. New bill is ready')}catch(e){toast('Printing could not be started. Bill was not saved.')}};if(w.document.readyState==='complete')setTimeout(printNow,100);else w.onload=function(){setTimeout(printNow,100)}};
  }
  function fixMojibake(){const map={[String.fromCharCode(0x00e2,0x201a,0x00b9)]:String.fromCharCode(8377),[String.fromCharCode(0x00e2,0x0161,0x2122)]:String.fromCharCode(9881),[String.fromCharCode(0x00f0,0x0178,0x2018,0x2039)]:String.fromCodePoint(128075),[String.fromCharCode(0x00e2,0x2013,0x00a6)]:String.fromCharCode(9638),[String.fromCharCode(0x00e2,0x2018,0x00b7)]:String.fromCharCode(9783),[String.fromCharCode(0x00e2,0x02dc,0x00b7)]:String.fromCharCode(9783),[String.fromCharCode(0x00e2,0x2030,0x00a1)]:String.fromCharCode(8801),[String.fromCharCode(0x00e2,0x2014,0x02c6)]:String.fromCharCode(9672),[String.fromCharCode(0x00e2,0x2013,0x00a4)]:String.fromCharCode(9636)};const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(function(node){let text=node.nodeValue;Object.keys(map).forEach(function(bad){if(text.indexOf(bad)!==-1)text=text.split(bad).join(map[bad])});node.nodeValue=text})}
  document.addEventListener('DOMContentLoaded',function(){installNavigationFix();installAppButtonFix();installPrintFix();addReprintButtons();fixMojibake()});
})();
