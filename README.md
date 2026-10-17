# Vedika Phadtare: Portfolio

A static, no-build website. Open `index.html` in a browser, or upload the whole folder to any static host (Netlify Drop, GitHub Pages, Vercel, Cloudflare Pages).

```
index.html          page structure and copy
css/style.css       design tokens, layout, animation
js/main.js          moods, cursor, gallery, lightbox, music, 404
assets/photos/      put her photos here
```

Fonts (Playfair Display, DM Sans, Caveat) load from Google Fonts, so the first view needs an internet connection.

## 1. Add her links and email

Open `js/main.js` and fill in the `CONFIG` block at the top:

```js
var CONFIG={
  instagram:'https://www.instagram.com/her_handle',
  email:'hello@example.com',
  linkedin:'', github:'', mediaKit:'',   // leave empty to hide
  photos:{ ... }
};
```

Anything left empty shows "Link coming soon" (LinkedIn, GitHub and media kit are hidden instead).

## 2. Add her photos

1. Copy photos into `assets/photos/` (JPG or WebP, about 1600px on the long side, under 400 KB each so the site stays fast on phones).
2. List them in `CONFIG.photos` in `js/main.js`:

```js
photos:{
  hero:'assets/photos/hero.jpg',      // arch portrait on the home screen
  about1:'assets/photos/about-1.jpg', // two polaroids in About
  about2:'assets/photos/about-2.jpg',
  p1:'assets/photos/p1.jpg', p2:'', p3:'', p4:'', p5:'',   // 5 featured-work cards
  r1:'assets/photos/reel-1.jpg', r2:'', r3:'', r4:'',      // 4 reel covers (9:16)
  g1:'assets/photos/g1.jpg', g2:'', /* ... */ g9:''        // 9 gallery frames
}
```

Empty slots keep the soft "your photo here" placeholder, so you can add photos gradually.

## 3. Things worth editing

- **Gallery titles and captions:** the `GAL` array in `js/main.js`.
- **Creative Process steps and Collaboration list:** `index.html`, sections `#process` and `#collab`.
- **Mood colors:** the `MOODS` array in `js/main.js`.
- **Palette and fonts:** the `:root` block at the top of `css/style.css`.

## How the moods work

- Desktop: moving the cursor left/right blends Pink Dream and Golden Hour. Featured Work is always Midnight Muse, Reels is Golden Hour, the Gallery is Creative Playground.
- Hovering a world card or project card switches to that mood. The dots in the bottom-right corner pin a mood.
- Phones have no cursor, so moods follow the section being scrolled and the dots.

## Notes

- Music is generated in the browser and only starts when a visitor taps the music button.
- The custom cursor and sparkle trail turn off on touch screens and when the visitor has "reduce motion" enabled.
- The hidden 404 opens from the footer link or from any unknown `#hash` in the URL.
