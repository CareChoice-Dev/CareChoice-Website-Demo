# SDA Photos — Marketing Workflow

CareChoice SDA homes live in Salesforce (Lumary). The website's marketing curation layer is Payload. This doc explains how marketing adds, orders, and removes photos for SDA homes on the website.

## Where to do it

Open `/admin` → SDA → SDA Photos.

## Add a photo

1. Click **Create New**.
2. **Salesforce Site** — pick from the dropdown. The list is live from Salesforce (only shows active SDA sites that match our website filter).
3. **Photo** — drag-and-drop the photo into the Photo field. You'll be prompted to add **alt text** — this is required for accessibility. Use a short description (e.g. "Sunny living room with hardwood floor and large window").
4. **Use as hero photo** — tick this for the photo you want to appear at the top of the home detail page and as the card image. **One hero per site.**
5. **Display order** — for non-hero photos, set the order they appear in the gallery (1, 2, 3…).
6. **Save**.

The photo appears on the website within 10 minutes (ISR revalidation window).

## Remove a photo

1. Open the SDA Photos collection.
2. Find the photo by site name.
3. Delete it. The card / hero falls back to the next photo by display order, or to the magenta "Photo coming soon" placeholder if none remain.

## Behavior

- Sites with NO photos show the magenta placeholder.
- Sites with photos: the **hero** (first photo tagged isHero, or first by display order if none flagged) appears on the card and at the top of the detail page.
- All photos (hero + non-hero) are stored for future gallery polish (Plan 6 or later).
- A site can have any number of photos — there's no upper limit.

## What about audit PDFs and inspection photos?

Those stay in Salesforce's Files related list on the Site record. They never appear on the website. Marketing only curates "for website" photos through Payload, keeping the public site clean and the Salesforce record complete.
