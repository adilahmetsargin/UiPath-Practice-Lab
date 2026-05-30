export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Job-ready";

export type PracticeTask = {
  id: string;
  title: string;
  difficulty: Difficulty;
  xp: number;
  practicalTask: string;
  expectedResult: string;
  hint: string;
  practiceUrl?: string;
};

export type Lesson = {
  id: string;
  level: number;
  title: string;
  summary: string;
  focus: string;
  tasks: PracticeTask[];
};

export const lessons: Lesson[] = [
  {
    id: "rpa-basics",
    level: 1,
    title: "RPA basics",
    focus: "Understand process thinking before opening UiPath.",
    summary:
      "Learn what RPA is, how bots follow repeatable rules, and how to choose tasks worth automating. You will practice mapping manual steps into precise automation instructions.",
    tasks: [
      task("Identify a rule-based office process", "Beginner", 20, "Write the exact manual steps for copying customer data from a web page into a spreadsheet.", "A numbered process map with inputs, outputs, exceptions, and success criteria.", "Look for repeated actions, stable rules, and data that already exists digitally."),
      task("Separate human decisions from bot actions", "Beginner", 20, "Review an order-entry workflow and label each step as bot-friendly, human decision, or exception.", "A clear list showing what should be automated and what needs review.", "Bots are strongest when the rule is explicit and the source is predictable."),
      task("Create an automation checklist", "Beginner", 20, "Build a checklist for verifying a simple browser search automation before handing it to QA.", "A checklist covering test data, login state, browser, expected result, and failure case.", "Think like a tester: what could make the bot fail on another machine?"),
      task("Define success metrics", "Beginner", 20, "Choose metrics for a daily invoice download automation.", "At least three metrics such as time saved, error rate, processed invoices, and retry count.", "Good automation is measured after it runs, not only when it is built.")
    ]
  },
  {
    id: "studio-basics",
    level: 2,
    title: "UiPath Studio basics",
    focus: "Navigate Studio and build your first browser workflow.",
    summary:
      "Practice Studio concepts such as activities, sequences, workflows, packages, and run/debug behavior. The goal is a small bot that opens a browser and completes a visible action.",
    tasks: [
      task("Open browser and search", "Beginner", 25, "Create a UiPath workflow that opens a browser and searches for 'RPA analyst interview questions'.", "Browser opens, search runs, and the page shows relevant results.", "Use Use Application/Browser and Type Into before trying selectors."),
      task("Build a clean sequence", "Beginner", 25, "Create a sequence with comments and activity names for each step of a login-form automation.", "A readable workflow where every major activity has a useful name.", "Pretend another QA analyst must debug it tomorrow."),
      task("Install and verify package", "Beginner", 25, "Install the UiPath UI Automation activities package and note where you verified the version.", "A short note with package name, version, and why it is needed.", "Modern projects rely on packages; record versions for repeatability."),
      task("Run with test data", "Beginner", 25, "Run the same search workflow with three different keywords.", "Three successful runs with the keyword values documented.", "Use variables early so your workflow is not hard-coded.")
    ]
  },
  {
    id: "variables-arguments-data-types",
    level: 3,
    title: "Variables, arguments, data types",
    focus: "Pass data through workflows reliably.",
    summary:
      "Learn how strings, numbers, booleans, dates, arrays, and DataTables drive automation logic. You will replace hard-coded actions with configurable values.",
    tasks: [
      task("Parameterize a search term", "Beginner", 30, "Store a search keyword in a String variable and use it in a browser search workflow.", "Changing the variable changes the browser search without editing the activity.", "Name variables by business meaning, such as searchKeyword."),
      task("Calculate order totals", "Beginner", 30, "Use numeric variables to calculate subtotal, tax, and final total for an order.", "The workflow logs the correct final total for at least two test cases.", "Use Decimal for money instead of Integer."),
      task("Pass values between workflows", "Intermediate", 35, "Create a small child workflow that receives a customer name argument and returns a formatted greeting.", "Parent workflow calls child workflow and logs the returned greeting.", "Arguments are contracts between workflows."),
      task("Validate required fields", "Intermediate", 35, "Use Boolean logic to check whether a name, email, and order amount are present before form entry.", "The bot logs valid records and skips invalid ones.", "Combine String.IsNullOrWhiteSpace checks with simple conditions.")
    ]
  },
  {
    id: "selectors-ui-automation",
    level: 4,
    title: "Selectors and UI automation",
    focus: "Make browser automation stable on changing pages.",
    summary:
      "Practice selectors, anchors, dynamic attributes, waits, and reliable clicking. You will automate pages that intentionally change button labels and layout.",
    tasks: [
      task("Inspect a login selector", "Intermediate", 35, "Use UiExplorer to inspect fields on /practice/login-form and identify stable attributes.", "A selector note that avoids brittle dynamic values.", "Prefer id, name, role, and visible labels when available.", "/practice/login-form"),
      task("Click dynamic buttons", "Intermediate", 40, "Use selectors to click the correct dynamic button on /practice/dynamic-buttons after labels change.", "The page records the clicked target button, not a random button.", "Use a reliable attribute or nearby anchor, not screen coordinates.", "/practice/dynamic-buttons"),
      task("Wait for delayed UI", "Intermediate", 40, "Automate a delayed confirmation message and add a wait that does not rely on fixed sleep.", "Workflow waits until confirmation exists and then reads it.", "Check App State is usually better than a blind delay."),
      task("Recover from selector failure", "Intermediate", 40, "Intentionally break one selector, capture the error, and document how you repaired it.", "A before/after selector note with the reason the new selector is stronger.", "Remove volatile attributes one by one.")
    ]
  },
  {
    id: "excel-automation",
    level: 5,
    title: "Excel automation",
    focus: "Read, transform, and write spreadsheet-driven work.",
    summary:
      "Use workbook data as input to browser processes. You will handle rows, empty cells, validation, and output status columns like a real operations bot.",
    tasks: [
      task("Read rows and log names", "Intermediate", 35, "Read a customer Excel file and log each customer name.", "Every row is processed once with no header row treated as data.", "Use For Each Row in DataTable."),
      task("Enter Excel rows into web form", "Intermediate", 45, "Read data from Excel and enter each row into /practice/excel-data-entry.", "The page table contains every valid Excel row entered by the bot.", "Start with three rows before scaling up.", "/practice/excel-data-entry"),
      task("Write status back to Excel", "Intermediate", 45, "After each web form submission, write Success or Failed into a Status column.", "The workbook has a status value for every processed row.", "A bot without output status is hard to support."),
      task("Skip incomplete rows", "Intermediate", 45, "Skip rows where email or amount is missing and log the row number.", "Only complete rows are submitted; invalid rows are documented.", "Validation belongs before UI entry.")
    ]
  },
  {
    id: "web-automation",
    level: 6,
    title: "Web automation",
    focus: "Complete realistic browser workflows end to end.",
    summary:
      "Work with forms, search pages, tables, confirmations, and multi-step order flows. You will practice the browser tasks common in QA and RPA jobs.",
    tasks: [
      task("Submit an order form", "Intermediate", 45, "Complete /practice/order-form with customer, product, quantity, and shipping values.", "A confirmation number appears and the submitted values are visible.", "Use stable field labels and verify confirmation text.", "/practice/order-form"),
      task("Search and capture result count", "Intermediate", 45, "Use /practice/search-page to search for a keyword and extract the visible result count.", "The workflow logs keyword and result count.", "Store both values so the output is auditable.", "/practice/search-page"),
      task("Extract product table rows", "Intermediate", 50, "Extract product names, categories, and prices from /practice/product-table.", "A DataTable or CSV contains all visible product rows.", "Use table extraction first, then compare with manual count.", "/practice/product-table"),
      task("Create a browser smoke test", "Intermediate", 45, "Build a UiPath smoke test that checks three internal practice pages load successfully.", "Workflow logs pass/fail for each URL.", "QA automation skills transfer directly to RPA reliability.")
    ]
  },
  {
    id: "email-automation",
    level: 7,
    title: "Email automation",
    focus: "Trigger notifications and parse inbox-driven work.",
    summary:
      "Practice designing email automations safely. You will draft messages, handle attachments conceptually, and create notification logic without spamming real users.",
    tasks: [
      task("Draft completion email", "Intermediate", 40, "Create a workflow step that drafts an email after an order process completes.", "Email body includes customer, order ID, status, and timestamp.", "Use variables in the body so the message is not hard-coded."),
      task("Filter invoice emails", "Intermediate", 45, "Design mailbox filter rules for unread invoice emails with PDF attachments.", "A written filter plan with sender, subject, attachment, and date criteria.", "Precise filters prevent bots from touching unrelated mail."),
      task("Send failure alert", "Intermediate", 45, "Add an email alert path for failed records in a data-entry process.", "Failure email includes record ID, error summary, and screenshot path or note.", "Support teams need enough context to act."),
      task("Create daily summary message", "Intermediate", 45, "Build a daily summary email from counts of success, skipped, and failed transactions.", "Summary includes totals and a short exception list.", "Aggregate numbers are more useful than many individual emails.")
    ]
  },
  {
    id: "pdf-document-automation",
    level: 8,
    title: "PDF and document automation",
    focus: "Extract document data and validate it against business rules.",
    summary:
      "Practice document handling patterns used in invoice, claims, and onboarding workflows. You will define fields, validation rules, and extraction outputs.",
    tasks: [
      task("Map invoice fields", "Intermediate", 45, "Open /practice/invoice-list and decide which fields a bot must extract from each invoice.", "A field map with invoice number, vendor, amount, due date, and status.", "Start with the output you need before choosing activities.", "/practice/invoice-list"),
      task("Validate invoice amount", "Intermediate", 50, "Create logic that flags invoices over 1000 for human review.", "Invoices are split into auto-process and review queues.", "High-value items often need exception handling."),
      task("Extract document table", "Advanced", 55, "Design an extraction output for line items from a simple invoice table.", "A table structure with item, quantity, unit price, and total.", "Line items need repeating-row thinking."),
      task("Route missing fields", "Advanced", 55, "Handle an invoice with a missing due date and route it to an exception list.", "Bot does not crash; missing due date is captured as an exception.", "Document automation is mostly exception design.")
    ]
  },
  {
    id: "data-scraping",
    level: 9,
    title: "Data scraping",
    focus: "Collect structured data from pages and verify completeness.",
    summary:
      "Practice extracting repeatable lists, tables, and filtered results. You will compare row counts, clean values, and prepare outputs for downstream systems.",
    tasks: [
      task("Scrape products to CSV", "Advanced", 55, "Extract all rows from /practice/product-table and export them to CSV.", "CSV has the same row count and columns as the page.", "Always compare the extracted row count to the UI.", "/practice/product-table"),
      task("Filter scraped results", "Advanced", 55, "Scrape products and keep only rows where price is greater than 50.", "Output contains only matching rows and preserves product names.", "Convert price text to a number before filtering."),
      task("Scrape invoice statuses", "Advanced", 55, "Extract invoices from /practice/invoice-list and group them by status.", "A summary count for Pending, Paid, and Review appears in logs.", "Grouping is a common reporting step.", "/practice/invoice-list"),
      task("Handle empty search results", "Advanced", 55, "Search /practice/search-page for a term with no results and handle it cleanly.", "Workflow logs zero results and continues.", "Zero results is a valid business outcome, not always an error.", "/practice/search-page")
    ]
  },
  {
    id: "error-handling-debugging",
    level: 10,
    title: "Error handling and debugging",
    focus: "Build automations that fail clearly and recover when possible.",
    summary:
      "Practice Try Catch, screenshots, logs, retries, and continuation rules. You will use a page that simulates random and business errors.",
    tasks: [
      task("Catch a simulated error", "Advanced", 60, "Automate /practice/error-simulation and catch the displayed error without stopping the whole run.", "The bot logs the error message and moves to the next transaction.", "Use Try Catch around risky UI actions.", "/practice/error-simulation"),
      task("Retry a temporary failure", "Advanced", 60, "Add a retry for a temporary page failure and stop after three attempts.", "Workflow records attempt count and final status.", "Retries need a limit or they become infinite waits."),
      task("Capture debug evidence", "Advanced", 60, "On failure, capture a screenshot path and the current transaction ID.", "Exception log includes transaction ID, message, and screenshot note.", "Future-you will thank present-you for evidence."),
      task("Classify business vs system exceptions", "Advanced", 60, "Label missing required data as business exception and page crash as system exception.", "Two exception categories appear in output logs.", "Business exceptions are expected bad data; system exceptions are automation/runtime failures.")
    ]
  },
  {
    id: "reframework-basics",
    level: 11,
    title: "REFramework basics",
    focus: "Structure bots like production RPA projects.",
    summary:
      "Learn the transaction mindset behind REFramework: initialization, get transaction data, process transaction, and end process. You will map earlier tasks into that structure.",
    tasks: [
      task("Map an order bot to REFramework", "Advanced", 65, "Assign each order-entry step to Init, Get Transaction Data, Process Transaction, or End Process.", "A clear REFramework mapping for the order form automation.", "Think in transactions, not one long script."),
      task("Create config keys", "Advanced", 65, "Define config keys for URLs, retry count, email recipient, and input file path.", "Config table has names, sample values, and purpose.", "Hard-coded settings make deployment painful."),
      task("Design queue item data", "Advanced", 65, "Design queue item fields for invoice processing.", "Queue schema includes invoice ID, vendor, amount, due date, and priority.", "Queues carry the transaction through the framework."),
      task("Plan retry rules", "Advanced", 65, "Set retry behavior for selector timeout, invalid invoice amount, and missing file.", "Each error has retry/no-retry decision and reason.", "Not every failure should be retried.")
    ]
  },
  {
    id: "real-world-mini-projects",
    level: 12,
    title: "Real-world mini projects",
    focus: "Combine skills into portfolio-ready automations.",
    summary:
      "Build compact projects that look like workplace assignments. Each project needs inputs, processing, validation, output, and support notes.",
    tasks: [
      task("Invoice processing automation", "Job-ready", 80, "Build a small invoice processing automation using /practice/invoice-list and exception rules.", "Bot extracts invoices, routes review items, and creates a summary.", "Treat each invoice as a transaction.", "/practice/invoice-list"),
      task("Customer order entry bot", "Job-ready", 80, "Read order test data and submit it into /practice/order-form with status tracking.", "All valid orders are submitted and invalid orders are skipped with reasons.", "This mirrors many entry-level RPA assignments.", "/practice/order-form"),
      task("Web data reporting bot", "Job-ready", 80, "Scrape /practice/product-table, filter rows, and produce a report summary.", "Report includes count, highest price, and filtered product list.", "Add validation so the report can be trusted.", "/practice/product-table"),
      task("Support-ready runbook", "Job-ready", 75, "Write a one-page runbook for one mini project covering setup, inputs, known errors, and restart steps.", "A support analyst could run and troubleshoot the bot.", "Production RPA includes documentation, but keep it practical.")
    ]
  },
  {
    id: "interview-qa-rpa-job-tasks",
    level: 13,
    title: "Interview preparation and QA/RPA job tasks",
    focus: "Practice explaining your work like a job candidate.",
    summary:
      "Prepare for QA Analyst and RPA interviews with practical demos, debugging explanations, selector reasoning, and scenario-based answers.",
    tasks: [
      task("Explain a selector fix", "Job-ready", 70, "Write an interview-style explanation of how you fixed a dynamic selector.", "Answer explains root cause, fix, and how you tested it.", "Use specific terms: stable attributes, anchors, wildcards, validation."),
      task("Demo a mini project", "Job-ready", 80, "Prepare a 3-minute walkthrough of an order-entry or invoice bot.", "Walkthrough covers goal, inputs, workflow, exceptions, and outcome.", "Hiring teams want evidence of process thinking."),
      task("Answer a failed-bot scenario", "Job-ready", 75, "Explain what you would check if a bot worked yesterday but fails today.", "Answer includes application changes, selector drift, credentials, data, packages, and logs.", "Start from evidence before guessing."),
      task("Create a QA test checklist", "Job-ready", 75, "Create a test checklist for releasing a new UiPath automation.", "Checklist covers happy path, invalid data, environment, exception, retry, and reporting tests.", "QA mindset is a real advantage in RPA roles.")
    ]
  }
];

export const allTasks = lessons.flatMap((lesson) =>
  lesson.tasks.map((task, index) => ({ ...task, lessonId: lesson.id, level: lesson.level, order: index + 1 }))
);

export const badges = [
  { name: "First Bot", description: "Complete your first browser automation task." },
  { name: "Selector Solver", description: "Finish Level 4 selector challenges." },
  { name: "Spreadsheet Operator", description: "Complete Excel-driven form entry." },
  { name: "Exception Handler", description: "Classify and recover from errors." },
  { name: "Job Ready Builder", description: "Complete a real-world mini project." }
];

export const mockProgress = {
  userName: "Practice Analyst",
  completedTaskIds: allTasks.slice(0, 14).map((task) => task.id),
  xp: allTasks.slice(0, 14).reduce((sum, task) => sum + task.xp, 0),
  currentLevel: 4
};

function task(
  title: string,
  difficulty: Difficulty,
  xp: number,
  practicalTask: string,
  expectedResult: string,
  hint: string,
  practiceUrl?: string
): PracticeTask {
  const id = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return { id, title, difficulty, xp, practicalTask, expectedResult, hint, practiceUrl };
}
