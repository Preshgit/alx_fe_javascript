// Initial quotes array with some default quotes
let quotes = [
  {
    text: "Life is what happens while you're busy making other plans.",
    category: "Life",
    id: 1,
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    category: "Inspiration",
    id: 2,
  },
  {
    text: "Success is not final, failure is not fatal.",
    category: "Success",
    id: 3,
  },
];

// Mock API URL
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Function to update sync status
function updateSyncStatus(message, isError = false) {
  const syncStatus = document.getElementById("syncStatus");
  syncStatus.innerHTML = message;
  syncStatus.style.color = isError ? "red" : "green";
}

// Function to simulate fetching quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    const serverData = await response.json();

    // Convert server data to quote format (simulation)
    return serverData.slice(0, 5).map((post) => ({
      id: post.id,
      text: post.title,
      category: "Server Quote",
      timestamp: Date.now(),
    }));
  } catch (error) {
    updateSyncStatus("Error fetching quotes from server", true);
    return null;
  }
}

// Function to simulate sending quotes to server
async function sendQuotesToServer(quotes) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(quotes),
      headers: {
        "Content-type": "application/json",
      },
    });
    return response.ok;
  } catch (error) {
    updateSyncStatus("Error sending quotes to server", true);
    return false;
  }
}

// Function to merge local and server quotes
function mergeQuotes(localQuotes, serverQuotes) {
  if (!serverQuotes) return localQuotes;

  const mergedQuotes = [...localQuotes];
  const localIds = new Set(localQuotes.map((quote) => quote.id));

  serverQuotes.forEach((serverQuote) => {
    if (!localIds.has(serverQuote.id)) {
      mergedQuotes.push(serverQuote);
    }
  });

  return mergedQuotes;
}

// Function to sync quotes with server
async function syncQuotes() {
  updateSyncStatus("Syncing...");

  // Fetch server quotes
  const serverQuotes = await fetchQuotesFromServer();

  if (serverQuotes) {
    // Merge quotes
    quotes = mergeQuotes(quotes, serverQuotes);

    // Update localStorage
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // Update UI
    populateCategories();
    filterQuotes();

    updateSyncStatus("Sync completed successfully");
  }
}

// Function to populate category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = new Set(quotes.map((quote) => quote.category));

  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

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
        <p>ID: ${quote.id}</p>
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
async function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value;
  const quoteCategory = document.getElementById("newQuoteCategory").value;

  if (quoteText && quoteCategory) {
    const newQuote = {
      text: quoteText,
      category: quoteCategory,
      id: Date.now(),
      timestamp: Date.now(),
    };

    // Add to local quotes
    quotes.push(newQuote);

    // Save to localStorage
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // Try to sync with server
    const synced = await sendQuotesToServer([newQuote]);
    if (synced) {
      updateSyncStatus("New quote synced with server");
    }

    // Update UI
    populateCategories();
    filterQuotes();

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Load saved quotes
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }

  // Setup UI
  populateCategories();
  filterQuotes();

  // Add event listeners
  document.getElementById("newQuote").addEventListener("click", filterQuotes);
  document
    .getElementById("exportQuotes")
    .addEventListener("click", exportQuotes);
  document
    .getElementById("fileInput")
    .addEventListener("change", handleFileImport);
  document.getElementById("syncNow").addEventListener("click", syncQuotes);

  // Set up periodic sync (every 5 minutes)
  setInterval(syncQuotes, 300000);

  // Initial sync
  syncQuotes();
});
