# Fitted product photos and partner logos

`public/images/products/fit/*.webp` and `public/images/partners/fit/*.webp` are generated from the
original files next to them (which stay untouched):

- products: white surround trimmed, then each product centred on a 1200×1200 white square with its
  long side at 78% of the frame, so every tile has the same visual weight. The Roberlo Multyfiller
  source photo has a grey colour-swatch disc beside the can; it is blanked in the fitted copy.
- logos: trimmed to the artwork with a 3% margin and exported up to 720×300.

Regenerate after adding or replacing a photo or logo:

    python3 scripts/assets/fit_assets.py "$PWD"

Requires Pillow. No AI generation is involved: these are the real product photos and brand marks.
