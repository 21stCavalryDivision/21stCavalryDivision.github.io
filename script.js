const toggle=document.querySelector('.nav-toggle');const nav=document.querySelector('.main-nav');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open);});}const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));const copyBtn=document.getElementById('copyApplication');if(copyBtn){copyBtn.addEventListener('click',async()=>{const get=id=>document.getElementById(id)?.value?.trim()||'Not provided';const text=`21ST CAVALRY DIVISION - ENLISTMENT APPLICATION

Display Name / Callsign: ${get('appName')}
Age: ${get('appAge')}
Timezone: ${get('appTimezone')}
Preferred Role: ${get('appRole')}

Previous Experience:
${get('appExp')}

Why I Want to Join:
${get('appWhy')}`;const s=document.getElementById('copyStatus');try{await navigator.clipboard.writeText(text);s.textContent='Application copied. Open Discord and paste it into the recruitment channel.';}catch(e){s.textContent='Copy failed. Select your answers manually and paste them into Discord.';}});}