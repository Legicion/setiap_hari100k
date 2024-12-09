document.addEventListener("DOMContentLoaded", () => {
    const dailyIncrement = 100000; // Tambahan saldo harian
    let startDate = null; // Tanggal mulai tabungan
    let totalDeducted = 0; // Total uang yang diambil
    const history = []; // Riwayat pengambilan

    // Elemen DOM
    const startDateInput = document.getElementById("startDateInput");
    const startDateDisplay = document.getElementById("startDate");
    const currentBalanceDisplay = document.getElementById("currentBalance");
    const totalDeductedDisplay = document.getElementById("totalDeducted");
    const deductAmountInput = document.getElementById("deductAmount");
    const deductButton = document.getElementById("deductButton");
    const historyList = document.getElementById("historyList");
    const toggleThemeButton = document.getElementById("toggleTheme");

    let darkMode = false; // Status tema

    // Format angka dengan titik pemisah ribuan
    function formatCurrency(amount) {
        return Rp${amount.toLocaleString("id-ID")};
    }

    // Menghitung saldo saat ini
    function calculateBalance() {
        if (!startDate) return 0;

        const today = new Date();
        const timeDifference = today - new Date(startDate); // Selisih waktu dalam milidetik
        const daysElapsed = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Konversi ke hari
        const totalBalance = daysElapsed * dailyIncrement - totalDeducted;
        return totalBalance;
    }

    // Update tampilan saldo
    function updateBalanceDisplay() {
        currentBalanceDisplay.textContent = formatCurrency(calculateBalance());
        totalDeductedDisplay.textContent = formatCurrency(totalDeducted);
    }

    // Menambah item ke riwayat
    function addHistory(amount) {
        const timestamp = new Date().toLocaleString("id-ID");
        const listItem = document.createElement("li");
        listItem.innerHTML = ${formatCurrency(amount)} <span>${timestamp}</span> <button>Hapus</button>;

        // Tombol hapus
        const deleteButton = listItem.querySelector("button");
        deleteButton.addEventListener("click", () => {
            totalDeducted -= amount;
            updateBalanceDisplay();
            historyList.removeChild(listItem);
        });

        historyList.appendChild(listItem);
        history.push({ amount, timestamp });
    }

    // Event listener untuk memilih tanggal mulai
    startDateInput.addEventListener("change", (event) => {
        startDate = event.target.value;
        startDateDisplay.textContent = new Date(startDate).toLocaleDateString("id-ID");
        updateBalanceDisplay();
    });

    // Event listener untuk tombol pengurangan saldo
    deductButton.addEventListener("click", () => {
        const deductAmount = parseInt(deductAmountInput.value.replace(/\./g, ""), 10); // Hilangkan titik pada input

        if (!isNaN(deductAmount) && deductAmount > 0) {
            totalDeducted += deductAmount;
            addHistory(deductAmount);
            updateBalanceDisplay();
            deductAmountInput.value = ""; // Reset input
        } else {
            alert("Masukkan jumlah yang valid!");
        }
    });

    // Format angka di input dengan titik pemisah ribuan
    deductAmountInput.addEventListener("input", () => {
        let value = deductAmountInput.value.replace(/\D/g, ""); // Hanya angka
        deductAmountInput.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Tambahkan titik
    });

    // Toggle tema
    toggleThemeButton.addEventListener("click", () => {
        darkMode = !darkMode;
        document.documentElement.style.setProperty("--background-color", darkMode ? "#333" : "#f4f4f9");
        document.documentElement.style.setProperty("--text-color", darkMode ? "#fff" : "#333");
        document.documentElement.style.setProperty("--container-color", darkMode ? "#444" : "#ffffff");
    });
});