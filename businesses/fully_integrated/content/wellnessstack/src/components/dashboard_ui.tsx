import { WellnessItem } from './WellnessItem';

// Use a named function for better readability and maintainability
export function displayDashboard(numberOfItems: number): void {
  // Use a constant for hard-coded values to improve maintainability
  const ITEMS_PER_PAGE = 10;

  // Check if numberOfItems is valid
  if (numberOfItems <= 0 || numberOfItems > Math.pow(2, 31) - 1) {
    throw new Error('Invalid number of items');
  }

  // Calculate the page number and the starting index
  const pageNumber = Math.floor(numberOfItems / ITEMS_PER_PAGE) + 1;
  const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;

  // Use a for loop for predictable and efficient iteration
  for (let i = startIndex; i < Math.min(numberOfItems, startIndex + ITEMS_PER_PAGE); i++) {
    // Access items using safe indexing to prevent potential array out-of-bounds errors
    const item = wellnessContent[i] || {};

    // Use template literals for string concatenation to improve readability
    const itemElement = createItemElement(item);

    // Append itemElement to the dashboard container
    dashboardContainer.innerHTML += itemElement;
  }

  // Update the pagination if necessary
  updatePagination(pageNumber);
}

// Create a helper function for creating item elements
function createItemElement(item: WellnessItem): string {
  return `
    <div class="item">
      <h3>${item.title || ''}</h3>
      <p>${item.description || ''}</p>
    </div>
  `;
}

// Create a helper function for updating the pagination
function updatePagination(pageNumber: number): void {
  const previousButton = document.createElement('button');
  previousButton.textContent = 'Previous';
  previousButton.addEventListener('click', () => displayDashboard(pageNumber - 1));

  const currentPageSpan = document.createElement('span');
  currentPageSpan.textContent = `Page ${pageNumber}`;

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.addEventListener('click', () => displayDashboard(pageNumber + 1));

  // Use document.createTextNode for accessibility purposes
  const pageTextNode = document.createTextNode('Page ');

  // Append elements to the pagination container
  pagination.innerHTML = '';
  pagination.appendChild(previousButton);
  pagination.appendChild(pageTextNode);
  pagination.appendChild(currentPageSpan);
  pagination.appendChild(nextButton);

  // Add ARIA attributes for accessibility
  previousButton.setAttribute('aria-label', 'Go to the previous page');
  nextButton.setAttribute('aria-label', 'Go to the next page');
}

import { WellnessItem } from './WellnessItem';

// Use a named function for better readability and maintainability
export function displayDashboard(numberOfItems: number): void {
  // Use a constant for hard-coded values to improve maintainability
  const ITEMS_PER_PAGE = 10;

  // Check if numberOfItems is valid
  if (numberOfItems <= 0 || numberOfItems > Math.pow(2, 31) - 1) {
    throw new Error('Invalid number of items');
  }

  // Calculate the page number and the starting index
  const pageNumber = Math.floor(numberOfItems / ITEMS_PER_PAGE) + 1;
  const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;

  // Use a for loop for predictable and efficient iteration
  for (let i = startIndex; i < Math.min(numberOfItems, startIndex + ITEMS_PER_PAGE); i++) {
    // Access items using safe indexing to prevent potential array out-of-bounds errors
    const item = wellnessContent[i] || {};

    // Use template literals for string concatenation to improve readability
    const itemElement = createItemElement(item);

    // Append itemElement to the dashboard container
    dashboardContainer.innerHTML += itemElement;
  }

  // Update the pagination if necessary
  updatePagination(pageNumber);
}

// Create a helper function for creating item elements
function createItemElement(item: WellnessItem): string {
  return `
    <div class="item">
      <h3>${item.title || ''}</h3>
      <p>${item.description || ''}</p>
    </div>
  `;
}

// Create a helper function for updating the pagination
function updatePagination(pageNumber: number): void {
  const previousButton = document.createElement('button');
  previousButton.textContent = 'Previous';
  previousButton.addEventListener('click', () => displayDashboard(pageNumber - 1));

  const currentPageSpan = document.createElement('span');
  currentPageSpan.textContent = `Page ${pageNumber}`;

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.addEventListener('click', () => displayDashboard(pageNumber + 1));

  // Use document.createTextNode for accessibility purposes
  const pageTextNode = document.createTextNode('Page ');

  // Append elements to the pagination container
  pagination.innerHTML = '';
  pagination.appendChild(previousButton);
  pagination.appendChild(pageTextNode);
  pagination.appendChild(currentPageSpan);
  pagination.appendChild(nextButton);

  // Add ARIA attributes for accessibility
  previousButton.setAttribute('aria-label', 'Go to the previous page');
  nextButton.setAttribute('aria-label', 'Go to the next page');
}