import{c}from"./reveal.C1o38KJz.js";import{e as o}from"./text.DgeDZjdf.js";import{o as d}from"./site-settings.CKBpDEDM.js";const r=document.getElementById("special-thanks-reveal");if(r instanceof HTMLElement){const s=r.querySelector("ul");if(s instanceof HTMLElement){const n=c(r,{threshold:.2});n.observe();const a=r.querySelectorAll("h2 .word-clip, p .word-clip").length,l=t=>t.map((e,i)=>`
        <li>
          <a
            href="${o(e.link||"#")}"
            target="_blank"
            rel="noopener noreferrer"
            class="word-clip"
            style="--word-index:${i+a};"
          >
            <span class="word-inner hover:text-white/70 transition-colors duration-300">
              ${o(e.name)}
            </span>
          </a>
        </li>`).join("");d(t=>{const e=t.specialThanks;!Array.isArray(e)||e.length===0||(n.disconnect(),s.innerHTML=l(e),n.restart())})}}
