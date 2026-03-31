#!/usr/bin/env node

/**
 * Generate secure secrets for deployment
 * Run with: node generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n=== Deployment Secrets Generator ===\n');

// Generate JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET (copy this to Render environment variables):');
console.log(jwtSecret);
console.log('\n');

// Generate session secret (if needed)
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('SESSION_SECRET (optional, for future use):');
console.log(sessionSecret);
console.log('\n');

console.log('=== Instructions ===\n');
console.log('1. Copy the JWT_SECRET above');
console.log('2. Go to Render dashboard → Your Service → Environment');
console.log('3. Add JWT_SECRET with the generated value');
console.log('4. Save and redeploy\n');

console.log('⚠️  IMPORTANT: Keep these secrets secure and never commit them to Git!\n');
