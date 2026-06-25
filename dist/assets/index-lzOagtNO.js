(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`undefined/functions/v1`;document.querySelector(`#app`).innerHTML=`
<div class="container">
  <h1>Exercise tracker</h1>
  <form id="user-form">
    <h2>Create a New User</h2>
    <p><code>POST /api/users</code></p>
    <input id="uname" type="text" name="username" placeholder="username" required />
    <input type="submit" value="Submit" />
  </form>
  <div id="user-result"></div>

  <form id="exercise-form">
    <h2>Add exercises</h2>
    <p><code>POST /api/users/:_id/exercises</code></p>
    <input id="uid" type="text" name="_id" placeholder=":_id" required />
    <input id="desc" type="text" name="description" placeholder="description*" required />
    <input id="dur" type="text" name="duration" placeholder="duration* (mins.)" required />
    <input id="date" type="text" name="date" placeholder="date (yyyy-mm-dd)" />
    <input type="submit" value="Submit" />
  </form>
  <div id="exercise-result"></div>

  <form id="log-form">
    <h2>Get Exercise Log</h2>
    <p><code>GET /api/users/:_id/logs?[from][&to][&limit]</code></p>
    <input id="log-uid" type="text" name="_id" placeholder=":_id" required />
    <input id="log-from" type="text" name="from" placeholder="from (yyyy-mm-dd)" />
    <input id="log-to" type="text" name="to" placeholder="to (yyyy-mm-dd)" />
    <input id="log-limit" type="text" name="limit" placeholder="limit" />
    <input type="submit" value="Get Log" />
  </form>
  <div id="log-result"></div>

  <p><strong>[ ]</strong> = optional</p>
  <p><strong>from, to</strong> = dates (yyyy-mm-dd); <strong>limit</strong> = number</p>
</div>
`,document.getElementById(`user-form`).addEventListener(`submit`,async t=>{t.preventDefault();let n=document.getElementById(`uname`).value,r=document.getElementById(`user-result`);try{let t=await(await fetch(`${e}/api-users`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({username:n})})).json();r.innerHTML=`<pre>${JSON.stringify(t,null,2)}</pre>`}catch(e){r.innerHTML=`<p style="color:red">Error: ${e.message}</p>`}}),document.getElementById(`exercise-form`).addEventListener(`submit`,async t=>{t.preventDefault();let n=document.getElementById(`uid`).value,r=document.getElementById(`desc`).value,i=document.getElementById(`dur`).value,a=document.getElementById(`date`).value,o=document.getElementById(`exercise-result`);try{let t=await(await fetch(`${e}/api-exercises`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({userId:n,description:r,duration:i,date:a||void 0})})).json();o.innerHTML=`<pre>${JSON.stringify(t,null,2)}</pre>`}catch(e){o.innerHTML=`<p style="color:red">Error: ${e.message}</p>`}}),document.getElementById(`log-form`).addEventListener(`submit`,async t=>{t.preventDefault();let n=document.getElementById(`log-uid`).value,r=document.getElementById(`log-from`).value,i=document.getElementById(`log-to`).value,a=document.getElementById(`log-limit`).value,o=document.getElementById(`log-result`),s=new URLSearchParams;s.append(`userId`,n),r&&s.append(`from`,r),i&&s.append(`to`,i),a&&s.append(`limit`,a);try{let t=await(await fetch(`${e}/api-logs?${s.toString()}`)).json();o.innerHTML=`<pre>${JSON.stringify(t,null,2)}</pre>`}catch(e){o.innerHTML=`<p style="color:red">Error: ${e.message}</p>`}});