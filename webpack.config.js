var path = require( "path" );
var webpack = require( 'webpack' );
const chalk = require( 'chalk' );
const gutil = require( 'gulp-util' );
const DEV_MODE = process.env.NODE_ENV === 'development';
var colorFun;
if( DEV_MODE ){
    colorFun = chalk.black.bgYellow;
}else{
    colorFun = chalk.bgCyan.white;
}
console.log( colorFun(  'DEV_MODE = '+DEV_MODE  ) );
console.log( colorFun(  'process.env.NODE_ENV = '+process.env.NODE_ENV ) );

var config = {
    context: path.resolve( 'src' ),
    entry:{
        app: ['./js/main.js'],// 這裡要放 Array , 因為在 gulp 時會動態加入 hotreload 的 js        
        // vendor:[]
    },
    output: {
        path: path.resolve( "dist" ),
        filename: "asset/js/[name].js"
    },
    resolve: {
        alias:{
        },
        root: [
            path.resolve( 'src/js/components' ),
            path.resolve( 'src/jade' ),
            path.resolve( 'src/img' ),
            path.resolve( 'src/css' ),
            path.resolve( 'src/asset' ),
        ],
        extensions: ["", ".js", ".vue"] // require 不用打副檔名
    },
    plugins: [        
        new webpack.DefinePlugin( {
            __DEV__         : DEV_MODE,
            __MY_STR__      : DEV_MODE ? "'我是開發版'" : "'正是正式版'",
            'process.env.NODE_ENV': DEV_MODE ? "'development'" : '"production"'  // 這個一定要加，不然 vue/react 裡會認定是 development 版，會有些 warning
        })
    ],
    devServer: {
        /*proxy: {            
            '/api': {
                target: 'http://www.sony-xperia.com.tw/XZ/',
                changeOrigin: true
            }
        },*/
        // https://webpack.github.io/docs/webpack-dev-server.html
        historyApiFallback: false,
		inline: true,
		progress: true,
        stats: {
            colors:       true,
			hash:         false, // add the hash of the compilation
			version:      false, // add webpack version information
			timings:      true, // add timing information
			assets:       true, // add assets information
			chunks:       false, // add chunk information
			chunkModules: false, // add built modules information to chunk information
			modules:      false, // add built modules information
			cached:       false, // add also information about cached (not built) modules
			reasons:      false, // add information about the reasons why modules are included
			source:       false, // add the source code of modules
			errorDetails: true, // add details to errors (like resolving log)
			chunkOrigins: false // add the origins of chunks and chunk merging info
        }
    },
    module: {
        noParse: [],
        vue: {
            // configure autoprefixer
            autoprefixer: {
                browsers: ['last 4 versions','> 1%']
            }
        },
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue',
                include: path.resolve( 'src/js/components' ),
                exclude: /node_modules/
            },          
            {
                test: /\.scss$/,
                loader: 'style!css!autoprefixer!sass',
                include: path.resolve( 'src/css' ),
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel',
                include: path.resolve( 'src/js' ),
                query: {
                    presets:["es2015", "stage-2"]
                },
                exclude: /node_modules/
            },
            /*{   // 用 file-loaer 直接將有用到的圖片搬到 dist/img/[name].[ext]
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader?name=img/[name].[ext]',
                include: path.resolve( 'src/img' )
            },*/
            {
                test: /\.(png|jpg)$/,   //url-loader, 小於 2 K 的圖片會變 base64, 其他就搬到 dist/asset/img/
                loader: 'url-loader?limit=2048&name=asset/img/[name].[ext]',
                include: path.resolve( 'src/img' ),
                exclude: /node_modules/
            },
            {
                // 搬動有用到的 asset 檔案
                loader: 'file-loader?name=[path][name].[ext]',
                include: path.resolve( 'src/asset' )
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                include: path.resolve( 'src/js/components/template/' )
            },
            {
                test: /\.jade$/,
                loader: 'file?name=[name].html!jade-html?pretty=false',
                include: path.resolve('src/jade')
            }
        ]
    },
    externals: {    // 不要將這裡打包到你的 js 檔裡, 可以用 extensions ，然後自己 script src, 或是用 addVendor 的方法，二選一
        'jquery': '$',
        'vue': 'Vue',
        'vuex': 'Vuex',
        'axios': 'axios',
        'vue-router': 'VueRouter'
    }
};

module.exports = config;
