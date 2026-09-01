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

  // KOT + Bill fix: open both windows from the original click, then run
  // the two print commands sequentially. window.print() blocks until the
  // current print dialog is dismissed, so the Bill command runs only after
  // the KOT print dialog has been completed.
  function installPrintFix(){
    if(typeof window.printKotAndBill!=='function') return;
    window.printKotAndBill=function(){
      const b=buildBill();
      if(!b)return;
      const k=makeKot(b);

      const kotWin=window.open('','_blank','width=420,height=720');
      const billWin=window.open('','_blank','width=420,height=720');
      if(!kotWin || !billWin){
        if(kotWin) kotWin.close();
        if(billWin) billWin.close();
        toast('Please allow popups for Swadistha printing. Bill was not saved.');
        return;
      }

      const stripScripts=function(html){
        return html.replace(/<script[\s\S]*?<\/script>/gi,'');
      };

      kotWin.document.open();
      kotWin.document.write(stripScripts(kotHTML(k)));
      kotWin.document.close();

      billWin.document.open();
      billWin.document.write(stripScripts(receiptHTML(b)));
      billWin.document.close();

      try{
        kotWin.focus();
        kotWin.print();
      }catch(e){
        kotWin.close();
        billWin.close();
        toast('KOT print could not be started. Bill was not saved.');
        return;
      }

      try{
        billWin.focus();
        billWin.print();
      }catch(e){
        toast('Bill print could not be started.');
        return;
      }

      consumeBill(b);
      toast('KOT and Bill printed. New bill is ready.');
    };
  }

  const oldRenderReports=window.renderReports;
  if(typeof oldRenderReports==='function'){
    window.renderReports=function(){oldRenderReports();addReprintButtons()};
  }

  document.addEventListener('DOMContentLoaded',function(){
    installPrintFix();
    addReprintButtons();
    new MutationObserver(function(){
      addReprintButtons();
      installPrintFix();
    }).observe(document.body,{childList:true,subtree:true});
  });
})();
