const MODULES=['نظافة المبنى','التكييف','الكهرباء والسباكة','حالة المبنى بشكل عام','جودة الضيافة','أنظمة السلامة بالموقع'];

const ratings={buildingCond:'ممتاز'},moduleRatings={},moduleImages={},extraPages={};
let siteImage=null;
MODULES.forEach((_,i)=>{moduleRatings[i]='جيد جداً';moduleImages[i]=[null,null];extraPages[i]=[];});

function goTo(idx){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.step-btn').forEach((b,i)=>{b.classList.remove('active','done');if(i<idx)b.classList.add('done');if(i===idx)b.classList.add('active');});
  document.getElementById('sec'+idx).classList.add('active');window.scrollTo(0,0);
}
function setRating(key,btn,v){ratings[key]=v;btn.closest('.rating-group').querySelectorAll('.rating-btn').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');}
function setModuleRating(idx,btn,v){moduleRatings[idx]=v;btn.closest('.rating-group').querySelectorAll('.rating-btn').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');}
function updateCount(el,cid,max){const len=el.value.length,c=document.getElementById(cid);c.textContent=len+' / '+max+' حرف';c.classList.toggle('warn',len>max*0.85);}
function handleSiteImage(input){
  const file=input.files[0];if(!file)return;siteImage=file;
  const slot=document.getElementById('site-img-slot');
  const reader=new FileReader();reader.onload=e=>{
    slot.querySelector('.upload-hint').style.display='none';
    let img=slot.querySelector('img')||document.createElement('img');img.src=e.target.result;
    if(!slot.querySelector('img'))slot.insertBefore(img,slot.querySelector('.rm-btn'));
    slot.classList.add('has-img');
  };reader.readAsDataURL(file);
}
function removeSiteImage(event){
  event.stopPropagation();siteImage=null;
  const slot=document.getElementById('site-img-slot');
  const img=slot.querySelector('img');if(img)img.remove();
  slot.querySelector('.upload-hint').style.display='flex';
  slot.classList.remove('has-img');slot.querySelector('input[type=file]').value='';
}
function buildModulesUI(){const c=document.getElementById('modules-container');c.innerHTML='';MODULES.forEach((name,i)=>c.insertAdjacentHTML('beforeend',moduleHTML(i,name)));}
const imgIcon='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
function moduleHTML(i,name){
  return '<div class="module-card" id="mcard-'+i+'">'
    +'<div class="module-header"><div class="module-title">'+(i+1)+'. '+name+'</div>'
    +'<div class="rating-group" style="margin-bottom:0">'
    +'<button class="rating-btn" onclick="setModuleRating('+i+',this,\'ممتاز\')">ممتاز</button>'
    +'<button class="rating-btn selected" onclick="setModuleRating('+i+',this,\'جيد جداً\')">جيد جداً</button>'
    +'<button class="rating-btn" onclick="setModuleRating('+i+',this,\'جيد\')">جيد</button>'
    +'<button class="rating-btn" onclick="setModuleRating('+i+',this,\'مقبول\')">مقبول</button>'
    +'<button class="rating-btn" onclick="setModuleRating('+i+',this,\'يحتاج صيانة\')">يحتاج صيانة</button>'
    +'</div></div>'
    +'<div class="img-pair">'
    +'<div class="img-slot" id="mslot-'+i+'-0"><div class="upload-hint">'+imgIcon+'<span>صورة كبيرة</span></div>'
    +'<button class="rm-btn" onclick="removeModImg('+i+',0,event)">✕</button>'
    +'<div class="size-label">كبيرة</div><input type="file" accept="image/*" onchange="handleModImg('+i+',0,this)"></div>'
    +'<div class="img-slot" id="mslot-'+i+'-1"><div class="upload-hint">'+imgIcon+'<span>صورة صغيرة</span></div>'
    +'<button class="rm-btn" onclick="removeModImg('+i+',1,event)">✕</button>'
    +'<div class="size-label">صغيرة</div><input type="file" accept="image/*" onchange="handleModImg('+i+',1,this)"></div>'
    +'</div>'
    +'<textarea rows="3" maxlength="300" id="mnotes-'+i+'" placeholder="ملاحظات '+name+' (اختياري)..." oninput="updateCount(this,\'mcount-'+i+'\',300)"></textarea>'
    +'<div class="char-count" id="mcount-'+i+'">0 / 300 حرف</div>'
    +'<div class="extra-pages" id="extra-'+i+'"></div>'
    +'<button class="btn-add-page" onclick="addExtraPage('+i+')">＋ إضافة صفحة صور لـ "'+name+'"</button></div>';
}
function handleModImg(mIdx,imgIdx,input){
  const file=input.files[0];if(!file)return;moduleImages[mIdx][imgIdx]=file;
  const slot=document.getElementById('mslot-'+mIdx+'-'+imgIdx);
  const reader=new FileReader();reader.onload=e=>{
    slot.querySelector('.upload-hint').style.display='none';
    let img=slot.querySelector('img')||document.createElement('img');img.src=e.target.result;
    if(!slot.querySelector('img'))slot.insertBefore(img,slot.querySelector('.rm-btn'));
    slot.classList.add('has-img');
  };reader.readAsDataURL(file);
}
function removeModImg(mIdx,imgIdx,event){
  event.stopPropagation();moduleImages[mIdx][imgIdx]=null;
  const slot=document.getElementById('mslot-'+mIdx+'-'+imgIdx);
  const img=slot.querySelector('img');if(img)img.remove();
  slot.querySelector('.upload-hint').style.display='flex';
  slot.classList.remove('has-img');slot.querySelector('input[type=file]').value='';
}
function addExtraPage(mIdx){
  const pi=extraPages[mIdx].length;extraPages[mIdx].push({imgs:[null,null,null]});
  const c=document.getElementById('extra-'+mIdx);
  const div=document.createElement('div');div.className='extra-page';div.id='ep-'+mIdx+'-'+pi;
  div.innerHTML='<button class="remove-extra-page" onclick="removeExtraPage('+mIdx+','+pi+')">✕</button>'
    +'<div class="extra-page-title">📷 صفحة صور إضافية '+(pi+1)+' — '+MODULES[mIdx]+'</div>'
    +'<div class="photo-row-3">'+[0,1,2].map(ph=>
      '<div class="photo-slot"><div class="photo-img-slot" id="epslot-'+mIdx+'-'+pi+'-'+ph+'">'
      +'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>'
      +'<input type="file" accept="image/*" onchange="handleExtraImg('+mIdx+','+pi+','+ph+',this)"></div>'
      +'<input type="text" class="photo-caption" id="epcap-'+mIdx+'-'+pi+'-'+ph+'" placeholder="تعليق..." maxlength="80"></div>'
    ).join('')+'</div>';
  c.appendChild(div);
}
function removeExtraPage(mIdx,pi){const el=document.getElementById('ep-'+mIdx+'-'+pi);if(el)el.remove();extraPages[mIdx][pi]=null;}
function handleExtraImg(mIdx,pi,ph,input){
  const file=input.files[0];if(!file)return;
  if(extraPages[mIdx][pi])extraPages[mIdx][pi].imgs[ph]=file;
  const slot=document.getElementById('epslot-'+mIdx+'-'+pi+'-'+ph);
  const reader=new FileReader();reader.onload=e=>{
    slot.querySelector('svg').style.display='none';
    let img=slot.querySelector('img')||document.createElement('img');img.src=e.target.result;
    img.style.cssText='width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;';
    if(!slot.querySelector('img'))slot.appendChild(img);
  };reader.readAsDataURL(file);
}
async function generateReport(){
  document.getElementById('genBtn').style.display='none';
  document.getElementById('loadingDiv').style.display='flex';
  try{
    const bin=atob(TEMPLATE_B64),bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    const zip=await JSZip.loadAsync(bytes.buffer);

    const visitISO      = val('visitDate');
    const contractorISO = val('contractorDate');
    const siteName   = val('siteName')  ||'متحف حائل الإقليمي';
    const bClass     = val('buildingClass')||'A';
    const bCond      = ratings.buildingCond||'جيد جداً';
    const genNotes   = val('generalNotes')||'';

    // ── Slide 1 ──
    let s1=await zip.file('ppt/slides/slide1.xml').async('string');
    const preparedBy=val('preparedBy')||'مصعب الشمري';
    const jobTitle  =val('jobTitle')  ||'مشرف إدارة المرافق بمنطقة حائل';
    const regionCity=val('regionCity')||'بمنطقة حائل';
    const regionText=val('region')    ||'المنطقة الشمالية - السدو';
    s1=s1.replace(/مصعب الشمري/g,preparedBy)
         .replace(/بمنطقة حائل/g,regionCity)
         .replace(/مشرف إدارة المرافق بمنطقة حائل/g,jobTitle)
         .replace(/المنطقة الشمالية - السدو/g,regionText);
    s1=patchSlide1(s1,visitISO);
    zip.file('ppt/slides/slide1.xml',s1);

    // ── Slide 2 ──
    let s2=await zip.file('ppt/slides/slide2.xml').async('string');
    let rels2=await zip.file('ppt/slides/_rels/slide2.xml.rels').async('string');
    s2=s2.replace(/متحف حائل الإقليمي/g,siteName)
         .replace(/>A</g,'>'+bClass+'<')
         .replace(/جـيد جـداً/g,bCond)
         .replace(/أنقر لإضافة نص/g,genNotes||'-');
    s2=patchSlide2(s2,visitISO,contractorISO);
    if(siteImage){const{b64}=await toSquareJpeg(siteImage);zip.file('ppt/media/site_photo.jpeg',b64,{base64:true});rels2=addRel(rels2,'rIdSITE','site_photo.jpeg');s2=injectShape(s2,'مستطيل 9','rIdSITE');}
    zip.file('ppt/slides/slide2.xml',s2);zip.file('ppt/slides/_rels/slide2.xml.rels',rels2);

    // ── Slides 3-8 ──
    for(let i=0;i<6;i++){
      const sn=i+3;
      let slide=await zip.file('ppt/slides/slide'+sn+'.xml').async('string');
      let rels=await zip.file('ppt/slides/_rels/slide'+sn+'.xml.rels').async('string');
      slide=slide.replace(/جيد جداً/g,moduleRatings[i]||'جيد جداً');
      slide=patchModuleNotes(slide,val('mnotes-'+i));
      if(moduleImages[i][0]){const{b64}=await toSquareJpeg(moduleImages[i][0]);const nm='mod'+sn+'b.jpeg';zip.file('ppt/media/'+nm,b64,{base64:true});rels=addRel(rels,'rIdB'+sn,nm);slide=injectShape(slide,'مستطيل 3','rIdB'+sn);}
      if(moduleImages[i][1]){const{b64}=await toSquareJpeg(moduleImages[i][1]);const nm='mod'+sn+'s.jpeg';zip.file('ppt/media/'+nm,b64,{base64:true});rels=addRel(rels,'rIdS'+sn,nm);slide=injectShape(slide,'مستطيل 21','rIdS'+sn);}
      zip.file('ppt/slides/_rels/slide'+sn+'.xml.rels',rels);zip.file('ppt/slides/slide'+sn+'.xml',slide);
    }
    
    let s13=await zip.file('ppt/slides/slide13.xml').async('string');
    s13=s13.replace(/مصعب الشمري/g,preparedBy);
    zip.file('ppt/slides/slide13.xml',s13);

    const moduleRids=['rId4','rId5','rId6','rId7','rId8','rId9'];

    let presXml=await zip.file('ppt/presentation.xml').async('string');
    let presRels=await zip.file('ppt/_rels/presentation.xml.rels').async('string');
    let ct=await zip.file('[Content_Types].xml').async('string');
    let maxId=getMaxSlideId(presXml),slideNum=14;
    for(let mIdx=0;mIdx<6;mIdx++){
      const pages=extraPages[mIdx].filter(p=>p!==null);
      for(let pi=0;pi<pages.length;pi++){
        const page=pages[pi];maxId++;
        let ns=await zip.file('ppt/slides/slide9.xml').async('string');
        let nr=await zip.file('ppt/slides/_rels/slide9.xml.rels').async('string');
        const ri=extraPages[mIdx].indexOf(page);
        const caps=[0,1,2].map(ph=>document.getElementById('epcap-'+mIdx+'-'+ri+'-'+ph)?.value||'');
        ns=patchPhotoCaptions(ns,caps);
        const rectNames=['مستطيل 16','مستطيل 11','مستطيل 3'];
        for(let ph=0;ph<3;ph++){if(page.imgs[ph]){const{b64}=await toSquareJpeg(page.imgs[ph]);const nm='ep'+mIdx+'_'+slideNum+'_'+ph+'.jpeg';zip.file('ppt/media/'+nm,b64,{base64:true});nr=addRel(nr,'rIdEP'+slideNum+ph,nm);ns=injectShape(ns,rectNames[ph],'rIdEP'+slideNum+ph);}}
        zip.file('ppt/slides/slide'+slideNum+'.xml',ns);
        zip.file('ppt/slides/_rels/slide'+slideNum+'.xml.rels',nr);
        ct=ct.replace('</Types>','<Override PartName="/ppt/slides/slide'+slideNum+'.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/></Types>');
        const anchorRid=pi===0?moduleRids[mIdx]:'rIdNS'+(slideNum-1);
        const newTag='<p:sldId id="'+maxId+'" r:id="rIdNS'+slideNum+'"/>';
        presXml=presXml.replace(new RegExp('(<p:sldId[^>]*r:id="'+anchorRid+'"[^/]*/>)'),'$1\n    '+newTag);
        if(!presXml.includes(newTag))presXml=presXml.replace('</p:sldIdLst>',newTag+'</p:sldIdLst>');
        presRels=presRels.replace('</Relationships>','  <Relationship Id="rIdNS'+slideNum+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide'+slideNum+'.xml"/>\n</Relationships>');
        slideNum++;
      }
    }
    zip.file('ppt/presentation.xml',presXml);
    zip.file('ppt/_rels/presentation.xml.rels',presRels);
    zip.file('[Content_Types].xml',ct);

    const blob=await zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.presentationml.presentation'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');
    a.href=url;a.download='تقرير_شمالية_'+(val('siteName')||'زيارة')+'_'+(val('visitDate')||'').replace(/-/g,'_')+'.pptx';
    a.click();URL.revokeObjectURL(url);
    document.getElementById('loadingDiv').style.display='none';
    document.getElementById('genBtn').style.display='inline-flex';
    document.getElementById('genBtn').textContent='✅ تم! اضغط مجدداً لإعادة التحميل';
  }catch(err){
    console.error(err);
    document.getElementById('loadingDiv').style.display='none';
    document.getElementById('genBtn').style.display='inline-flex';
    alert('خطأ: '+err.message);
  }
}
function getDateParts(isoVal){
  if(!isoVal) return {dd:'01',mm:'01',yyyy:'2025',dayAr:'الأحد'};
  const [yyyy,mm,dd]=isoVal.split('-');
  const d=new Date(+yyyy,+mm-1,+dd);
  const days=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  return {dd,mm,yyyy,dayAr:days[d.getDay()]};
}

function onDateChange(input){
  const {dd,mm,yyyy,dayAr}=getDateParts(input.value);
  document.getElementById('dateDisplay').textContent=dayAr+' '+dd+'/'+mm+'/'+yyyy;
}

function onContractorDateChange(input){
  const {dd,mm,yyyy,dayAr}=getDateParts(input.value);
  document.getElementById('contractorDateDisplay').textContent=dayAr+' '+dd+'/'+mm+'/'+yyyy;
}

// ══ patchSlide1: يوم | 01(يوم) | / | 01(شهر) | /2025 م ══
function patchSlide1(xml,isoVal){
  const {dd,mm,yyyy,dayAr}=getDateParts(isoVal);
  xml=xml.replace(
    /<a:t>01<\/a:t>([\s\S]*?<a:t>\/<\/a:t>[\s\S]*?<a:t>)01(<\/a:t>[\s\S]*?<a:t>)\/2025 م/,
    function(_,g1,g2){return '<a:t>'+dd+'</a:t>'+g1+mm+g2+'/'+yyyy+' م';}
  );
  xml=xml.replace(/يوم الاحد الموافق /g,'يوم '+dayAr+' الموافق ');
  return xml;
}

// ══ patchOnePara: يستبدل تاريخ داخل فقرة واحدة فقط ══
function patchOnePara(para,dd,mm,yyyy,dayAr){
  const y3=yyyy.substring(0,3),y4=yyyy[3];
  para=para.replace(/<a:t>202<\/a:t>([\s\S]*?<a:t>)5(<\/a:t>)/g,
    function(_,g1,g2){return '<a:t>'+y3+'</a:t>'+g1+y4+g2;});
  para=para.replace(/<a:t>\/01\/01<\/a:t>/g,'<a:t>/'+mm+'/'+dd+'</a:t>');
  para=para.replace(/يوم الأربعاء /g,'يوم '+dayAr+' ');
  return para;
}

// ══ patchSlide2: تاريخ الزيارة وتاريخ المقاول منفصلان ══
function patchSlide2(xml,visitISO,contractorISO){
  const v=getDateParts(visitISO);
  const c=getDateParts(contractorISO);
  return xml.replace(/<a:p>[\s\S]*?<\/a:p>/g,function(para){
    const txt=para.replace(/<[^>]+>/g,'');
    if(txt.includes('موعد الزيارة'))    return patchOnePara(para,v.dd,v.mm,v.yyyy,v.dayAr);
    if(txt.includes('أخر زيارة للمقاول')) return patchOnePara(para,c.dd,c.mm,c.yyyy,c.dayAr);
    return para;
  });
}

function injectShape(xml,shapeName,rId){
  return xml.replace(/<p:sp>[\s\S]*?<\/p:sp>/g,match=>{
    if(!match.includes('name="'+shapeName+'"'))return match;
    let out=match.replace(/(<p:spPr>[\s\S]*?)<a:solidFill>[\s\S]*?<\/a:solidFill>([\s\S]*?<\/p:spPr>)/,
      '$1<a:blipFill><a:blip r:embed="'+rId+'"/><a:stretch><a:fillRect/></a:stretch></a:blipFill>$2');
    return out.replace('<a:fillRef idx="1">','<a:fillRef idx="0">');
  });
}
function addRel(rels,newRid,filename){
  return rels.replace('</Relationships>',
    '  <Relationship Id="'+newRid+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/'+filename+'"/>\n</Relationships>');
}
function patchModuleNotes(xml,notes){
  if(!notes)return xml;
  const lines=notes.split('\n').filter(l=>l.trim());let i=0;
  return xml.replace(/<a:t>-<\/a:t>/g,()=>i<lines.length?'<a:t>'+ex(lines[i++])+'</a:t>':'<a:t>-</a:t>');
}
function patchPhotoCaptions(xml,caps){
  let i=0;return xml.replace(/<a:t>إضافة تعليق<\/a:t>/g,()=>'<a:t>'+ex(caps[i++]||'')+'</a:t>');
}
function ex(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function getMaxSlideId(xml){const ids=[...xml.matchAll(/<p:sldId[^>]*id="(\d+)"/g)].map(m=>+m[1]);return ids.length?Math.max(...ids):300;}
function val(id){return document.getElementById(id)?.value?.trim()||'';}
function toSquareJpeg(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();reader.onerror=reject;
    reader.onload=e=>{
      const img=new Image();img.onerror=reject;
      img.onload=()=>{
        const size=Math.min(img.width,img.height),sx=(img.width-size)/2,sy=(img.height-size)/2;
        const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
        canvas.getContext('2d').drawImage(img,sx,sy,size,size,0,0,size,size);
        resolve({b64:canvas.toDataURL('image/jpeg',0.9).split(',')[1]});
      };img.src=e.target.result;
    };reader.readAsDataURL(file);
  });
}

buildModulesUI();
