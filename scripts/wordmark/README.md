# Hero wordmark

`public/models/millocolor-wordmark.svg` holds the exact MILLOCOLOR letterforms, traced from
`public/images/logo_en.png`. The hero extrudes it into 3D, and the loader and fallbacks use it flat.
The logo face is custom (splayed M, flat-cut C terminals), so no stock font matches it.

To regenerate (for example after a logo change):

```bash
mkdir -p /tmp/wordmark && python3 scripts/wordmark/extract-masks.py /tmp/wordmark
npm i --no-save potrace@2.1.8
node scripts/wordmark/trace.cjs /tmp/wordmark public/models/millocolor-wordmark.svg
```

Then add `fill-rule="evenodd"` to both paths (it keeps the holes in O and R) and set the fills to
the logo colours (blue `#2c4ea2`, red `#ed1c24`).
