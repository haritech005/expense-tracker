## Expense Tracker

A sleek, dark-themed **expense tracking web app** built with plain **HTML, CSS, and JavaScript**. It lets you quickly add expenses, categorize them, and see your total spending at a glance.

### Features

- **Add expenses** with name, amount (₹), and category.
- **Custom dropdowns** for category selection and filtering.
- **Category filter** to view only specific types of expenses.
- **Live total** of all expenses displayed in the header.
- **Animated list items** and delete with a smooth remove animation.
- **LocalStorage support** so your data stays even after refreshing the page.
- **Responsive layout** that works on mobile, tablet, and desktop.

### Tech Stack

- HTML5
- CSS3 (modern, dark UI)
- Vanilla JavaScript (no frameworks)

### Getting Started (Local)

1. **Clone the repository**

   ```bash
   git clone https://github.com/haritech005/expense-tracker.git
   cd expense-tracker
   ```

2. **Open in the browser (simple way)**

   - Double-click `index.html`, or  
   - From terminal/PowerShell:

     ```bash
     start index.html
     ```

3. **(Recommended) Serve with a local server**

   Using `http-server`:

   ```bash
   npm install -g http-server   # one-time
   http-server -p 5500
   ```

   Then open `http://localhost:5500/index.html` in your browser.

### Usage

1. Enter an **expense name** and **amount**.
2. Choose a **category** from the dropdown.
3. Click **“Add Expense”**.
4. Use the **“Filter by Category”** dropdown to narrow down the list.
5. Click the **trash icon** to delete an expense.

### Future Improvements (Ideas)

- Edit existing expenses.
- Monthly/weekly summaries and charts.
- Export data as CSV.
- Multi-currency support.

