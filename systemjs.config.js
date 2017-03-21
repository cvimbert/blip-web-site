/**
 * Created by Christophe on 31/01/2017.
 */

(function (global) {
    System.config({
        defaultJSExtensions: true,
        paths: {
            'npm:': 'node_modules/'
        },
        map: {
            src: "src",
            'rxjs': 'npm:rxjs',
            'blip-framework/core': 'npm:blip-framework/core'
        },
        packages: {
            src: {
                main: '../compiled/main.js',
                defaultExtension: 'js'
            },
            //'blip-framework': { defaultExtension: 'js', main: 'bundles/blip-framework.umd' },
        }
    })
})(this);