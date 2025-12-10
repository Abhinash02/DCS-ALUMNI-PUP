module.exports = {
  style: {
    postcss: {
      loaderOptions: (postcssLoaderOptions) => {
        // Prevent PostCSS from processing node_modules
        postcssLoaderOptions.postcssOptions.plugins = [
          require('tailwindcss')({
            content: ['./src/**/*.{js,jsx,ts,tsx}'],
          }),
          require('autoprefixer'),
        ];
        return postcssLoaderOptions;
      },
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Modify Webpack to exclude node_modules from postcss-loader
      const cssRule = webpackConfig.module.rules.find(
        (rule) => rule.test && rule.test.toString().includes('.css')
      );
      if (cssRule) {
        cssRule.exclude = /node_modules/;
      }
      return webpackConfig;
    },
  },
};