"""Re-frame the real product photos and partner logos so they sit consistently.
Products: trim the white surround, then centre each product in a square canvas so its
larger dimension fills the same share of the frame. Logos: trim to the artwork and export
at a usable resolution with only a hairline margin."""
import sys, os, glob
from PIL import Image, ImageChops

root = sys.argv[1]

def ink_box(rgb, thresh):
    bg = Image.new('RGB', rgb.size, (255, 255, 255))
    m = ImageChops.difference(rgb, bg).convert('L').point(lambda v: 255 if v > thresh else 0)
    return m.getbbox()

def flat(im):
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
        return Image.alpha_composite(bg, im).convert('RGB')
    return im.convert('RGB')

# ---- products: 1200x1200, product's long side = 78% of the frame, white ground
src = os.path.join(root, 'public/images/products')
dst = os.path.join(root, 'public/images/products/fit')
os.makedirs(dst, exist_ok=True)
S, FILL = 1200, 0.78
for f in sorted(glob.glob(os.path.join(src, '*.jpg'))):
    im = flat(Image.open(f))
    if os.path.basename(f) == 'roberlo-multyfiller-express.jpg':
        # the source photo carries a grey colour-swatch disc beside the can; it is not part of the product
        from PIL import ImageDraw
        ImageDraw.Draw(im).rectangle((1135, 45, 1345, 255), fill=(255, 255, 255))
    bb = ink_box(im, 14)
    im = im.crop(bb)
    w, h = im.size
    k = (S * FILL) / max(w, h)
    im = im.resize((round(w * k), round(h * k)), Image.LANCZOS)
    canvas = Image.new('RGB', (S, S), (255, 255, 255))
    # sit products slightly low of centre, like on a shelf
    x = (S - im.width) // 2
    y = (S - im.height) // 2 + round(S * 0.02)
    canvas.paste(im, (x, y))
    out = os.path.join(dst, os.path.basename(f).replace('.jpg', '.webp'))
    canvas.save(out, 'WEBP', quality=86, method=6)
    print('product', os.path.basename(out), im.size)

# ---- logos: trimmed artwork, max 720x300, 3% margin, white ground (tiles are white)
lsrc = os.path.join(root, 'public/images/partners')
ldst = os.path.join(root, 'public/images/partners/fit')
os.makedirs(ldst, exist_ok=True)
for f in sorted(glob.glob(os.path.join(lsrc, '*.*'))):
    if os.path.isdir(f): continue
    name = os.path.splitext(os.path.basename(f))[0].lower()
    im = flat(Image.open(f))
    bb = ink_box(im, 24) or (0, 0, *im.size)
    im = im.crop(bb)
    w, h = im.size
    k = min(720 / w, 300 / h, 1.0 if max(w, h) > 720 else 3.0)
    im = im.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)
    m = round(max(im.size) * 0.03)
    canvas = Image.new('RGB', (im.width + 2 * m, im.height + 2 * m), (255, 255, 255))
    canvas.paste(im, (m, m))
    out = os.path.join(ldst, name + '.webp')
    canvas.save(out, 'WEBP', quality=90, method=6)
    print('logo', name, canvas.size)
