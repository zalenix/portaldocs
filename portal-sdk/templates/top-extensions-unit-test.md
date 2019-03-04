# Unit Test Framework
Covered in this document:

- File > New Project scaffolding
- Creating a project from scratch
- CI: test results output to CI accepted formats JUNIT, TRX, other.
- Code Coverage: where to find your code coverage output

## Getting Started with the Visual Studio Project Template

1. Install [Node LTS](https://nodejs.org/en/download/)
1. To support the Unit Test project in Visual Studio you must first install the `Node Tools for Visual Studio` [from here](https://github.com/Microsoft/nodejstools/releases/tag/v1.3.1) then
1. Launch Visual Studio and click `File > New > Project > Visual C# > Azure Portal`. It will scaffold a Solution with two projects Extension.csproj and Extension.UnitTest.csproj.  
    
    Note: If you do not see the `Azure Portal` project template ensure you have already installed the [Portal SDK](https://aka.ms/portalfx/download) and are using VS2015 (at the time of writing the vsix only targets VS2015).

1. Build the solution `Ctl + Shift + B`
1. run `npm run test` or `npm run test-ci` from the command line

## Creating a project from scratch with Visual Studio Code

Before getting started with this step by step:
- if building a new extension from scratch its simpler/faster to start with the above project template rather then following the step by step.
- if adding a UT project to an existing extension you can still just scaffold the content from above then follow this guide for customizing the config to point to your existing extension.

This tutorial will provide you step by step instructions for creating a UnitTest project for your Azure Portal Extension.  The resulting folder structure will look like the following:

```

+-- Extension
+-- Extension.UnitTests
|   +-- test/CreateBlade.test.ts
|   +-- test/ResourceOverviewBlade.test.ts
|   +-- test-main.js
|   +-- karma.conf.js
|   +-- msportalfx-ut.config.json
|   +-- package.json
|   +-- tsconfig.json
    +-- .npmrc

// The build and code generation will add the following
|   +-- _generated
|     +-- Ext
|     +-- Fx
|   +-- Output

```

Note:
* This document uses relative paths to indicate where you should add each file relative to the root of your test folder e.g ./package.json indicates adding an package.json at the root of your test project folder Extension.UnitTests/package.json
* All code snippets provided are for `Microsoft.Portal.Tools.V2.targets` if you are using it's predecessor `Microsoft.Portal.Tools.targets` see the [FAQ](#FAQ) at the bottom of this document.

### Dev/Build time configuration

#### Add ./.npmrc

msportalfx-ut is available from the internal AzurePortalNpmRegistry.  To configure your project to use this registry add the following:

Add a ./.npmrc file 

```

registry=https://msazure.pkgs.visualstudio.com/_packaging/AzurePortalNpmRegistry/npm/registry/
always-auth=true

```

#### Add ./package.json

* Add the ./package.json

```json

{"gitdown": "include-file", "file": "../samples/VS/PackageTemplates/Default/Extension.UnitTests/package.json"}

```

    In the package.json you can see we're using mocha and chai but you can choose your own test and assertion framework.

1. Update ./package.json to refer directly to msportalfx-ut i.e rather then using the file:// syntax simply specify `"msportalfx-ut" : "5.302.VersionOfSdkYouAreUsing"` (notice difference in versioning, no 0 as minor version)

1. run the following command.

    ```

    npm install --no-optional

    ```

Note:
* If you receive auth errors against the internal NPM feed see the "Connect to feed" instructions [here](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=feed)

#### add ./msportalfx-ut.config.json

msportalfx-ut.config.json defines paths to those files needed by the msportalfx-ut node module to generate everything under `./_generated/*`.  

add ./msportalfx-ut.config.json with the following:

```json

{"gitdown": "include-file", "file": "../samples/VS/PT/Default/Extension.UnitTests/msportalfx-ut.config.json"}

```
Customize the paths to those of your extension. The definition of each key in the config is as follows:

- `UTNodeModuleRootPath`: the root path to where the msportalfx-ut node module was installed.
- `GeneratedAssetRootPath`: the root path to save all assets that will be generated e.g your resx to js AMD module so you can use resource strings directly in your test.
- `ResourcesResxRootDirectory`: extension client root directory that contains all *.resx files. These will be used to generate js AMD string resource modules into `GeneratedAssetRootPath` and the associated require config.

Note:
* if your official build environment uses different paths then your dev environment you can override them either by using command line arguments or environmental variables.  The msportalfx-ut gulpfile will search in the following order command line argument > environmental variable > ./msportalfx-ut.config.json file.  An example of overriding an item for an official build via a command line argument `gulp --UTNodeModuleResolutionPath ./some/other/location`

#### Add a test

Add a CreateBlade test to ./test/CreateBlade.test.ts.  This demonstrates how to provide the provisioning context to your CreateBlade that portal would normally provide via your gallery package. You can modify this example for your own extension.

```typescript
    
{"gitdown": "include-file", "file": "../samples/VS/PT/Default/Extension.UnitTests/test/CreateBlade.test.ts"}

```

Add a TemplateBlade test to ./test/ResourceOverviewBlade.test.ts.  You can modify this example for your own extension.

```typescript
    
{"gitdown": "include-file", "file": "../samples/VS/PT/Default/Extension.UnitTests/test/ResourceOverviewBlade.test.ts"}

```

#### Compile your test project

1. To compile your test and for dev time intellisense you will need a ./tsconfig.json

    ```json

    {"gitdown": "include-file", "file": "../samples/VS/PT/Default/Extension.UnitTests/tsconfig.json"}

    ```

    Update the paths in the tsconfig.json to for your specific extension paths.

1. Build your extension
1. run the following command to build your tests

    ```

    npm run build

    ```

### Runtime configuration

Now that your tests are building, add the following to run your tests.

#### Configure Require and Mocha using add test-main.js

requirejs and mocha need to know where all your modules are located for your extension and any frameworks that you are using. 

add a ./test-main.js file as the main entrypoint for your app

```javascript

{"gitdown": "include-file", "file": "../samples/VS/PT/Default/Extension.UnitTests/test-main.js"}

```

Update for your specific extension paths.

#### Configure your test runner

In this example we will using karmajs as a test runner.  It provides a rich plugin ecosystem for watch based compile on save based dev/test cycles, test reporting and code coverage to name a few.

add a file named ./karma.conf.js

```javascript
  
  {"gitdown": "include-file", "file": "../samples/VS/PT/Default/Extension.UnitTests/karma.conf.js"}

```

Update for your specific extension paths.

#### Run your tests

You can run your tests with `npm run test`.  This command is specified in packages.json and will start karmajs in your configured target browser(s) in watch mode.  This is particularly useful when used in conjunction with compile on save allowing for an efficient inner dev loop i.e dev > compile > automatic test execution, in short any change to your extension src and test project src will be automatically compiled (due to tsconfig.json setup) and then tests will automatically (due to karma.conf.js). The net result is real time feedback on what tests you've broken as you modifying extension code.

Using karmajs for a single test run useful for scenarios such as running in CI 

`npm run test-ci` launches karmajs in your configured target browsers for a single run.

Note that the karma.conf.js is configured to run your tests in both in Edge and Chrome. You may also pick and choose additional browsers via the launcher plugins [documented here](https://karma-runner.github.io/2.0/config/browsers.html).

### Test Results

In dev scenarios the test results from running your tests via karmajs are available in the console output. In addition to the console output reporters have been added to `karma.conf.js` to provide formats that are useful to CI scenarios.

#### Test Output for CI

By Default the project template/steps above will generate a project configured to produce JUNIT and TRX output. This should be useful for most CI environments. The content will be output under ./TestResults/**/*.xml|trx.  To configure the output paths update karma.conf.js. For more plugins for outputing in a format your CI environment supports see [karmajs official docs](https://karma-runner.github.io/2.0/index.html).

Note: 
* TRX and JUNIT output are generated when running `npm run test` or `npm run test-ci` via karmajs and its karma.conf.js.
* drop the TRX or JUNIT reporter that is not needed for your CI environment.

![alt-text](../media/top-extensions-getting-started/trxoutput.png "trx output")

#### Code Coverage

By Default the project template/steps above will generate a project configured that also produces code coverage using karma-coverage. The content will be output under ./TestResults/Coverage/**/index.html

![alt-text](../media/top-extensions-getting-started/coverage1.png "code coverage summary")

Note: 
* coverage results are generated when running  `npm run test` or `npm run test-ci` via karmajs its karma.conf.js.

Clicking through from the summary view to the ResourceOverviewBlade you can see code coverage line by line

![alt-text](../media/top-extensions-getting-started/coverage2.png "code coverage detail")


# FAQ

## When I do File `File > New > Project > Visual C# > Azure Portal` I get the following error

```

Severity    Code    Description Project File    Line    Suppression State
Error       Could not install package 'PortalFx.NodeJS8 10.0.0.125'. You are trying to install this package into a project that targets '.NETFramework,Version=v4.6.1', but the package does not contain any assembly references or content files that are compatible with that framework. For more information, contact the package author

```

Solution: Install the `Node Tools for Visual Studio` [from here](https://github.com/Microsoft/nodejstools/releases/tag/v1.3.1)

## Corext Environments

Build environments which are setup using Corext will need to manually add additional lines in order to specify where to pick up the Unit Test Framework NuGet package.
This NuGet package will be expanded at a different location (CxCache) than the default, so you need to update your Corext config and the npm packages.json in order to
point to the correct location.

### Common Error

If you are a executing the default instructions on your Corext environment, this is the error you will see:

`npm ERR! enoent ENOENT: no such file or directory, stat 'C:\...\ExtensionName\packages\Microsoft.Portal.TestFramework.UnitTest.5.0.302.979\msportalfx-ut-5.302.979.tgz'`

This error indicates that it cannot find the expanded NuGet package for the Unit Test Framework. 

### Fix

1. **Update your Repository's `corext.config`**

    Found under `\<ExtensionRepoName>\.corext\corext.config`

    Under the `<generator>` section add the following to the bottom:

    ```xml
    <!-- Unit Test Framework -->
    <package id="Microsoft.Portal.TestFramework.UnitTest" />
    ```

2. **Update your Extension's `package.config`**

    Found under `\<ExtensionRepoName>\src\<ExtensionName>\packages.config`

    Add the folowing to your `<packages>`:

    ```xml
    <package id="Microsoft.Portal.TestFramework.UnitTest" version="5.0.302.1016" targetFramework="net45" />
    ```

    **Note:** *The version listed above should match the version of the Portal SDK you are using for your extension and will match the `"Microsoft.Portal.Framework"` package in your `packages.config`.*

3. **Update your Unit Test `package.json`**

    Found under `<ExtensionRepoName>\src\<ExtensionName>.UnitTests\package.json`

    If you have the package `msportalfx-ut` in your dependencies, remove it.

    Update your scripts init command to be the following:

    `"init": "npm install --no-optional && npm install %PkgMicrosoft_Portal_TestFramework_UnitTest%\\msportalfx-ut-5.302.1016.tgz --no-save",`

    **Note:** *The version listed above should match the version of the Portal SDK you are using for your extension and will match the `"Microsoft.Portal.Framework"` package in your `packages.config`.*

4. **Run the following commands to finish the setup**

    * Run Corext Init - From the root of your repository run: `init`
    * Run the Npm install - From your Unit Test directory run: `npm run init`

## How do I override the default stubs the unit test harness provides out of the box.

Use the Harness.init function and supply an options object of type InitializationOptions with your own stub(s) that will override the default stub provided by the unit test framework.

example usage:

```typescript

import * as harness from "msportalfx-ut/Harness";

...

const options : harness.InitializationOptions = { 
    getUserInfo: sinon.stub().returns(Q({
            email: "ibizaems@microsoft.com",
            isOrgId: false,
            givenName: "givenName",
            surname: "surName",
            directoryId: "00000000-0000-0000-0000-000000000000",
            directoryName: "directoryName",
            uniqueDirectoryName: "uniqueDirectoryName",
            domainName: "domainName"
        })),
        ...
};

harness.init(options);

...

```

## I am still using Microsoft.Portal.Tools.targets rather than Microsoft.Portal.Tools.V2.targets. What do I need to change

Ideally you should move to v2 targets to benefit from the dev productivity it will bring to your dev/test inner loop. Migration only takes about an hour or so, see https://aka.ms/portalfx/cloudbuild for details.  If you can't migrate to v2 update the following:

1. Update your ../Extension/Extension.csproj 
add 

    xml
    ```
    <PropertyGroup>
        <TypeScriptGeneratesDeclarations>true</TypeScriptGeneratesDeclarations>
    </PropertyGroup>
    ```

1. ./package.json update the `script` named `prereq`  to be the following

    ```
    "prereq": "npm run init && gulp --gulpfile=./node_modules/msportalfx-ut/gulpfile.js --cwd ./"
    ``` 

1. ./msportalfx-ut.config.js

    ```
        "ExtensionTypingsFiles": "../Extension/**/*.d.ts",
        "ResourcesResxRootDirectory": "../Extension/Client"
    ```    

1. ./tsconfig.json

    ```

    {
        "compileOnSave": true,
        "compilerOptions": {

    ...
            "paths": {
                "msportalfx-ut/*": [
                    "./node_modules/msportalfx-ut/lib/*"
                ],
                "*": [
                    "./_generated/Ext/typings/Client/*",
                    "./node_modules/@types/*/index"
                ]
            }
    ...

        },
    ...
        "include": [
            "./_generated/Ext/typings/Definitions/*",
            "test/**/*"
        ]
    }

    ```

1. ./karma.conf.js


    ```
    ... 

    files: [
        ...,

        { pattern: "Extension/Output/Content/Scripts**/*.js", included: false },
        
        ...
    ],

    ...

    preprocessors: {
        "./Extension/Client/**/*.js": "coverage"
    }

    ```

1. ./test-main.js

    ```
    rjs = require.config({
    ...,
        "_generated": "../Extension/Client/_generated",
        "Resource": "../Extension/Client/Resource",
        "Shared": "../Extension/Client/Shared"
    ...
    ```

# I can't use the internal npm registry https://msazure.pkgs.visualstudio.com/_packaging/AzurePortalNpmRegistry/npm/registry/ because ...

## I can't authenticate

Try the following:
1. If you receive auth errors against the internal NPM feed see the "Connect to feed" instructions [here](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=feed)
1. If your not a member of any of the Groups on https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=settings&view=permissions please join `Azure Portal Partner Contributors – 19668` in https://myaccess .

## My build nodes are completely disconnected from the internet 

* you can commit your version of msportalfx-ut.zip into your repo and install it directly using relative file path syntax
`"msportalfx-ut": "file:../externals/msportalfx-ut-5.302.someversion.tgz",`
