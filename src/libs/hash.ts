import { generateKeySync, pbkdf2Sync } from 'crypto';

const hashIt = (input: string, salt: string) => {
  return pbkdf2Sync(input, salt, 1000, 64, `sha512`).toString(`hex`);
};

export default {
  verify: async (password: string, hash: string, salt: string) => {
    const passwordHash = hashIt(password, salt);
    return hash === passwordHash;
  },

  generate: async (password: string) => {
    const salt = generateKeySync('hmac', { length: 512 }).export().toString('hex');

    return [hashIt(password, salt), salt];
  },
};
