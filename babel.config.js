module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@components': './components',
            '@screens': './app/screens',
            '@api': './api',
            '@context': './context'
          }
        }
      ],
      'react-native-reanimated/plugin' // must be last
    ]
  };
};




