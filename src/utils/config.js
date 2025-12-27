import readline from 'readline';

export function getApiKey(providedKey) {
  if (providedKey) {
    return providedKey;
  }
  if (process.env.TESTOMATIO) {
    return process.env.TESTOMATIO;
  }
  return null;
}

export async function promptForApiKey() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Enter Testomatio API key: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
