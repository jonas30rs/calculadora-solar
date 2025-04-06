document.getElementById("energyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const equipment = document.getElementById("equipment").value;
  const quantity = parseInt(document.getElementById("quantity").value);
  const power = parseFloat(document.getElementById("power").value);
  const hours = parseFloat(document.getElementById("hours").value);
  const minutes = parseFloat(document.getElementById("minutes").value);

  const totalHours = hours + (minutes / 60);
  const dailyConsumption = (quantity * power * totalHours) / 1000;

  const table = document.querySelector("#equipmentList tbody");
  const row = table.insertRow();

  row.innerHTML = `
    <td>${equipment}</td>
    <td>${quantity}</td>
    <td>${power}</td>
    <td>${hours}h ${minutes}min</td>
    <td>${dailyConsumption.toFixed(2)}</td>
  `;

  updateTotals();
  this.reset();
});

document.getElementById("clearBtn").addEventListener("click", function () {
  document.querySelector("#equipmentList tbody").innerHTML = "";
  updateTotals();
  localStorage.clear();
});

function updateTotals() {
  const rows = document.querySelectorAll("#equipmentList tbody tr");
  let totalKwh = 0;
  let inverterW = 0;

  rows.forEach(row => {
    const qtd = parseInt(row.cells[1].textContent);
    const pot = parseFloat(row.cells[2].textContent);
    const consumo = parseFloat(row.cells[4].textContent);
    totalKwh += consumo;
    inverterW += qtd * pot;
  });

  const sunHours = parseFloat(document.getElementById("sunHours").value);
  const voltage = parseFloat(document.getElementById("systemVoltage").value);
  const autonomy = parseFloat(document.getElementById("autonomyDays").value);

  const systemSize = totalKwh / sunHours;
  const panelCount = systemSize / 0.33;
  const batteryWh = totalKwh * autonomy * 1000;
  const batteryAh = batteryWh / voltage;

  document.getElementById("totalConsumption").textContent = totalKwh.toFixed(2);
  document.getElementById("systemSize").textContent = systemSize.toFixed(2);
  document.getElementById("panelCount").textContent = Math.ceil(panelCount);
  document.getElementById("batteryCapacity").textContent = Math.ceil(batteryAh);
  document.getElementById("inverterPower").textContent = Math.ceil(inverterW);
}

// Salvar no localStorage
function saveToLocalStorage() {
  localStorage.setItem("equipamentos", document.querySelector("#equipmentList tbody").innerHTML);
  localStorage.setItem("sunHours", document.getElementById("sunHours").value);
  localStorage.setItem("systemVoltage", document.getElementById("systemVoltage").value);
  localStorage.setItem("autonomyDays", document.getElementById("autonomyDays").value);
}

function loadFromLocalStorage() {
  const tbody = document.querySelector("#equipmentList tbody");
  tbody.innerHTML = localStorage.getItem("equipamentos") || '';
  document.getElementById("sunHours").value = localStorage.getItem("sunHours") || 5;
  document.getElementById("systemVoltage").value = localStorage.getItem("systemVoltage") || 24;
  document.getElementById("autonomyDays").value = localStorage.getItem("autonomyDays") || 1;
  updateTotals();
}

// Executar ao carregar
window.addEventListener("load", loadFromLocalStorage);
setInterval(saveToLocalStorage, 3000);
