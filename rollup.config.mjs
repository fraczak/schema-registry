import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/main.mjs',  // Entry point of your application
  output: {
    file: 'public/js/bundle.js',
    format: 'iife',  // Immediately Invoked Function Expression, suitable for <script> tags
    name: 'local_k'
  },
  plugins: [
    nodePolyfills(),
    resolve({
      browser: true,
      preferBuiltins: false  // Ensure that rollup uses the browser-compatible versions
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),  // or 'production'
      preventAssignment: true
    })
  ]
};
