module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },


    // {
    //   name: '@electron-forge/maker-squirrel',
    //   config: {
    //     authors: 'YOU',
    //     iconUrl: 'https://your_site/favicon.ico',
    //     exe: `${BUILD_NAME}.exe`,
    //     name: BUILD_NAME,
    //   },
    // },

  ],
};
