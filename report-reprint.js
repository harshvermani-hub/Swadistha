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

  // KOT + Bill fix. Both windows are opened during the original button click
  // so Chrome treats them as user-initiated. Automatic print scripts are
  // removed, then KOT is printed first and Bill second.
  function installPrintFix(){
    if(typeof window.printKotAndBill!=='function') return;
    window.printKotAndBill=function(){
      const b=buildBill();
      if(!b)return;
      const k=makeKot(b);
      consumeBill(b);

      const kotWin=window.open('','_blank','width=420,height=720');
      const billWin=window.open('','_blank','width=420,height=720');
      if(!kotWin || !billWin){
        if(kotWin) kotWin.close();
        if(billWin) billWin.close();
        toast('Please allow popups for Swadistha printing. Bill was saved.');
        return;
      }

      const stripScripts=function(html){
        return html.replace(/<script[\\s\\S]*?<\\/script>/gi,'');
      };

      const kotDoc=stripScripts(kotHTML(k));
      const billDoc=stripScripts(receiptHTML(b));

      kotWin.document.open();
      kotWin.document.write(kotDoc);
      kotWin.document.close();

      billWin.document.open();
      billWin.document.write(billDoc);
      billWin.document.close();

      let billStarted=false;
      const printBill=function(){
        if(billStarted)return;
        billStarted=true;
        try{
          billWin.focus();
          billWin.print();
        }catch(e){
          toast('Bill print could not be started.');
        }
      };

      kotWin.addEventListener('afterprint',function(){
        setTimeout(printBill,150);
      },{once:true});

      setTimeout(function(){
        try{
          kotWin.focus();
          kotWin.print();
        }catch(e){
          toast('KOT print could not be started.');
        }
      },300);

      toast('KOT first. Bill will print next.');
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
