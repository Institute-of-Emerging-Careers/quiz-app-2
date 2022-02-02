const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
    plugins: [
      // ...
      require('tailwindcss'),
      require('autoprefixer'),
	purgecss({
      		content: ['./**/*.html','./**/*.ejs','./**/*.js'],
          extractors: [
            {
                extractor: content => {
                    return content.match(/[A-z0-9-:\/]+/g) || [];
                },
                extensions: ['css', 'html', 'ejs', 'js']
            }
          ]
    	})
      // ...
    ]
  }
