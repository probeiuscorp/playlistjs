module.exports = {
    webpack: config => {
        config.module.rules.push({
            test: /\.txt$/,
            loader: 'raw-loader'
        });
        return config;
    }
};