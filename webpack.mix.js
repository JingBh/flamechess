const mix = require('laravel-mix');

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

mix.ts('resources/js/chessterm/main.ts', 'public/js/chessterm.js');

if (mix.inProduction()) {
    mix.babel('public/js/chessterm.js', 'public/js/chessterm.js');
} else mix.sourceMaps();
