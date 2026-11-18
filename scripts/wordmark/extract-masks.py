"""Extract black-on-white masks of MILLO (blue) and COLOR (red) from the logo PNG.
Usage: python3 scripts/wordmark/extract-masks.py <out-dir>
"""
import sys
import numpy as np
from PIL import Image

out = sys.argv[1].rstrip('/') + '/'
im = np.array(Image.open('public/images/logo_en.png').convert('RGBA')).astype(int)
r, g, b, a = im[..., 0], im[..., 1], im[..., 2], im[..., 3]
# letter band only: excludes the round emblem on the left, the (R) mark and the tagline
X0, X1, Y0, Y1 = 430, 3140, 60, 420
band = np.zeros(a.shape, bool)
band[Y0:Y1, X0:X1] = True
blue = (a > 100) & (b > r + 40) & (b > g + 20) & band
red = (a > 100) & (r > g + 60) & (r > b + 40) & band
for name, m in (('blue', blue), ('red', red)):
    Image.fromarray(np.where(m[Y0:Y1, X0:X1], 0, 255).astype('uint8')).save(out + name + '.png')
print('masks written to', out)
