var gulp = require('gulp'),
    gutil = require( "gulp-util" ),
    webpack = require( 'webpack' ),
    $ = require('gulp-load-plugins')(),
    WebpackDevServer = require('webpack-dev-server'),
    path = require( 'path' ),
    rimraf = require('rimraf'),    
    open = require( 'gulp-open' );
    childProcess = require( 'child_process' ),
    env = require( 'gulp-env' ),
    merge = require( 'merge-stream' ),    
    chalk = require( 'chalk' );                 // jshint ignore:line

const DEV_MODE =  gutil.env._[0] != 'p' && !gutil.env._[0] != 'pp';      // jshint ignore:line
function log( str ) {
    if ( DEV_MODE ) console.log( chalk.black.bgYellow( str ) );
    else            console.log( chalk.bgCyan.white.bold( str ) );    
}
if( DEV_MODE ){
    var str = `
    ########  ######## ##     ## 
    ##     ## ##       ##     ## 
    ##     ## ##       ##     ## 
    ##     ## ######   ##     ## 
    ##     ## ##        ##   ##  
    ##     ## ##         ## ##   
    ########  ########    ###    
    `;
    log( str );
}else{
    var str = `
    ########  ########   #######  
    ##     ## ##     ## ##     ## 
    ##     ## ##     ## ##     ## 
    ########  ########  ##     ## 
    ##        ##   ##   ##     ## 
    ##        ##    ##  ##     ## 
    ##        ##     ##  #######   `;
    log( str ) ;
}


gulp.task( 'm', () => {
    log( 'm' );    
    var IMG_SRC = [ 'src/img_src/**/*.+(jpg|png)', '!src/img_src/_*' ];
    var OTHER_IMG = [ '!src/img_src/**/*.(jpg|png)', 'src/img_src/_*' ];
    var DIST = 'src/img';
    var imageminPngquant = require( 'imagemin-pngquant' );
    var imageminMozjpeg = require( 'imagemin-mozjpeg' );

    var taskOtherIMG = gulp.src( OTHER_IMG )
        .pipe( $.changed( DIST ) )
        .pipe( $.size( {
            title: '',
            showFiles: true
        }) )
        .pipe( gulp.dest( DIST ) );

    var taskIMGSRC = gulp.src( IMG_SRC )
        .pipe( $.changed( DIST ) )
        .pipe( $.size( {
            title: '',
            showFiles: true
        }) )
        .pipe( $.imagemin( [
            imageminMozjpeg( { quality: 80 }),
            imageminPngquant( { quality: 80 })
        ] ) )
        .pipe( gulp.dest( DIST ) )
        .pipe( $.size( {
            title: 'dist'
        }) );
    return merge( taskOtherIMG, taskIMGSRC );
});

gulp.task( 'rimraf', function ( cb ) {
    log( 'rimraf' );
    rimraf( './dist', cb );
});



gulp.task('webpack-dev-server' ,(cb) => {
    process.env.NODE_ENV = 'development';
    var ifs = require('os').networkInterfaces();
    let host = ''+ Object.keys( ifs ).map( x => ifs[ x ].filter( x => x.family === 'IPv4' && !x.internal )[ 0 ] ).filter( x => x )[ 0 ].address;
    var port = 3000;    
    var URI = `http://${host}:${port}/`;    
    var config = require('./webpack.config');
    config.devtool = 'cheap-module-eval-source-map';
    config.devtool = "source-map"; 
    // config.devtool = "inline-source-map";
    config.output.publicPath = URI;
    
    // 一定先 push 再寫 devServer.hot = true 
    // 不然會 Uncaught RangeError: Maximum call stack size exceeded
    for(var a in config.entry){
        config.entry[a].push( 'webpack/hot/dev-server' );
    }
    config.devServer.hot = true;
    for ( let a in config.entry ) {
        config.entry[ a ].unshift( `webpack-dev-server/client?${URI}` );        
    }
    config.plugins.push( new webpack.NoErrorsPlugin() );
    config.plugins.push( new webpack.HotModuleReplacementPlugin() );
    
    var w = webpack( config );
    var server = new WebpackDevServer( w  , config.devServer  );
    server.listen( port , host , (err) => {
        if( err )
            console.log( err );
        gutil.log("[webpack-dev-server]", URI);

        cb();
        if( gutil.env._[0] === 'd' ){
            return gulp.src( './' )
                .pipe( open( { uri: URI +'?debug=medialand' }) );
        }
    } );
});



// production
gulp.task('p',['rimraf'], (cb) => {
    log( 'p' );    
    process.env.NODE_ENV = 'production';
    var config = require( './webpack.config' );
    config.plugins.push(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false }
        })
    );
    webpack(config, (err , stats) => {
        if(err) {
            throw new gutil.PluginError("webpack", err);
        }
        gutil.log( "[webpack]", stats.toString( { colors: true, progress: true ,chunkModules: false }) );  
        cb();      
    });
});
gulp.task( 'pp', ['p'], () => {
    // deploy productin
    // open FTP
    log('pp');
    var fileZillaBAT =  path.resolve( __dirname, './___FTP.bat' );
    childProcess.exec( fileZillaBAT, ( error, stdout, stderr ) => {
        return gulp.src( './' )
            .pipe( open( { uri: 'http://push.medialand.tw/?debug=milkmidi' }) );
    });
});


gulp.task( 'watch', () => {    
    gulp.watch( 'src/img_src/**/*', [ 'm' ] );    
});


gulp.task( 'd', [ 'watch', 'webpack-dev-server' ], () => {    
});

gulp.task('default',['d']);