/* Shared between the site bundle and the Cloudflare worker, which are built
   separately — the refusal has to be one literal in one place or the widget
   will eventually stop recognising what the model was told to say. */
export const OFF_TOPIC_REFUSAL =
  "That's outside what I can answer. I only cover Srinivasan's background, experience, projects, and how to reach him.";

/* The request caps, shared for the same reason the refusal is: the widget
   trims a conversation before sending it and the worker rejects one that
   arrives too long, and those two have to agree. When they drifted, the
   widget cheerfully sent a history the worker had already decided was too
   big — a 400 the visitor could only escape by resetting the chat.

   `maxMessageChars` is also the textarea's maxLength, so an over-long
   message is impossible to type rather than rejected after sending. */
export const CHAT_LIMITS = {
  /** Most turns the worker will accept in one request. */
  maxTurns: 16,
  /** Longest single message, in characters. */
  maxMessageChars: 1500,
  /** Longest whole conversation, in characters, summed across turns. */
  maxTotalChars: 12000,
} as const;
