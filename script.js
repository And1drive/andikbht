// script.js
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwYZOMUVUlC6O9lvLdKRRtTA51aRdceDFge8Zk_mFiC32BeJyrO7vmLGRbzGE3JJ-s/exec'; // Ganti dengan URL Web App kamu

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  fetch(GAS_WEB_APP_URL, {
    method: 'POST',
    body: JSON.stringify({ action: '_login', username, password }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(response => {
    if (response.success) {
      localStorage.setItem('token', response.token);
      showMainMenu();
    } else {
      alert(response.message || 'Login gagal');
    }
  });
}

function showMainMenu() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('mainMenu').style.display = 'block';
}

function logout() {
  localStorage.removeItem('token');
  location.reload();
}

function goTo(menu) {
  alert('Navigasi ke menu: ' + menu); // Ganti dengan fungsi navigasi sesungguhnya
}

window.onload = () => {
  const token = localStorage.getItem('token');
  if (token) {
    fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      body: JSON.stringify({ action: '_whoami', token }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(response => {
      if (response.success) {
        showMainMenu();
      } else {
        localStorage.removeItem('token');
      }
    });
  }
};

function goTo(menu) {
  if (menu === 'input') {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('inputForm').style.display = 'block';
    isiDropdownMaster();
    isiBulanTahun();
  }
  // Tambahkan menu lain nanti
}

function kembaliKeMenu() {
  document.getElementById('inputForm').style.display = 'none';
  document.getElementById('mainMenu').style.display = 'block';
}

function isiDropdownMaster() {
  const token = localStorage.getItem('token');
  fetch(GAS_WEB_APP_URL, {
    method: 'POST',
    body: JSON.stringify({ action: '_getMasterData', token }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(response => {
    if (response.success) {
      const penerimaSelect = document.getElementById('penerima');
      const penyetorSelect = document.getElementById('penyetor');
      penerimaSelect.innerHTML = '';
      penyetorSelect.innerHTML = '';
      response.data.forEach(nama => {
        const opt1 = document.createElement('option');
        opt1.value = opt1.text = nama;
        penerimaSelect.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = opt2.text = nama;
        penyetorSelect.appendChild(opt2);
      });
    }
  });
}

function isiBulanTahun() {
  const bulanSelect = document.getElementById('bulan');
  const tahunSelect = document.getElementById('tahun');
  const bulanList = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  bulanSelect.innerHTML = '';
  tahunSelect.innerHTML = '';
  bulanList.forEach((b, i) => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.text = b;
    if (i === currentMonth) opt.selected = true;
    bulanSelect.appendChild(opt);
  });

  for (let y = currentYear - 2; y <= currentYear + 2; y++) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.text = y;
    if (y === currentYear) opt.selected = true;
    tahunSelect.appendChild(opt);
  }
}

function formatAngka(inputId) {
  const el = document.getElementById(inputId);
  let val = el.value.replace(/\D/g, '');
  el.value = Number(val).toLocaleString('id-ID');
}

['jumlah','kasPenerima','kasPanitia'].forEach(id => {
  document.getElementById(id).addEventListener('blur', () => formatAngka(id));
});

function simpanInput() {
  const token = localStorage.getItem('token');
  const data = {
    action: '_saveInput',
    token,
    penerima: document.getElementById('penerima').value,
    bulan: document.getElementById('bulan').value,
    tahun: document.getElementById('tahun').value,
    penyetor: document.getElementById('penyetor').value,
    jumlah: document.getElementById('jumlah').value.replace(/\D/g, ''),
    kasPenerima: document.getElementById('kasPenerima').value.replace(/\D/g, ''),
    kasPanitia: document.getElementById('kasPanitia').value.replace(/\D/g, '')
  };

  fetch(GAS_WEB_APP_URL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(response => {
    if (response.success) {
      document.getElementById('statusInput').textContent = '✅ Data berhasil disimpan!';
    } else {
      document.getElementById('statusInput').textContent = '❌ Gagal menyimpan data.';
    }
  });
}

