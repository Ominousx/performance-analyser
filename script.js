const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1fcU1UBeS_7UnmMOJGVZTufRAlLnc1IxfSvHLnQZvfD0/export?format=csv";

let chart;
let allData = [];

function updateChart(player) {
  const playerData = allData.filter(
    (row) => row.Player && row.Player.trim() === player,
  );
  const sorted = playerData.sort((a, b) => new Date(a.Date) - new Date(b.Date));

  const labels = sorted.map((row) => row.Date);
  const values = sorted.map((row) => parseFloat(row["ACS"]));

  const pointBackgroundColors = values.map((val, i, arr) => {
    if (i === 0) return "#4cff4c";
    const drop = arr[i - 1] && val < arr[i - 1] * 0.8;
    return drop ? "#ff4c4c" : "#4cff4c";
  });

  if (chart) chart.destroy();
  if (values.length === 0) return;

  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) /
      values.length,
  );

  chart = new Chart(
    document.getElementById("performanceChart").getContext("2d"),
    {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: `${player} - ACS`,
            data: values,
            borderColor: "#4cff4c",
            backgroundColor: "rgba(76, 255, 76, 0.1)",
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: pointBackgroundColors,
          },
          {
            label: "",
            data: values.map(() => average + stdDev),
            borderColor: "#ffaa00",
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            borderWidth: 1,
          },
          {
            label: "",
            data: values.map(() => average - stdDev),
            borderColor: "#ffaa00",
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
              color: "#e0e0e0",
            },
            ticks: { color: "#e0e0e0" },
            grid: { color: "#333" },
          },
          y: {
            title: {
              display: true,
              text: "ACS",
              color: "#e0e0e0",
            },
            ticks: { color: "#e0e0e0" },
            grid: { color: "#333" },
            beginAtZero: true,
          },
        },
        plugins: {
          legend: { labels: { color: "#e0e0e0" } },
          tooltip: { backgroundColor: "#333" },
        },
        layout: {
          padding: 20,
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    },
  );

  // Fade in chart
  setTimeout(() => {
    const wrapper = document.getElementById("chartWrapper");
    wrapper.style.transition = "opacity 1s ease";
    wrapper.style.opacity = "1";
  }, 100);

  // 🆕 Streak Counter Logic
  let currentStreak = 0;
  let longestStreak = 0;
  const lowerBound = average - stdDev;

  for (let i = 0; i < values.length; i++) {
    if (values[i] >= lowerBound) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  // Current ongoing streak from end
  let currentOngoingStreak = 0;
  for (let i = values.length - 1; i >= 0; i--) {
    if (values[i] >= lowerBound) {
      currentOngoingStreak++;
    } else {
      break;
    }
  }

  // Update Streak Counter
  document.getElementById("streakCounter").innerHTML = `
        <span>Longest High-Performance Streak: <strong>${longestStreak}${longestStreak >= 5 ? " 🏆" : ""}</strong> matches<br>
        Current Streak: <strong class="${currentOngoingStreak > 0 ? "active-streak" : ""}">
        ${currentOngoingStreak}</strong> matches ${currentOngoingStreak > 0 ? "🔥 ongoing" : "ended"}</span>
    `;
}

function createPlayerTable(data) {
  const tableBody = document.querySelector("#playerTable tbody");
  tableBody.innerHTML = "";

  const players = [
    ...new Set(
      data.map((row) => row.Player).filter((p) => p && p.trim() !== ""),
    ),
  ];

  players.forEach((player) => {
    const playerData = data.filter((row) => row.Player.trim() === player);
    const acsValues = playerData
      .map((row) => parseFloat(row["ACS"]))
      .filter((v) => !isNaN(v));
    const averageACS =
      acsValues.reduce((sum, val) => sum + val, 0) / acsValues.length;

    const variance =
      acsValues.reduce((acc, val) => acc + Math.pow(val - averageACS, 2), 0) /
      acsValues.length;
    const stdDev = Math.sqrt(variance);

    const cv = (stdDev / averageACS) * 100;

    const imgName = player.toLowerCase().replace(/\s+/g, "") + ".png";

    const cvColor = cv < 20 ? "#4cff4c" : cv < 30 ? "#ffcc00" : "#ff4c4c";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <img src="pics/${imgName}" alt="${player}" class="player-img" />
        ${player}
      </td>
      <td>${averageACS.toFixed(1)}</td>
      <td>${stdDev.toFixed(1)}</td>
      <td style="color: ${cvColor}; font-weight: bold;">${cv.toFixed(1)}%</td>
    `;
    tableBody.appendChild(row);
  });
}

function initSelectors(data) {
  const players = [
    ...new Set(
      data.map((row) => row.Player).filter((p) => p && p.trim() !== ""),
    ),
  ];
  const playerSelect = document.getElementById("playerSelect");
  playerSelect.innerHTML = players
    .map((p) => `<option value="${p}">${p}</option>`)
    .join("");

  if (players.length === 0) {
    document.getElementById("performanceChart").style.display = "none";
    return;
  }

  playerSelect.addEventListener("change", () => {
    updateChart(playerSelect.value);
  });

  updateChart(players[0]);
}

Papa.parse(SHEET_CSV_URL, {
  download: true,
  header: true,
  complete: function (results) {
    document.getElementById("loadingSpinner").style.display = "none";
    allData = results.data.filter((row) => row.Player && row.Date && row.ACS);
    initSelectors(allData);
    createPlayerTable(allData);
  },
});
