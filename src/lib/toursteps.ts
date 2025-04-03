// TourSteps.ts
export const steps = [
  {
    target: '[data-tour-id="timer"]',
    content: "You will see how much time you've spent here",
  },
  {
    target: '[data-tour-id="hint"]',
    content: "This is how many hints you've used",
  },
  {
    target: '[data-tour-id="hintbutton"]',
    content: "Click to show hint - make sure the direction is correct.",
  },

  {
    target: '[data-tour-id="check"]',
    content: "Visit your profile to update personal info.",
  },

  {
    target: '[data-tour-id="reset"]',
    content: "Click to start again",
  },

  {
    target: '[data-tour-id="direction"]',
    content: "Shows whether you are solving an Across or a Down word",
  },
  {
    target: '[data-tour-id="words"]',
    content: "These are clues to help you fill the grid. Click to set direction and focus the cursor to the relevant cell",
  },

  {
    target: '[data-tour-id="row"]',
    content: "Type your answer here. Double click to toggle word direction",
  },
];
