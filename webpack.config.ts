import path from "path";
import webpack from "webpack";
// @ts-ignore
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

module.exports = (env: { [ i: string ]: boolean; }): webpack.Configuration => {
    return {
        context: __dirname, // to automatically find tsconfig.json
        mode: env.PRODUCTION ? "production" : "development",
        entry: { main: "./src/script/main.ts" },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].js"
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                    options: {
                        // disable type checker - we will use it in fork plugin
                        transpileOnly: true
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        "resolve-url-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                sassOptions: {
                                    outputStyle: "compressed"
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.html$/i,
                    loader: "html-loader",
                },
                {
                    test: /\.(png|svg|webp)$/i,
                    // @ts-ignore
                    type: "asset/resource"
                }
            ]
        },
        // @ts-ignore
        devServer: {
            contentBase: path.resolve(__dirname, "dist"),
            proxy: {
                "/api": env.PRODUCTION ? "" : "http://localhost:7071"
            }
        },
        resolve: {
            extensions: [ ".ts", ".js", ".scss" ]
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "src/index.html"
            })
        ]
    };
};
