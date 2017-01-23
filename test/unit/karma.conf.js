// Karma configuration
// Generated on Mon Jan 23 2017 10:53:08 GMT+0800 (CST)


module.exports = function(config) {
    var configuration = {
        // other things
        //根目录，files的路径从这里开始取
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // 源文件与测试用例
        // list of files / patterns to load in the browser
        files: [
            'src/modules/**/*.js',
            'test/unit/specs/**/*.spec.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

        // es6代码做预处理
        preprocessors: {
            'src/modules/**/*.js': ['babel', 'coverage', 'sourcemap'],
            'test/unit/specs/**/*.spec.js': ['babel', 'coverage', 'sourcemap']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'kjhtml', 'coverage'],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        // proxies 资源文件代理
        proxies: {
            "/media/": "http://localhost:4002/media/"
        },

        // coverage output setting
        coverageReporter: {
            instrumenterOptions: {
                istanbul: {
                    noCompact: true
                }
            },
            reporters: [{
                type: 'html',
                dir: './test/unit/coverage/'
            }, {
                type: 'text-summary'
            }],
        },
        sourcemap: {
            transform: function(mapData) {
                mapData.sourceRoot = '/';
            }
        },

        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
    };

    if (process.env.TRAVIS) {
        configuration.browsers = ['Chrome_travis_ci'];
    }
    
    config.set(configuration)
}
