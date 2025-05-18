/**
 * Production Build Optimization Script
 * 
 * This script helps prepare and optimize the frontend for production:
 * 1. Runs linting checks
 * 2. Runs type checking
 * 3. Checks for unused dependencies
 * 4. Runs webpack bundle analyzer (if enabled)
 * 5. Builds the Next.js application
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Log utility
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Run a command and return its output
function runCommand(command, options = {}) {
  log(`Running: ${command}`, colors.blue);
  try {
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    if (options.ignoreError) {
      log(`Command failed but continuing: ${command}`, colors.yellow);
      return null;
    }
    log(`Command failed: ${command}`, colors.red);
    throw error;
  }
}

// Main function
async function main() {
  log('\n================================', colors.cyan);
  log('   PRODUCTION BUILD OPTIMIZER', colors.cyan);
  log('================================\n', colors.cyan);

  // Check if running from the right directory
  if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    log('Error: Please run this script from the project root directory', colors.red);
    process.exit(1);
  }

  // Set environment to production
  process.env.NODE_ENV = 'production';

  try {
    // Step 1: Run ESLint
    log('\n📋 Step 1/5: Running linting checks...', colors.magenta);
    runCommand('npm run lint');
    log('✅ Linting passed', colors.green);

    // Step 2: Run TypeScript checks
    log('\n📋 Step 2/5: Running type checking...', colors.magenta);
    runCommand('npx tsc --noEmit');
    log('✅ Type checking passed', colors.green);

    // Step 3: Check for unused dependencies
    log('\n📋 Step 3/5: Checking for unused dependencies...', colors.magenta);
    runCommand('npx depcheck', { ignoreError: true });

    // Step 4: Run bundle analyzer if enabled
    log('\n📋 Step 4/5: Running bundle analyzer...', colors.magenta);
    const analyzeEnabled = process.argv.includes('--analyze');
    if (analyzeEnabled) {
      log('Bundle analyzer enabled', colors.yellow);
      runCommand('npm run analyze');
    } else {
      log('Skipping bundle analyzer (use --analyze flag to enable)', colors.yellow);
    }

    // Step 5: Build the application
    log('\n📋 Step 5/5: Building the application...', colors.magenta);
    runCommand('npx next build');
    
    log('\n🎉 Build completed successfully!', colors.green);
    log('\nTo start the production server:', colors.blue);
    log('npm run start\n', colors.yellow);

  } catch (error) {
    log('\n❌ Build failed. Please fix the errors and try again.', colors.red);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  log(`\n❌ Unexpected error: ${error.message}`, colors.red);
  process.exit(1);
}); 