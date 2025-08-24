/*
  Conditionally push Prisma schema only when DATABASE_URL is configured.
  This prevents builds from failing on environments without a database.
*/
const { execSync } = require('child_process');

try {
  // Always generate Prisma client
  execSync('npx prisma generate', { stdio: 'inherit' });

  if (process.env.DATABASE_URL) {
    console.log('[db-prepare] DATABASE_URL detected. Running `prisma db push`...');
    execSync('npx prisma db push', { stdio: 'inherit' });
  } else {
    console.log('[db-prepare] DATABASE_URL not set. Skipping `prisma db push`.');
  }
} catch (error) {
  console.error('[db-prepare] Error preparing database:', error);
  // Do not fail build if database step fails; surface error for debugging only
}

