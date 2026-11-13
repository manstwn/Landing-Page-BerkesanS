import{b as M,d as D,r as s,j as e}from"./index-uPGQxiAj.js";/* empty css                   */const $=()=>{const{id:g}=M(),[x]=D(),[l,w]=s.useState(""),[o,h]=s.useState(""),[t,z]=s.useState("semi"),[b,f]=s.useState(""),[k,I]=s.useState([]),[v,S]=s.useState(!1),[y,A]=s.useState({}),[r,T]=s.useState("message"),W=a=>{A(n=>({...n,[a]:!n[a]}))},u={semi:{id:"semi",label:"Semi Formal",content:`Kepada Yth.
{{nama}}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk memberikan doa restu pada acara pernikahan kami.

Detail acara dapat dilihat di link berikut:
🔗 {{link}}

Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir.

Terima kasih.`},formal:{id:"formal",label:"Formal",content:`Yth. Bapak/Ibu/Saudara/i
{{nama}}
Di Tempat

Assalamualaikum Wr. Wb.

Dengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara kami.

Untuk informasi lebih lengkap mengenai acara dapat diakses melalui tautan berikut:

🔗 {{link}}

Kami berharap Bapak/Ibu/Saudara/i dapat meluangkan waktu untuk hadir.

Mohon maaf undangan ini hanya disampaikan melalui pesan ini.

Terima kasih.`},santai:{id:"santai",label:"Santai",content:`Halo {{nama}}! 👋

Kami punya kabar bahagia! Kami akan menikah dan sangat berharap kamu bisa datang merayakan momen spesial ini bersama kami.

Cek detail undangannya di sini ya:
👉 {{link}}

Ditunggu kehadirannya ya! Terima kasih!`},singkat:{id:"singkat",label:"Singkat",content:`Undangan Pernikahan untuk {{nama}}

Mohon doa restu untuk pernikahan kami.
Link undangan: 
🔗 {{link}}

Terima kasih.`},custom:{id:"custom",label:"Buat Sendiri",content:""}};s.useEffect(()=>{const a=g||x.get("id");a?(w(a),S(!0)):S(!1)},[g,x]),s.useEffect(()=>{const a=localStorage.getItem("share_guestNames");if(a&&h(a),!g&&!x.get("id")){const n=localStorage.getItem("share_slug");n&&w(n)}},[g,x]),s.useEffect(()=>{localStorage.setItem("share_guestNames",o)},[o]),s.useEffect(()=>{v||localStorage.setItem("share_slug",l)},[l,v]),s.useEffect(()=>{if(t==="custom")return;const a=o.split(`
`)[0].trim()||"Nama Tamu",n="https://m.berkesanstudio.com",i=l.trim()||"slug-undangan-anda",d=`${n}/${i}?to=${encodeURIComponent(a).replace(/%20/g,"+")}`,m=u[t].content,p=`*${a}*`,c=m.replace(/{{nama}}/g,p).replace(/{{link}}/g,d);f(c)},[t,o,l]);const L=a=>{z(a),a==="custom"&&f(u.formal.content)},B=()=>{const a=o.split(`
`).filter(m=>m.trim()!==""),n="https://m.berkesanstudio.com",i=l.trim()||"slug-undangan-anda",d=a.map(m=>{const p=m.trim(),c=`${n}/${i}?to=${encodeURIComponent(p).replace(/%20/g,"+")}`;if(r==="link")return{name:p,link:c,message:c};let j="";t==="custom"?j=b:j=u[t].content;let P=p;t!=="custom"&&(P=`*${p}*`);let E=j.replace(/{{nama}}/g,P).replace(/{{link}}/g,c);return{name:p,link:c,message:E}});I(d)},R=a=>{navigator.clipboard&&window.isSecureContext?navigator.clipboard.writeText(a).then(()=>{alert("Teks berhasil disalin!")}).catch(n=>{console.error("Failed to copy: ",n),N(a)}):N(a)},N=a=>{var n=document.createElement("textarea");n.value=a,n.style.position="fixed",document.body.appendChild(n),n.focus(),n.select();try{var i=document.execCommand("copy");i&&alert("Teks berhasil disalin!")}catch(d){console.error("Fallback: Oops, unable to copy",d)}document.body.removeChild(n)},G=a=>{const n=`https://wa.me/?text=${encodeURIComponent(a)}`;window.open(n,"_blank")},C=a=>a?a.split(/(\*[^*]+\*)/g).map((i,d)=>i.startsWith("*")&&i.endsWith("*")?e.jsx("strong",{children:i.slice(1,-1)},d):i):null;return e.jsx("div",{className:"form-page-wrapper",children:e.jsxs("div",{className:"form-container",children:[e.jsxs("header",{className:"form-header",children:[e.jsx("h1",{children:"Generator Undangan"}),e.jsx("p",{children:"Buat dan bagikan undangan personal secara otomatis."})]}),e.jsx("div",{className:"form-section mode-section",style:{padding:"20px",textAlign:"center",background:"transparent",boxShadow:"none"},children:e.jsxs("div",{style:{display:"inline-flex",background:"#e2e8f0",padding:"4px",borderRadius:"12px",position:"relative",boxShadow:"inset 0 2px 4px rgba(0,0,0,0.06)"},children:[e.jsx("button",{onClick:()=>T("message"),style:{padding:"10px 24px",border:"none",borderRadius:"10px",background:r==="message"?"white":"transparent",color:r==="message"?"#4f46e5":"#64748b",fontWeight:r==="message"?"700":"600",boxShadow:r==="message"?"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)":"none",cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",transition:"all 0.3s ease",fontSize:"0.95rem"},children:"📝 Pesan WhatsApp"}),e.jsx("button",{onClick:()=>T("link"),style:{padding:"10px 24px",border:"none",borderRadius:"10px",background:r==="link"?"white":"transparent",color:r==="link"?"#4f46e5":"#64748b",fontWeight:r==="link"?"700":"600",boxShadow:r==="link"?"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)":"none",cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",transition:"all 0.3s ease",fontSize:"0.95rem"},children:"🔗 Hanya Link"})]})}),e.jsxs("div",{className:"form-section guide-section",style:{padding:0,overflow:"hidden"},children:[e.jsxs("button",{onClick:a=>{const n=a.currentTarget.nextElementSibling;n.style.display=n.style.display==="none"?"block":"none",a.currentTarget.querySelector(".arrow").textContent=n.style.display==="block"?"▲":"▼"},style:{width:"100%",padding:"16px",textAlign:"left",background:"var(--bg-card, #fff)",border:"none",fontWeight:"bold",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"1rem"},children:[e.jsx("span",{children:"💡 Panduan & Tips Penggunaan"}),e.jsx("span",{className:"arrow",children:"▼"})]}),e.jsx("div",{style:{display:"none",padding:"0 16px 16px 16px",background:"var(--bg-card, #fff)",borderTop:"1px solid var(--border-color, #eee)"},children:e.jsxs("div",{style:{padding:"16px",background:"var(--bg-secondary, #f9f9f9)",borderRadius:"8px",marginTop:"10px"},children:[e.jsx("h4",{style:{marginTop:0,marginBottom:"8px"},children:"📝 Cara Pakai"}),e.jsxs("ol",{style:{margin:"0 0 16px 20px",padding:0,lineHeight:"1.6"},children:[e.jsxs("li",{children:["Pilih Mode: ",e.jsx("strong",{children:"Pesan WhatsApp"})," atau ",e.jsx("strong",{children:"Hanya Link"}),"."]}),e.jsxs("li",{children:["Tulis ",e.jsx("strong",{children:"Daftar Nama Tamu"})," (satu nama per baris)."]}),r==="message"&&e.jsxs("li",{children:["Pilih ",e.jsx("strong",{children:"Template Pesan"})," yang diinginkan."]}),e.jsxs("li",{children:["Klik ",e.jsxs("strong",{children:["Generate ",r==="message"?"Pesan":"Link"]}),"."]})]})]})})]}),l&&e.jsxs("section",{className:"form-section",style:{textAlign:"center",padding:"20px",background:"var(--bg-card, #fff)"},children:[e.jsx("p",{style:{margin:"0 0 8px 0",fontSize:"1rem",color:"#64748b",fontWeight:"bold"},children:"Data Undangan"}),e.jsx("h2",{style:{margin:0,fontSize:"1.5rem",color:"var(--primary-color, #667eea)"},children:l})]}),e.jsxs("section",{className:"form-section",children:[e.jsxs("div",{className:"section-header-row",style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},children:[e.jsx("h2",{className:"section-title",style:{marginBottom:0},children:"👥 1. Daftar Nama Tamu"}),e.jsx("button",{onClick:()=>{window.confirm("Yakin ingin menghapus semua nama tamu?")&&h("")},style:{background:"#ffebee",color:"#e53935",border:"none",padding:"6px 12px",borderRadius:"8px",fontSize:"0.85rem",cursor:"pointer",fontWeight:"600"},children:"🗑️ Reset"})]}),e.jsxs("div",{className:"form-group full-width",children:[e.jsx("label",{children:"Masukkan Nama Tamu (Satu nama per baris)"}),e.jsx("textarea",{rows:"6",placeholder:`Budi Saktiawan
Siti Aminah
Andi Pratama`,value:o,onChange:a=>h(a.target.value)})]})]}),r==="message"&&e.jsxs("section",{className:"form-section",children:[e.jsx("h2",{className:"section-title",children:"📝 2. Template Pesan"}),e.jsx("label",{style:{fontSize:"1.1rem",marginBottom:"12px",display:"block"},children:"✏️ Pilih Template"}),e.jsx("div",{className:"template-selector",children:Object.values(u).map(a=>e.jsx("button",{className:`template-btn ${t===a.id?"active":""}`,onClick:()=>L(a.id),children:a.label},a.id))}),t==="custom"&&e.jsxs("div",{className:"info-banner",style:{marginTop:"20px",marginBottom:"15px",display:"block",lineHeight:"1.6"},children:[e.jsx("p",{style:{margin:"0 0 10px 0"},children:e.jsx("strong",{children:"Panduan Custom Pesan:"})}),e.jsxs("ul",{style:{margin:"0",paddingLeft:"20px"},children:[e.jsxs("li",{children:["Pastikan telah mengisi nama, minimal 1 di ",e.jsx("strong",{children:" Daftar Nama Tamu"})]}),e.jsxs("li",{children:["Gunakan kode ",e.jsx("code",{children:"{{nama}}"})," : Akan otomatis berubah menjadi ",e.jsx("strong",{children:"Nama Tamu"}),"."]}),e.jsxs("li",{children:["Gunakan kode ",e.jsx("code",{children:"{{link}}"})," : Akan otomatis berubah menjadi ",e.jsx("strong",{children:"Link Undangan"})," unik."]}),e.jsx("li",{children:"Apabila ingin mengubah pesan, silakan edit di bagian ini."}),e.jsxs("li",{children:["Tekan ",e.jsx("strong",{children:"Generate Pesan"})," untuk melihat hasilnya"]})]})]}),e.jsxs("div",{className:"form-group full-width",style:{marginTop:"1rem"},children:[e.jsx("label",{style:{fontSize:"1.1rem",marginBottom:"12px",display:"block"},children:t==="custom"?"✏️ Editor Pesan":e.jsxs("span",{children:['📄 Contoh Pesan untuk Tamu "',e.jsxs("strong",{children:[o.split(`
`)[0].trim()||"Nama Tamu",'"']})]})}),t==="custom"?e.jsx("textarea",{className:"template-editor",rows:"16",value:b,onChange:a=>f(a.target.value),style:{fontSize:"1rem",backgroundColor:"white",color:"inherit",cursor:"text"}}):e.jsx("div",{className:"template-preview-box",style:{padding:"14px 16px",border:"2px solid rgba(var(--section-color), 0.15)",borderRadius:"12px",fontSize:"1rem",backgroundColor:"#f5f5f5",color:"#333",whiteSpace:"pre-wrap",minHeight:"120px",lineHeight:"1.5"},children:C(b)})]})]}),e.jsx("div",{style:{textAlign:"center",margin:"2rem 0"},children:e.jsxs("button",{className:"generate-btn",onClick:B,disabled:!o.trim(),children:["✨ Generate ",r==="message"?"Pesan":"Link"," (",o.split(`
`).filter(a=>a.trim()).length," Tamu)"]})}),k.length>0&&e.jsxs("section",{className:"form-section results-section",children:[e.jsxs("h2",{className:"section-title",children:["📤 ",r==="message"?"3.":"2."," Hasil (",k.length,")"]}),e.jsxs("div",{className:"info-banner",style:{marginBottom:"20px",display:"block"},children:[e.jsx("p",{style:{margin:"0 0 10px 0",fontWeight:"bold"},children:"Keterangan Tombol:"}),e.jsxs("ul",{style:{margin:0,paddingLeft:"20px",lineHeight:"1.5"},children:[e.jsxs("li",{children:["📋 ",e.jsx("strong",{children:"Copy"}),": Menyalin ",r==="message"?"teks pesan":"link","."]}),r==="message"&&e.jsxs("li",{children:["📲 ",e.jsx("strong",{children:"WhatsApp"}),": Membuka WhatsApp dengan pesan otomatis terisi."]}),r==="message"&&e.jsxs("li",{children:["👁️ ",e.jsx("strong",{children:"Preview"}),": Melihat pesan yang akan di kirim."]}),e.jsxs("li",{children:["🔗 ",e.jsx("strong",{children:"Lihat"}),": Membuka link undangan atas nama tamu tersebut."]})]})]}),e.jsx("div",{className:"results-list",style:{display:"flex",flexDirection:"column",gap:"10px"},children:k.map((a,n)=>e.jsxs("div",{className:"result-item",style:{background:"white",border:"1px solid var(--border-color)",borderRadius:"12px",overflow:"hidden"},children:[e.jsxs("div",{style:{padding:"16px",display:"flex",flexWrap:"wrap",gap:"16px",alignItems:"center",justifyContent:"space-between"},children:[e.jsxs("h3",{className:"guest-name",style:{margin:0,fontSize:"1.2rem",flex:"1 1 auto",display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("span",{style:{display:"flex",alignItems:"center",justifyContent:"center",width:"28px",height:"28px",background:"var(--bg-input)",color:"#666",borderRadius:"50%",fontSize:"0.9rem",fontWeight:"bold",flexShrink:0},children:n+1}),a.name]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",alignItems:"flex-end",flex:"0 0 auto"},children:[e.jsxs("div",{className:"action-buttons",style:{display:"flex",gap:"8px",flexWrap:"wrap",justifyContent:"flex-end"},children:[e.jsx("button",{className:"btn-copy",onClick:()=>R(a.message),style:{padding:"8px 12px",fontSize:"0.9rem"},children:"📋 Copy"}),r==="message"&&e.jsx("button",{className:"btn-wa",onClick:()=>G(a.message),style:{padding:"8px 12px",fontSize:"0.9rem"},children:"📲 WhatsApp"}),e.jsx("button",{className:"btn-view",onClick:()=>window.open(a.link,"_blank"),style:{padding:"8px 12px",fontSize:"0.9rem"},children:"🔗 Lihat"})]}),r==="message"&&e.jsx("button",{className:"btn-preview",onClick:()=>W(n),style:{padding:"12px 18px",fontSize:"0.85rem",background:y[n]?"#e5e7eb":"transparent",border:"1px solid var(--border-color)",borderRadius:"8px",cursor:"pointer",width:"100%",color:"#666"},children:y[n]?"🙈 Sembunyikan":"👁️ Preview"})]})]}),r==="link"&&e.jsx("div",{style:{padding:"0 16px 16px",marginTop:"-8px"},children:e.jsx("code",{style:{display:"block",background:"#f5f5f5",padding:"8px",borderRadius:"6px",wordBreak:"break-all",color:"#666",fontSize:"0.85rem"},children:a.link})}),r==="message"&&y[n]&&e.jsxs("div",{className:"preview-box-container",style:{padding:"0 16px 16px",borderTop:"2px dashed var(--border-color)",marginTop:"-8px"},children:[e.jsx("p",{style:{fontSize:"0.85rem",color:"#666",marginBottom:"8px",marginTop:"12px"},children:"Preview Pesan:"}),e.jsx("div",{style:{padding:"14px 16px",border:"2px solid rgba(var(--section-color), 0.15)",borderRadius:"12px",fontSize:"1rem",backgroundColor:"#f5f5f5",color:"#333",whiteSpace:"pre-wrap",lineHeight:"1.5"},children:C(a.message)})]})]},n))})]}),e.jsx("style",{children:`
                /* share-page-container removed to match WeddingForm width */
                .form-page-wrapper .template-selector {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-bottom: 1rem;
                }
                .form-page-wrapper .template-btn {
                    padding: 8px 16px;
                    border: 1px solid var(--border-color, #ddd);
                    border-radius: 20px;
                    background: var(--bg-card, #fff);
                    color: var(--text-main, #333);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .form-page-wrapper .template-btn.active {
                    background: var(--primary-color, #667eea);
                    color: white;
                    border-color: var(--primary-color, #667eea);
                }
                .form-page-wrapper .template-editor {
                    font-family: monospace;
                    line-height: 1.5;
                }
                .form-page-wrapper .generate-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 16px 32px;
                    border-radius: 50px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(118, 75, 162, 0.4);
                    transition: transform 0.2s;
                }
                .form-page-wrapper .generate-btn:hover {
                    transform: translateY(-2px);
                }
                .form-page-wrapper .generate-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                .form-page-wrapper .results-grid {
                    display: grid;
                    gap: 20px;
                }
                .form-page-wrapper .result-card {
                    background: var(--bg-card, #fff);
                    border: 1px solid var(--border-color, #eee);
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .form-page-wrapper .guest-name {
                    margin: 0 0 10px 0;
                    font-size: 1.1rem;
                    color: var(--text-main, #333);
                }
                .form-page-wrapper .preview-box {
                    background: var(--bg-secondary, #f9f9f9);
                    padding: 12px;
                    border-radius: 8px;
                    white-space: pre-wrap;
                    font-size: 0.9rem;
                    color: var(--text-muted, #555);
                    max-height: 150px;
                    overflow-y: auto;
                    margin-bottom: 12px;
                    border: 1px solid var(--border-color, #eee);
                }
                .form-page-wrapper .action-buttons {
                    display: flex;
                    gap: 10px;
                }
                .form-page-wrapper .action-buttons button {
                    flex: 1;
                    padding: 10px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    transition: opacity 0.2s;
                }
                .form-page-wrapper .btn-copy {
                    background: var(--bg-secondary, #e2e8f0);
                    color: var(--text-main, #333);
                }
                .form-page-wrapper .btn-wa {
                    background: #25D366;
                    color: white;
                }
                .form-page-wrapper .btn-view {
                    background: #3b82f6;
                    color: white;
                }
                .form-page-wrapper .action-buttons button:hover {
                    opacity: 0.9;
                }
                .form-page-wrapper .helper-text code {
                    background: rgba(0,0,0,0.05);
                    padding: 2px 4px;
                    border-radius: 4px;
                    color: #667eea;
                }
            `})]})})};export{$ as default};
