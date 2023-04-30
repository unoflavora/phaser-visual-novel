const webpack = require("webpack");
const { merge } = require("webpack-merge");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const common = require("./webpack.common.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const JavaScriptObfuscator = require("webpack-obfuscator");

/**
 * @type {import("webpack-dev-server").WebpackConfiguration}
 */
const prodWebpackConfig = {
	mode: "production",
	output: {
		filename: "js/[name].[contenthash].js",
		path: path.resolve(__dirname, "../dist"),
		chunkFilename: "chunks/[name].[contenthash].js",
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
	optimization: {
		splitChunks: {
			chunks: "initial",
		},
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: 4,
				terserOptions: {
					output: {
						comments: false,
					},
				},
				extractComments: true,
			}),
			new CssMinimizerPlugin({
				minimizerOptions: {
					preset: [
						"default",
						{
							discardComments: { removeAll: true },
						},
					],
				},
			}),
		],
	},
	plugins: [
		new JavaScriptObfuscator(
			{
				rotateUnicodeArray: true,
			},
			[]
		),
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: "./src/assets/",
					to: "",
					globOptions: {
						ignore: [
							// Ignore all `templateinfo` files
							"**/*.templateinfo",
						],
					},
				},
			],
			options: {
				concurrency: 100,
			},
		}),
		new webpack.DefinePlugin({
			DEVELOPMENT: JSON.stringify(false),
			PRODUCTION: JSON.stringify(true),
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css",
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
		],
	},
};

module.exports = (env) =>
	new Promise((resolve, reject) => {
		common(env)
			.then((config) => {
				resolve(merge(config, prodWebpackConfig));
			})
			.catch((err) => {
				reject(err);
			});
	});
