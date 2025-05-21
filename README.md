
# 🎯 Performance Analyser

Welcome to the **Performance Analyser** – a web-based tool designed to track, visualize, and evaluate player performance trends over time, built specifically for esports analysts, coaches, and data-savvy players.

🔗 [Live Demo](https://ominousx.github.io/performance-analyser/)

---

## 📈 Features

- **Player ACS Trendline**  
  Visualizes Average Combat Score (ACS) across a timeline for each player.

- **Consistency Metrics**  
  - **Standard Deviation (Std Dev)** – Measures performance variability.
  - **Coefficient of Variation (CV%)** – Normalized measure of consistency.

- **Role-Based Context**  
  Adds narrative context based on player roles (e.g., Duelists expected to have high variance).

- **CSV Upload Support**  
  Upload your `.csv` file with player stats and instantly analyze trends.

---

## 📁 How to Use

1. **Visit the Web App**:  
   [https://ominousx.github.io/performance-analyser/](https://ominousx.github.io/performance-analyser/)

2. **Upload Your Data**:  
   Use the file upload button to add your performance CSV.

3. **View Insights**:  
   The tool auto-generates graphs and consistency scores per player.

---

## 📊 CSV Format

The CSV file should contain at least:

```csv
Date,Player,ACS
2025-01-15,Juicy,240
2025-01-16,Yui,198
...
```

Additional columns like K/D, Agent, or Map can be added but are currently optional.

---

## 🚀 Tech Stack

- HTML + CSS + JavaScript
- Chart.js for dynamic graphing
- Fully client-side – no backend or data storage

---

## 💡 Roadmap

- [ ] Multi-metric comparison (K/D, FKPR, etc.)
- [ ] Dark mode toggle
- [ ] Role filters
- [ ] Export graphs as images

---

## ✍️ Credits

Built by [@Ominousx](https://github.com/Ominousx) 🎮  
For any feedback, feel free to open an issue or connect on Twitter/X: [@Ominousx](https://twitter.com/Ominousx)

---

## 📄 License

MIT License – free to use, modify, and share.
