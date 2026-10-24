/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​​​​‌‌‌​​​​​‌‌‌‌​‌​​‌‌​‌‌​​​​‌‌​​​‌​‌​​‌‌‌​​‌​‌​​‌​​‌‌​​​‌‌​‌​‌‌‌‌‌​‌​​‌‌‌​​‌​​​‌‌​​​‌‌​​‌​​‌​​‌‌​​​‌‌​‌​‌​​‌‌​‌‌‌‌​‌​‌‌‌‌‌​‌​​‌​​‌​‌‌‌​​‌‌​‌​‌​‌​​​‌‌​‌​‌​​‌‌‌​​​​​‌​​​‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.0pzl1NRc_NF2Ljo_IsTjpG
 */
"use client";

import { useRef, useState } from "react";
import Icon from "@/components/primitives/Icon";
import { COPY_EMAIL_COPY, PROFILE, type ContactMethod } from "@/lib/data/profile";
import { haptic } from "@/lib/haptics";

/* The email cell of the contact grid, which is the only one of the six
   that carries an action as well as a link.

   The previous version called `navigator.clipboard.writeText` bare and
   set "Copied" on the next line regardless. That fails in three real
   situations: the Clipboard API does not exist at all on a page served
   over plain HTTP or inside some in-app webviews, `writeText` rejects
   when the document is not focused or permission is refused, and an
   unhandled rejection in that handler is silent. In all three the
   visitor was told the address had been copied when it had not.

   So the copy runs through one guarded path with a real fallback:

     1. `navigator.clipboard.writeText`, if it exists, awaited.
     2. Failing that, the deprecated-but-universal selection route — a
        hidden textarea, `select()`, `document.execCommand("copy")`.
        It is deprecated; it is also the only thing that works where the
        async API is missing, and "deprecated" is not the same as "gone".
     3. Failing both, the visible address itself is selected so the
        visitor can copy it with their own keyboard, and the button does
        not claim success. There is no invented failure message here on
        purpose: the mailto link beside it still works, and a control
        that quietly does nothing it promised is worse than one that
        hands the job back.

   Only the confirmed-success path shows "Copied" and fires the commit
   haptic. */

type CopyEmailCardProps = {
  /** The email method's own record, so the labels stay in the data. */
  method: ContactMethod;
};

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* Fall through to the selection route rather than giving up: a
       rejected permission is exactly when the old API still works. */
  }

  try {
    const scratch = document.createElement("textarea");
    scratch.value = text;
    scratch.setAttribute("readonly", "");
    /* Off-screen rather than `display: none` — a hidden element cannot
       hold a selection, and a visible one would scroll the page. */
    scratch.style.position = "fixed";
    scratch.style.top = "0";
    scratch.style.left = "-9999px";
    document.body.appendChild(scratch);
    scratch.select();
    scratch.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(scratch);
    return ok;
  } catch {
    return false;
  }
}

export default function CopyEmailCard({ method }: CopyEmailCardProps) {
  const [copied, setCopied] = useState(false);
  const valueRef = useRef<HTMLSpanElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function onCopy() {
    const ok = await writeToClipboard(PROFILE.email);

    if (!ok) {
      /* Last resort: select the address on the page. The visitor's own
         copy shortcut then does what the button could not. */
      haptic("reject");
      try {
        const node = valueRef.current;
        if (node) {
          const range = document.createRange();
          range.selectNodeContents(node);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      } catch {
        /* Nothing further to try. The mailto link is still there. */
      }
      return;
    }

    haptic("commit");
    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-start justify-between gap-4 bg-ground p-5">
      <a
        href={method.href}
        title={COPY_EMAIL_COPY.linkTitle}
        className="group min-w-0 flex-1"
      >
        <div className="flex items-center gap-2.5 text-mute">
          <Icon name={method.icon} className="h-4 w-4" />
          <span className="t-anno">{method.label}</span>
        </div>

        <span
          ref={valueRef}
          className="mt-3 block text-[0.9375rem] break-all text-body transition-colors duration-150 group-hover:text-detect"
        >
          {method.value}
        </span>
      </a>

      <button
        type="button"
        onClick={onCopy}
        title={COPY_EMAIL_COPY.buttonTitle}
        /* The state change is the word, not a tick glyph: "Copied" is
           legible to a screen reader and to someone who cannot tell the
           two colours apart. `aria-live` announces it without moving
           focus. */
        className="btn shrink-0"
      >
        <span aria-live="polite">
          {copied ? COPY_EMAIL_COPY.copied : COPY_EMAIL_COPY.idle}
        </span>
      </button>
    </div>
  );
}
