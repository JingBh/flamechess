const mix = require("laravel-mix")

mix.disableNotifications()

mix.sass("resources/sass/chessterm.scss", "public/css")
  .sass('resources/sass/chessterm_intro.scss', "public/css")
  .sass("resources/sass/chessgui.scss", "public/css")

mix.ts("resources/js/chessterm/main.ts", "public/js/chessterm.js")
  .ts("resources/js/chessintro/intro.ts", "public/js/chessterm_intro.js")
  .ts("resources/js/chessgui/main.ts", "public/js/chessgui.js")

// Vue
mix.ts("resources/chessterm/intro/index.ts", "public/js/chessterm/intro.js")

if (mix.inProduction()) {
  mix.babel("public/js/chessterm.js", "public/js/chessterm.js")
    .babel("public/js/chessterm_intro.js", "public/js/chessterm_intro.js")
    .babel("public/js/chessgui.js", "public/js/chessgui.js")
  mix.version()
} else {
  mix.sourceMaps()
  mix.browserSync({
    proxy: "homestead-flamechess",
    files: [
      "resources/views/**/*.php",
      "public/js/**/*.js",
      "public/css/**/*.css"
    ],
    ghostMode: false,
    open: false
  })
}
