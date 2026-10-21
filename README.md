# Patriot Animal Defense website

A plain HTML and CSS site with four pages and no build step. Open `index.html` in a browser to see it.

| File | Page |
|---|---|
| `index.html` | Home: headline, the four principle cards, About teaser |
| `about.html` | Mission, who we are, what we do |
| `why-it-matters.html` | One section per principle; the Home cards link here |
| `contact.html` | Get involved form |
| `styles.css` | All colors, fonts and layout. Colors are set once at the top. |

## How to change the text

Open the page's `.html` file and change the words between the tags. Or open this folder in Claude Code and ask, for example: "Change the Free Markets section to say ..."

The menu and footer are repeated in all four pages. If you change one, change all four (Claude Code will do this if you ask).

## Before launch

- Write the text in each gray "To write" / "To decide" box, then delete the box.
- Delete the `<div class="draft">` line at the top of each page.
- Add a source link for every factual claim.
- Add real photos in place of the striped placeholder on the About page.

## Publishing (free)

Connect this GitHub repo to **Netlify** or **Cloudflare Pages**. Every push to `main` then updates the live site. No build command is needed; the publish folder is the repo root.

The contact form is set up for Netlify Forms (`data-netlify="true"`). On Netlify, submissions show up in the Netlify dashboard with no extra setup. On another host, swap in a form service such as Formspree.

## Handing to a developer

Everything is standard HTML and CSS, so any web developer can take it over. If the site grows past a handful of pages, they can move it to a static site generator such as Astro or Eleventy to share the menu and footer across pages.
