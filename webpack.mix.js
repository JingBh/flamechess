const mix = require('laravel-mix');

/*
mix.webpackConfig({
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            require.resolve("@babel/preset-typescript"),
                            [
                                require.resolve("@babel/preset-env"),
                                {
                                    modules: false,
                                    targets: {"ie": 10}
                                }
                            ]
                        ],
                        cacheDirectory: true
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx", ".vue", ".ts", ".tsx"]
    }
});
*/

mix.disableNotifications();
mix.version();

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.sass('resources/sass/chessterm.scss', 'public/css');

mix.ts('resources/js/chessterm.ts', 'public/js');

if (mix.inProduction()) {
    mix.babel('public/js/chessterm.js', 'public/js/chessterm.js');
} else mix.sourceMaps();
