
# Unit Test Framework

* [Project templates with Visual Studio](#project-templates-with-visual-studio)

* [CoreXT environments](#corext-environments)

* [Creating a project from scratch](#creating-a-project-from-scratch)

* [Test results and code coverage](#test-results-and-code-coverage) 

## Project templates with Visual Studio

If you do not see the `Azure Portal` project template in your installation of Visual Studio, ensure you have already installed the Portal SDK that is located at [https://aka.ms/portalfx/download](https://aka.ms/portalfx/download).  Also make sure you are using `Visual Studio 2015`.

1. Install **Node LTS** that is located at [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

1. To support the Unit Test project in Visual Studio you must first install the **Node Tools for Visual Studio** that are located at  [https://github.com/Microsoft/nodejstools/releases/tag/v1.3.1](https://github.com/Microsoft/nodejstools/releases/tag/v1.3.1). 

1. Launch Visual Studio and click `File > New > Project > Visual C# > Azure Portal`. It will scaffold a solution with two projects:  `Extension.csproj` and `Extension.UnitTest.csproj`.

1. Update the `extension.csproj` to include `<TypeScriptGeneratesDeclarations>true</TypeScriptGeneratesDeclarations>`. Then, build the `extension.csproj` to ensure that the extension project will produce  `d.ts` files.

1. On the `Extension.UnitTest` project, right-click on `npm > Install Missing npm Packages`.  If the option is not available, use `Tools > NuGet Package Manager > Package Manager Console` to present the Package Manager Console. If the console indicates that any NuGet packages are missing, go ahead and install them.

1. Build the solution by using `Ctrl + Shift + B` on the `Extension.UnitTests.csproj` project.

1. Run `npm run test` or `npm run test-ci` from the command line, or open `index.html` in a browser if you have already performed a build.

## Corext Environments

Build environments which are constructed using Corext will need to manually specify where to locate the Unit Test Framework **NuGet** package. This **NuGet** package will be expanded at `CxCache`, which is not the default location.  Consequently, you need to update the `CoreXT` config and then run  `npm packages.json` in order to point to the correct location.

If you are executing the default instructions on your CoreXT environment, it may display the following error.

`npm ERR! enoent ENOENT: no such file or directory, stat 'C:\...\ExtensionName\packages\Microsoft.Portal.TestFramework.UnitTest.5.0.302.979\msportalfx-ut-5.302.979.tgz'`

This error indicates that the dev environment cannot find the expanded NuGet package for the Unit Test Framework. To make the dev environment aware of the package, perform the following steps.

1. Update the repository's `corext.config` file that is located in the `\<ExtensionRepoName>\.corext` folder by adding the following to the end of the `<generator>` section.

    ```xml
    <!-- Unit Test Framework -->
    <package id="Microsoft.Portal.TestFramework.UnitTest" />
    ```

1. Update the `package.config` file that is located in the `\<ExtensionRepoName>\src\<ExtensionName>\` folder by adding the following to the `<packages>` section.

    ```xml
    <package id="Microsoft.Portal.TestFramework.UnitTest" version="5.0.302.1016" targetFramework="net45" />
    ```

    where
    
    **version**:  matches the version of the Portal SDK you are using for your extension and also matches the version of the `"Microsoft.Portal.Framework"` package in your `packages.config`.*.

1. Update the Unit Test `package.json` file that is located in the `<ExtensionRepoName>\src\<ExtensionName>.UnitTests\` folder by removing the `msportalfx-ut` package from the dependencies if it is listed.
    
    Update the script's `init` command to the following:

    `"init": "npm install --no-optional && npm install %PkgMicrosoft_Portal_TestFramework_UnitTest%\\msportalfx-ut-5.302.1016.tgz --no-save",`

    **Note:** *The version listed above should match the version of the Portal SDK you are using for your extension and will match the `"Microsoft.Portal.Framework"` package in your `packages.config`.*

1. Run the following commands to finish the setup.

    * Run Corext Init - From the root of your repository run: `init`
    * Run the Npm install - From your Unit Test directory run: `npm run init`

## Creating a project from scratch

If you are building a new extension from scratch, it is simpler and faster to start with the project template specified in [Project templates with Visual Studio](#project-templates-with-visual-studio) instead of creating a project from scratch.  If you are adding a Unit Test project to an existing extension, you can create a new project from the previous step, and then follow this guide to customize the project to point to your existing extension. By default, the project will be configured to produce JUNIT and TRX output. It produces code coverage by using **karma-coverage**.

This tutorial provides step-by-step instructions for creating a UnitTest project for your Azure Portal Extension.

The resulting folder structure will look like the following.

```
+-- Extension
+-- Extension.UnitTests
|   +-- test/ResourceOverviewBlade.test.ts
|   +-- test-main.js
// |   +-- init.js
|   +-- karma.conf.js
|   +-- msportalfx-ut.config.json
|   +-- package.json
|   +-- tsconfig.json
    +-- .npmrc
```

The build and code generation will add the following folders.
```
|   +-- _generated
|     +-- Ext
|     +-- Fx
|   +-- Output
```

**NOTE**: This document uses relative path syntax to indicate where you should add each file.  For example, `./index.html` indicates adding a file named `index.html` at the root of the test project folder, where the name of the test project is  `Extension.UnitTests`, therefore the relative path is  `Extension.UnitTests/index.html`.

**NOTE**:  All code snippets provided are for `Microsoft.Portal.Tools.V2.targets`. If you are using  `Microsoft.Portal.Tools.targets`, instead see the "Frequently Asked Questions" document that is located at [portalfx-extensions-faq-unit-test.md](portalfx-extensions-faq-unit-test.md).
[Build-time-configuration](#build-time-configuration)
[Runtime-configuration](#runtime-configuration)

### Build time configuration

The following steps will configure the VS project at dev or build time.

1. Add the `./.npmrc` registry file to your project so that it will store feed URLs and credentials, as described in [https://docs.microsoft.com/en-us/vsts/package/npm/npmrc?view=vsts](https://docs.microsoft.com/en-us/vsts/package/npm/npmrc?view=vsts).

1. The `msportalfx-ut` unit test package is available from the internal `AzurePortalNpmRegistry`. You may select any test and test assertion frameworks, because `msportalfx-ut` is test-framework agnostic. Add the following code to the `./.npmrc` file to configure your project to use this registry.

    ```
    registry=https://msazure.pkgs.visualstudio.com/_packaging/AzurePortalNpmRegistry/npm/registry/
    always-auth=true
    ```

1.  Add `msportalfx-ut.*.tgz` from the `Microsoft.Portal.TestFramework.UnitTest` NuGet package.  You can add a reference to it in the `./<extensionName>/packages.config` file, in addition to adding a `file://` reference to the path where it will be located.

    **NOTE**: If you are building using CoreXT there are a number of tips at the end of this document under the `Corext Environments` section.

1. Add the  `./package.json` file to the project. The following example file uses **mocha** and **chai**, but you can choose your own test and assertion framework.

   ```cs

  {"gitdown": "include-file", "file": "../samples/VS/PackageTemplates/Default/Extension.UnitTests/package.json"} 
 
   ```

and this one

    ```json
    {
      "name": "extension-ut",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "init": "npm install --no-optional",
        "prereq": "npm run init && gulp --gulpfile=./node_modules/msportalfx-ut/gulpfile.js --cwd ./",
        "build": "npm run prereq && tsc -p tsconfig.json",
        "build-trace": "tsc -p tsconfig.json --diagnostics --listFiles --listEmittedFiles --traceResolution",
        "test": "npm run build && karma start",
        "test-ci": "npm run build && karma start --single-run --no-colors",
        "test-dev": "npm run build && index.html"
      },
      "keywords": [
        "unittest"
        ],
      "author": "Microsoft",
      "license": "MIT",
      "dependencies": {
        "@types/chai": "4.1.2",
        "@types/mocha": "2.2.48",
        "@types/nconf": "0.0.37",
        "@types/sinon": "4.3.0",
        "chai": "4.1.2",
        "gulp": "3.9.1",
        "gulp-concat": "2.6.1",
        "karma": "2.0.0",
        "karma-chai": "0.1.0",
        "karma-chrome-launcher": "2.2.0",
        "karma-coverage": "1.1.1",
        "karma-edge-launcher": "0.4.2",
        "karma-mocha": "1.3.0",
        "karma-mocha-reporter": "2.2.5",
        "karma-junit-reporter": "1.2.0",
        "karma-requirejs": "1.1.0",
        "karma-trx-reporter": "0.2.9",
        "mocha": "5.0.4",
        "msportalfx-ut": "file:../../packages/Microsoft.Portal.TestFramework.UnitTest.5.0.302.1057/msportalfx-ut-5.302.1057.tgz",
        "nconf": "0.10.0",
        "requirejs": "2.3.5",
        "sinon": "4.4.3",
        "typescript": "2.3.3"
      },
      "devDependencies": {
      }
    }
    ```
      
  1. Update the `./package.json` file to refer directly to `msportalfx-ut`.  For example, specify `"msportalfx-ut" : "5.0.302.VersionOfSdkYouAreUsing"` instead of the `file://` syntax.
     
  1. Run the following command: `npm install --no-optional`.
          
      **NOTE**: If you receive auth errors against the internal NPM feed see the "Connect to feed" instructions that are located at  [https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=feed](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=feed).

  1. The `msportalfx-ut.config.json` file defines paths to the files that are used by the `msportalfx-ut` module to generate everything in the `./_generated/*` folder.  This includes [#test-results-and-code-coverage](#test-results-and-code-coverage).  The keys that this config file uses are the following parameters.
  
      * `UTNodeModuleRootPath`: the root path to where the `msportalfx-ut` node module was installed. The value should be "./node_modules/msportalfx-ut".

      *  `GeneratedAssetRootPath`: the root path that will contain all of the generated assets, for example, `FxScriptDependencies.js` or the resx-to-AMD module that allows the use of resource strings would be located here. The value should be "./_generated".
    
      <!-- TODO: Determine whether this should be "glob" or "blob" -->
      <!-- TODO:  Determine whether this should be "in work" or "under test". -->

      * `ExtensionTypingsFiles`: blob for `d.ts` files of the extension. These are copied to the `GeneratedAssetRootPath` so that the `d.ts` files are not side-by-side with the extension's `.ts` files. This ensures that typescript module resolution does not include the source `.ts` file during the build of your extension, which ensures that your UT project does not compile extension `*.ts` files that are still in work. under test. The value should be "../Extension/**/*.d.ts".

      * `ResourcesResxRootDirectory`: The extension client root directory that contains all *.resx files. These will be used to generate javaScript  AMD string resource modules that will be located in the  `GeneratedAssetRootPath`, in addition to the associated `require.config`. The value should be "../Extension/Client". 

  1. Add `./msportalfx-ut.config.json` with the following value:

      ```json
     {
          "UTNodeModuleRootPath" : "./node_modules/msportalfx-ut",
          "GeneratedAssetRootPath" : "./_generated",
          "ExtensionTypingsFiles": "../Extension/**/*.d.ts",
          "ResourcesResxRootDirectory": "../Extension/Client"
      }

      ```

1. If using `Microsoft.Portal.Tools.*V2*.targets` in your `Extension.csproj` file, you need to  update the `ExtensionTypingsFiles` parameter as follows:

    `"ExtensionTypingsFiles": "../Extension/Output/typings/**/*.d.ts",`

    Add the `./msportalfx-ut.config.json` file by using the following code.
    ```
   {"gitdown": "include-file", "file": "../samples/VS/PT/Default/Extension.UnitTests/msportalfx-ut.config.json"}
   ```

1. Customize the file paths to the paths that are used by your project.  The `msportalfx-ut` gulpfile module searches for paths in the following order.

    1. command line argument
    
    1. environmental variable

    1. `./msportalfx-ut.config.json` file.  

1. If there are differences between the paths for your official build environment and the paths for your dev environment, you can override them by using command line arguments or by using environmental variables. An example of overriding an item for an official build with a command line argument is as follows.

    `gulp --UTNodeModuleResolutionPath ./some/other/location`

1. Add a test to the `./test/ResourceOverviewBlade.test.ts` file.  You can modify the following example for your own extension.
   
 {"gitdown": "include-file", "file": "../samples/VS/PT/Default/Extension.UnitTests/test/ResourceOverviewBlade.test.ts"}
    
1. To compile your test, and for dev time Intellisense, the project should have a `./tsconfig.json` file, as in the following example.

 {"gitdown": "include-file", "file": "../samples/VS/PT/Default/Extension.UnitTests/tsconfig.json"}
    
and another one.

```json

{
  "compilerOptions": {
    "experimentalDecorators": true,
    "module": "amd",
    "sourceMap": false,
    "baseUrl": ".",
    "rootDir": ".",
    "target": "es5",
    "paths": {
      "msportalfx-ut/*": ["./node_modules/msportalfx-ut/lib/*"],
      "*": [
        "./_generated/Ext/typings/Client/*",
        "./node_modules/@types/*/index"
      ]
    }
  },
  "include": [
    "./_generated/Ext/typings/Definitions/*",
    "test/**/*"
  ]
}

```


1. Update the paths in the `tsconfig.json` file to your specific extension paths. Then, build your extension and run the following command to build your tests.

  ```
  npm run build
  ```

### Runtime configuration

Now that your tests are building, add the following to run your tests.

1. Configure Require and Mocha and `test-main.js` file.

    The `require.js`  and `mocha` scripts need be made aware of the locations of the modules for your extension, in addition to any frameworks that you are using, as in the following example.
 
  {"gitdown": "include-file", "file": "../samples/VS/PT/Default/Extension.UnitTests/karma.conf.js"}


     Add a `./test-main.js` file, like the one in the following example, as the main entrypoint for your app. Remember to update the file to point to the paths that should be specified for your extension, as in the following example.

    ```typescript

      window.fx.environment.armEndpoint = "https://management.azure.com";
      window.fx.environment.armApiVersion = "2014-04-01";

      const allTestFiles = []
      if(window.__karma__) {
        const TEST_REGEXP = /^\/base\/Extension.UnitTests\/Output\/.*(spec|test)\.js$/i;
        // Get a list of all the test files to include
        Object.keys(window.__karma__.files).forEach(function (file) {
          if (TEST_REGEXP.test(file)) {
            // Normalize paths to RequireJS module names.
            // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
            // then do not normalize the paths
            const normalizedTestModule = file.replace(/^\/base\/Extension.UnitTests\/|\.js$/g, "")
            allTestFiles.push(normalizedTestModule)
          }
        });
      } else {
        // if using index.html rather than the perferred above karmajs as the test host then add files here.
        allTestFiles.push("./Output/test/ResourceOverviewBlade.test");
      }

      mocha.setup({
        ui: "bdd",
        timeout: 60000,
        ignoreLeaks: false,
        globals: [] });

      rjs = require.config({
        // Karma serves files under /base, which is the basePath from your config file
        baseUrl: window.__karma__ ? "/base/Extension.UnitTests" : "",
        paths: {
          "_generated": "../Extension/Client/_generated",
          "Resource": "../Extension/Client/Resource",
          "Shared": "../Extension/Client/Shared",
          "sinon": "node_modules/sinon/pkg/sinon",
          "chai": "node_modules/chai/chai",
      },
        // dynamically load all test files
        deps: allTestFiles,

        // kickoff karma or mocha
        callback: window.__karma__ ? window.__karma__.start : function () { return mocha.run(); }
      });

    ```

1. Configure your test runner
  
   Add a file named `./karma.conf.js` to run your tests. This test runner provides a rich plugin ecosystem for watch "Compile on Save" based dev/test cycles, test reporting, and code coverage, among other testing factors. Remember to specify the paths for your extension.

  JavaScript
  ```javascript
  {"gitdown": "include-file", "file": "../samples/VS/PT/Default/Extension.UnitTests/karma.conf.js"}
  ```

  Karma

  ```
  // Karma configuration
  // Generated on Fri Feb 16 2018 15:06:08 GMT-0800 (Pacific Standard Time)

  module.exports = function (config) {
    config.set({

      // base path that will be used to resolve all patterns (eg. files, exclude)
      basePath: "../",

      // frameworks to use
      // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
      frameworks: ["mocha"],

      plugins: [
        require("karma-mocha"),
        require("karma-mocha-reporter"),
        require("karma-edge-launcher"),
        require("karma-coverage"), // Include if you want coverage
        require("karma-chrome-launcher"),
        require("karma-junit-reporter"),  // Include if you want junit reporting
        require("karma-trx-reporter")   // Include if you want trx reporting
      ],
      // list of files / patterns to load in the browser
      files: [
        // chai assertion framework.
        { pattern: "Extension.UnitTests/node_modules/chai/**/*.js", included: false },
        // sinonjs used for mocking xhr.
        { pattern: "Extension.UnitTests/node_modules/sinon/**/*.js", included: false },
        // aggregate script of portal bundles required for test.
        "Extension.UnitTests/node_modules/msportalfx-ut/lib/FxScripts.js",
        // karma requirejs adapter required to successfully load requirejs in karma.
        "Extension.UnitTests/node_modules/karma-requirejs/lib/adapter.js",
        // generated require configs for extension resx files.
        { pattern: "Extension.UnitTests/_generated/Ext/**/*RequireConfig.js", included: true },
        // msportalfx-ut test harness and other test scripts you may load within a unit test.
        { pattern: "Extension.UnitTests/node_modules/msportalfx-ut/lib/*.js", included: false },
        // portal framework scripts.
        { pattern: "Extension.UnitTests/node_modules/msportalfx-ut/lib/fx/Content/Scripts/**/*.js", included: false },
        // reserved directory for generated content for framework.
        { pattern: "Extension.UnitTests/_generated/Fx/**/*.js", included: false },
        // generated content for extension.
        { pattern: "Extension.UnitTests/_generated/Ext/**/*.js", included: false },
        // make available compiled tests from tsconfig.json outDir
        { pattern: "Extension.UnitTests/Output/**/*.test.js", included: false },
        // make available all client extension code that unit tests will use.
        { pattern: "Extension/Client/**/*.js", included: false },
        // the entrypoint for running unit tests.
        "Extension.UnitTests/test-main.js",
      ],

      client: {
        mocha: {
          reporter: "html",
          ui: "bdd"
        }
      },

      // list of files / patterns to exclude
      exclude: [
      ],

      // preprocess matching files before serving them to the browser
      // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
        "./Extension/Client/**/*.js": "coverage"
      },

      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: ["mocha", "trx", "junit", "coverage"],

      // the default trx configuration
      trxReporter: { outputFile: "./TestResults/test-results.trx", shortTestName: false },

      junitReporter: {
        outputDir: "./Extension.UnitTests/TestResults", // results will be saved as $outputDir/$browserName.xml
        outputFile: "test-results.xml", // if included, results will be saved as $outputDir/$browserName/$outputFile
        suite: "Extension.UnitTests", // suite will become the package name attribute in xml testsuite element
        useBrowserName: true, // add browser name to report and classes names
        nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
        classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
        properties: {} // key value pair of properties to add to the <properties> section of the report
      },

      coverageReporter: {
        type: "html",
        dir: "./Extension.UnitTests/TestResults/coverage/"
      },

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
      browsers: ["Chrome_No_Sandbox", "Edge"],

      customLaunchers: {
        Chrome_No_Sandbox: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
      },
      // Continuous Integration mode
      // if true, Karma captures browsers, runs the tests and exits
      singleRun: false,

      // Concurrency level
      // how many browser should be started simultaneous
      concurrency: Infinity,
    })
  }
  ```

1. Run your tests

  You can run your tests with `npm run test`.  This command is specified in `packages.json` and will start **karmajs** in watch mode in your configured target browser(s) .  This is good practice when used in conjunction with "Compile on Save", which allows for efficient iterative development.  Whenever the extension is modified, saving the code results in compilation and  automatic test execution.  Typically, any change to your extension and test project `.src` files will be automatically compiled because of  the `tsconfig.json` setup. Then, the tests run automatically because of  `karma.conf.js`. The net result is real time feedback on what tests were broken as a result of modifying the extension code.

  * Using **karmajs** for a single test run 

    This is useful for scenarios like running in CI. `npm run test-ci` launches **karmajs** in your configured target browsers for a single run.

  * Using a browser as a host

    This has been deprecated. Developers can use the command `npm run test-dev` to open `index.html` in your regular browser.

  **NOTE**: `karma.conf.js` is configured to run your tests in both **Edge** and **Chrome**. You may also pick and choose additional browsers by using the launcher plugins located at [https://karma-runner.github.io/2.0/config/browsers.html](https://karma-runner.github.io/2.0/config/browsers.html).

### Test results and code coverage

The console output contains the results from  **karmajs** tests. These results were  generated by using the `npm run test` or `npm run test-ci` commands. In addition to the console output, reporters were added to `karma.conf.js` to provide output in formats that are compatible with CI scenarios.

* Test Output for CI

  This can be used for most CI environments. The content is located in the `./TestResults/**/*.xml|trx` folders.  You can  configure the output paths by updating `karma.conf.js`. For more plugins  that format test output from your CI environment, see [https://karma-runner.github.io/2.0/index.html](https://karma-runner.github.io/2.0/index.html).

* Code Coverage

  The content is located in the `./TestResults/Coverage/**/index.html` file. The following is a sample .html file.

 <!-- TODO:  Determine whether there are more than one index.html file. 
 
1. Add `./index.html` for running tests.
-->

```html

<html>
<head>
  <meta charset="utf-8">
  <title>Mocha Tests</title>
  <link href="./node_modules/mocha/mocha.css" rel="stylesheet" />
</head>
<body>
  <div id="mocha"></div>
  <!-- mocha prereq -->
  <script type="text/javascript" charset="utf-8" src="./node_modules/mocha/mocha.js"></script>
  <script type="text/javascript" charset="utf-8" src="./node_modules/chai/chai.js"></script>
  <!-- fx prereq -->
  <script src="./node_modules/msportalfx-ut/lib/FxScripts.js"></script>
  <!-- extension scripts -->
  <script src="./_generated/Ext/ExtensionStringResourcesRequireConfig.js"></script>
  <script src="./test-main.js"></script>
</body>
</html>

```

The following scripts are imported into the `./index.html` file.

1. **mocha.js**: Test framework is used in the shipped sample. 

1. **chai.js**: Test assertion framework. 

1. **./node_modules/msportalfx-ut/lib/FxScripts.js**: Aggregate script that contains all portal scripts required  for your test context. It includes: default setup of `window.fx.*`, all portal bundles required to successfully load your blades, and all `requirejs` configuration that is required to load your blades.

1. **./_generated/Ext/ExtensionStringResourcesRequireConfig.js**: `requirejs` mapping for AMD modules that are generated from the extension's `.resx` files. To generate `./_generated/Ext/ExtensionStringResourcesRequireConfig.js` and to copy typings local to the test context, `msportalfx-ut` provides a gulpfile that automates the generation of content under `./_generated/Ext/`. It can be executed as part of the `prereq` script below. Before running the `prereq` script you must provide the  configuration specified in [#build-time-configuration](#build-time-configuration) so that the gulp task can correctly locate resources when it runs  `msportalfx-ut.config.json`.

1. **./test-main.js**: Entrypoint to setup the test runner and the `require` config.

<!-- TODO: Determine how many index.html files there are. -->

### Generating the FxScriptDependencies.js file

The last script imported into the `./index.html` file  is `./_generated/Fx/FxScriptDependencies.js`. This generated script:

* Correctly references Framework scripts in the required order

* Sets up the  `require` config for Framework AMD modules

* Generates string resources AMD modules from the extension's `resx` files

* Sets up `require` config for string resource AMD modules from `resx` files

To generate this script and all other dependencies required to successfully run tests, `msportalfx-ut` provides a default `gulpfile` that automates the generation of the `FxScriptDependencies.js` file and its dependencies.
  To run the script, config items must be specified in `msportalfx-ut.config.json`, as in the following script.

```json
{
  "name": "extension-ut",
  "version": "1.0.0",
  "description": "",
  "main": "index.html",
  "scripts": {
    "init": "npm install --no-optional",
    "prereq": "gulp --gulpfile=./node_modules/msportalfx-ut/gulpfile.js --cwd ./",
    "build": "npm run prereq && tsc -p tsconfig.json",
    "build-trace": "tsc -p tsconfig.json --diagnostics --listFiles --listEmittedFiles --traceResolution",
    "test": "npm run build && index.html"
  },
  "keywords": [
   "unittest"
  ],
  "author": "Microsoft",
  "license": "MIT",
  "dependencies": {
    "@types/chai": "4.0.4",
    "@types/mocha": "2.2.44",
    "@types/nconf": "0.0.35",
    "@types/sinon": "2.1.3",
    "chai": "4.1.2",
    "gulp": "3.9.1",
    "nconf": "0.10.0",
    "mocha": "2.2.5",
    "msportalfx-ut": "file:../../packages/Microsoft.Portal.TestFramework.UnitTest.5.0.302.979/msportalfx-ut-5.302.979.tgz",
    "sinon": "4.2.1",
    "typescript": "2.3.3"
  }
}

```

Save the previous script  to `./package.json` and then run the following command:

```
npm install --no-optional
```

{"gitdown": "include-file", "file": "portalfx-extensions-faq-unit-test.md"}