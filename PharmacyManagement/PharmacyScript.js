(() => {
    const page = document.body.querySelector('body').getAttribute('data-page');
  
    const redirectToLogin = () => window.location = 'PharmacyLogin.html';
  
    const requireAuth = () => {
      const usr = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!usr) return redirectToLogin();
      return usr;
    };
  
    const requireAdmin = () => {
      const usr = requireAuth();
      if (usr.role !== 'admin') return window.alert('Access denied — Admin only') || redirectToLogin();
    };
  
    const usersKey = 'pharmacy_users';
    const medsKey = 'pharmacy_medicines';
  
    const defaultUsers = [{username: 'admin', password: 'p', role: 'admin'}];
    const defaultMeds = [
      {name: 'Paracetamol', qty: 100, price: 0.5},
      {name: 'Amoxicillin', qty: 50, price: 1.2},
    ];
  
    if (!localStorage.getItem(usersKey)) localStorage.setItem(usersKey, JSON.stringify(defaultUsers));
    if (!localStorage.getItem(medsKey)) localStorage.setItem(medsKey, JSON.stringify(defaultMeds));
  
    // Login Page Logic
    if (location.pathname.endsWith('PharmacyLogin.html')) {
      document.getElementById('loginForm').addEventListener('submit', e => {
        e.preventDefault();
        const username = e.target.username.value.trim();
        const password = e.target.password.value;
        const users = JSON.parse(localStorage.getItem(usersKey));
        const found = users.find(u => u.username === username && u.password === password);
        if (found) {
          localStorage.setItem('currentUser', JSON.stringify(found));
          window.location = 'PharmacyDashboard.html';
        } else {
          document.getElementById('loginError').textContent = 'Invalid credentials.';
        }
      });
    }
  
    // Logout Logic
    if (document.getElementById('logoutBtn')) {
      document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        redirectToLogin();
      });
    }
  
    // Medicine Management Logic
    if (location.pathname.endsWith('PharmacyMedicine.html')) {
      requireAuth();
      const medForm = document.getElementById('medicineForm'),
            medTable = document.querySelector('#medicineTable tbody'),
            medList = () => JSON.parse(localStorage.getItem(medsKey) || '[]');
  
      const renderMeds = () => {
        medTable.innerHTML = '';
        medList().forEach((med, i) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${med.name}</td>
            <td>${med.qty}</td>
            <td>$${med.price.toFixed(2)}</td>
            <td>
              <button class="action-btn edit-btn">Edit</button>
              <button class="action-btn delete-btn">Delete</button>
            </td>`;
          row.querySelector('.edit-btn').onclick = () => {
            medForm.medName.value = med.name;
            medForm.medQty.value = med.qty;
            medForm.medPrice.value = med.price;
            medForm.editIndex.value = i;
            medForm.querySelector('button').textContent = 'Update';
          };
          row.querySelector('.delete-btn').onclick = () => {
            const arr = medList();
            arr.splice(i, 1);
            localStorage.setItem(medsKey, JSON.stringify(arr));
            renderMeds();
          };
          medTable.appendChild(row);
        });
      };
  
      medForm.addEventListener('submit', e => {
        e.preventDefault();
        const arr = medList();
        const med = {
          name: e.target.medName.value.trim(),
          qty: parseInt(e.target.medQty.value),
          price: parseFloat(e.target.medPrice.value),
        };
        const idx = e.target.editIndex.value;
        if (idx) arr[idx] = med;
        else arr.push(med);
        localStorage.setItem(medsKey, JSON.stringify(arr));
        medForm.reset();
        medForm.editIndex.value = '';
        medForm.querySelector('button').textContent = 'Save Medicine';
        renderMeds();
      });
  
      document.getElementById('exportCsv').onclick = () => {
        const data = medList();
        const csv = ['Name,Qty,Price', ...data.map(m => `${m.name},${m.qty},${m.price.toFixed(2)}`)].join('\n');
        downloadFile(csv, 'medicines.csv', 'text/csv');
      };
      document.getElementById('exportJson').onclick = () => {
        downloadFile(JSON.stringify(medList(), null, 2), 'medicines.json', 'application/json');
      };
      document.getElementById('exportXml').onclick = () => {
        const xml = `<medicines>\n${medList().map(m => `  <medicine><name>${m.name}</name><qty>${m.qty}</qty><price>${m.price.toFixed(2)}</price></medicine>`).join('\n')}\n</medicines>`;
        downloadFile(xml, 'medicines.xml', 'application/xml');
      };
  
      renderMeds();
    }
  
    // User Management Logic
    if (location.pathname.endsWith('PharmacyUsers.html')) {
      requireAdmin();
      const userForm = document.getElementById('userForm'),
            userTable = document.querySelector('#userTable tbody'),
            usersArr = () => JSON.parse(localStorage.getItem(usersKey) || '[]');
  
      const renderUsers = () => {
        userTable.innerHTML = '';
        usersArr().forEach((u, i) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${u.username}</td>
            <td>${u.role}</td>
            <td>
              <button class="action-btn edit-btn">Edit</button>
              <button class="action-btn delete-btn">Delete</button>
            </td>`;
          row.querySelector('.edit-btn').onclick = () => {
            userForm.newUsername.value = u.username;
            userForm.newPassword.value = u.password;
            userForm.newRole.value = u.role;
            userForm.editUserIndex.value = i;
            userForm.querySelector('button').textContent = 'Update User';
          };
          row.querySelector('.delete-btn').onclick = () => {
            const arr = usersArr();
            arr.splice(i, 1);
            localStorage.setItem(usersKey, JSON.stringify(arr));
            renderUsers();
          };
          userTable.appendChild(row);
        });
      };
  
      userForm.addEventListener('submit', e => {
        e.preventDefault();
        const arr = usersArr();
        const usr = {
          username: e.target.newUsername.value.trim(),
          password: e.target.newPassword.value,
          role: e.target.newRole.value,
        };
        const idx = e.target.editUserIndex.value;
        if (idx) arr[idx] = usr;
        else arr.push(usr);
        localStorage.setItem(usersKey, JSON.stringify(arr));
        userForm.reset();
        userForm.editUserIndex.value = '';
        userForm.querySelector('button').textContent = 'Save User';
        renderUsers();
      });
  
      renderUsers();
    }
  
    // Utility to trigger download
    window.downloadFile = (content, filename, mime) => {
      const a = document.createElement('a'), blob = new Blob([content], { type: mime });
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    };
  })();
  