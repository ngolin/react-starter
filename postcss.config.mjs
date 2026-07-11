import babelConfig from './babel.config.js';

const config = {
  plugins: {
    '@stylexjs/postcss-plugin': {
      include: ['{app,lib}/**/*.{js,jsx,mjs,ts,tsx,mts}'],
      babelConfig: {
        babelrc: false,
        parserOpts: {
          plugins: ['typescript', 'jsx'],
        },
        plugins: babelConfig.plugins,
      },
    },
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;
