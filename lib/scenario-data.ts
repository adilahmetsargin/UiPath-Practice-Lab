export type ScenarioTask = {
  id: string;
  title: string;
  role: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  targetUrl: string;
  mission: string;
  steps: string[];
  expectedEvidence: string[];
  checks: string[];
  xp: number;
};

export const scenarios: ScenarioTask[] = [
  {
    id: "search-rpa-article",
    title: "Search and capture an RPA article",
    role: "QA/RPA trainee",
    difficulty: "Beginner",
    targetUrl: "/practice/search-page",
    mission: "Open the fake search website, search for a keyword, click a matching result, and submit screenshot evidence from the result page.",
    steps: [
      "Open /practice/search-page in a browser.",
      "Search for automation.",
      "Click the result titled Enterprise automation playbook.",
      "Confirm the opened page shows the category Operations.",
      "Take a screenshot of the result detail page."
    ],
    expectedEvidence: [
      "Screenshot shows Enterprise automation playbook.",
      "Screenshot or note includes category Operations.",
      "Steps mention search keyword automation."
    ],
    checks: ["automation", "Enterprise automation playbook", "Operations", "screenshot"],
    xp: 35
  },
  {
    id: "order-confirmation",
    title: "Submit an order and prove the confirmation",
    role: "RPA developer",
    difficulty: "Beginner",
    targetUrl: "/practice/order-form",
    mission: "Fill a business order form, submit it, and capture the generated confirmation number.",
    steps: [
      "Open /practice/order-form.",
      "Enter customer name Jordan Miles.",
      "Choose Studio License with quantity 2.",
      "Submit the order.",
      "Take a screenshot showing the confirmation number."
    ],
    expectedEvidence: [
      "Screenshot includes Order submitted.",
      "Confirmation number starts with ORD-.",
      "Steps mention customer Jordan Miles and quantity 2."
    ],
    checks: ["Jordan Miles", "Studio License", "2", "ORD-", "Order submitted"],
    xp: 40
  },
  {
    id: "product-table-extraction",
    title: "Extract high-value product data",
    role: "RPA analyst",
    difficulty: "Intermediate",
    targetUrl: "/practice/product-table",
    mission: "Use the product table like a scraping target and identify products over $100.",
    steps: [
      "Open /practice/product-table.",
      "Read every product row.",
      "Identify products with price over $100.",
      "Write the matching product names in your evidence notes.",
      "Attach a screenshot of the table."
    ],
    expectedEvidence: [
      "Evidence includes Automation Cloud Seat, Invoice Scanner, and Robot Runtime.",
      "Screenshot shows the product table.",
      "Note explains that prices were compared numerically."
    ],
    checks: ["Automation Cloud Seat", "Invoice Scanner", "Robot Runtime", "price", "screenshot"],
    xp: 55
  },
  {
    id: "dynamic-selector-proof",
    title: "Click the correct dynamic selector target",
    role: "UiPath selector tester",
    difficulty: "Intermediate",
    targetUrl: "/practice/dynamic-buttons",
    mission: "Use a stable selector idea to click the target button even when labels change.",
    steps: [
      "Open /practice/dynamic-buttons.",
      "Click Change labels once.",
      "Click the button with data-action approve-primary.",
      "Confirm the page says Correct dynamic button clicked.",
      "Upload screenshot evidence and explain which attribute you used."
    ],
    expectedEvidence: [
      "Screenshot shows Correct dynamic button clicked.",
      "Explanation mentions data-action approve-primary.",
      "Steps avoid screen coordinates."
    ],
    checks: ["Correct dynamic button clicked", "data-action", "approve-primary", "selector"],
    xp: 60
  },
  {
    id: "exception-classification",
    title: "Classify a business exception",
    role: "Production support analyst",
    difficulty: "Advanced",
    targetUrl: "/practice/error-simulation",
    mission: "Trigger a business exception, capture the message, and explain why it should not be retried.",
    steps: [
      "Open /practice/error-simulation.",
      "Click Business error.",
      "Read the exact exception message.",
      "Take a screenshot of the visible exception.",
      "Submit why this is business data issue rather than system failure."
    ],
    expectedEvidence: [
      "Screenshot shows required invoice amount is missing.",
      "Explanation identifies it as a business exception.",
      "Explanation says retrying will not fix missing data."
    ],
    checks: ["Business exception", "invoice amount", "missing", "not retry", "screenshot"],
    xp: 70
  }
];
