// TODO: craco-less-fix -> craco-less
// https://github.com/DocSpring/craco-less/issues/86#issuecomment-994265357
const CracoLessPlugin = require('craco-less-fix');
const { getThemeVariables } = require('antd/dist/theme');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              ...getThemeVariables({
                dark: true,
              }),
              '@primary-color': '#0f0',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
