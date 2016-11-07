import Vue from 'vue';
import { init } from './util/init';
var VueRouter = require( "vue-router" );

init();

require("index.jade");
require("main.scss");

console.log( '--------------------' );
console.log( '__DEV__',__DEV__ );
console.log( 'process.env.NODE_ENV',process.env.NODE_ENV );
console.log( '--------------------' );


const router = new VueRouter( {
    routes: [
        { path: '/', component: require( "HelloWorld.vue" ) },
        { path: '/child', component: require( "Child.vue" ) },
    ]
});

var App = require( 'HelloWorld' );
new Vue( {
    className: "main.js",    
    el: '#app',    // 會把 #app 下的 app 元素整個換成 HelloWorld 裡的元素
    components: { 'app': require( 'App' ) },
    router
});


