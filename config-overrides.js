const { override, addWebpackResolve } = require('customize-cra');

module.exports = override(
    addWebpackResolve({
        fallback: {
            vm: require.resolve('vm-browserify')
        }
    })
);