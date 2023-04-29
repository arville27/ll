module.exports = {
  plugins: {
    '@unocss/postcss': {
      content: [
        './src/**/*.{html,js,ts,jsx,tsx}',
        '../../packages/ui/src/**/*.{html,js,ts,jsx,tsx}',
        '../../packages/ui/index.tsx',
      ],
    },
  },
};
