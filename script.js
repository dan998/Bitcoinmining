let btcEarned = 0;
let walletBTC = 0;
let mining = false;
let miningInterval;
let transactions = [];
let transactionUpdateInterval;

// Masked email list for transactions
const maskedEmails = [
  "da*******@g*******m",
  "ju*********@y****o.com",
  "mi******@h******l.com",
  "sa*******@o******k.com",
  "al*******@g*******m",
  "ro********@y****o.com",
  "be******@a******l.com",
  "jo*******@g*******m",
  "ka******@y****o.com",
  "lu******@h******l.com",
  "em*******@g*******m",
  "ch*******@o******k.com"
];

// Load transactions from JSON file (mock implementation)
fetch('transactions.json')
  .then(response => response.json())
  .then(data => {
    transactions = data.map((tx, index) => ({
      ...tx,
      email: maskedEmails[index % maskedEmails.length]
    }));
    updateTransactionList();
    transactionUpdateInterval = setInterval(randomizeTransactions, 5 * 60 * 1000); // Randomize every 5 minutes
  });

// Randomize and update transaction data
function randomizeTransactions() {
  // Shuffle transactions and update random values
  transactions = transactions.sort(() => 0.5 - Math.random()).map(tx => {
    const newAmount = (Math.random() * 0.01 + 0.001).toFixed(8);
    return {
      ...tx,
      type: Math.random() > 0.5 ? "Deposit" : "Withdraw",
      amount: newAmount,
      date: new Date().toLocaleString(), // Set realistic current date and time
      email: maskedEmails[Math.floor(Math.random() * maskedEmails.length)]
    };
  });

  // Hide current transactions, update list, and fade in new transactions
  fadeOutTransactions().then(() => {
    updateTransactionList();
    fadeInTransactions();
  });
}

// Fade out transactions
function fadeOutTransactions() {
  return new Promise(resolve => {
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.style.opacity = 0;
    setTimeout(resolve, 500); // Wait for fade-out animation
  });
}

// Fade in transactions
function fadeInTransactions() {
  const transactionsList = document.getElementById('transactions-list');
  transactionsList.style.opacity = 1;
}

// Start mining
function startMining() {
  if (!mining) {
    mining = true;
    document.getElementById('start-mining').innerText = 'Stop Mining';
    miningInterval = setInterval(mineBitcoin, 1000);
  } else {
    stopMining();
  }
}

// Stop mining
function stopMining() {
  mining = false;
  clearInterval(miningInterval);
  document.getElementById('start-mining').innerText = 'Start Mining';
}

// Function to simulate bitcoin mining
function mineBitcoin() {
  const btcPerSecond = 0.00000123;
  btcEarned += btcPerSecond;
  document.getElementById('btc').innerText = btcEarned.toFixed(8);
}

// Deposit BTC to wallet and log transaction
function depositBTC() {
  const randomAmount = (Math.random() * 0.01 + 0.001).toFixed(8);
  walletBTC += parseFloat(randomAmount);
  btcEarned = 0;
  document.getElementById('btc').innerText = btcEarned.toFixed(8);
  document.getElementById('wallet-btc').innerText = walletBTC.toFixed(8);
  addTransaction('Deposit', randomAmount);
}

// Withdraw BTC from wallet and log transaction
function withdrawBTC() {
  if (walletBTC > 0) {
    const randomAmount = (Math.random() * (walletBTC > 0.01 ? 0.01 : walletBTC)).toFixed(8);
    walletBTC -= parseFloat(randomAmount);
    document.getElementById('wallet-btc').innerText = walletBTC.toFixed(8);
    addTransaction('Withdraw', randomAmount);
  } else {
    alert('No BTC available to withdraw.');
  }
}

// Add transaction to the list with masked email
function addTransaction(type, amount) {
  const transaction = {
    type: type,
    amount: amount,
    date: new Date().toLocaleString(),
    email: maskedEmails[Math.floor(Math.random() * maskedEmails.length)]
  };
  transactions.push(transaction);
  updateTransactionList();
}

// Update transaction list display
function updateTransactionList() {
  const transactionsList = document.getElementById('transactions-list');
  transactionsList.innerHTML = '';
  transactions.forEach(tx => {
    const transactionDiv = document.createElement('div');
    transactionDiv.classList.add('transaction');
    transactionDiv.innerText = `${tx.date} - ${tx.type}: ${tx.amount} BTC (${tx.email})`;
    transactionsList.appendChild(transactionDiv);
  });
}

// Event listeners for buttons
document.getElementById('start-mining').addEventListener('click', startMining);
document.getElementById('deposit-btn').addEventListener('click', depositBTC);
document.getElementById('withdraw-btn').addEventListener('click', withdrawBTC);
