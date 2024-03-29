import compiler from '@ampproject/rollup-plugin-closure-compiler'

export default {
  input: 'index.js',
  plugins: [
    compiler()
  ],
  output: {
    file: 'dist/trimmings.js',
    format: 'iife'
  }
}
