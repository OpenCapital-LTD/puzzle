// webpack.config.js
const {
    ModuleFederationPlugin
} = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const {
    DefinePlugin,
    ProvidePlugin
} = require('webpack')

module.exports = {
    mode: 'development',
    entry: './src/main.tsx',
    output: {
        publicPath: 'auto',
        filename: '[name].bundle.js',
        // chunkFilename: "[name].[contenthash].js",
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        port: 3004, // Different port for each microfrontend
        hot: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        historyApiFallback: true,
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'fe_oca_puzzle',
            filename: 'remoteEntry.js', // Name of the remote entry file
            exposes: {
                './oca_puzzle': './src/App.tsx'
            },
            remotes: {
                shell_app: 'shell_app@https://ehub.opencapital.com/remoteEntry.js', // Remote module and its URL
            },
            shared: {
                react: {
                    singleton: true,
                    eager: true,
                    requiredVersion: false
                },
                "react-dom": {
                    singleton: true,
                    eager: true,
                    requiredVersion: false
                },
                "react-router-dom": {
                    singleton: true,
                    eager: true,
                    requiredVersion: false
                },
            },
        }),
        new DefinePlugin({
            'process.env': {
                VITE_API_KEY: JSON.stringify(process.env.VITE_API_KEY),
            },
        }),
        new ProvidePlugin({
            React: 'react', // Auto import React wherever JSX is used
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        alias: {
            '@': path.resolve(__dirname, 'src'), // 👈 this makes @ point to /src
        },
    },
    module: {
        rules: [{
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'], // Add loaders for CSS files
            },
            {
                test: /\.(scss|sass)$/, // Add this rule to handle SCSS files
                use: [
                    'style-loader', // Inject CSS into the DOM
                    'css-loader', // Translates CSS into CommonJS
                    'sass-loader', // Compiles Sass to CSS
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource', // Add loader for images and SVGs
            },
        ],
    },
};