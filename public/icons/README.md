# PWA Icon Generation Notes

To generate proper PWA icons from the Hawamoni logo, you'll need to:

1. Create the following icon sizes from your logo:
   - favicon.ico (16x16, 32x32, 48x48)
   - icon-72x72.png
   - icon-96x96.png  
   - icon-128x128.png
   - icon-144x144.png
   - icon-152x152.png
   - icon-192x192.png
   - icon-384x384.png
   - icon-512x512.png

2. Tools you can use:
   - Online: favicon.io, realfavicongenerator.net
   - Command line: ImageMagick, sharp-cli
   - Design tools: Figma, Adobe Illustrator

3. Guidelines:
   - Ensure the Naira symbol remains clear at small sizes
   - Consider a simplified version for very small icons (16x16, 32x32)
   - Maintain the gradient colors from your brand palette
   - Add padding/safe area for rounded corners on mobile

Current logo: /public/logo.png
Generated icons should go in: /public/icons/