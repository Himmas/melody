/**
 * Created by kylin on 16/7/8.
 */
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/main.js',
    format: 'iife',
    plugins: [ json(), babel() ],
    dest: 'src/build/index.js'
};
