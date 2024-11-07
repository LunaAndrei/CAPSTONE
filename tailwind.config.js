module.exports = {
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
  }