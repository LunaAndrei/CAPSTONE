module.exports = {
  content: [
    "./CAPSTONE/*.html",      // Scans all HTML files in the CAPSTONE directory
    "./CAPSTONE/**/*.js"      // Scans all JS files in CAPSTONE (including subfolders)
  ],
  theme: {
    extend: {
      keyframes: {
        drive: {
          '0%': { left: '-40px' },
          '100%': { left: '100px' },
        }
      },
      animation: {
        drive: 'drive 1.5s linear infinite'
      }
    }
  },
  plugins: []
};
