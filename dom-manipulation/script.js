// Initial quotes array with some default quotes
let quotes = [
  {
    text: "Life is what happens while you're busy making other plans.",
    category: "Life",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    category: "Inspiration",
  },
  { text: "Success is not final, failure is not fatal.", category: "Success" },
];

// Load quotes from localStorage if available
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `
            <p>"${quote.text}"</p>
            <p>Category: ${quote.category}</p>
        `;
  }
}

// Function to create and add the form for new quotes
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `;
  document.body.appendChild(formContainer);
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value;
  const quoteCategory = document.getElementById("newQuoteCategory").value;

  if (quoteText && quoteCategory) {
    // Add to quotes array
    quotes.push({
      text: quoteText,
      category: quoteCategory,
    });

    // Save to localStorage
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Update DOM with new quote
    showRandomQuote();
  }
}

// Function to handle file import
function handleFileImport(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        quotes = importedQuotes;
        localStorage.setItem("quotes", JSON.stringify(quotes));
        showRandomQuote();
        alert("Quotes imported successfully!");
      } catch (error) {
        alert("Error importing quotes. Please check the file format.");
      }
    };
    reader.readAsText(file);
  }
}

// Function to export quotes
function exportQuotes() {
  const quotesJSON = JSON.stringify(quotes, null, 2);
  const blob = new Blob([quotesJSON], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Load saved quotes
  loadQuotes();

  // Initial quote display
  showRandomQuote();

  // Create the form
  createAddQuoteForm();

  // Add event listeners
  const newQuoteButton = document.getElementById("newQuote");
  if (newQuoteButton) {
    newQuoteButton.addEventListener("click", showRandomQuote);
  }

  const exportButton = document.getElementById("exportQuotes");
  if (exportButton) {
    exportButton.addEventListener("click", exportQuotes);
  }

  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.addEventListener("change", handleFileImport);
  }
});
