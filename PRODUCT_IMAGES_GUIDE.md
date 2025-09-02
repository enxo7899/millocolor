# 🎨 **Product Images Guide - Uniform Size & Ratios**

## 📋 **Current Status**
- **✅ RUPES Skorpio III RH356**: Working (103KB)
- **✅ SATAjet X 5500**: Working (43KB)
- **❌ Need**: Uniform sizing and ratios for professional appearance

## 🎯 **Recommended Image Specifications**

### **📐 Optimal Dimensions:**
- **Width**: 800px
- **Height**: 600px
- **Aspect Ratio**: 4:3 (landscape)
- **File Size**: 100-200KB (optimized)
- **Format**: JPG (for web performance)

### **🎨 Visual Requirements:**
- **Background**: White or transparent
- **Product**: Centered and well-lit
- **Quality**: High resolution, sharp details
- **Consistency**: Same lighting and angle style

## 🔗 **Official Product Image Sources**

### **1. RUPES Skorpio III RH356** ✅
- **Source**: https://www.rupes.com/products/skorpio-iii-rh356
- **Current**: Working (103KB)
- **Status**: Keep as reference for quality

### **2. SATAjet X 5500** ✅
- **Source**: https://www.sata.com/en-amn/products/spray-guns/gravity-flow-cup-guns/satajet-x-5500
- **Current**: Working (43KB)
- **Status**: Keep as reference for quality

## 📥 **Download Instructions**

### **Step 1: Visit Official Websites**
1. **RUPES**: https://www.rupes.com/products/skorpio-iii-rh356
2. **SATA**: https://www.sata.com/en-amn/products/spray-guns/gravity-flow-cup-guns/satajet-x-5500

### **Step 2: Find High-Quality Images**
- Look for product galleries or 360° views
- Find images with white/clean backgrounds
- Choose images showing the full product clearly

### **Step 3: Download Process**
1. **Right-click** on the best product image
2. **Select "Save image as..."**
3. **Save with these exact filenames:**
   - `rupes-skorpio-iii.jpg`
   - `satajet-x5500.jpg`

### **Step 4: Image Optimization**
If images are too large or different ratios:

**Using Online Tools:**
- **TinyPNG**: https://tinypng.com (compress)
- **ResizeImage**: https://resizeimage.net (resize to 800x600)

**Using Photoshop/GIMP:**
1. Open image
2. Go to Image → Image Size
3. Set Width: 800px, Height: 600px
4. Maintain aspect ratio
5. Save as JPG, Quality: 85%

## 📁 **File Structure**
```
public/images/products/
├── rupes-skorpio-iii.jpg    (800x600px, ~150KB)
├── satajet-x5500.jpg        (800x600px, ~150KB)
└── [other product images]
```

## ✅ **Quality Checklist**
- [ ] **Dimensions**: 800x600px (4:3 ratio)
- [ ] **File Size**: 100-200KB
- [ ] **Background**: Clean/white
- [ ] **Product**: Centered and clear
- [ ] **Format**: JPG
- [ ] **Quality**: Sharp and professional

## 🚀 **After Download**
1. **Replace** existing images in `/public/images/products/`
2. **Clear cache**: `rm -rf .next node_modules/.cache`
3. **Restart server**: `npm run dev`
4. **Test**: Visit `http://localhost:3000/products`

## 💡 **Pro Tips**
- **Consistent Lighting**: All images should have similar lighting
- **Same Angle**: Try to get similar viewing angles
- **Clean Backgrounds**: White or neutral backgrounds work best
- **High Resolution**: Start with high-res images, then optimize
- **Brand Consistency**: Maintain the professional look of your brand

---

**🎯 Goal**: Create a uniform, professional product showcase that matches your MilloColor brand aesthetic!