(function(){
  function addReprintButtons(){
    const rows=document.querySelectorAll('#reportRows tr');
    rows.forEach(row=>{
      if(row.dataset.reprintReady==='1') return;
      const cells=row.querySelectorAll('td');
      if(cells.length<7) return;
      const billNo=cells[1].textContent.trim();
      if(!billNo || billNo==='—') return;
      const actions=cells[6];
      if(!actions) return;
      const bill=bills.find(x=>String(x.no)===billNo);
      if(!bill) return;
      const billBtn=document.createElement('button');
      billBtn.className='btn orange';
      billBtn.textContent='Print Bill';
      billBtn.onclick=function(){openPrint(receiptHTML(bill),function(){toast('Bill reprinted.')})};
      actions.appendChild(document.createTextNode(' '));
      actions.appendChild(billBtn);

      const kot=kots.slice().reverse().find(function(x){
        return x.items && bill.items && x.items.length===bill.items.length &&
          x.items.every(function(ki){return bill.items.some(function(bi){return bi.name===ki.name && Number(bi.qty)===Number(ki.qty)})});
      });
      if(kot){
        const kotBtn=document.createElement('button');
        kotBtn.className='btn blue';
        kotBtn.textContent='Print KOT';
        kotBtn.onclick=function(){openPrint(kotHTML(kot),function(){toast('KOT reprinted.')})};
        actions.appendChild(document.createTextNode(' '));
        actions.appendChild(kotBtn);
      }
      row.dataset.reprintReady='1';
    });
  }
  const oldRenderReports=window.renderReports;
  if(typeof oldRenderReports==='function'){
    window.renderReports=function(){oldRenderReports();addReprintButtons()};
  }
  document.addEventListener('DOMContentLoaded',function(){
    addReprintButtons();
    new MutationObserver(addReprintButtons).observe(document.body,{childList:true,subtree:true});
  });
})();
