import './style.css'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const FUNCTIONS_BASE = `${SUPABASE_URL}/functions/v1`;

document.querySelector('#app').innerHTML = `
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
`;

// Create User
document.getElementById('user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('uname').value;
  const resultDiv = document.getElementById('user-result');

  try {
    const res = await fetch(`${FUNCTIONS_BASE}/api-users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const data = await res.json();
    resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
});

// Add Exercise
document.getElementById('exercise-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.getElementById('uid').value;
  const description = document.getElementById('desc').value;
  const duration = document.getElementById('dur').value;
  const date = document.getElementById('date').value;
  const resultDiv = document.getElementById('exercise-result');

  try {
    const res = await fetch(`${FUNCTIONS_BASE}/api-exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, description, duration, date: date || undefined })
    });
    const data = await res.json();
    resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
});

// Get Log
document.getElementById('log-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.getElementById('log-uid').value;
  const from = document.getElementById('log-from').value;
  const to = document.getElementById('log-to').value;
  const limit = document.getElementById('log-limit').value;
  const resultDiv = document.getElementById('log-result');

  const params = new URLSearchParams();
  params.append('userId', userId);
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  if (limit) params.append('limit', limit);

  try {
    const res = await fetch(`${FUNCTIONS_BASE}/api-logs?${params.toString()}`);
    const data = await res.json();
    resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
});
