import webpack from 'webpack';
import path from 'path';
import {fileURLToPath} from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsPath = './src/js';
const cssPath = './src/scss';
const outputPath = 'dist';
const entryPoints = {
    'bundle': jsPath + '/app.js',
    'style': cssPath + '/app.scss',
};

export default {
    stats: 'summary',
    entry: entryPoints,
    output: {
        path: path.resolve(__dirname, outputPath),
        filename: '[name].min.js',
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].min.css',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './src/img/**/*',
                    to({context, absoluteFilename}) {
                        return "./img/[name][ext]";
                    },
                    transform: {
                        cache: true,
                    },
                },
            ],
        }),
    ],
    externals: {
        "jquery": "jQuery"
    },
    module: {
        rules: [
            {
                test: /\.s?[c]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.sass$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                outputStyle: 'expanded',
                                indentedSyntax: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                type: 'asset',
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
            new ImageMinimizerPlugin({
                loader: true,
                minimizer: {
                    implementation: ImageMinimizerPlugin.sharpMinify,
                    options: {
                        fileURLToPath: './dist/img',
                        encodeOptions: {
                            jpeg: {
                                quality: 90,
                            },
                            png: {
                                quality: 90,
                            }
                        },
                    },
                },
                generator: [
                    {
                        type: "asset",
                        implementation: ImageMinimizerPlugin.sharpGenerate,
                        options: {
                            encodeOptions: {
                                webp: {
                                    quality: 100,
                                },
                            },
                        },
                    },
                ],
            }),
        ],
    },
};