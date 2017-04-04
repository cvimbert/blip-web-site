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
            jquery: "npm:jquery/dist/jquery",
            highlightjs: "npm:highlight.js/lib/index",
            TweenLite: "npm:gsap/TweenLite",
            'blip-framework/core': 'npm:blip-framework/core/index'
        },
        packages: {
            
        }
    })
})(this);