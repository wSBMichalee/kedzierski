import configPromise from './src/payload.config.ts';

async function run() {
  try {
    console.log('Resolving config...');
    const config = await configPromise;
    console.log('Config resolved. Keys:', Object.keys(config || {}));
    if (!config) {
      console.log('CONFIG IS UNDEFINED');
    }
  } catch (err) {
    console.error('ERROR during config resolve:', err);
  }
}

run();
