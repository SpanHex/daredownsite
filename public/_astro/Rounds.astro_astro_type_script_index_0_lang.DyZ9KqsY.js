import{c as d}from"./reveal.C1o38KJz.js";import{e as t}from"./text.DgeDZjdf.js";(()=>{const s=document.getElementById("rounds-reveal");if(!(s instanceof HTMLElement))return;const a=d(s,{threshold:.2});a.observe();const i=r=>r.map((e,n)=>`
          <div class="round-card flex flex-col gap-[40px] items-start justify-center w-full max-w-[280px]" style="--round-index:${n};">
            <div class="flex flex-col gap-[5px] items-start justify-center">
              <p class="text-[75px] text-white">${t(e.id)}</p>
              <p class="text-[24px] text-white uppercase">${t(e.duration)} - ${t(e.duration_amount)} days</p>
            </div>
            <div class="flex flex-col gap-[5px] items-start justify-center">
              <p class="text-[24px] text-white uppercase">JUDGE</p>
              <p class="text-[24px] text-white uppercase">${t(e.judge?.duration??"")} - ${t(e.judge?.duration_amount??"")} days</p>
            </div>
          </div>`).join("");window.addEventListener("siteSettings:loaded",r=>{const e=r.detail?.rounds;!Array.isArray(e)||e.length===0||(a.disconnect(),s.innerHTML=i(e),a.restart())})})();
