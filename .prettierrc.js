import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export default {
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  tabWidth: 2,
  printWidth: 100,
  plugins: [require.resolve('prettier-plugin-tailwindcss')]
};
