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

// Function to populate category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = new Set(quotes.map((quote) => quote.category));

  // Clear existing options except "All Categories"
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  // Add categories to dropdown
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const lastCategory = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = lastCategory;
}

// Function to filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  if (selectedCategory === "all") {
    showRandomQuote();
  } else {
    const filteredQuotes = quotes.filter(
      (quote) => quote.category === selectedCategory
    );
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      displayQuote(filteredQuotes[randomIndex]);
    }
  }
}

// Function to display a specific quote
function displayQuote(quote) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
        <p>"${quote.text}"</p>
        <p>Category: ${quote.category}</p>
    `;
}

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    displayQuote(quotes[randomIndex]);
  }
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

    // Update categories dropdown
    populateCategories();

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Update display
    filterQuotes();
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
        populateCategories();
        filterQuotes();
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
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }

  // Populate categories
  populateCategories();

  // Initial quote display using filter
  filterQuotes();

  // Add event listeners
  document.getElementById("newQuote").addEventListener("click", filterQuotes);
  document
    .getElementById("exportQuotes")
    .addEventListener("click", exportQuotes);
  document
    .getElementById("fileInput")
    .addEventListener("change", handleFileImport);
});
