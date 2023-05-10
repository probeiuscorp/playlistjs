const CopyPlugin = require('copy-webpack-plugin');
const MonacoPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.txt$/,
            loader: 'raw-loader',
        });

        if(isServer === false) {
            config.plugins.push(
                new CopyPlugin({
                    patterns: [{
                        from: './node_modules/onigasm/lib/onigasm.wasm',
                        to: './public/onigasm.wasm',
                    }],
                }),
                new MonacoPlugin({
                    languages: ['markdown'],
                }),
            );
        }
        return config;
    },
};