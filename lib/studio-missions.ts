export type ActivityType = "openBrowser" | "typeInto" | "click" | "getText" | "validateText" | "logMessage";

export type WorkflowStepTemplate = {
  id: string;
  type: ActivityType;
  name: string;
  target?: string;
  value?: string;
  outputVariable?: string;
};

export type StudioMission = {
  id: string;
  progressTaskId: string;
  title: string;
  level: string;
  xp: number;
  targetApp: "search" | "login" | "order" | "table" | "dynamic";
  goal: string;
  checklist: string[];
  starterWorkflow: WorkflowStepTemplate[];
  expected: {
    url: string;
    typedValue?: string;
    clickTarget?: string;
    extractTarget?: string;
    extractedValue?: string;
    validationText?: string;
    logMustInclude?: string;
  };
};

export const studioMissions: StudioMission[] = [
  {
    id: "mission-search-extract",
    progressTaskId: "open-browser-and-search",
    title: "Search Automation: Extract Category",
    level: "Beginner",
    xp: 35,
    targetApp: "search",
    goal: "Open the search app, search for automation, click the enterprise result, extract the category, and validate Operations.",
    checklist: [
      "Open /practice/search-page",
      "Type automation into #searchKeyword",
      "Click the enterprise automation result",
      "Extract category text",
      "Validate the extracted text is Operations"
    ],
    expected: {
      url: "/practice/search-page",
      typedValue: "automation",
      clickTarget: "[data-result='enterprise-automation-playbook']",
      extractTarget: "[data-field='category']",
      extractedValue: "Operations",
      validationText: "Operations"
    },
    starterWorkflow: [
      { id: "search-open", type: "openBrowser", name: "Open Search Page", target: "/practice/search-page" },
      { id: "search-type", type: "typeInto", name: "Type Keyword", target: "#searchKeyword", value: "automation" },
      { id: "search-click", type: "click", name: "Click Enterprise Result", target: "[data-result='enterprise-automation-playbook']" },
      { id: "search-get", type: "getText", name: "Get Category", target: "[data-field='category']", outputVariable: "articleCategory" },
      { id: "search-validate", type: "validateText", name: "Validate Category", value: "Operations" }
    ]
  },
  {
    id: "mission-login-success",
    progressTaskId: "inspect-a-login-selector",
    title: "Login Automation: Validate Success",
    level: "Beginner",
    xp: 40,
    targetApp: "login",
    goal: "Open the login app, type valid credentials, click sign in, and validate the success message.",
    checklist: [
      "Open /practice/login-form",
      "Type analyst@example.com into #email",
      "Type Practice123 into #password",
      "Click #signInButton",
      "Validate Login successful"
    ],
    expected: {
      url: "/practice/login-form",
      typedValue: "Practice123",
      clickTarget: "#signInButton",
      validationText: "Login successful"
    },
    starterWorkflow: [
      { id: "login-open", type: "openBrowser", name: "Open Login Page", target: "/practice/login-form" },
      { id: "login-email", type: "typeInto", name: "Type Email", target: "#email", value: "analyst@example.com" },
      { id: "login-password", type: "typeInto", name: "Type Password", target: "#password", value: "Practice123" },
      { id: "login-click", type: "click", name: "Click Sign In", target: "#signInButton" },
      { id: "login-validate", type: "validateText", name: "Validate Success", value: "Login successful" }
    ]
  },
  {
    id: "mission-order-confirmation",
    progressTaskId: "submit-an-order-form",
    title: "Order Entry: Capture Confirmation",
    level: "Intermediate",
    xp: 55,
    targetApp: "order",
    goal: "Open the order form, enter customer data, submit the order, and extract the confirmation number.",
    checklist: [
      "Open /practice/order-form",
      "Type Jordan Miles into #customerName",
      "Type Studio License into #productName",
      "Click #submitOrder",
      "Extract confirmation number"
    ],
    expected: {
      url: "/practice/order-form",
      typedValue: "Studio License",
      clickTarget: "#submitOrder",
      extractTarget: "[data-field='confirmation']",
      extractedValue: "ORD-48291",
      validationText: "ORD-48291"
    },
    starterWorkflow: [
      { id: "order-open", type: "openBrowser", name: "Open Order Form", target: "/practice/order-form" },
      { id: "order-customer", type: "typeInto", name: "Type Customer", target: "#customerName", value: "Jordan Miles" },
      { id: "order-product", type: "typeInto", name: "Type Product", target: "#productName", value: "Studio License" },
      { id: "order-submit", type: "click", name: "Submit Order", target: "#submitOrder" },
      { id: "order-get", type: "getText", name: "Get Confirmation", target: "[data-field='confirmation']", outputVariable: "confirmationId" },
      { id: "order-validate", type: "validateText", name: "Validate Confirmation", value: "ORD-48291" }
    ]
  },
  {
    id: "mission-table-extraction",
    progressTaskId: "extract-product-table-rows",
    title: "Table Extraction: Highest Value Product",
    level: "Intermediate",
    xp: 60,
    targetApp: "table",
    goal: "Open the product table, extract the highest value product, and validate Robot Runtime.",
    checklist: [
      "Open /practice/product-table",
      "Extract [data-field='highestProduct']",
      "Validate Robot Runtime"
    ],
    expected: {
      url: "/practice/product-table",
      extractTarget: "[data-field='highestProduct']",
      extractedValue: "Robot Runtime",
      validationText: "Robot Runtime"
    },
    starterWorkflow: [
      { id: "table-open", type: "openBrowser", name: "Open Product Table", target: "/practice/product-table" },
      { id: "table-get", type: "getText", name: "Get Highest Product", target: "[data-field='highestProduct']", outputVariable: "highestProduct" },
      { id: "table-validate", type: "validateText", name: "Validate Product", value: "Robot Runtime" }
    ]
  },
  {
    id: "mission-dynamic-selector",
    progressTaskId: "click-dynamic-buttons",
    title: "Dynamic Selector: Click Stable Target",
    level: "Intermediate",
    xp: 65,
    targetApp: "dynamic",
    goal: "Use a stable selector to click the dynamic approval target and validate the success status.",
    checklist: [
      "Open /practice/dynamic-buttons",
      "Click [data-action='approve-primary']",
      "Validate Correct dynamic button clicked"
    ],
    expected: {
      url: "/practice/dynamic-buttons",
      clickTarget: "[data-action='approve-primary']",
      validationText: "Correct dynamic button clicked"
    },
    starterWorkflow: [
      { id: "dynamic-open", type: "openBrowser", name: "Open Dynamic Buttons", target: "/practice/dynamic-buttons" },
      { id: "dynamic-click", type: "click", name: "Click Stable Approval Target", target: "[data-action='approve-primary']" },
      { id: "dynamic-validate", type: "validateText", name: "Validate Click", value: "Correct dynamic button clicked" }
    ]
  }
];
