// let inventory = JSON.parse(localStorage.getItem("inventoryData")) || [];
// Sample Items Below

let inventory = JSON.parse(localStorage.getItem("inventoryData")) || [
    
  { name: "Laptop", qty: 12, category: "Electronics" },
  { name: "Printer Ink", qty: 4, category: "Supplies" },
  { name: "Office Chair", qty: 8, category: "Furniture" },
  { name: "HDMI Cable", qty: 25, category: "Electronics" },
  { name: "Notebook", qty: 100, category: "Stationery" },
  { name: "Coffee Cups", qty: 50, category: "Pantry" },
  { name: "Router", qty: 3, category: "Networking" },
  { name: "Whiteboard Marker", qty: 15, category: "Stationery" }
];

let history = JSON.parse(localStorage.getItem("inventoryHistory")) || [];
let editingIndex = null;

function openAddModal() {
  editingIndex = null;  // reset to null on new add
  document.getElementById("modalTitle").textContent = "Add Item";
  document.getElementById("itemName").value = "";
  document.getElementById("itemQty").value = "";
  document.getElementById("itemCategory").value = "";
  document.getElementById("itemModal").style.display = "block";
}


function openEditModal(index) {
  editingIndex = index;
  const item = inventory[index];
  document.getElementById("modalTitle").textContent = "Edit Item";
  document.getElementById("itemName").value = item.name;
  document.getElementById("itemQty").value = item.qty;
  document.getElementById("itemCategory").value = item.category;
  document.getElementById("itemModal").style.display = "block";
}

function saveItem() {
  const name = document.getElementById("itemName").value.trim();
  const qty = parseInt(document.getElementById("itemQty").value);
  const category = document.getElementById("itemCategory").value.trim();

  if (!name || isNaN(qty) || qty < 0 || !category) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const item = { name, qty, category };

  if (editingIndex === null) {
    // Add new item
    inventory.push(item);
    history.push(`Added "${name}" with qty ${qty}.`);
  } else {
    // Replace existing item at editingIndex
    inventory[editingIndex] = item;
    history.push(`Edited "${name}" to qty ${qty}.`);
  }

  updateStorage();
  renderInventory();

  // Show success message
  const messageBox = document.getElementById("saveMessage");
  messageBox.textContent = "Saved successfully!";
  messageBox.style.display = "block";

  // Hide message and close modal after 1.2 seconds
  setTimeout(() => {
    messageBox.style.display = "none";
    closeModal();
  }, 1200);
}
function closeModal() {
  document.getElementById("itemModal").style.display = "none";
  editingIndex = null;
}

function editItem(index) {
  editingIndex = index; // VERY IMPORTANT
  openAddModal();
  document.getElementById("modalTitle").textContent = "Edit Item";
  const item = inventory[index];
  document.getElementById("itemName").value = item.name;
  document.getElementById("itemQty").value = item.qty;
  document.getElementById("itemCategory").value = item.category;
}

function saveItem() {
  const name = document.getElementById("itemName").value.trim();
  const qty = parseInt(document.getElementById("itemQty").value);
  const category = document.getElementById("itemCategory").value.trim();

  if (!name || isNaN(qty) || qty < 0 || !category) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const item = { name, qty, category };

  if (editingIndex === null) {
    // Add new item
    inventory.push(item);
    history.push(`Added "${name}" with qty ${qty}.`);
  } else {
    // Replace existing item
    inventory[editingIndex] = item;
    history.push(`Edited "${name}" to qty ${qty}.`);
  }

  updateStorage();
  renderInventory();

  // Show success message bubble
  const messageBox = document.getElementById("saveMessage");
  messageBox.textContent = "Saved successfully!";
  messageBox.style.display = "block";

  // Hide message and close modal after 1.2 seconds
  setTimeout(() => {
    messageBox.style.display = "none";
    closeModal();
  }, 1200);
}
function renderInventory() {
  const tbody = document.getElementById("inventoryBody");
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filter = document.getElementById("categoryFilter").value.toLowerCase();

  tbody.innerHTML = "";
  const categories = new Set();

  inventory.forEach((item, index) => {
    if (
      (!search || item.name.toLowerCase().includes(search)) &&
      (!filter || item.category.toLowerCase() === filter)
    ) {
      const tr = document.createElement("tr");
      const status = item.qty <= 5 ? `<span class="low-stock">Low</span>` : "OK";
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.category}</td>
        <td>${status}</td>
        <td>
          <button onclick="editItem(${index})">Edit</button>
          <button onclick="deleteItem(${index})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    }
    categories.add(item.category);
  });

  renderHistory();
  updateCategoryFilter(Array.from(categories));
}

function updateCategoryFilter(categories) {
  const select = document.getElementById("categoryFilter");
  select.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function editItem(index) {
  const item = inventory[index];
  editingIndex = index;
  openAddModal();
  document.getElementById("modalTitle").textContent = "Edit Item";
  document.getElementById("itemName").value = item.name;
  document.getElementById("itemQty").value = item.qty;
  document.getElementById("itemCategory").value = item.category;
}

function deleteItem(index) {
  const removed = inventory.splice(index, 1)[0];
  history.push(`Deleted "${removed.name}".`);
  updateStorage();
  renderInventory();
}

function clearInventory() {
  if (confirm("Are you sure you want to delete all inventory?")) {
    inventory = [];
    history.push("Cleared all inventory.");
    updateStorage();
    renderInventory();
  }
}

function exportCSV() {
  let csv = "Name,Quantity,Category\n";
  inventory.forEach(item => {
    csv += `${item.name},${item.qty},${item.category}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "inventory.csv";
  link.click();
}

function updateStorage() {
  localStorage.setItem("inventoryData", JSON.stringify(inventory));
  localStorage.setItem("inventoryHistory", JSON.stringify(history));
}

function renderHistory() {
  const log = document.getElementById("historyLog");
  log.innerHTML = history.slice(-10).reverse().map(h => `<li>${h}</li>`).join("");
}

document.getElementById("searchInput").addEventListener("input", renderInventory);
document.getElementById("categoryFilter").addEventListener("change", renderInventory);

// Initial render
renderInventory();
