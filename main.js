function getData(){
  const school=JSON.parse(localStorage.getItem('schoolData')||'{}');
  const papers=JSON.parse(localStorage.getItem('questionPapers')||'{}');
  const achievements=JSON.parse(localStorage.getItem('galleryAchievements')||'[]');
  const sports=JSON.parse(localStorage.getItem('gallerySports')||'[]');
  const defaults={
    schoolName:'My School',
    principalName:'Principal Name',
    address:'123 Street, City',
    contactEmail:'school@example.com',
    staffCount:20,
    studentCount:300
  };
  return {
    schoolName:school.schoolName||defaults.schoolName,
    principalName:school.principalName||defaults.principalName,
    address:school.address||defaults.address,
    contactEmail:school.contactEmail||defaults.contactEmail,
    staffCount:school.staffCount||defaults.staffCount,
    studentCount:school.studentCount||defaults.studentCount,
    papers,
    achievements,
    sports
  };
}
function setBrand(name){
  document.getElementById('brand').textContent=name;
}
function renderHome(d){
  document.getElementById('schoolName').textContent=d.schoolName;
  document.getElementById('principalName').textContent='Principal: '+d.principalName;
  document.getElementById('address').textContent=d.address;
  document.getElementById('contactEmail').textContent=d.contactEmail;
  const link=document.getElementById('contactEmailLink');
  link.href='mailto:'+encodeURIComponent(d.contactEmail);
}
function renderStats(d){
  document.getElementById('staffCount').textContent=d.staffCount;
  document.getElementById('studentCount').textContent=d.studentCount;
}
function renderGallery(id,items){
  const grid=document.getElementById(id);
  grid.innerHTML='';
  if(!items||!items.length){
    const ph=[
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' fill='%236b7280'>Placeholder</text></svg>",
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='%23eef2ff'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' fill='%236b7280'>Placeholder</text></svg>",
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='%23fef3c7'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' fill='%236b7280'>Placeholder</text></svg>",
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='%23dcfce7'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' fill='%236b7280'>Placeholder</text></svg>"
    ];
    items=ph;
  }
  items.forEach(u=>{
    const img=document.createElement('img');
    img.src=u;
    img.alt='';
    grid.appendChild(img);
  });
}
function renderPapers(d,grade){
  const list=document.getElementById('papersList');
  list.innerHTML='';
  const key=String(grade);
  const arr=(d.papers&&d.papers[key])||[];
  if(!arr.length){
    const a=document.createElement('a');
    a.href='https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    a.textContent='Sample Paper';
    a.target='_blank';
    const li=document.createElement('li');
    li.appendChild(document.createElement('span')).textContent='No papers set. Sample:';
    li.appendChild(a);
    list.appendChild(li);
    return;
  }
  arr.forEach(p=>{
    const li=document.createElement('li');
    const t=document.createElement('span');
    t.textContent=p.title||'Paper';
    const a=document.createElement('a');
    a.href=p.url;
    a.textContent='Download';
    a.target='_blank';
    li.appendChild(t);
    li.appendChild(a);
    list.appendChild(li);
  });
}
function setupNav(){
  const toggle=document.getElementById('navToggle');
  const nav=document.getElementById('nav');
  toggle.addEventListener('click',()=>{
    const show=getComputedStyle(nav).display==='none';
    nav.style.display=show?'flex':'none';
  });
  document.querySelectorAll('.nav a').forEach(a=>{
    a.addEventListener('click',()=>{nav.style.display='';});
  });
}
function setupAcademic(d){
  const select=document.getElementById('gradeSelect');
  renderPapers(d,select.value);
  select.addEventListener('change',()=>renderPapers(d,select.value));
}
function setupContact(){
  const form=document.getElementById('contactForm');
  const status=document.getElementById('contactStatus');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.getElementById('name').value.trim();
    const phone=document.getElementById('phone').value.trim();
    const email=document.getElementById('email').value.trim();
    const message=document.getElementById('message').value.trim();
    const to=(JSON.parse(localStorage.getItem('schoolData')||'{}').contactEmail)||'school@example.com';
    const body=`Name: ${name}%0D%0APhone: ${phone}%0D%0AEmail: ${encodeURIComponent(email)}%0D%0AMessage: ${encodeURIComponent(message)}`;
    const mail=`mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent('School Contact')}&body=${body}`;
    status.textContent='Opening email client...';
    window.location.href=mail;
    setTimeout(()=>{status.textContent='If your email client did not open, copy mailto link.';},1200);
  });
}
function init(){
  const d=getData();
  setBrand(d.schoolName);
  renderHome(d);
  renderStats(d);
  renderGallery('achievementsGrid',d.achievements);
  renderGallery('sportsGrid',d.sports);
  setupNav();
  setupAcademic(d);
  setupContact();
}
document.addEventListener('DOMContentLoaded',init);
