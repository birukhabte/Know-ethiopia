#!/usr/bin/env node

/**
 * Validate environment variables before deployment
 * Run with: node validate-env.js [backend|frontend]
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const target = args[0] || 'both';

console.log('\n=== Environment Variables Validator ===\n');

// Required backend environment variables
const backendRequired = [
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'CLIENT_URL'
];

// Required frontend environment variables
const frontendRequired = [
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_SUPABASE_ANON_KEY',
  'REACT_APP_API_BASE_URL'
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

function validateEnv(env, required, name) {
  console.log(`\n📋 Validating ${name} environment variables...\n`);
  
  if (!env) {
    console.log(`❌ .env file not found for ${name}`);
    return false;
  }
  
  let allValid = true;
  const missing = [];
  const empty = [];
  const warnings = [];
  
  required.forEach(key => {
    if (!(key in env)) {
      missing.push(key);
      allValid = false;
    } else if (!env[key] || env[key].trim() === '') {
      empty.push(key);
      allValid = false;
    } else {
      // Check for placeholder values
      const value = env[key].toLowerCase();
      if (value.includes('your-') || 
          value.includes('change-this') || 
          value.includes('localhost') && name === 'Backend (Production)') {
        warnings.push(key);
      }
    }
  });
  
  if (missing.length > 0) {
    console.log('❌ Missing variables:');
    missing.forEach(key => console.log(`   - ${key}`));
  }
  
  if (empty.length > 0) {
    console.log('❌ Empty variables:');
    empty.forEach(key => console.log(`   - ${key}`));
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  Potential placeholder values:');
    warnings.forEach(key => console.log(`   - ${key}: ${env[key]}`));
  }
  
  if (allValid && warnings.length === 0) {
    console.log('✅ All required variables are set!');
  } else if (missing.length === 0 && empty.length === 0) {
    console.log('⚠️  All variables present but check warnings above');
  }
  
  return allValid;
}

function validateBackend() {
  const envPath = path.join(__dirname, 'backend', '.env');
  const env = loadEnvFile(envPath);
  return validateEnv(env, backendRequired, 'Backend');
}

function validateFrontend() {
  const envPath = path.join(__dirname, 'frontend', '.env.local');
  const env = loadEnvFile(envPath);
  return validateEnv(env, frontendRequired, 'Frontend');
}

function showDeploymentChecklist(backendValid, frontendValid) {
  console.log('\n=== Pre-Deployment Checklist ===\n');
  
  console.log(backendValid ? '✅' : '❌', 'Backend environment variables');
  console.log(frontendValid ? '✅' : '❌', 'Frontend environment variables');
  console.log('⬜', 'Code committed to GitHub');
  console.log('⬜', 'Secrets not committed (.gitignore configured)');
  console.log('⬜', 'Google OAuth credentials ready');
  console.log('⬜', 'Supabase project configured');
  
  console.log('\n=== Next Steps ===\n');
  
  if (!backendValid || !frontendValid) {
    console.log('1. Fix the environment variable issues above');
    console.log('2. Run this script again to verify');
    console.log('3. Follow QUICK_START_DEPLOYMENT.md\n');
  } else {
    console.log('1. Generate production secrets: node generate-secrets.js');
    console.log('2. Follow QUICK_START_DEPLOYMENT.md');
    console.log('3. Use DEPLOYMENT_CHECKLIST.md to track progress\n');
  }
}

function showProductionReminders() {
  console.log('\n=== Production Deployment Reminders ===\n');
  console.log('📝 Remember to update these for production:\n');
  console.log('Backend (Render):');
  console.log('  - Generate new JWT_SECRET (use generate-secrets.js)');
  console.log('  - Set NODE_ENV=production');
  console.log('  - Update GOOGLE_CALLBACK_URL with Render URL');
  console.log('  - Update CLIENT_URL with Vercel URL');
  console.log('');
  console.log('Frontend (Vercel):');
  console.log('  - Update REACT_APP_API_BASE_URL with Render URL');
  console.log('');
  console.log('Google OAuth:');
  console.log('  - Add production URLs to authorized origins');
  console.log('  - Add Render callback URL to redirect URIs');
  console.log('');
}

// Main execution
if (target === 'backend' || target === 'both') {
  const backendValid = validateBackend();
  
  if (target === 'backend') {
    showProductionReminders();
    process.exit(backendValid ? 0 : 1);
  }
  
  if (target === 'both') {
    const frontendValid = validateFrontend();
    showDeploymentChecklist(backendValid, frontendValid);
    showProductionReminders();
    process.exit(backendValid && frontendValid ? 0 : 1);
  }
}

if (target === 'frontend') {
  const frontendValid = validateFrontend();
  showProductionReminders();
  process.exit(frontendValid ? 0 : 1);
}

if (target !== 'backend' && target !== 'frontend' && target !== 'both') {
  console.log('Usage: node validate-env.js [backend|frontend|both]');
  console.log('Default: both\n');
  process.exit(1);
}
