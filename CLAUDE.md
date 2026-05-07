# Claude Instructions

1. Use Traditional Chinese or US English.
2. Never use CN Chinese or Simplified Chinese.
3. Treat this repository as classroom course material. Optimize for students understanding the lesson during class and reproducing demos after class.

## Course Readability Criteria

There is no single public standard that fully defines "good readability." Use this repo-specific rubric when reviewing or changing course UI/content.

### Legibility

- Use WCAG-style contrast as the baseline: normal text should meet at least 4.5:1 contrast; large text should meet at least 3:1.
- On dark backgrounds, avoid low-contrast gray text for anything students must read.
- Avoid tiny body copy. Metadata can be small, but learning content, demo steps, and Q&A answers should be comfortable on a classroom projector.
- Keep line height generous for Traditional Chinese and mixed Chinese/English content.

### Scannability

- Assume students scan before they read. Put the main point early in headings, paragraphs, and list items.
- Prefer direct headings, short paragraphs, ordered lists, and bullet lists over decorative layouts.
- If something is just a sequence of steps, use a real ordered list instead of a visual "step" widget.
- Keep each section focused on one teaching job.

### Cognitive Load

- Follow Cognitive Load Theory and Mayer-style multimedia principles: remove decorative material that does not support the learning goal.
- A visual aid is only useful if it reduces explanation cost. If the graphic needs extra explanation, use plain text instead.
- Use visual emphasis to signal essential material, not to make the page look richer.
- Do not split one idea into many boxes unless the grouping genuinely helps comprehension.

### Affordance And Predictability

- Do not make static content look clickable. Pills, tabs, cards, and step controls should only look interactive when they actually are.
- Follow common UI conventions so students do not need to infer what a shape means.
- Keep navigation and keyboard behavior course-scoped and predictable.

### Classroom Utility

- Demo-ready material should appear before optional or homework-style material.
- Demo steps should be concrete enough that students can follow prompts in an interactive CLI.
- Every page should make the current learning objective obvious: what to listen for, what to try, or what to take away.
- Prefer fewer, clearer sections over many visually distinct sections.

## Pre-Ship Review Checklist

- Is the main takeaway visible without decoding the layout?
- Does every visual element reduce understanding cost?
- Are any non-interactive elements styled like controls?
- Is required text readable on a dark background and projector-sized display?
- Can a student reproduce the demo or exercise from the written steps?
