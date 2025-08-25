/*
  Build script that doesn't require database connection
  Use this for deployment when DATABASE_URL is not available
*/
const { execSync } = require('child_process');

try {
  console.log('[build] Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('[build] Building Next.js application...');
  execSync('next build', { stdio: 'inherit' });
  
  console.log('[build] Build completed successfully!');
} catch (error) {
  console.error('[build] Build failed:', error);
  process.exit(1);
} 