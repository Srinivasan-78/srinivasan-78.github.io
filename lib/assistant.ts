/* Shared between the site bundle and the Cloudflare worker, which are built
   separately — the refusal has to be one literal in one place or the widget
   will eventually stop recognising what the model was told to say. */
export const OFF_TOPIC_REFUSAL =
  "That's outside what I can answer. I only cover Srinivasan's background, experience, projects, and how to reach him.";
