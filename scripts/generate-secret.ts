import { generateKeySync } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import { resolve } from 'path';

const variables = ['SECRET='];

const envPath = resolve(process.argv[2] || '.env');

function generateString() {
  return generateKeySync('hmac', { length: 512 }).export().toString('hex');
}

async function setEnvValues(input: any) {
  try {
    if (!existsSync(envPath)) {
      writeFileSync(envPath, '');
    }
    // read file from hdd & split if from a line break to a array
    const ENV_VARS = readFileSync(envPath, 'utf8').split(EOL);

    const itemsIndex = variables.map((each) => {
      return ENV_VARS.findIndex((e) => e.startsWith(each));
    });

    if (itemsIndex.some((e) => e < 0) && ENV_VARS[ENV_VARS.length - 1] !== '') {
      ENV_VARS.push('');
    }

    variables.forEach((name, i) => {
      const index = itemsIndex[i];
      const key = name.replace('=', '');
      const data = `${key}=${input[key]}`;

      if (index >= 0) {
        ENV_VARS[index] = data;
      } else {
        ENV_VARS.push(data);
      }
    });

    if (itemsIndex.some((e) => e < 0)) {
      ENV_VARS.push('');
    }

    // write everything back to the file system
    writeFileSync(envPath, ENV_VARS.join(EOL));
    return console.log('KEY PAIR ADDED TO THE .ENV FILE ✅ ✅ ✅');
  } catch (error) {
    console.error(error);
    console.error('❌ ❌ ERROR :: KEY PAIR START/END NOT FOUND ❌ ❌');
  }
}

async function generate() {
  const SECRET = generateString();
  await setEnvValues({
    SECRET,
  });

  process.exit(0);
}

generate();
