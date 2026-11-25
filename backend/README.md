# Goldberg Beds — backend (PocketBase)

The site works on its own: products come from `site/products.js`, and cart, favourites and recent orders are kept in each visitor's browser. Connect PocketBase so **you** can edit products and prices and see every order in one dashboard.

## What it stores

| Collection | What's in it | Who can see it |
|---|---|---|
| `products` | name, category, price, description, features, photos, featured (shows in "Recent work"), active (shown on site), sort | Public can read active products; only you can edit |
| `orders` | reference (GB-XXXXXX), customer name, WhatsApp number, area, notes, items, item count, subtotal, status | Customers can only create; only you can read |

Order statuses: new, contacted, quoted, paid, in production, delivered, cancelled.

## Set it up (about 10 minutes)

1. **Get PocketBase v0.23 or newer.** Either:
   - Hosted: create a free instance at pockethost.io, or
   - Your own machine/server: download from pocketbase.io and run `pocketbase serve`.
2. **Add the migration.** Copy `pb_migrations/1764100000_goldberg_init.js` into PocketBase's `pb_migrations` folder (on PocketHost, upload it via the instance's file manager) and restart. This creates both collections and loads all 38 products.
3. **Create your admin login** at `https://YOUR-PB-URL/_/` the first time you open it.
4. **Allow the website to talk to it.** In the dashboard, under Settings → Application, keep the URL correct. CORS is open by default.
5. **Connect the site.** In `site/index.html`, find `CONFIG` near the bottom and set:
   ```js
   pb: 'https://YOUR-PB-URL',
   ```
6. **Deploy the `site` folder** (GitHub Pages, Netlify, etc.). Keep `products.js` and the `img` folder next to `index.html` — the seeded products point to `img/...`.

## Day to day

- **Set prices:** dashboard → `products` → edit `price` (rand, whole number). Blank shows "Price on request".
- **New product:** add a record, upload photos to `photos` (these override `images`), pick a category, tick `active`.
- **Front showcase:** tick `featured`; order with `sort` (lower first).
- **Orders:** dashboard → `orders`, newest first. The customer also sends the same order to WhatsApp with its GB- reference so you can match them.

## Notes

- If PocketBase is unreachable the site falls back to `products.js`, so it never shows an empty shop.
- To add a new category, edit the `category` field's options in the dashboard.
- Anyone can submit an order (that's how checkout works). If spam shows up, add a rate limit under Settings → Rate limits.
