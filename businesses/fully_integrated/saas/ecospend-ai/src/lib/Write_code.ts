// Function signature with TypeScript type annotations for better type safety and readability
function ecoSpendAI(carbonFootprint: number): string {
  // Input validation to ensure the carbonFootprint is a non-negative number and not null or undefined
  if (carbonFootprint === null || carbonFootprint === undefined || carbonFootprint < 0) {
    throw new Error("Carbon footprint must be a non-negative number.");
  }

  // Ensure a minimum carbonFootprint to avoid division by zero
  const minCarbonFootprint = 1;
  carbonFootprint = Math.max(carbonFootprint, minCarbonFootprint);

  // Logic to categorize the carbon footprint and suggest eco-friendly alternatives
  let category: string;
  let suggestion: string;

  switch (true) {
    case carbonFootprint <= 100:
      category = "Low";
      break;
    case carbonFootprint <= 500:
      category = "Medium";
      suggestion = "Consider using public transportation or carpooling.";
      break;
    default:
      category = "High";
      suggestion = "It's crucial to reduce your carbon footprint. Consider switching to renewable energy sources or implementing energy-efficient practices.";
  }

  // Return the category and suggestion
  return `${category} carbon footprint. ${suggestion}`;
}

// Function signature with TypeScript type annotations for better type safety and readability
function ecoSpendAI(carbonFootprint: number): string {
  // Input validation to ensure the carbonFootprint is a non-negative number and not null or undefined
  if (carbonFootprint === null || carbonFootprint === undefined || carbonFootprint < 0) {
    throw new Error("Carbon footprint must be a non-negative number.");
  }

  // Ensure a minimum carbonFootprint to avoid division by zero
  const minCarbonFootprint = 1;
  carbonFootprint = Math.max(carbonFootprint, minCarbonFootprint);

  // Logic to categorize the carbon footprint and suggest eco-friendly alternatives
  let category: string;
  let suggestion: string;

  switch (true) {
    case carbonFootprint <= 100:
      category = "Low";
      break;
    case carbonFootprint <= 500:
      category = "Medium";
      suggestion = "Consider using public transportation or carpooling.";
      break;
    default:
      category = "High";
      suggestion = "It's crucial to reduce your carbon footprint. Consider switching to renewable energy sources or implementing energy-efficient practices.";
  }

  // Return the category and suggestion
  return `${category} carbon footprint. ${suggestion}`;
}