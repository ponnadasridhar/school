// =========================
// EmailJS OTP Helper Functions
// =========================
emailjs.init("O4nd0NmBxC_hi-r2T); // Replace with your EmailJS public key

async function sendOtp(email) {
  // Use default email if none provided
  email = email || 'ponnadasridhar05@gmail.com';

  // Generate OTP and store it temporarily
  currentOtp = genOtp();

  // Prepare EmailJS parameters
  const templateParams = {
    to_email: email,
    otp_code: currentOtp
  };

  try {
    const res = await emailjs.send('serivce_j85lbxe', 'template_1jhazk1', templateParams);
    // res.status === 200 if success
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false };
  }
}

async function verifyOtp(email, code) {
  // Simply compare the entered code with the current OTP
  if (code === currentOtp) {
    // Clear OTP after successful verification
    currentOtp = null;
    return true;
  } else {
    return false;
  }
}


// =========================
// Existing Code
// =========================
const ADMIN_USERNAME='admin';
const ADMIN_PASSWORD='Admin@123';
const BYPASS_EMAIL='ponnadasridhar05@gmail.com';
const OTP_EXP_MS=5*60*1000;

function genOtp(){return String(Math.floor(100000+Math.random()*900000))}
function read(key,def){try{const v=localStorage.getItem(key);return v?JSON.parse(v):def}catch{return def}}
function write(key,val){localStorage.setItem(key,JSON.stringify(val))}
function getAdminPassword(){const v=localStorage.getItem('adminPassword');return v?v:ADMIN_PASSWORD}
function setAdminPassword(p){localStorage.setItem('adminPassword',p)}
function getSchool(){return read('schoolData',{})}
function setSchool(d){write('schoolData',d)}
function getAchievements(){return read('galleryAchievements',[])}
function setAchievements(arr){write('galleryAchievements',arr)}
function getSports(){return read('gallerySports',[])}
function setSports(arr){write('gallerySports',arr)}
function getPapers(){return read('questionPapers',{})}
function setPapers(obj){write('questionPapers',obj)}
function show(el,flag){el.style.display=flag?'':'none'}

// =========================
// Login and OTP Setup
// =========================
function loginInit(){
  const form=document.getElementById('loginForm');
  const status=document.getElementById('loginStatus');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const user=document.getElementById('username').value.trim();
    const pwd=document.getElementById('password').value;
    if(user!==ADMIN_USERNAME || pwd!==getAdminPassword()){
      status.textContent='Invalid credentials';
      return;
    }
    show(document.getElementById('loginSection'),false);
    show(document.getElementById('otpSection'),true);
    setupOtp();
    const otpStatus=document.getElementById('otpStatus');
    sendOtp().then(res=>{
      if(res && res.ok){
        otpStatus.textContent='OTP sent to email';
      }else{otpStatus.textContent='Failed to send OTP'}
    }).catch(()=>{otpStatus.textContent='Failed to send OTP'});
  });
}

function setupOtp(){
  const sendBtn=document.getElementById('sendOtp');
  const verifyBtn=document.getElementById('verifyOtp');
  const status=document.getElementById('otpStatus');
  sendBtn.addEventListener('click',()=>{
    status.textContent='Sending OTP...';
    sendOtp().then(res=>{
      if(res && res.ok){
        status.textContent='OTP sent to email';
      }else{status.textContent='Failed to send OTP'}
    }).catch(()=>{status.textContent='Failed to send OTP'});
  });
  verifyBtn.addEventListener('click',()=>{
    const input=document.getElementById('otpInput').value.trim();
    status.textContent='Verifying OTP...';
    verifyOtp(undefined,input).then(ok=>{
      if(ok){
        show(document.getElementById('otpSection'),false);
        show(document.getElementById('adminPanel'),true);
        initAdmin();
      }else{status.textContent='Invalid or expired OTP'}
    }).catch(()=>{status.textContent='Verification failed'});
  });
}

// =========================
// Admin Panel Setup
// =========================
function initAdmin(){
  const s=getSchool();
  document.getElementById('schoolNameInput').value=s.schoolName||'';
  document.getElementById('principalNameInput').value=s.principalName||'';
  document.getElementById('addressInput').value=s.address||'';
  document.getElementById('emailInput').value=s.contactEmail||'';
  document.getElementById('staffCountInput').value=s.staffCount||0;
  document.getElementById('studentCountInput').value=s.studentCount||0;

  document.getElementById('schoolForm').addEventListener('submit',e=>{
    e.preventDefault();
    const d={
      schoolName:document.getElementById('schoolNameInput').value.trim(),
      principalName:document.getElementById('principalNameInput').value.trim(),
      address:document.getElementById('addressInput').value.trim(),
      contactEmail:document.getElementById('emailInput').value.trim(),
      staffCount:Number(document.getElementById('staffCountInput').value),
      studentCount:Number(document.getElementById('studentCountInput').value)
    };
    setSchool(d);
    document.getElementById('schoolStatus').textContent='Saved';
  });

  renderGalleryAdmin();
  renderPapersAdmin();
  setupPasswordChange();

  document.getElementById('addAch').addEventListener('click',()=>{
    const url=document.getElementById('achUrl').value.trim();
    if(!url)return;
    const list=getAchievements();
    list.push(url);
    setAchievements(list);
    document.getElementById('achUrl').value='';
    renderGalleryAdmin();
  });

  document.getElementById('addSport').addEventListener('click',()=>{
    const url=document.getElementById('sportUrl').value.trim();
    if(!url)return;
    const list=getSports();
    list.push(url);
    setSports(list);
    document.getElementById('sportUrl').value='';
    renderGalleryAdmin();
  });

  document.getElementById('paperForm').addEventListener('submit',e=>{
    e.preventDefault();
    const grade=String(document.getElementById('gradeInput').value);
    const title=document.getElementById('paperTitle').value.trim();
    const url=document.getElementById('paperUrl').value.trim();
    const papers=getPapers();
    if(!papers[grade])papers[grade]=[];
    papers[grade].push({title,url});
    setPapers(papers);
    document.getElementById('paperTitle').value='';
    document.getElementById('paperUrl').value='';
    document.getElementById('paperStatus').textContent='Added';
    renderPapersAdmin();
  });

  document.getElementById('logout').addEventListener('click',()=>{
    show(document.getElementById('adminPanel'),false);
    show(document.getElementById('loginSection'),true);
    show(document.getElementById('otpSection'),false);
    document.getElementById('loginEmail').value='';
    document.getElementById('otpInput').value='';
  });
}

// =========================
// Password Change Setup
// =========================
function setupPasswordChange(){
  const sendBtn=document.getElementById('sendOtpPwd');
  const applyBtn=document.getElementById('applyPassword');
  const status=document.getElementById('passwordStatus');

  if(sendBtn){
    sendBtn.addEventListener('click',()=>{
      const email=document.getElementById('adminEmailChange').value.trim()||document.getElementById('loginEmail').value.trim()||getSchool().contactEmail||'school@example.com';
      status.textContent='Sending OTP...';
      sendOtp(email).then(res=>{
        if(res && res.ok){
          status.textContent='OTP sent to email';
        }else{status.textContent='Failed to send OTP'}
      }).catch(()=>{status.textContent='Failed to send OTP'});
    });
  }

  if(applyBtn){
    applyBtn.addEventListener('click',()=>{
      const input=document.getElementById('otpInputPwd').value.trim();
      const newPwd=document.getElementById('newPassword').value;
      const confirm=document.getElementById('confirmPassword').value;
      if(newPwd.length<4){status.textContent='Password too short';return}
      if(newPwd!==confirm){status.textContent='Passwords do not match';return}
      const email=document.getElementById('adminEmailChange').value.trim()||document.getElementById('loginEmail').value.trim()||getSchool().contactEmail||'school@example.com';
      status.textContent='Verifying OTP...';
      verifyOtp(email,input).then(ok=>{
        if(ok){
          setAdminPassword(newPwd);
          status.textContent='Password changed';
          document.getElementById('otpInputPwd').value='';
          document.getElementById('newPassword').value='';
          document.getElementById('confirmPassword').value='';
        }else{status.textContent='Invalid or expired OTP'}
      }).catch(()=>{status.textContent='Verification failed'});
    });
  }
}

// =========================
// Gallery and Papers Rendering
// =========================
function renderGalleryAdmin(){
  const ach=getAchievements();
  const sport=getSports();
  const achList=document.getElementById('achList');
  const sportList=document.getElementById('sportList');
  achList.innerHTML='';
  sportList.innerHTML='';

  ach.forEach((u,i)=>{
    const ul=document.createElement('ul'); ul.className='list';
    const li=document.createElement('li');
    li.appendChild(document.createElement('span')).textContent=u;
    const btn=document.createElement('button'); btn.className='btn'; btn.textContent='Remove';
    btn.addEventListener('click',()=>{
      const arr=getAchievements(); arr.splice(i,1); setAchievements(arr); renderGalleryAdmin();
    });
    li.appendChild(btn); ul.appendChild(li); achList.appendChild(ul);
  });

  sport.forEach((u,i)=>{
    const ul=document.createElement('ul'); ul.className='list';
    const li=document.createElement('li');
    li.appendChild(document.createElement('span')).textContent=u;
    const btn=document.createElement('button'); btn.className='btn'; btn.textContent='Remove';
    btn.addEventListener('click',()=>{
      const arr=getSports(); arr.splice(i,1); setSports(arr); renderGalleryAdmin();
    });
    li.appendChild(btn); ul.appendChild(li); sportList.appendChild(ul);
  });
}

function renderPapersAdmin(){
  const cont=document.getElementById('papersAdmin'); cont.innerHTML='';
  const papers=getPapers();
  Object.keys(papers).sort((a,b)=>Number(a)-Number(b)).forEach(g=>{
    papers[g].forEach((p,i)=>{
      const ul=document.createElement('ul'); ul.className='list';
      const li=document.createElement('li');
      const s=document.createElement('span'); s.textContent='Grade '+g+': '+p.title;
      const a=document.createElement('a'); a.href=p.url; a.target='_blank'; a.textContent='Open';
      const btn=document.createElement('button'); btn.className='btn'; btn.textContent='Remove';
      btn.addEventListener('click',()=>{
        const pp=getPapers(); pp[g].splice(i,1); setPapers(pp); renderPapersAdmin();
      });
      li.appendChild(s); li.appendChild(a); li.appendChild(btn); ul.appendChild(li); cont.appendChild(ul);
    });
  });
}

// =========================
// Initialize
// =========================
document.addEventListener('DOMContentLoaded', loginInit);
