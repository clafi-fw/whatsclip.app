# Screenshots

The windows the panels of the start page show. A new shot replaces the file of the same name;
[The files](#the-files) says which panel shows which.

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
| `any-scale` | `scale` | the same clipboard at a small and at a large scale |
| `themes` | `trio` | three different ClaFi themes |
| `as-text` | single | a private or HTML format read as text, its encoding shown |
| `syntax` | single | code copied from an editor, coloured, the language picker in view |
| `exotic-languages` | single | text in several scripts - Arabic, Devanagari, Thai, CJK |
| `picture-and-text` | single | a clipboard holding both - the two preview tabs at the top of the strip |
| `pixels` | single | a picture zoomed in, one pixel picked, its colour read out |
| `alpha-channel` | single | a translucent picture over the checkerboard |

## The files

| File | Panel |
|------|-------|
| `dark-mode-light.png`, `dark-mode-dark.png` | `dark-mode` |
| `any-scale-small.png`, `any-scale-large.png` | `any-scale` |
| `themes-1.png`, `themes-2.png`, `themes-3.png` | `themes`, back to front |
| `as-text.png` | `as-text` |
| `syntax.png` | `syntax` |
| `exotic-languages.png` | `exotic-languages` |
| `picture-and-text.png` | `picture-and-text` |
| `pixels.png` | `pixels` |
| `alpha-channel.png` | `alpha-channel` |

Images outside the first panel carry `loading="lazy"`, so a visitor fetches a panel's windows when
it is opened.
