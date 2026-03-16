document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const nameInput = document.getElementById('name');
    const amountInput = document.getElementById('amount');
    const categoryInput = document.getElementById('category');
    const expenseList = document.getElementById('expense-list');
    const totalAmountDisplay = document.getElementById('total-amount');
    const emptyState = document.getElementById('empty-state');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let currentFilter = 'All';

    // Initialize the app
    function init() {
        setupCustomDropdowns();
        renderExpenses();
        updateTotal();
    }

    // Save to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    // Add new expense
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const amount = amountInput.value.trim();
        const category = categoryInput.value;

        let isValid = true;

        // Reset errors
        document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
        document.querySelectorAll('input, select, .custom-select').forEach(el => el.classList.remove('invalid'));

        // Validate Name
        if (!name) {
            document.getElementById('name-error').style.display = 'block';
            nameInput.classList.add('invalid');
            isValid = false;
        }

        // Validate Amount
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            document.getElementById('amount-error').style.display = 'block';
            amountInput.classList.add('invalid');
            isValid = false;
        }

        // Validate Category
        if (!category) {
            document.getElementById('category-error').style.display = 'block';
            document.getElementById('category-wrapper').classList.add('invalid');
            isValid = false;
        }

        if (!isValid) return;

        const expense = {
            id: Date.now(),
            name,
            amount: parseFloat(amount),
            category
        };

        expenses.push(expense);
        saveToLocalStorage();
        renderExpenses();
        updateTotal();

        // Reset form
        expenseForm.reset();
        document.getElementById('category').value = '';
        document.getElementById('category-display').innerHTML = 'Select Category';
        document.querySelectorAll('#category-wrapper .same-as-selected').forEach(el => el.classList.remove('same-as-selected'));
        nameInput.focus();
    });

    // Delete expense with animation
    function deleteExpense(id) {
        const itemElement = document.querySelector(`[data-id="${id}"]`);
        itemElement.classList.add('removing');
        
        itemElement.addEventListener('animationend', () => {
            expenses = expenses.filter(expense => expense.id !== id);
            saveToLocalStorage();
            renderExpenses();
            updateTotal();
        }, { once: true });
    }

    // Handle delete button clicks
    expenseList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const id = parseInt(e.target.closest('.expense-item').dataset.id);
            deleteExpense(id);
        }
    });

    // Update total amount
    function updateTotal() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmountDisplay.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // Custom Dropdown Logic
    function setupCustomDropdowns() {
        const customSelects = document.querySelectorAll('.custom-select');

        // Close all dropdowns if clicked outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-select')) {
                closeAllSelects();
            }
        });

        function closeAllSelects() {
            document.querySelectorAll('.select-items').forEach(item => {
                item.classList.add('select-hide');
            });
            document.querySelectorAll('.select-selected').forEach(item => {
                item.classList.remove('select-arrow-active');
            });
        }

        customSelects.forEach(customSelect => {
            const selectedDiv = customSelect.querySelector('.select-selected');
            const itemsDiv = customSelect.querySelector('.select-items');
            const options = itemsDiv.querySelectorAll('div');

            selectedDiv.addEventListener('click', function(e) {
                e.stopPropagation();
                // Close others
                const isCurrentlyOpen = !itemsDiv.classList.contains('select-hide');
                closeAllSelects();
                
                if (!isCurrentlyOpen) {
                    itemsDiv.classList.remove('select-hide');
                    this.classList.add('select-arrow-active');
                }
            });

            options.forEach(option => {
                option.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Update display
                    selectedDiv.innerHTML = this.innerHTML;
                    
                    // Update selected class
                    const sameAsSelected = itemsDiv.querySelector('.same-as-selected');
                    if (sameAsSelected) {
                        sameAsSelected.classList.remove('same-as-selected');
                    }
                    this.classList.add('same-as-selected');

                    // If this is the category select for the form
                    if (customSelect.id === 'category-wrapper') {
                        const hiddenInput = document.getElementById('category');
                        hiddenInput.value = this.dataset.value;
                        
                        // Remove invalid class if an option was chosen to clear error visually
                        if (hiddenInput.value) {
                            customSelect.classList.remove('invalid');
                            document.getElementById('category-error').style.display = 'none';
                        }
                    }

                    // If this is the filter select
                    if (customSelect.id === 'filter-wrapper') {
                        currentFilter = this.dataset.value;
                        renderExpenses();
                    }

                    closeAllSelects();
                });
            });
        });
    }

    // Render expense list
    function renderExpenses() {
        expenseList.innerHTML = '';
        
        const filteredExpenses = currentFilter === 'All' 
            ? expenses 
            : expenses.filter(e => e.category === currentFilter);

        if (filteredExpenses.length === 0) {
            emptyState.style.display = 'block';
            if (currentFilter !== 'All') {
                emptyState.innerHTML = `<p>No expenses found in <strong>${currentFilter}</strong> category.</p>`;
            } else {
                emptyState.innerHTML = `<p>No expenses yet. Start by adding one!</p>`;
            }
        } else {
            emptyState.style.display = 'none';
        }

        filteredExpenses.sort((a, b) => b.id - a.id).forEach(expense => {
            const li = document.createElement('li');
            li.className = 'expense-item';
            li.dataset.id = expense.id;
            
            const categoryClass = expense.category.toLowerCase();
            
            li.innerHTML = `
                <div class="expense-info">
                    <span class="expense-name">${expense.name}</span>
                    <span class="badge ${categoryClass}">${expense.category}</span>
                </div>
                <div class="expense-right">
                    <span class="expense-amount">₹${expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    <button class="delete-btn" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
                    </button>
                </div>
            `;
            expenseList.appendChild(li);
        });
    }

    init();
});
