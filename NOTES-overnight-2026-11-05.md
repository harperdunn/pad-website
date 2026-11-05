# Overnight quality pass: 5 November 2026

Isaac, this is a short list of what changed on the site last night and why. Nothing you wrote was changed, and the gray "To write" boxes are still empty for you to fill in.

## What I checked

I opened every page at phone width (400 pixels) and desktop width (1280 pixels) and checked:

- Does anything stick out past the edge of a phone screen? **No.** Nothing needed fixing.
- Do the four "Read more" links on the Home cards land on the right section of Why It Matters? **Yes.** All four (`#stewardship`, `#no-special-favors`, `#personal-responsibility`, `#free-markets`) exist.
- Do the pictures have descriptions for blind visitors (alt text)? There are no pictures on the four pages yet, so there was nothing to fix. When you add real photos, each one needs a short description.
- Are the headings in order (big title, then section titles, then smaller titles)? **Yes** on all four pages.
- Is the text dark or light enough against its background to read easily (the WCAG AA standard)? **All text passes.** One thing did not: the borders of the form boxes (see below).

## What I changed

1. **Added a page description to About, Why It Matters and Get Involved.** Google shows this text under the page title in search results. Home already had one. I built each from words already on that page, so it makes no new claims. If you want different wording, change the `<meta name="description" ...>` line near the top of the page.

2. **Added a "Skip to main content" link to all four pages.** Some people use the Tab key instead of a mouse. Without this link they have to Tab through the whole menu on every page. It stays hidden until someone presses Tab, then appears in the top-left corner.

3. **Marked the main part of each page.** I wrapped everything between the menu and the footer in a `<main>` tag. You won't see a difference, but screen readers use it to jump straight to the content, and the skip link goes there.

4. **Made keyboard focus easy to see.** When someone Tabs to a link, button or form box, it now gets a thick outline: dark on the light parts of the page, light on the navy parts. Before, the browser drew a thin outline that was hard to see on navy, and the buttons had a pink outline that almost disappeared on the light background.

5. **Made the form boxes easier to see on the Get Involved page.** Their borders were nearly the same color as the navy background, which made it hard to tell where to type. I added one color setting, `--fieldline`, at the top of `styles.css` with the other colors and pointed the form borders at it. To change that color later, change that one line.

The skip link and `<main>` tag are in all four pages, the same way the menu and footer are.

## Claims that still need a source before launch

I did not add any sources. These are the statements on the pages that state facts and do not link to a source yet:

**About page**
- Isaac graduated from the University of Wisconsin-Madison in 2025.
- He was active in Students For Liberty and served as President of Animal Advocacy UW.
- He has been published in The Hill and other outlets. A link to the article(s) would back this up.
- "the national security issues tied to animal policy." This implies such issues exist. The gray box on Why It Matters about pandemic and food security may be where those sources go.

**Why It Matters page**
- No Special Favors: suggests that some industries get bailouts or advantages that others don't. (Your gray box already says a source is needed.)
- Free Markets: suggests that the government props up one industry while blocking its competitors. (Same, your gray box already flags this.)

**Home and About pages**
- "government policies that strip [animals] of their natural-born freedoms." This is mostly a statement of values. If it is meant to refer to specific policies, it needs examples and sources.

## Left for later (not changed)

- The `drafts/` folder was not touched.
- When you add real photos to replace the striped box on About, give each one alt text, for example `alt="Isaac speaking to students at ..."`.
- `styles.css` still has a few colors written directly in the file instead of at the top (white, the pink label color, the light gray-blue text on navy, the dark form-box fill). They all pass the contrast check. Moving them to the top would be a good tidy-up but wasn't needed for this pass.
