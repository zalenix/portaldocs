## Frequently asked questions

<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

### Cannot create new VS project

***Cannot find the Node Tools for VS***

Description: When I try to create a new project in Visual Studio, I get an error: `Could not install package 'PortalFx.NodeJS8 10.0.0.125`.  The command line that was used was `File > New > Project > Visual C# > Azure Portal`.

 You are trying to install this package into a project that targets `.NETFramework,Version=v4.6.1`, but the package does not contain assembly references or content files that are compatible with that framework.

Solution: Install the `Node Tools for Visual Studio` that is located at [https://github.com/Microsoft/nodejstools/releases/tag/v1.3.1](https://github.com/Microsoft/nodejstools/releases/tag/v1.3.1).

<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

### Overriding default stubs

***How do I override the default stubs the unit test harness provides out of the box?***

Description:

Solution: Use the `Harness.init` function and supply an options object of type `InitializationOptions` with your own stub(s) that will override the default stub that is provided by the unit test framework.

The following is an example.

```cs
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



***

### Mocha test harness

***Simple html test harness for running mocha tests***

Description: Even though it is not that useful for gated CI, some teams prefer to have a simple `index.html` for debugging their tests in the browser rather than using the **karma** Debug view.

Solution: If you would like this alternative approach use the following.

{"gitdown": "include-file", "file": "../samples/VS/PT/Default/Extension.UnitTests/index.html"}

***

### Using Microsoft.Portal.Tools.targets

***I am still using Microsoft.Portal.Tools.targets rather than Microsoft.Portal.Tools.V2.targets***

Description: How do I upgrade from `Microsoft.Portal.Tools.targets` to `Microsoft.Portal.Tools.V2.targets`?

Solution: Ideally you should move to ***V2.targets*** to benefit from the dev productivity it will bring to your dev/test inner loop. Migration only takes about an hour. See  [https://aka.ms/portalfx/cloudbuild](https://aka.ms/portalfx/cloudbuild) for details. If you can't migrate to v2, update the following:

1. Update your `../Extension/Extension.csproj` file.

    ```
    xml
    <PropertyGroup>
        <TypeScriptGeneratesDeclarations>true</TypeScriptGeneratesDeclarations>
    </PropertyGroup>
    ```

1. The `./package.json` file.
Update the script named `prereq` to be the following:

    ```
    "prereq": "npm run init && gulp --gulpfile=./node_modules/msportalfx-ut/gulpfile.js --cwd ./"
    ```

1. The `./msportalfx-ut.config.js` file

    ```
        "ExtensionTypingsFiles": "../Extension/**/*.d.ts",
        "ResourcesResxRootDirectory": "../Extension/Client"
    ```

1. The `./tsconfig.json` file.

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

1. The `./karma.conf.js` file.

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

1. The `./test-main.js` file
    ```
    rjs = require.config({
    ...,
        "_generated": "../Extension/Client/_generated",
        "Resource": "../Extension/Client/Resource",
        "Shared": "../Extension/Client/Shared"
    ...
    ```
***

### Cannot use internal registry

***I can't use the internal npm registry***

Description: When I try to use the internal npm registry https://msazure.pkgs.visualstudio.com/_packaging/AzurePortalNpmRegistry/npm/registry/  the screen stays blank. It does not display a sad cloud or some other "not found" message.

Solution:

***

### Extension will not authenticate

***I can't authenticate***

Description:  When I     , the extension receives the following error message.

Solution: Try the following:

If you receive auth errors against the internal NPM feed see the "Connect to feed" instructions that are located at [https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=feed](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=feed). 

If you are not a member of any of the Groups on https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=settings&view=permissions reach out to <a href="mailto:nickha@microsoft.com?subject=Azure Portal Permissions &body=Hello, I am not a member of any of the groups that are listed in the AzurePortalNpmRegistry.">nickha@microsoft.com</a>.

***

### Build nodes are disconnected

***My build nodes are completely disconnected from the internet***

Description:
<!-- TODO: Where did they go and how can you tell they are disconnected?  -->

Solution: You can commit your version of `msportalfx-ut.zip` into your repo and install it directly using the following relative file path syntax in the `package.json` file.
<!-- TODO: Determine whether this is the right file for the line. -->

`"msportalfx-ut": "file:../externals/msportalfx-ut-5.0.302.someversion.tgz",`.

***

### Corext Environments

Build environments which are constructed using Corext will need to manually specify where to locate the Unit Test Framework **NuGet** package. This **NuGet** package will be expanded at `CxCache`, which is not the default location.  Consequently, you need to update the `CoreXT` config and then run  `npm packages.json` in order to point to the correct location.

If you are executing the default instructions on your CoreXT environment, it may display the following error.

`npm ERR! enoent ENOENT: no such file or directory, stat 'C:\...\ExtensionName\packages\Microsoft.Portal.TestFramework.UnitTest.5.0.302.979\msportalfx-ut-5.302.979.tgz'`

This error indicates that the dev environment cannot find the expanded NuGet package for the Unit Test Framework. To make the dev environment aware of the package, perform the following steps.

1. Update the repository's `corext.config` file that is located in the `\<ExtensionRepoName>\.corext` folder by adding the following to the end of the `<generator>` section.

    ```xml
    <!-- Unit Test Framework -->
    <package id="Microsoft.Portal.TestFramework.UnitTest" />
    ```

1. Update the `packages.config` file that is located in the `\<ExtensionRepoName>\src\<ExtensionName>\` folder by adding the following to the `<packages>` section.

    ```xml
    <package id="Microsoft.Portal.TestFramework.UnitTest" version="<version>" targetFramework="net45" />
    ```

    where
    
    **version**:  Matches the version of the Portal SDK you are using for your extension and also matches the version of the `"Microsoft.Portal.Framework"` package in your `packages.config.*` file. An example value of the version parameter is "5.0.302.1016". The version number also matches the `"Microsoft.Portal.Framework"` package in the `packages.config.*` file.

1. Update the Unit Test `package.json` file that is located in the `<ExtensionRepoName>\src\<ExtensionName>.UnitTests\` folder by removing the `msportalfx-ut` package from the dependencies if it is listed.
    
    Update the script's `init` command to the following:

    `"init": "npm install --no-optional && npm install %PkgMicrosoft_Portal_TestFramework_UnitTest%\\msportalfx-ut-5.302.1016.tgz --no-save",`

    **NOTE:** The version listed above matches the version of the Portal SDK you are using for your extension and also matches the `"Microsoft.Portal.Framework"` package in the  `packages.config` file.

1. Run the following commands to finish the setup.

    * Run Corext Init - From the root of your repository run: `init`
    * Run the Npm install - From your Unit Test directory run: `npm run init`
