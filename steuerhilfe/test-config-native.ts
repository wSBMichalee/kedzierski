import { buildConfig } from 'payload';
import config from './src/payload.config.ts';

async function testConfig() {
  try {
    console.log("Resolving config promise...");
    const resolvedConfig = await config;
    console.log("Config keys:", Object.keys(resolvedConfig));
    if (resolvedConfig.admin) {
      console.log("Admin config exists!");
    } else {
      console.log("Admin config is missing!");
    }
  } catch (err) {
    console.error("Failed to build config:", err);
  }
}

testConfig();
