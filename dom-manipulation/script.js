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

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Load saved quotes
  loadQuotes();

  // Initial quote display
  showRandomQuote();

  // Create the form
  createAddQuoteForm();

  // Add event listener to the "Show New Quote" button
  const newQuoteButton = document.getElementById("newQuote");
  if (newQuoteButton) {
    newQuoteButton.addEventListener("click", showRandomQuote);
  }
});
