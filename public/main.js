document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('expenseForm');
  const amountInput = document.getElementById('amount');
  const categoryInput = document.getElementById('category');
  const dateInput = document.getElementById('date');
  const noteInput = document.getElementById('note');
  const expenseTable = document.getElementById('expenseTable');
  const total = document.getElementById('total');
  let categoryChart, trendChart;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const expense = {
      amount: Number(amountInput.value),
      category: categoryInput.value,
      date: dateInput.value,
      note: noteInput.value
    };
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense)
    });
    form.reset();
    loadExpenses();
  });

  async function loadExpenses() {
    const res = await fetch('/api/expenses');
    const data = await res.json();

    // Display records in table
    expenseTable.innerHTML = data.map(expense => `
      <tr>
        <td>${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.date.substring(0, 10)}</td>
        <td>${expense.note}</td>
      </tr>
    `).join('');

    // Calculate & display total
    const totalAmount = data.reduce((sum, e) => sum + e.amount, 0);
    total.textContent = totalAmount;

    // Prepare category-wise data
    const categoryMap = {};
    data.forEach(e => categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount);
    const categories = Object.keys(categoryMap);
    const categoryValues = Object.values(categoryMap);

    // Pie Chart
    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(document.getElementById('categoryChart'), {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          data: categoryValues,
          backgroundColor: ['#90caf9', '#f48fb1', '#a5d6a7', '#ffe082', '#b39ddb', '#ffab91']
        }]
      }
    });

    // Prepare date-wise data for line chart
    const dateMap = {};
    data.forEach(e => {
      const d = e.date.substring(0, 10);
      if (!dateMap[d]) dateMap[d] = 0;
      dateMap[d] += e.amount;
    });
    const dateLabels = Object.keys(dateMap).sort();
    const dateValues = dateLabels.map(d => dateMap[d]);
    if (trendChart) trendChart.destroy();
    trendChart = new Chart(document.getElementById('trendChart'), {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [{
          label: 'Spending',
          data: dateValues,
          borderColor: '#1976d2',
          fill: false
        }]
      }
    });
  }

  loadExpenses();
});

