# Screenshots

Each panel of the start page shows a drawn illustration until its screenshots are here. A panel
takes real images by replacing its `data-illustration` element in `index.html`.

## Taking them

- PNG, cropped to the window's edge, with transparent corners where the window is rounded. The
  page adds a soft shadow of its own.
- At least 1500 px wide for a single window, so the picture stays sharp on a high-density screen.
- A single window fills a 16:10 box; other proportions are fitted in and centred.

## Plugging one in

A single window:

```html
<div class="scene"><img src="shots/syntax.png" alt="C++ copied from an editor, coloured"></div>
```

A light and a dark version, picked by the visitor's system:

```html
<div class="scene">
    <picture>
        <source srcset="shots/syntax-dark.png" media="(prefers-color-scheme: dark)">
        <img src="shots/syntax.png" alt="C++ copied from an editor, coloured">
    </picture>
</div>
```

Several windows in one scene - the layout class places them in order:

| Class   | Windows | Where they stand |
|---------|---------|------------------|
| `pair`  | 2 | top left, then bottom right, overlapping |
| `scale` | 2 | the small one bottom left, the large one top right |
| `trio`  | 3 | cascading from top left to bottom right |

```html
<div class="scene pair">
    <img src="shots/dark-mode-light.png" alt="WhatsClip in light">
    <img src="shots/dark-mode-dark.png" alt="WhatsClip in dark">
</div>
```

## The panels

| Panel | Layout | What the window shows |
|-------|--------|-----------------------|
| `dark-mode` | `pair` | the same clipboard in light and in dark |
| `any-scale` | `scale` | the same clipboard at 87% and at 150% |
| `themes` | `trio` | three different ClaFi themes |
| `as-text` | single | a private or HTML format read as text, its encoding shown |
| `syntax` | single | code copied from an editor, coloured, the language picker in view |
| `exotic-languages` | single | text in several scripts - Arabic, Devanagari, Thai, CJK |
| `picture-and-text` | single | a clipboard holding both - the two preview tabs at the top of the strip |
| `pixels` | single | a picture zoomed in, one pixel picked, its colour read out |
| `alpha-channel` | single | a translucent picture over the checkerboard |

When every panel has its screenshots, `assets/illustrations.js` and `assets/illustrations.css`
have nothing left to draw, and both lines that load them in `index.html` can go.
