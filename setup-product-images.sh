#!/bin/bash

# Script to set up temporary product images for testing
# Run this script to create placeholder images for all products

echo "Setting up temporary product images..."

# Create the products directory if it doesn't exist
mkdir -p public/images/products

# Copy existing images to create placeholders for each product
cp public/images/products/premium.jpg public/images/products/rupes-skorpio-iii.jpg
cp public/images/products/professional.jpg public/images/products/roberlo-spray-gun.jpg
cp public/images/products/specialty.jpg public/images/products/satajet-x5500.jpg
cp public/images/products/premium.jpg public/images/products/rupes-bigfoot-lhr21.jpg
cp public/images/products/professional.jpg public/images/products/satajet-5000b.jpg
cp public/images/products/specialty.jpg public/images/products/roberlo-custom-system.jpg

echo "✅ Temporary product images created!"
echo ""
echo "Files created:"
echo "- rupes-skorpio-iii.jpg"
echo "- roberlo-spray-gun.jpg"
echo "- satajet-x5500.jpg"
echo "- rupes-bigfoot-lhr21.jpg"
echo "- satajet-5000b.jpg"
echo "- roberlo-custom-system.jpg"
echo ""
echo "Next steps:"
echo "1. Replace these temporary images with actual product photos"
echo "2. See PRODUCT_IMAGES_GUIDE.md for detailed instructions"
echo "3. Ensure images are optimized for web (under 500KB each)"