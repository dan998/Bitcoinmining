let balance = parseFloat(localStorage.getItem("balance")) || 0; // Initial balance from localStorage
const miningRate = 0.000005; // Mining rate in BTC per second
let miningInterval;

// Display the balance on page load
document.getElementById("balance").innerText = `${balance.toFixed(4)} BTC`;
document.getElementById("miningRate").innerText = `${miningRate} BTC/s`;

// Start Mining function
window.startMining = function startMining() {
    document.getElementById("startMiningBtn").disabled = true;
    document.getElementById("startMiningBtn").innerText = "Mining...";

    miningInterval = setInterval(() => {
        balance += miningRate;
        document.getElementById("balance").innerText = `${balance.toFixed(4)} BTC`;

        // Save updated balance to localStorage
        localStorage.setItem("balance", balance);
    }, 1000);
};

// Function to validate Bitcoin wallet addresses for different networks using regex
async function validateBTCWallet(wallet, network) {
    const regexMap = {
        btc_segwit: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/, // SegWit
        btc: /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/, // Mainnet
        lightning: /^lntb[a-z0-9]{70,}$/i, // Lightning Network
        bnb_bep20: /^(0x[a-fA-F0-9]{40})$/, // BNB Smart Chain
        eth_erc20: /^(0x[a-fA-F0-9]{40})$/, // Ethereum
        bnb_bep2: /^(bnb[a-zA-Z0-9]{39})$/, // BNB Beacon Chain
    };

    // Check if the network exists in the regexMap
    const regex = regexMap[network];
    if (!regex) {
        throw new Error(`Unsupported network: ${network}`);
    }
    
    return regex.test(wallet); // Validate for the selected network
}

// Update network details when a network is selected
function updateNetworkDetails(selectId, detailsId) {
    const selectedOption = document.querySelector(`#${selectId} option:checked`);
    const confirmation = selectedOption.getAttribute('data-confirmation');
    const minDeposit = selectedOption.getAttribute('data-min-deposit');
    const arrival = selectedOption.getAttribute('data-arrival');

    const detailsText = `1 block confirmation/s: ${confirmation}, Min. deposit >${minDeposit} BTC, Est. arrival: ${arrival}`;
    document.getElementById(detailsId).innerText = detailsText;
}

// Event listeners for network selection
document.getElementById("networkSelect").addEventListener("change", function() {
    updateNetworkDetails("networkSelect", "networkDetails");
});
document.getElementById("withdrawNetworkSelect").addEventListener("change", function() {
    updateNetworkDetails("withdrawNetworkSelect", "withdrawNetworkDetails");
});

// Function to handle deposits
window.makeDeposit = async function makeDeposit() {
    const selectedNetwork = document.getElementById("networkSelect").value;
    const depositWalletAddress = document.getElementById("depositWalletAddress").value;
    const depositAmount = parseFloat(document.getElementById("depositAmount").value);

    // Validate wallet address before proceeding
    try {
        if (!await validateBTCWallet(depositWalletAddress, selectedNetwork)) {
            alert("Please enter a valid BTC deposit wallet address.");
           
            return;
        }
    } catch (error) {
        alert(error.message);
        return;
    }

    // Check if the deposit amount is greater than the minimum required
    const selectedOption = document.querySelector(`#networkSelect option:checked`);
    const minDeposit = parseFloat(selectedOption.getAttribute('data-min-deposit'));

    if (depositAmount <= minDeposit) {
        alert(`Minimum deposit for this network is >${minDeposit} BTC`);
        return;
    }

    // Process the deposit
    balance += depositAmount; // Add to balance
    localStorage.setItem("balance", balance); // Update localStorage

    // Log the deposit
    const depositLog = document.getElementById("depositLog");
    const logEntry = document.createElement("li");
    logEntry.innerText = `Deposited ${depositAmount} BTC to ${depositWalletAddress} via ${selectedNetwork}`;
    depositLog.appendChild(logEntry);

    // Display success message
    const depositMessage = document.getElementById("depositMessage");
    depositMessage.innerText = `Successfully deposited ${depositAmount} BTC.`;
    depositMessage.style.display = "block";

    // Reset the form fields
    document.getElementById("depositForm").reset();
    updateNetworkDetails("networkSelect", "networkDetails");
};

// Function to handle withdrawals
window.makeWithdrawal = async function makeWithdrawal() {
    const selectedNetwork = document.getElementById("withdrawNetworkSelect").value;
    const withdrawWalletAddress = document.getElementById("withdrawWalletAddress").value;
    const withdrawAmount = parseFloat(document.getElementById("withdrawAmount").value);

    // Validate wallet address before proceeding
    try {
        if (!await validateBTCWallet(withdrawWalletAddress, selectedNetwork)) {
            alert("Please enter a valid BTC withdrawal wallet address.");
            return;
        }
    } catch (error) {
        alert(error.message);
        return;
    }

    // Check if the withdrawal amount is less than or equal to the current balance
    if (withdrawAmount > balance) {
        alert("Insufficient balance for this withdrawal.");
        return;
    }

    // Process the withdrawal
    balance -= withdrawAmount; // Deduct from balance
    localStorage.setItem("balance", balance); // Update localStorage

    // Log the withdrawal
    const withdrawalLog = document.getElementById("withdrawalLog");
    const logEntry = document.createElement("li");
    logEntry.innerText = `Withdrew ${withdrawAmount} BTC to ${withdrawWalletAddress} via ${selectedNetwork}`;
    withdrawalLog.appendChild(logEntry);

    // Display success message
    alert(`Successfully withdrew ${withdrawAmount} BTC to ${withdrawWalletAddress}.`);
    
    // Reset the form fields
    document.getElementById("withdrawForm").reset();
    updateNetworkDetails("withdrawNetworkSelect", "withdrawNetworkDetails");
};

// Initial call to set default network details on page load
updateNetworkDetails("networkSelect", "networkDetails");
updateNetworkDetails("withdrawNetworkSelect", "withdrawNetworkDetails");
