# Marco Fissore '27 — site source

A static site with **HTML, CSS, and JS kept in separate files**, that
renders every page from a Markdown file. Nav is data-driven, so adding a
page is just: write a `.md` file + add one entry to `data/nav.json`.

## Structure

```
index.html          shell — header, sidebar, content mount point
css/style.css        all styling
js/markdown.js        tiny markdown -> HTML renderer (no dependencies)
js/nav.js              builds the header dropdown + sidebar from nav.json
js/router.js           hash router (#/page-id) — loads & renders pages
js/main.js              boot script
data/nav.json          site structure: every page/link, and where to find it
data/portfolio.json    Photography gallery manifest (dropdown folders)
content/*.md           the actual page text, one file per page
src/portfolio/<folder>/  photo/video files for each portfolio dropdown
```

## Running it locally

Because pages are fetched with `fetch()`, you need a local server (opening
`index.html` directly with `file://` will block the fetches in most
browsers). From this folder:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`.

## Adding or editing a text page

1. Add/edit a Markdown file in `content/`.
2. If it's a new page, add an entry to `data/nav.json`:
   ```json
   { "id": "my-page", "title": "My Page", "type": "markdown", "file": "content/my-page.md" }
   ```
   Nest it under another entry's `"children"` array to put it in a
   dropdown/section. Use `"type": "external"` with a `"url"` instead of
   `"file"` for links that should just open another site in a new tab.
3. That's it — the header dropdown, the sidebar, and the router all pick
   it up automatically.

### Markdown support

Headers (`#`–`######`), **bold**, *italic*, `` `code` ``, fenced ```` ``` ````
code blocks, links, images, bullet/numbered lists, blockquotes, tables,
horizontal rules, and `[button: Label](url)` for a styled button-link.

Anything that isn't plain text — an embed, an iframe, a custom `<div>` —
can be dropped straight into the Markdown file as raw HTML; it passes
through untouched. See `content/ftc.md` for an example iframe embed.

## Adding photos/videos to the Photography page

1. Drop image/video files into the matching folder under `src/portfolio/`
   (or create a new folder for a new dropdown).
2. List them in `data/portfolio.json`. Each group looks like:
   ```json
   {
     "id": "brophy-mtb",
     "title": "Brophy MTB",
     "description": "Photos from the Brophy mountain biking team.",
     "folder": "src/portfolio/brophy-mtb",
     "items": [
       { "file": "trail-01.jpg", "caption": "Trail day" },
       { "file": "race-clip.mp4", "type": "video" }
     ]
   }
   ```
3. To add a brand-new dropdown/category, add a new object to the `groups`
   array with a new `id` and `folder`, and create that folder under
   `src/portfolio/`.

Photos render as a grid inside a collapsible dropdown per folder/category,
and click through to a full-size lightbox.
