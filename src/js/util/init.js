import Vue from 'vue';
export function init() {
    console.log( 'init' );
    Vue.mixin( {
        /*created: function () {            
            var className = this.$options.className;
            console.log( "%c1:" + 'created ' + className, 'background:#1abc9c;color:white;font-size:10px' );
        },*/
        mounted: function () {
            var className = this.$options.className;
            console.log( "%c1:" + 'mounted ' + className, 'background:#1abc9c;color:white;font-size:10px' );
        },
        destroyed: function () {
            var className = this.$options.className;
            console.log( "%c1:" + 'destroyed ' + className, 'background:#1abc9c;color:white;font-size:10px' );
        }
    });
}