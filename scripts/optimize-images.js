/**
 * Image Optimization Script for Production
 * 
 * This script optimizes all images in the /public folder, reducing
 * their file size without significant quality loss, making the
 * website load faster.
 * 
 * Usage: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if sharp is installed
try {
  require.resolve('sharp');
  console.log('✅ Sharp is already installed');
} catch (e) {
  console.log('📦 Installing sharp for image optimization...');
  execSync('npm install sharp --save-dev');
}

// ANSI color codes for better terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Image optimization function using Sharp
function optimizeImage(imagePath) {
  const sharp = require('sharp');
  const { name, ext, dir } = path.parse(imagePath);
  const outputPath = imagePath;
  
  // Skip already optimized images
  if (name.endsWith('.opt')) return;
  
  const isJPEG = ['.jpg', '.jpeg'].includes(ext.toLowerCase());
  const isPNG = ext.toLowerCase() === '.png';
  const isWebP = ext.toLowerCase() === '.webp';
  const isGIF = ext.toLowerCase() === '.gif';
  
  let optimizePromise;
  
  if (isJPEG) {
    console.log(`${colors.blue}Processing JPEG:${colors.reset} ${imagePath}`);
    optimizePromise = sharp(imagePath)
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
  } else if (isPNG) {
    console.log(`${colors.blue}Processing PNG:${colors.reset} ${imagePath}`);
    optimizePromise = sharp(imagePath)
      .png({ quality: 80, compressionLevel: 9 })
      .toBuffer();
  } else if (isWebP) {
    console.log(`${colors.blue}Processing WebP:${colors.reset} ${imagePath}`);
    optimizePromise = sharp(imagePath)
      .webp({ quality: 80 })
      .toBuffer();
  } else if (isGIF) {
    console.log(`${colors.yellow}Skipping GIF (optimization not supported):${colors.reset} ${imagePath}`);
    return;
  } else {
    console.log(`${colors.yellow}Skipping unsupported file type:${colors.reset} ${imagePath}`);
    return;
  }
  
  // Get original file size
  const originalSize = fs.statSync(imagePath).size;
  
  // Process the image and save
  optimizePromise.then(buffer => {
    fs.writeFileSync(outputPath, buffer);
    const newSize = fs.statSync(outputPath).size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(2);
    console.log(`${colors.green}Optimized:${colors.reset} ${imagePath} ${colors.green}(${reduction}% smaller)${colors.reset}`);
  }).catch(err => {
    console.error(`${colors.red}Error optimizing ${imagePath}:${colors.reset}`, err);
  });
}

// Get all image files from a directory recursively
function getAllImageFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllImageFiles(filePath, arrayOfFiles);
    } else {
      const ext = path.extname(filePath).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
        arrayOfFiles.push(filePath);
      }
    }
  }
  
  return arrayOfFiles;
}

// Main function
async function main() {
  console.log(`\n${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.cyan}       IMAGE OPTIMIZATION UTILITY${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}\n`);
  
  try {
    const publicDir = path.join(process.cwd(), 'public');
    
    // Check if public directory exists
    if (!fs.existsSync(publicDir)) {
      console.log(`${colors.red}Error: Public directory not found${colors.reset}`);
      return;
    }
    
    // Get all images
    const imageFiles = getAllImageFiles(publicDir);
    
    if (imageFiles.length === 0) {
      console.log(`${colors.yellow}No images found in ${publicDir}${colors.reset}`);
      return;
    }
    
    console.log(`${colors.blue}Found ${imageFiles.length} images to optimize${colors.reset}\n`);
    
    // Process each image
    for (const imagePath of imageFiles) {
      optimizeImage(imagePath);
    }
    
    console.log(`\n${colors.green}Image optimization complete!${colors.reset}\n`);
    
  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error);
  }
}

// Run the script
main().catch(console.error); 