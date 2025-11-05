// server/check-version.js
try {
  // We will read the package.json of the installed library directly
  const googleAiPackageJson = require('@google/generative-ai/package.json');
  console.log('--- DIAGNOSTIC TEST ---');
  console.log('Successfully found @google/generative-ai package.');
  console.log('Installed Version:', googleAiPackageJson.version);
  console.log('-----------------------');

  const expectedVersion = "0.14.1"; // Or a similar recent version
  const majorVersion = parseInt(googleAiPackageJson.version.split('.')[1], 10);

  if (majorVersion >= 10) { // Recent versions are 0.10.0 and up
      console.log('✅ SUCCESS: A recent version is installed. The issue is somewhere else.');
  } else {
      console.log('❌ FAILURE: An old version is installed. This is the root cause of the v1beta error.');
  }

} catch (e) {
  console.error('--- DIAGNOSTIC TEST FAILED ---');
  console.error('Could not find the @google/generative-ai package.');
  console.error('This means the installation is broken. Please run "npm install" again.');
  console.error(e);
  console.error('------------------------------');
}