export type FeedbackResult = {
  source: "huggingface" | "mock";
  correct: string[];
  missing: string[];
  improve: string[];
  nextTask: string;
};

export async function getAiFeedback(input: string): Promise<FeedbackResult> {
  const key = process.env.HUGGINGFACE_API_KEY;

  if (!key) {
    return mockFeedback(input);
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-large", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `Review this UiPath/RPA practice submission. Return concise feedback about what is correct, missing, improvements, and next task:\n\n${input}`
      })
    });

    if (!response.ok) {
      return mockFeedback(input);
    }

    const data = await response.json();
    const text = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;

    return {
      source: "huggingface",
      correct: ["You described a concrete automation attempt and provided useful troubleshooting context."],
      missing: ["Check whether the workflow includes validation, logging, and exception handling."],
      improve: [text || "Add clearer transaction steps, expected output, and evidence from the run."],
      nextTask: "Repeat the task with one invalid input row and document how your bot handles it."
    };
  } catch {
    return mockFeedback(input);
  }
}

function mockFeedback(input: string): FeedbackResult {
  const text = input.toLowerCase();
  const mentionsSelector = text.includes("selector");
  const mentionsError = text.includes("error") || text.includes("exception");
  const mentionsExcel = text.includes("excel") || text.includes("datatable");

  return {
    source: "mock",
    correct: [
      "You included enough detail to understand the workflow goal.",
      mentionsSelector ? "You are thinking about selector reliability, which is critical for browser bots." : "You described practical steps instead of only theory."
    ],
    missing: [
      mentionsError ? "Add the exact exception type and whether it is business or system related." : "Add a failure case so the workflow is testable.",
      "Include the expected output and how you verified it."
    ],
    improve: [
      mentionsExcel ? "Write status back to the input file so each row has an audit trail." : "Use variables for inputs instead of hard-coded values.",
      "Add logs around each major step: open page, enter data, submit, validate result."
    ],
    nextTask: mentionsSelector
      ? "Automate the dynamic buttons page and explain which selector attributes stayed stable."
      : "Run the same task with valid and invalid data, then record how the bot behaves in both cases."
  };
}
