# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Database

The schema for the website-specific parts of the scrape database:

```sql
CREATE TABLE slugs(slug TEXT PRIMARY KEY);

CREATE TABLE chunks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL DEFAULT 'unknown',
  ts TEXT NOT NULL DEFAULT (datetime('now')),
  title TEXT NOT NULL DEFAULT 'Unknown',
  body TEXT NOT NULL DEFAULT '',
  FOREIGN KEY (slug) REFERENCES slugs(slug)
);

CREATE TABLE chunk_posts (
  chunk_id INTEGER NOT NULL,
  post_uri TEXT NOT NULL,
  is_live_tweet BOOLEAN NOT NULL DEFAULT 0,
  is_news_link BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (chunk_id, post_uri),
  FOREIGN KEY (chunk_id) REFERENCES chunks(id),
  FOREIGN KEY (post_uri) REFERENCES posts(uri)
);
```

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
