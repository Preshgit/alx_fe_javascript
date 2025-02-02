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
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    category: "Programming",
  },
];

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Clear previous content
  quoteDisplay.innerHTML = "";

  // Create and append quote text
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;
  quoteText.style.fontStyle = "italic";

  // Create and append category
  const categoryText = document.createElement("p");
  categoryText.textContent = `Category: ${quote.category}`;
  categoryText.style.color = "#666";

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(categoryText);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  // Validate inputs
  if (!newQuoteText || !newQuoteCategory) {
    alert("Please fill in both the quote and category fields");
    return;
  }

  // Add new quote to array
  quotes.push({
    text: newQuoteText,
    category: newQuoteCategory,
  });

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Show success message
  alert("Quote added successfully!");

  // Show the new quote
  showRandomQuote();
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Show initial random quote
  showRandomQuote();

  // Add event listener to "Show New Quote" button
  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
});
