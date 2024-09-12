document.getElementById('inputform').addEventListener('submit', function(event) {
    event.preventDefault();
    const no_banks = parseInt(document.getElementById('no_banks').value);
    const banks = [];
    for (let i = 0; i < no_banks; i++) {
        const name = document.getElementById(bankname${i}).value;
        const no_types = parseInt(document.getElementById(no_types${i}).value);
        const types = [];
        for (let j = 0; j < no_types; j++) {
            types.push(document.getElementById(type${i}_${j}).value);
        }
        banks.push({ name, types });
    }
    const no_trans = parseInt(document.getElementById('no_trans').value);
    const transactions = [];
    for (let i = 0; i < no_trans; i++) {
        const debtor = document.getElementById(debtor${i}).value;
        const creditor = document.getElementById(creditor${i}).value;
        const amount = parseInt(document.getElementById(amount${i}).value);
        transactions.push({ debtor, creditor, amount });
    }

     const results = minimize(no_banks, banks, transactions);

    display(results);
});

function updatebanks(no_banks) {
    const banks_inputs = document.getElementById('banksinputs');
    banks_inputs.innerHTML = '';
    for (let i = 0; i < no_banks; i++) {
        banks_inputs.innerHTML += `
            <h3>Bank ${i + 1}</h3>
            <div class="form-group">
                <label for="bankname${i}">Bank name:</label>
                <input type="text" id="bankname${i}" required>
            </div>
            <div class="form-group">
                <label for="no_types${i}">Number of payment modes:</label>
                <input type="number" id="no_types${i}" min="1" required onchange="updatetypes(${i})">
            </div>
            <div id="typesinputs${i}">
                <!-- Payment modes will be added here dynamically -->
            </div>
        `;
    }
}

function updatetypes(bank_index) {
    const no_types = parseInt(document.getElementById(no_types${bank_index}).value);
    const types_inputs = document.getElementById(typesinputs${bank_index});
    types_inputs.innerHTML = '';
    
    for (let j = 0; j < no_types; j++) {
        types_inputs.innerHTML += `
            <div class="form-group">
                <label for="type${bank_index}_${j}">Payment mode ${j + 1}:</label>
                <input type="text" id="type${bank_index}_${j}" required>
            </div>
        `;
    }
}

function updatetrans(no_trans) {
    const transactions_inputs = document.getElementById('transactionsinputs');
    transactions_inputs.innerHTML = '';
    
    for (let i = 0; i < no_trans; i++) {
        transactions_inputs.innerHTML += `
            <h3>Transaction ${i + 1}</h3>
            <div class="form-group">
                <label for="debtor${i}">Debtor Bank:</label>
                <input type="text" id="debtor${i}" required>
            </div>
            <div class="form-group">
                <label for="creditor${i}">Creditor Bank:</label>
                <input type="text" id="creditor${i}" required>
            </div>
            <div class="form-group">
                <label for="amount${i}">Amount:</label>
                <input type="number" id="amount${i}" min="1" required>
            </div>
        `;
    }
}

function minimize(no_banks, banks, transactions) {
    const net_amounts = new Array(no_banks).fill(0);
    const bank_names = banks.map(bank => bank.name);
    for (const transaction of transactions) {
        const debtor_index = bank_names.indexOf(transaction.debtor);
        const creditor_index = bank_names.indexOf(transaction.creditor);
        net_amounts[debtor_index] -= transaction.amount;
        net_amounts[creditor_index] += transaction.amount;
    }
    let results = [];
    for (let i = 0; i < no_banks; i++) {
        for (let j = 0; j < no_banks; j++) {
            if (i !== j && net_amounts[i] < 0 && net_amounts[j] > 0) {
                const amount = Math.min(-net_amounts[i], net_amounts[j]);
                results.push({ from: bank_names[i], to: bank_names[j], amount });
                net_amounts[i] += amount;
                net_amounts[j] -= amount;
            }
        }
    }
    
    return results;
}

function display(results) {
    const results_div = document.getElementById('results');
    results_div.innerHTML = '<h2>Minimized Transactions:</h2>';
    
    for (const result of results) {
        results_div.innerHTML += <p>${result.from} pays Rs ${result.amount} to ${result.to}</p>;
    }
}

document.getElementById('no_banks').addEventListener('change', function() {
    const no_banks = parseInt(this.value);
    updatebanks(no_banks);
});

document.getElementById('no_trans').addEventListener('change', function() {
    const no_trans = parseInt(this.value);
    updatetrans(no_trans);
});