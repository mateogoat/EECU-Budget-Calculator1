// --- Step Pages ---
const stepPages = document.querySelectorAll(".progressBar button");
stepPages.forEach(btn => {
  btn.addEventListener("click", () => {
    stepPages.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    // Logic to show/hide sections based on step can be added here
    btn.dataset.section && document.querySelectorAll(".inputs > div").forEach(div => {
      div.style.display = div.id === btn.dataset.section ? "block" : "none";
    });
  });
});


// --- Creating input elements ---
const createInputElement = (id, label) => {
  const container = document.getElementById("informationLegend");
  const input = document.createElement("input");
  input.type = "number";
  input.id = id;
  input.placeholder = label;
  container.appendChild(input);
  return container;
};

// --- Chart.js setup ---
const canvas = document.getElementById("chartCanvas").getContext("2d");
const chartTypeSelect = document.getElementById("chartTypeSelect");
const monthselect = document.getElementById("monthSelect");
const budgetSelect = document.getElementById("budgetSelect");
const metricSelect = document.getElementById("metricSelect");
const renderBtn = document.getElementById("renderBtn");

// --- Setup ---
const housingData = createInputElement("housingData", "Housing");
const utilData = createInputElement("utilData", "Utilities");
const transportData = createInputElement("transportData", "Transport");
const entertainmentData = createInputElement("entertainmentData", "Entertainment");
const hobbiesData = createInputElement("hobbiesData", "Hobbies");
const splurgeData = createInputElement("splurgeData", "Splurge");
const emergencyData = createInputElement("emergencyData", "Emergency");
const retireData = createInputElement("retireData", "Retirement");
const vacationData = createInputElement("vacationData", "Vacation");
const chartData = [
  { month: 1, budget: "Housing", value: housingData.value },
  { month: 1, budget: "Utilities", value: utilData.value },
  { month: 1, budget: "Transport", value: transportData.value },
  { month: 1, budget: "Entertainment", value: entertainmentData.value },
  { month: 1, budget: "Hobbies", value: hobbiesData.value },
  { month: 1, budget: "Splurge", value: splurgeData.value },
  { month: 1, budget: "Emergency", value: emergencyData.value },
  { month: 1, budget: "Retirement", value: retireData.value },
  { month: 1, budget: "Vacation", value: vacationData.value },
];

let currentChart = null;

// --- Populate dropdowns from data ---
const months = [...new Set(chartData.map(r => r.month))];
const budgets = [...new Set(chartData.map(r => r.budget))];

months.forEach(m => monthselect.add(new Option(m, m)));
budgets.forEach(h => budgetSelect.add(new Option(h, h)));
budgetSelect.add(new Option("eSports", "eSports"));

monthselect.value = months[0];
budgetSelect.value = budgets[0];

// --- Main render ---
renderBtn.addEventListener("click", () => {
  const chartType = chartTypeSelect.value;
  const month = Number(monthselect.value);
  const budget = budgetSelect.value;
  const metric = metricSelect.value;

  // Destroy old chart if it exists (common Chart.js gotcha)
  if (currentChart) currentChart.destroy();

  // Build chart config based on type
  const config = buildConfig(chartType, { month, budget, metric });

  currentChart = new Chart(canvas, config);
});

function doughnutDiffCosts(month, budget) {
  const rows = getRowsForbudget(budget).filter(r => r.month === month);

  const regionSums = rows.reduce((acc, r) => {
    const region = r.region;
    const rev = r.revenue;
    acc[region] = (acc[region] || 0) + rev;
    return acc;
  }, {});

  const labels = Object.keys(regionSums);
  const data = labels.map(l => regionSums[l]);

  return {
    type: "doughnut",
    data: {
      labels,
      datasets: [{ label: "Revenue (USD)", data }]
    },
    options: {
      plugins: {
        title: { display: true, text: `Revenue by region: ${budget} (${month})` }
      }
    }
  };
}