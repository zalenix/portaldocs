<a name="overview"></a>
## Overview

There are many different ways to test an extension.  In the development environment, you can test from Visual Studio or from the command line.  In the Windows Azure Engineering System (WAES), you can use the procedures that are described in [http://aka.ms/WAES](http://aka.ms/WAES). If you run **mocha** with the `--debug-brk` flag, you can press F5 and the project will attach to a debugger. 
There are instructions that describe how to set up test run parallelization in **Jenkins**.

<a name="msportalfx-test"></a>
## MSPortalFx-test

**MsPortalFx-Test** is an end-to-end test framework that runs tests against the Microsoft Azure Portal. It tests extension interactions with user behavior, moreso than extension interactions with the Portal.  Its open source contribution model focuses on partner needs instead of internal Portal needs. It is distributed independently from the SDK to allow developers to develop tests in the same language as the extension.

The test framework interacts with the Portal as a user would, and helps developers make performant and robust extensions when they decrease breaking changes to partner team CI.

* [General Architecture](#general-architecture)

* [Installation](#installation)

* [Running tests in Visual Studio](#running-tests-in-visual-studio)

* [Write a browse blade test](#write-a-browse-blade-test)

    * [Configure, compile and run](#configure,-compile-and-run)

    * [Output](#output)

* [Create and test a resource](#create-and-test-a-resource)

* [More Examples](#more-examples)

* [Running a test in cloudtest](#running-a-test-in-cloudtest)

<a name="msportalfx-test-general-architecture"></a>
### General Architecture

**MsPortalFx-Test** is arranged into three layers of abstraction. The names of the layers may not be consistent in all instances, but the general idea is the same.  There may also be some future refactoring to easily differentiate between the layers.

1. Controls layer

    The controls layer contains the basic controls used in the Portal, like blades, checkboxes, textboxes, and others.  It is not used directly by tests in most cases, because it is mainly for composing the action layer and the  test layers. It is built on webdriver primitives and there is little or no retry logic.  

 1. Actions layer 

    The actions layer performs an action and verifies whether it was successful. It can retry the action if necessary. It is  used in writing tests like `portal.openBrowseBlade`. It is built upon the controls layer.

1. Test layer 

    The test layer contains wrappers that are used for testing common functionality. It is built upon the action and control layers, and is used in writing business-case tests or other forms of suite-test functionality, like `parts.canPinAllBladeParts`. It can re-run the test if necessary, and throws an exception if the test or verification fails.  

<a name="msportalfx-test-installation"></a>
### Installation

Your computer should have the most recent editions of operating systems and other software installed, as specified in [top-extensions-install-software.md](top-extensions-install-software.md). To stay current with the latest changes, we recommend updating whenever a new version of **MsportalFx-Test** is released. 

In addition, you should perform the following verifications to ensure that your development environment is ready for the msportalfx-test suite.

* node version is v4.5 or v5.1 using `node -v`

* npm version is 3.10.6 or greater using `npm -v`. 
    
    To update npm version use `npm install npm -g`.  The `npm install` command will automatically pull the latest version of `msportalfx-test`. 

* tsc version is 1.8.10 or greater, but less than Typescript 2+, by using `tsc -v`.

Then, open a command prompt and create a directory for your test files, by using the following command:  `md e2etests`. Switch to the new directory and install the **MsPortalFx-Test** module by using `npm`, as in the following command.

```
	cd e2etests
	npm install msportalfx-test --no-optional
```

The **MsPortalFx-Test** module includes useful TypeScript definitions and dependencies. You can make them available to your tests by using the **Typescript Definition Manager** located at [https://www.npmjs.com/package/typings](https://www.npmjs.com/package/typings). It can be installed by using the following command: `npm install typings -g`.

Now you can install the provided definitions by performing the following steps.

1. Copy the  `typings.json` file from the `node_modules/msportalfx-test/typescript` folder to your test root directory. Remember to copy the **Typescript** definition files in the `*typings\*` folder from the updated version that is located at `*/node_modules/msportalfx-test/typescript*`.  

1. Navigate to your test root directory.

1. Install the definitions with the following command: `typings install`.

**MsPortalFx-Test** needs a WebDriver server to drive the browser. Currently, only the **ChromeDriver** that is located at [https://sites.google.com/a/chromium.org/chromedriver](https://sites.google.com/a/chromium.org/chromedriver) is supported, therefore it should be downloaded and placed in your computer's PATH.  Alternately, it can be installed from the Web site located at [chromedriver Node module](https://www.npmjs.com/package/chromedriver) by using the command `npm install chromedriver`.

You may also need the C++ compiler that is included in Visual Studio or some other development environment.

<a name="running-tests-in-visual-studio"></a>
## Running tests in Visual Studio

Your computer should have the most recent editions of operating systems and other software installed, as specified in [top-extensions-install-software.md](top-extensions-install-software.md).

1. Launch **Visual Studio 2015** and navigate to `File -> New -> Project`. In the new project dialog, select `Installed ->  Templates -> TypeScript`. Select the `Node.js -> From Existing Node.js code*` project type, and give it a unique name.  The name of the project typically matches the solution name. The location can be the same as any other **Visual Studio** project directory.  Then, click the checkbox next to ```Create directory for solution```.  Then, click the ```OK``` button, as described in the following image.

    ![alt-text](../media/msportalfx-test/NewTypeScriptNodeJsExistingProject.png "NewTypeScriptNodeJsExistingProject")

1. Open the properties on the **TypeScript** file and set the TestFramework property to “mocha”.

    ![alt-text](../media/msportalfx-test/FileSetTestFrameworkPropertyMocha.png "FileSetTestFrameworkPropertyMocha")

1. Now, you should be able to build your test and view it in the Test Explorer.  If you do not see your tests, make sure that there are no build errors.  You can also try restarting **Visual Studio** to determine whether the restart will cause the IDE to display the test results.  
 
<a name="running-tests-in-visual-studio-write-a-browse-blade-test"></a>
### Write a browse blade test

 This test scenario is that the user opens the Cloud Services Browse blade, filters the list of cloud services, checks that the grid has only one row after the filter, selects the only row and waits for the correct blade to open. Finally, the browser is closed when the user is done. The test uses the **Mocha** testing framework that is located at [https://mochajs.org/](https://mochajs.org/), but you can use any framework that supports **Node.js** modules and promises. The **Mocha** **Typescript** definitions were installed when **typings** was installed, but if you need to install Mocha, you can do so by using the following command: `npm install mocha`.

This test requires an existing cloud service, so if you need one, you can create a new cloud service by using the site located at [https://ms.portal.azure.com/#create/Microsoft.CloudService](https://ms.portal.azure.com/#create/Microsoft.CloudService). Make a note of the DNS name of your cloud service for later use.

1. Create a new TypeScript file named **portaltests.ts** file in your `e2etests` directory and paste the following Typescript code into it.

    ```ts
    /// <reference path="./typings/index.d.ts" />

    import assert = require('assert');
    import testFx = require('MsPortalFx-Test');
    import nconf = require('nconf');
    import until = testFx.until;

    describe('Cloud Service Tests', function () {
        this.timeout(0);
        
        it('Can Browse To A Cloud Service', () => {
            
            // Load command line arguments, environment variables and config.json into nconf
            nconf.argv()
                .env()
                .file(__dirname + "/config.json");

            //provide windows credential manager as a fallback to the above three
            nconf[testFx.Utils.NConfWindowsCredentialManager.ProviderName] = testFx.Utils.NConfWindowsCredentialManager;
            nconf.use(testFx.Utils.NConfWindowsCredentialManager.ProviderName);
        
            testFx.portal.portalContext.signInEmail = 'johndoe@outlook.com';
            testFx.portal.portalContext.signInPassword = nconf.get('msportalfx-test/johndoe@outlook.com/signInPassword');
            
            // Update this variable to use the dns name of your actual cloud service 
            let dnsName = "mycloudservice";
            
            return testFx.portal.openBrowseBlade('microsoft.classicCompute', 'domainNames', "Cloud services (classic)").then((blade) => {
                return blade.filterItems(dnsName);
            }).then((blade) => {
                return testFx.portal.wait<testFx.Controls.GridRow>(() => {
                    return blade.grid.rows.count().then((count) => {
                        return count === 1 ? blade.grid.rows.first() : null;
                    });
                }, null, "Expected only one row matching '" + dnsName + "'.");
            }).then((row) => {
                return row.click();			
            }).then(() => {            
                let summaryBlade = testFx.portal.blade({ title: dnsName + " - Production" });
                return testFx.portal.wait(until.isPresent(summaryBlade));
            }).then(() => {
                return testFx.portal.quit();
            });
        });
    });
    ```

    **NOTE**: Remember to replace "mycloudservice" with the DNS name of your cloud service.

1. The **Windows Credential Manager** needs user credentials for the  **MsPortalFx-Test** suite. These should be the credentials of a user that already has an active Azure subscription. Use the following command in the command window to create the credentials.

```
    cmdkey /generic:msportalfx-test/johndoe@outlook.com/signInPassword /user:johndoe@outlook.com /pass:somePassword
```

After the **MsPortalFx-Test** module is imported and the credentials are specified for the user, we can use the Portal object to drive the test. The scenario completes when the call to `quit()` closes the browser.

<a name="running-tests-in-visual-studio-write-a-browse-blade-test-configure-compile-and-run"></a>
#### Configure, compile and run

Create the following configuration file to specify that  **MsPortalFx-Test** will use the **Chrome** browser for the test session and `https://portal.azure.com` for the test Portal.  The file is named **config.json** and is located in the `e2etests` directory. 

```json

    {
    "capabilities": {
        "browserName": "chrome"
    },
    "portalUrl": "https://portal.azure.com"
    }

```	

Compile the `portaltests.ts` TypeScript test file with the following command.

`tsc portaltests.ts --module commonjs`

Then, run **Mocha** against the generated JavaScript file using the following command.

`node_modules\.bin\mocha portaltests.js`

**NOTE**: Using an elevated command prompt may cause **Chrome** to crash.  Use a non-elevated command prompt for best results.

<a name="running-tests-in-visual-studio-write-a-browse-blade-test-output"></a>
#### Output

The following output will be sent to your console as the test progresses.

```
Portal Tests
Opening the Browse blade for the microsoft.classicCompute/domainNames resource type...
Starting the ChromeDriver process...
Performing SignIn...
Waiting for the Portal...
Waiting for the splash screen to go away...
Applying filter 'mycloudservice'...
√ Can Browse To A Cloud Service (37822ms)	

1 passing (38s)
```

**NOTE**: If you receive compilation errors on the `node.d.ts` file, verify that the `tsc` version you are using is 1.8.x by running the following command: `tsc --version`. If the version is incorrect, then you may need to adjust the path variables or directly call the correct version of `tsc.exe`.  

<a name="running-tests-in-visual-studio-create-and-test-a-resource"></a>
### Create and test a resource

This scenario creates a resource in an extension, and tests it with a new TypeScript file that is saved in the **e2etest** folder of your extension. The test verifies the Browse experience while sideloading your local extension.

1. Create a new extension in **Visual Studio** by using the procedures located in [top-extensions-getting-started.md](top-extensions-getting-started.md).  For the purposes of this example we named the project **theresource**. The extension is named  'LocalExtension' and made it run in the default [https://localhost:44300](https://localhost:44300) address by using CTRL+F5.  

1. Click on the `Create Resource` option in the left Menu, then click on the `see all` option. Then select `Local Development` in the MarketPlace pane to display previews for **theresource**.  You may have to select a preview size on the MarketPlace pane previous to completing the required fields on the extension pane and clicking the `Create` button.

1. Then, on the MyResource pane, enter **theresource** in the ResourceName field, complete the required fields on the extension pane and clicking the `Create` button.

1. Wait for the Portal to complete the creation of the resource.

1. Create a new TypeScript file named  `localextensiontests.ts` in your `e2etests` directory and paste the following Typescript code into it. It imports the **MsPortalFx-Test** module and lays out the Mocha test.

	```ts
	/// <reference path="./typings/index.d.ts" />
	
	import assert = require('assert');
	import testFx = require('MsPortalFx-Test');
	import until = testFx.until;
	
	describe('Local Extension Tests', function () {
		this.timeout(0);
	
		it('Can Browse To The Resource Blade', () => {
			
		});
	});
	```

1. In the **Can Browse To The Resource Blade** test body, specify the credentials for the test session.  Substitute the actual Azure test credentials for the credentials in the example.

	```ts
	// Hardcoding credentials to simplify the example, but you should never hardcode credentials
	testFx.portal.portalContext.signInEmail = 'johndoe@outlook.com';
	testFx.portal.portalContext.signInPassword = '12345';
	```

1. Use the `features` option of the `portal.PortalContext` object to enable the **canmodifyextensions** feature flag, and use the `testExtensions` option to specify the name and address of the local extension to load, as in the following code.

	```ts
	testFx.portal.portalContext.features = [{ name: "feature.canmodifyextensions", value: "true" }];
	testFx.portal.portalContext.testExtensions = [{ name: 'LocalExtension', uri: 'https://localhost:44300/' }];
	```

1. Declare a variable that contains the name of the resource to which the test will browse.

	```ts
	let resourceName = 'theresource';
	```

1. Opening the browse blade for the resource requires three pieces of information: the resource provider, the resource type and the title of the blade. All of that information is located in the Browse PDL file of the extension. In this instance, the resource provider is **Microsoft.PortalSdk**, the resource type is **rootResources** and the browse blade title is **My Resources**, as in the following example that calls the `openBrowseBlade` function.

	```ts
	return testFx.portal.openBrowseBlade('Microsoft.PortalSdk', 'rootResources', 'My Resources')
	```

1. The extension uses the returned Blade object to filter the list, verify that only one row remains after filtering, and select that row, as in the following code.
	
	```ts
	.then((blade) => {
        return testFx.portal.wait<testFx.Controls.GridRow>(() => {
            return blade.grid.rows.count().then((count) => {
                return count === 1 ? blade.grid.rows.first() : null;
            });
        }, null, "Expected only one row matching '" + resourceName + "'.");
    }).then((row) => {
        return row.click();				
	})
	```

1. Verify that the correct blade opened and will close the Portal when it is done.

	```ts
	.then(() => {
		let summaryBlade = testFx.portal.blade({ title: resourceName });
		return testFx.portal.wait(until.isPresent(summaryBlade));
	}).then(() => {
		return testFx.portal.quit();
	});
	```


1. To add the required configuration, create a file named **config.json** in the `e2etest` directory. Paste the following code in the file.

	```json
	{
	  "capabilities": {
	    "browserName": "chrome"
	  },
	  "portalUrl": "https://portal.azure.com"
	}
	```		

1. Compile the **TypeScript** test file by using the following command.

    ```tsc localextensiontests.ts --module commonjs```

1. Run the test by running Mocha against the generated JavaScript file.

	```node_modules\.bin\mocha localextensiontests.js```

    The following output will be sent to your console as the test progresses:

```
	Local Extension Tests
	Opening the Browse blade for the Microsoft.PortalSdk/rootResources resource type...
	Starting the ChromeDriver process...
	Performing SignIn...
	Waiting for the Portal...
	Waiting for the splash screen...
	Allowing trusted extensions...
	Waiting for the splash screen to go away...
	Applying filter 'theresource'...
	    √ Can Browse To The Resource Blade (22872ms)
	
	
	  1 passing (23s)

```

<a name="running-tests-in-visual-studio-entire-test-script"></a>
### Entire test script

The following is the entire test script.

```ts
/// <reference path="./typings/index.d.ts" />

import assert = require('assert');
import testFx = require('MsPortalFx-Test');
import until = testFx.until;

describe('Local Extension Tests', function () {
    this.timeout(0);

    it('Can Browse To The Resource Blade', () => {
        // Hardcoding credentials to simplify the example, but you should never hardcode credentials
        testFx.portal.portalContext.signInEmail = 'johndoe@outlook.com';
        testFx.portal.portalContext.signInPassword = '12345';
        testFx.portal.portalContext.features = [{ name: "feature.canmodifyextensions", value: "true" }];
        testFx.portal.portalContext.testExtensions = [{ name: 'LocalExtension', uri: 'https://localhost:44300/' }];
        
        let resourceName = 'theresource';
        
        return testFx.portal.openBrowseBlade('Microsoft.PortalSdk', 'rootResources', 'My Resources').then((blade) => {
            return blade.filterItems(resourceName);
        }).then((blade) => {
            return testFx.portal.wait<testFx.Controls.GridRow>(() => {
                return blade.grid.rows.count().then((count) => {
                    return count === 1 ? blade.grid.rows.first() : null;
                });
            }, null, "Expected only one row matching '" + resourceName + "'.");
        }).then((row) => {
            return row.click();
        }).then(() => {
            let summaryBlade = testFx.portal.blade({ title: resourceName });
            return testFx.portal.wait(until.isPresent(summaryBlade));
        }).then(() => {
            return testFx.portal.quit();
        });
    });
});
```

<a name="running-a-test-in-cloudtest"></a>
## Running a test in cloudtest

 In CI, one test option is to use Cloudtest.  The `nodejs` test adaptor cannot be used with `vs.console.exe` since it requires a full installation of Visual Studio, which is absent on the VMs. Fortunately, we can run a script that sets up the test environment and the Exe Execution type that will run against the powershell/cmd executable.

* Environment Setup

    **Nodejs** and **npm** are installed on the cloudtest VMs by default. **Chrome** is not installed by default, therefore the **Chrome** executable can be included in the build drop for quick installation by using the following      `setup.bat` script.


    ```
    cd UITests
    call npm install --no-optional
    call npm install -g typescript
    call "%APPDATA%\npm\tsc.cmd"
    call chrome_installer.exe /silent /install
    exit 0
    ```

* Running Tests

    A test sends sign-in credentials to Cloudtest, either as secret parameters or as non-secret paraneters. You can create a TestJob that uses the `Exe` execution type to specify whether to use the powershell or cmd executable. Then, point to a script that will run your tests, like the one in the following `TestGroup.xml` file.

    ```
    <TestJob Name="WorkspaceExtension.UITests" Type="SingleBox" Size="Small" Tags="Suite=Suite0">
        <Execution Type="Exe" Path="C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" Args='[SharedWorkingDirectory]\UITests\RunTests.ps1' />
    </TestJob>
    ```

    Use the `mocha-trx-reporter` **npm** package to generate a `.trx` file, and when the script completes, copy the resulting `.trx` file to the `TestResults` folder where Cloudtest expects to locate it. 

    * Secret parameters

        To pass secrets to CloudTest, you can either use test `secretstore` which has been configured to use a certificate installed on all cloudtest VMs for particular paths, or one of the other solutions described in [http://aka.ms/portalfx/ais-user-certificates](http://aka.ms/portalfx/ais-user-certificates).

    * Non-secret parameters

        You can use the `props` switch to pass non-secret parameters to the cloudtest session, and therefore the **MsPortalfx-Tests**, when kicking off a cloudtest session. The properties are saved as machine-level environment variables on your cloudtest VM. After these environment variables are set for the session, you can use `nconf` to pick them up in your UI test configuration.

    * CI Test example 

    A Powershell script named `RunTests.ps1` that uses secrets to run the test might contain content similar to the following example.
        
        ```
        cd ..\UITests

        $env:USER_EMAIL = ..\StashClient\StashClient.exe -env:test pgetdecrypted -name:Your/Secret/Path -cstorename:My -cstorelocation:LocalMachine -cthumbprint:0000000000000000000000000000000000000000

        $env:USER_PASSWORD = ..\StashClient\StashClient.exe -env:test pgetdecrypted -name:Your/Secret/Path -cstorename:My -cstorelocation:LocalMachine -cthumbprint:0000000000000000000000000000000000000000

        $env:TEST_ENVIRONMENT = [environment]::GetEnvironmentVariable("TEST_ENVIRONMENT","Machine")

        mocha WorkspaceTests.js --reporter mocha-trx-reporter --reporter-file ./TestResults/result.trx

        xcopy TestResults\* ..\TestResults
        ```

    The following non-secret parameters can be used when kicking off the cloudtest session, instead of the secret environment variables from the previous script.

        ```
        ct -t "amd64\CloudTest\TestMap.xml" -tenant Default -BuildId "GUID" -props worker:TEST_ENVIRONMENT=canary
        ```


---------------------

<a name="debugging"></a>
## Debugging

<a name="debugging-checking-results-while-tests-are-running"></a>
### Checking results while tests are running

Screenshots are a handy way to help diagnose issues. The following code takes a screenshot of what is currently displayed in the browser.  

```ts
//1. import test fx
import testFx = require('MsPortalFx-Test');
...
    var screenshotPromise = testFx.portal.takeScreenshot(ScreenshotTitleHere);
```

Sometimes it is useful to get the result of currently running tests.  The following code takes a screenshot  only when the test fails, if you are using the **mocha** test runner,

```ts
import testFx = require('MsPortalFx-Test');
...
    afterEach(function () {
        if (this.currentTest.state === "failed") {
            return testSupport.GatherTestFailureDetails(this.currentTest.title);
        }
    });

```

<a name="debugging-lambda-functions"></a>
### lambda functions

Typescript lambda functions, also known as "the fat arrow" or "() => {}", capture the "this" variable from the surrounding context.  This can cause problems when trying to access Mocha's current test state.  See [arrow functions](https://basarat.gitbooks.io/typescript/content/docs/arrow-functions.html) for details.


<a name="debugging-how-to-capture-browser-console-output"></a>
### How to capture browser console output

When trying to identify reasons for failure of a test, its useful to capture the console logs of the browser that was used to execute your test. You can capture the logs at a given level e.g error, warning, etc or at all levels using the LogLevel parameter. The following example demonstrates how to call getBrowserLogs and how to work with the result. getBrowserLogs will return a Promise of string[] which when resolved will contain the array of logs that you can view during debug or write to the test console for later analysis.

```ts
import testFx = require('MsPortalFx-Test');
...

        return testFx.portal.goHome(20000).then(() => {
            return testFx.portal.getBrowserLogs(LogLevel.All);
        }).then((logs) => {
            assert.ok(logs.length > 0, "Expected to collect at least one log.");
        });

```

<a name="debugging-callstack"></a>
### Callstack

<a name="debugging-test-output-artifacts"></a>
### Test output artifacts

        
---------------------------

<a name="debugging-more-examples"></a>
### More Examples

Examples and test scripts are located at [https://github.com/Azure/msportalfx-test/tree/master/test](https://github.com/Azure/msportalfx-test/tree/master/test), and in various folders located at  [https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx), including `src/SDK/AcceptanceTests/Extensions/SamplesExtension/Tests`.

If you do not have access to the AzureUX-PortalFx dashboard, you can enlist by following the instructions specified in [top-onboarding.md](top-onboarding.md). 
--------------


  ## Debugging

<a name="debugging-debug-tests-101"></a>
### debug tests 101

<a name="debugging-debugging-tests-in-vs-code"></a>
### debugging tests in VS Code

If you run mocha with the --debug-brk flag, you can press F5 and the project will attach to a debugger. 

<a name="debugging-checking-the-result-of-the-currently-running-test-in-code"></a>
### Checking the result of the currently running test in code

Sometimes it is useful to get the result of the currently running test, for example: you want to take a screenshot only when the test fails.

```ts

    afterEach(function () {
        if (this.currentTest.state === "failed") {
            return testSupport.GatherTestFailureDetails(this.currentTest.title);
        }
    });

```

One thing to watch out for in typescript is how lambda functions, "() => {}", behave.  Lambda functions (also called "fat arrow" sometimes) in Typescript capture the "this" variable from the surrounding context.  This can cause problems when trying to access Mocha's current test state.  See [arrow functions](https://basarat.gitbooks.io/typescript/content/docs/arrow-functions.html) for details.

<a name="debugging-how-to-take-a-screenshot-of-the-browser"></a>
### How to take a screenshot of the browser

This is an example of how to take a screenshot of what is currently displayed in the browser.  

```ts
//1. import test fx
import testFx = require('MsPortalFx-Test');
...
    var screenshotPromise = testFx.portal.takeScreenshot(ScreenshotTitleHere);
```

Taking a screenshot when there is a test failure is a handy way to help diagnose issues.  If you are using the mocha test runner, then you can do the following to take a screenshot whenever a test fails:

```ts
import testFx = require('MsPortalFx-Test');
...

    afterEach(function () {
        if (this.currentTest.state === "failed") {
            return testSupport.GatherTestFailureDetails(this.currentTest.title);
        }
    });

```

<a name="debugging-how-to-capture-browser-console-output"></a>
### How to capture browser console output

When trying to identify reasons for failure of a test its useful to capture the console logs of the browser that was used to execute your test. You can capture the logs at a given level e.g error, warning, etc or at all levels using the LogLevel parameter. The following example demonstrates how to call getBrowserLogs and how to work with the result. getBrowserLogs will return a Promise of string[] which when resolved will contain the array of logs that you can view during debug or write to the test console for later analysis.    

```ts
import testFx = require('MsPortalFx-Test');
...

        return testFx.portal.goHome(20000).then(() => {
            return testFx.portal.getBrowserLogs(LogLevel.All);
        }).then((logs) => {
            assert.ok(logs.length > 0, "Expected to collect at least one log.");
        });

```

<a name="debugging-callstack"></a>
### Callstack

<a name="debugging-test-output-artifacts"></a>
### Test output artifacts


   ## Localization

This section intentionally left  blank.

   
<a name="user-management"></a>
## User Management

This section intentionally left blank.

   
<a name="user-management-create"></a>
### Create

<a name="user-management-create-opening-the-create-blade-from-a-deployed-gallery-package"></a>
#### Opening the create blade from a deployed gallery package

To open/navigate to the create blade a gallery package previously deployed to the Azure Marketplace you can use `portal.openGalleryCreateBlade`.  The returned promise will resolve with the CreateBlade defined by that gallery package. 

```ts 
import TestFx = require('MsPortalFx-Test');
...
FromLocalPackage
        return testFx.portal.openGalleryCreateBladeFromLocalPackage(
            extensionResources.samplesExtensionStrings.Engine.engineV3,     //title of the item in the marketplace e.g "EngineV3"
            extensionResources.samplesExtensionStrings.Engine.createEngine, //the title of the blade that will be opened e.g "Create Engine"
            10000)                                                          //an optional timeout to wait on the blade
        .then(() => createEngineBlade.checkFieldValidation())
        .then(() => createEngineBlade.fillRequiredFields(resourceName, "600cc", "type1", subscriptionName, resourceName, locationDescription))
        .then(() => createEngineBlade.actionBar.pinToDashboardCheckbox.click())
        .then(() => createEngineBlade.actionBar.createButton.click())
        .then(() => testFx.portal.wait(until.isPresent(testFx.portal.blade({ title: resourceName })), 120000, "The resource blade was not opened, could be deployment timeout."));
        
...
```

<a name="user-management-create-opening-the-create-blade-from-a-local-gallery-package"></a>
#### Opening the create blade from a local gallery package

To open/navigate to the create blade a local gallery package that has been sideloaded into the Portal along with your extension you can use `portal.openGalleryCreateBladeFromLocalPackage`.  The returned promise will resolve with the CreateBlade defined by that gallery package. 

```ts 
import TestFx = require('MsPortalFx-Test');
...

        return testFx.portal.openGalleryCreateBladeFromLocalPackage(
            extensionResources.samplesExtensionStrings.Engine.engineV3,     //title of the item in the marketplace e.g "EngineV3"
            extensionResources.samplesExtensionStrings.Engine.createEngine, //the title of the blade that will be opened e.g "Create Engine"
            10000)                                                          //an optional timeout to wait on the blade
        .then(() => createEngineBlade.checkFieldValidation())
        .then(() => createEngineBlade.fillRequiredFields(resourceName, "600cc", "type1", subscriptionName, resourceName, locationDescription))
        .then(() => createEngineBlade.actionBar.pinToDashboardCheckbox.click())
        .then(() => createEngineBlade.actionBar.createButton.click())
        .then(() => testFx.portal.wait(until.isPresent(testFx.portal.blade({ title: resourceName })), 120000, "The resource blade was not opened, could be deployment timeout."));
        
...
```

<a name="user-management-create-validation-state"></a>
#### Validation State

<a name="user-management-create-get-the-validation-state-of-fields-on-your-create-form"></a>
#### Get the validation state of fields on your create form

`FormElement` exposes two useful functions for working with the ValidationState of controls. 

The function `getValidationState` returns a promise that resolves with the current state of the control and can be used as follows

```ts
import TestFx = require('MsPortalFx-Test');
...

            //click the createButton on the create blade to fire validation
            .then(() => this.actionBar.createButton.click())
            //get the validation state of the control
            .then(() => this.name.getValidationState())
            //assert state matches expected
            .then((state) => assert.equal(state, testFx.Constants.ControlValidationState.invalid, "name should have invalid state"));
...

```

<a name="user-management-create-wait-on-a-fields-validation-state"></a>
#### Wait on a fields validation state

The function `waitOnValidationState(someState, optionalTimeout)` returns a promise that resolves when the current state of the control is equivalent to someState supplied.  This is particularly useful for scenarions where you may be performing serverside validation and the control remains in a pending state for the duration of the network IO.

```ts
import TestFx = require('MsPortalFx-Test');
...

            //change the value to initiate validation
            .then(() => this.name.sendKeys(nameTxt + webdriver.Key.TAB))
            //wait for the control to reach the valid state
            .then(() => this.name.waitOnValidationState(testFx.Constants.ControlValidationState.valid))
...

```

 
<a name="user-management-browse"></a>
### Browse

<a name="user-management-browse-how-to-test-the-context-menu-in-browse-shows-your-extensions-commands"></a>
#### How to test the context menu in browse shows your extensions commands?

There is a simple abstraction available in MsPortalFx.Tests.Browse.  You can use it as follows: 

```ts
//1. import test fx
import TestFx = require('MsPortalFx-Test');

...

it("Can Use Context Click On Browse Grid Rows", () => {
    ...
//2. Setup an array of commands that are expected to be present in the context menu
//  and call the contextMenuContainsExpectedCommands on Tests.Browse. 
    //  The method will assert expectedCommands match what was displayed  
    
        let expectedContextMenuCommands: Array<string> = [
            PortalFxResources.pinToDashboard,
            extensionResources.deleteLabel
        ];
        return testFx.Tests.Browse.contextMenuContainsExpectedCommands(
            resourceProvider, // the resource provider e.g "microsoft.classicCompute"
            resourceType, // the resourceType e.g "domainNames"
            resourceBladeTitle, // the resource blade title "Cloud services (classic)"
            expectedContextMenuCommands) 
});
```

<a name="user-management-browse-how-to-test-the-grid-in-browse-shows-the-expected-default-columns-for-your-extension-resource"></a>
#### How to test the grid in browse shows the expected default columns for your extension resource

There is a simple abstraction available in MsPortalFx.Tests.Browse.  You can use it as follows:

```ts
//1. import test fx
import TestFx = require('MsPortalFx-Test');

...

it("Browse contains default columns with expected column header", () => {
 // 2. setup an array of expectedDefaultColumns to be shown in browse
    
    const expectedDefaultColumns: Array<testFx.Tests.Browse.ColumnTestOptions> =
        [
            { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.name },
            { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.subscription },
            { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.location },
        ];

// 3. call the TestFx.Tests.Browse.containsExpectedDefaultColumns function.
// This function this will perform a reset columns action in browse and then assert
// the expectedDefaultColumns match what is displayed
        
        return testFx.Tests.Browse.containsExpectedDefaultColumns(
            resourceProvider,
            resourceType,
            resourceBladeTitle,
            expectedDefaultColumns);
}
```

<a name="user-management-how-to-test-the-grid-in-browse-shows-additional-extension-resource-columns-that-are-selected"></a>
### How to test the grid in browse shows additional extension resource columns that are selected

There is a simple abstraction available in MsPortalFx.Tests.Browse that asserts extension resource specific columns can be selected in browse and that after selection they show up in the browse grid.  
the function is called `canSelectResourceColumns`. You can use it as follows:

```ts
// 1. import test fx
import TestFx = require('MsPortalFx-Test');

...

it("Can select additional columns for the resourcetype and columns have expected title", () => {

// 2. setup an array of expectedDefaultColumns to be shown in browse
    
    const expectedDefaultColumns: Array<testFx.Tests.Browse.ColumnTestOptions> =
        [
            { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.name },
            { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.subscription },
            { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.location },
        ];

// 3. setup an array of columns to be selected and call the TestFx.Tests.Browse.canSelectResourceColumns function.
// This function this will perform:
//   - a reset columns action in browse 
//   - select the provided columnsToSelect
//   - assert that brows shows the union of 
// the expectedDefaultColumns match what is displayed expectedDefaultColumns and columnsToSelect

        let columnsToSelect: Array<testFx.Tests.Browse.ColumnTestOptions> =
            [
                { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.locationId },
                { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.resourceGroupId },
                { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.status },
                { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.subscriptionId },
            ];
        return testFx.Tests.Browse.canSelectResourceColumns(
            resourceProvider,
            resourceType,
            resourceBladeTitle,
            expectedDefaultColumns,
            columnsToSelect); 
}
```


 
<a name="blades"></a>
## Blades

Topics about blade navigation are the following.

* [Common portal blades](#common-portal-blades)

* [Locating an open blade](#locating-an-open-blade)

* [Dialogs](#dialogs)

* [Blade navigation](#blade-navigation)

* * * 

<a name="blades-common-portal-blades"></a>
### Common portal blades

There are several types of Portal blades that can be opened programmatically. There are also several API's available to make testing a common functionality within browse such as context menu commands and column picking functionality. 

* [Open the create blade](#open-the-create-blade)

* [Open the browse blade from your resource](#open-the-browse-blade-from-your-resource)

* [Open the resource summary blade](#open-the-resource-summary-blade)

* [Navigate to the spec picker blade](#navigate-to-the-spec-picker-blade)

* [Navigate to the Settings blade](#navigate-to-the-settings-blade)

* [Navigate to the Properties Blade](#navigate-to-the-properties-blade)

* [Navigate to the QuickStart blade](#navigate-to-the-quickstart-blade)

* [Navigate to the user access blade](#navigate-to-the-user-access-blade)

* [The Move Resource Blade](#the-move-resource-blade)

* * *

<a name="blades-common-portal-blades-open-the-create-blade"></a>
#### Open the create blade

For more information about opening the create blade, see [msportalfx-test-scenarios-create.md#opening-the-create-blade-from-a-deployed-gallery-package](msportalfx-test-scenarios-create.md#opening-the-create-blade-from-a-deployed-gallery-package).

<a name="blades-common-portal-blades-open-the-browse-blade-from-your-resource"></a>
#### Open the browse blade from your resource

To open/navigate to the Browse blade from resource type you can use `portal.openBrowseBlade`.  The returned promise will resolve with the browse blade. 

```ts
import testFx = require('MsPortalFx-Test');
...

        return testFx.portal.openBrowseBlade(resourceProvider, resourceType, resourceBladeTitle, 20000)
            .then((blade) => blade.filterItems(resourceName))
...
```

<a name="blades-common-portal-blades-open-the-resource-summary-blade"></a>
#### Open the resource summary blade

Use the `portal.openResourceBlade` method to open or navigate to the Resource Summary blade for a specific resource.  The returned promise will resolve with the Resource summary blade for the specified resource, as in the following example.

```ts
import testFx = require('MsPortalFx-Test');
...

        return testSupport.armClient.createResourceGroup(resourceGroupName, locationId)
            .then((result) => testFx.portal.openResourceBlade(result.resourceGroup.id, result.resourceGroup.name, 70000))
            .then(() => resourceBlade.clickCommand(extensionResources.deleteLabel))
...
```

<a name="blades-common-portal-blades-navigate-to-the-spec-picker-blade"></a>
#### Navigate to the spec picker blade

The `SpecPickerBlade` can be used to select or change the current spec of a resource.  The following example demonstrates how to navigate to the spec picker for a specific resource, then changes the selected spec.

```ts
//1. imports
import testFx = require('MsPortalFx-Test');
import SpecPickerBlade = testFx.Parts.SpecPickerBlade;


        const pricingTierBlade = testFx.portal.blade({ title: extensionResources.samplesExtensionStrings.PricingTierBlade.title });
        let pricingTierPart: PricingTierPart;
//2. Open navigate blade and select the pricing tier part.  
// Note if navigating to a resourceblade use testFx.portal.openResourceBlade and blade.element
        return testFx.portal.navigateToUriFragment("blade/SamplesExtension/PricingTierV3Blade", 15000).then(() => {
            return pricingTierBlade.waitUntilBladeAndAllTilesLoaded();
        }).then(() => {
            pricingTierPart = testFx.portal.element(PricingTierPart);
            return pricingTierPart.click();
        }).then(() => {
 //3. get a reference to the picker blade and pick a spec 
            var pickerBlade = testFx.portal.blade({ bladeType: SpecPickerBlade, title: extensionResources.choosePricingTier});
            return pickerBlade.pickSpec(extensionResources.M);
        }).then(() => {
        
```

<a name="blades-common-portal-blades-navigate-to-the-settings-blade"></a>
#### Navigate to the settings blade

Navigation to the `SettingsBlade` is performed by using the `ResourceSummaryPart` on a resource summary blade. The following demonstrates how to navigate to a settings blade and click on a setting.

```ts
import testFx = require('MsPortalFx-Test');
...
//1. model your resource summary blade which contains a resource summary part

import Blade = testFx.Blades.Blade;
import ResourceSummaryPart = testFx.Parts.ResourceSummaryPart;

class SummaryBlade extends Blade {
    public essentialsPart = this.element(ResourceSummaryPart);
    public rolesAndInstancesPart = this.part({ innerText: resources.rolesAndInstances });
    public estimatedSpendPart = this.part({ innerText: resources.estimatedSpend });
}
...
//2. navigate to the quickstart and click a link
...
        const settingsBlade = testFx.portal.blade({ bladeType: testFx.Blades.SettingsBlade });
        return testSupport.armClient.createResourceGroup(resourceGroups[0], locationId)
            .then((result) => testFx.portal.openResourceBlade(result.resourceGroup.id, result.resourceGroup.name, 70000))
            //click on the settings hotspot to open the settings blade
             //blades#navigateClick
            .then((blade) => blade.asType(SummaryBlade).essentialsPart.settingsHotSpot.click())
            .then(() => settingsBlade.clickSetting(PortalFxResources.properties))
            .then(() => testFx.portal.wait(until.isPresent(testFx.portal.element(testFx.Blades.PropertiesBlade))));//blades#navigateClick
        
...
```

<a name="blades-common-portal-blades-navigate-to-the-properties-blade"></a>
#### Navigate to the properties blade

Navigation to the `PropertiesBlade` is performed by using the resource summary blade. The following demonstrates how to navigate to the properties blade.

```ts
import testFx = require('MsPortalFx-Test');
...
//2. navigate to the properties blade from the resource blade and check the value of one of the properties

                return testFx.portal.openResourceBlade(resourceId, resourceName, 70000);
            })
            .then(() => testFx.portal.blade({ bladeType: SummaryBlade })
                .essentialsPart.settingsHotSpot.click())
            .then(() => testFx.portal.blade({ bladeType: testFx.Blades.SettingsBlade })
                .clickSetting(PortalFxResources.properties))
            .then(() => {
                const expectedPropertiesCount = 6;
                return testFx.portal.wait(() => {
                    return propertiesBlade.properties.count().then((count) => {
                        return count === expectedPropertiesCount;
                    });
                }, null, testFx.Utils.String.format("Expected to have {0} properties in the Properties blade.", expectedPropertiesCount));
            }).then(() => propertiesBlade.property({ name: PortalFxResources.nameLabel }).value.getText())
            .then((nameProperty) => assert.equal(nameProperty, resourceName, testFx.Utils.String.format("Expected the value for the 'NAME' property to be '{0}' but found '{1}'.", resourceName, nameProperty)));
...
```

<a name="blades-common-portal-blades-navigate-to-the-quickstart-blade"></a>
#### Navigate to the quickstart blade

The `Portal.navigateToUriFragment` method allows an extension to navigate directly into a `QuickStartBlade` for a resource by using a deep link.
   
```ts
import testFx = require('MsPortalFx-Test');
...

        const resourceName = resourcePrefix + guid.newGuid();
        const createOptions = {
            name: resourceName,
            resourceGroup: resourceGroupName,
            location: locationId,
            resourceProvider: resourceProvider,
            resourceType: resourceType,
            resourceProviderApiVersion: resourceProviderApiVersion,
            properties: {
                displacement: "600cc",
                model: "type1",
                status: 0
            }
        };
        return testSupport.armClient.createResource(createOptions)
            //form deep link to the quickstart blade
            .then((resourceId) => {
                return testFx.portal.navigateToUriFragment(`blade/SamplesExtension/EngineQuickStartBlade/id/${encodeURIComponent(resourceId)}`)
                    .then(() =>
                        testFx.portal.wait(ExpectedConditions.isPresent(testFx.portal.blade({ title: resourceId, bladeType: QuickStartBlade }))));
```

Deep-linking is fast, but it does not validate that the user can actually navigate to a `QuickStartBlade` by using a `ResourceSummaryPart` on a resource summary blade.  The following code demonstrates how to verify that the user can navigate to the blade.

```ts
import testFx = require('MsPortalFx-Test');
...
//1. model your resource summary blade which contains a resource summary part

import Blade = testFx.Blades.Blade;
import ResourceSummaryPart = testFx.Parts.ResourceSummaryPart;

class SummaryBlade extends Blade {
    public essentialsPart = this.element(ResourceSummaryPart);
    public rolesAndInstancesPart = this.part({ innerText: resources.rolesAndInstances });
    public estimatedSpendPart = this.part({ innerText: resources.estimatedSpend });
}

...
//2. navigate to the quickstart and click a link

        const summaryBlade = testFx.portal.blade({ title: resourceGroupName, bladeType: SummaryBlade });

        return testFx.portal.openResourceBlade(resourceGroupId, resourceGroupName, 70000)
            //click to open the quickstart blade
            .then(() => summaryBlade.essentialsPart.quickStartHotSpot.click())
            .then(() => summaryBlade.essentialsPart.quickStartHotSpot.isSelected())
            .then((isSelected) => assert.equal(isSelected, true))
            .then(() => testFx.portal.wait(testFx.until.isPresent(testFx.portal.blade({ title: resourceGroupName, bladeType: QuickStartBlade }))))
            .then((result) => assert.equal(result, true));
...
```

<a name="blades-common-portal-blades-navigate-to-the-user-access-blade"></a>
#### Navigate to the user access blade

The `Portal.navigateToUriFragment` method allows an extension to navigate directly into the user access blade that is associated with a resource by using  a deep link.
   
```ts
import testFx = require('MsPortalFx-Test');
...

        const resourceName = resourcePrefix + guid.newGuid();
        const createOptions = {
            name: resourceName,
            resourceGroup: resourceGroupName,
            location: locationId,
            resourceProvider: resourceProvider,
            resourceType: resourceType,
            resourceProviderApiVersion: resourceProviderApiVersion,
            properties: {
                displacement: "600cc",
                model: "type2",
                status: 0
            }
        };

        return testSupport.armClient.createResource(createOptions)
            //form deep link to the quickstart blade
            .then((resourceId) => testFx.portal.navigateToUriFragment(`blade/Microsoft_Azure_AD/UserAssignmentsBlade/scope/${resourceId}`, timeouts.defaultLongTimeout))
            .then(() => testFx.portal.wait(ExpectedConditions.isPresent(testFx.portal.element(testFx.Blades.UsersBlade))));
```

Deep-linking is fast, but it does not validate that the user can actually navigate to a `UsersBlade ` by using a `ResourceSummaryPart` on a resource summary blade.  The following code demonstrates how to verify that the user can navigate to the blade.

```ts
import testFx = require('MsPortalFx-Test');
...
//1. model your resource summary blade which contains a resource summary part

import Blade = testFx.Blades.Blade;
import ResourceSummaryPart = testFx.Parts.ResourceSummaryPart;

class SummaryBlade extends Blade {
    public essentialsPart = this.element(ResourceSummaryPart);
    public rolesAndInstancesPart = this.part({ innerText: resources.rolesAndInstances });
    public estimatedSpendPart = this.part({ innerText: resources.estimatedSpend });
}

...
//2. navigate to the quickstart and click a link

        const summaryBlade = testFx.portal.blade({ title: resourceGroupName, bladeType: SummaryBlade });

        return testFx.portal.openResourceBlade(resourceGroupId, resourceGroupName, 70000)
            //click to open the user access blade
            .then(() => summaryBlade.essentialsPart.accessHotSpot.click())
            .then(() => summaryBlade.essentialsPart.accessHotSpot.isSelected())
            .then((isSelected) => assert.equal(isSelected, true))
            .then(() => testFx.portal.wait(ExpectedConditions.isPresent(testFx.portal.element(UsersBlade)), 90000))
            .then((result) => assert.equal(result, true));
...
```

<a name="blades-common-portal-blades-the-move-resource-blade"></a>
#### The move resource blade

The `MoveResourcesBlade` is used to move resources from one resource group to a new resource group.  The `portal.startMoveResource` method provides a simple abstraction that will initiate the move of an existing resource to a new resource group.  The following example demonstrates how to initiate the move and then wait on successful notification of completion.
  
```ts
import testFx = require('MsPortalFx-Test');
...
    
            return testFx.portal.startMoveResource(
                {
                    resourceId: resourceId,
                    targetResourceGroup: newResourceGroup,
                    createNewGroup: true,
                    subscriptionName: subscriptionName,
                    timeout: 120000
                });
            }).then(() => {
            return testFx.portal.element(NotificationsMenu).waitForNewNotification(portalFxResources.movingResourcesComplete, null, 5 * 60 * 1000);
```

<a name="blades-locating-an-open-blade"></a>
### Locating an open blade

The `testfx.portal.blade` method can be used to locate an already opened blade.

*  Locate an already opened blade by its  title, as in the following example.

    ```ts
    
        const resourceBlade = testFx.portal.blade({ title: resourceGroupName });
    ```  
 
* Locate an already opened blade by using its  blade type and its predefined locator, as in the following example.

    ```ts
    
        const settingsBlade = testFx.portal.blade({ bladeType: testFx.Blades.SettingsBlade });
        
    ```

<a name="blades-dialogs"></a>
### Dialogs

Some blades commands create dialogs that typically require the user to acknowledge something. The `Blade` class exposes a `dialog` function that can be used to locate the dialog on the specified blade, and to perform actions against it. 

The following example demonstrates how to:

* Get a reference to a dialog by its title

* Find a field within the dialog and send information to it by using the `sendKeys` method

* Click on a button in a dialog

```ts
import testFx = require('MsPortalFx-Test');
...

        const samplesBlade = testFx.portal.blade({ title: "Samples", bladeType: SamplesBlade });
        return testFx.portal.goHome(20000).then(() => {
            return testFx.portal.navigateToUriFragment("blade/SamplesExtension/SamplesBlade");
        }).then(() => {
            return samplesBlade.openSample(extensionResources.samplesExtensionStrings.SamplesBlade.bladeWithToolbar);
        }).then((blade) => {
            return blade.clickCommand(extensionResources.samplesExtensionStrings.BladeWithToolbar.commands.save);
            }).then((blade) => {
            //get a reference to a dialog by title
            let dialog = blade.dialog({ title: extensionResources.samplesExtensionStrings.BladeWithToolbar.bladeDialogs.saveFile });
            //sending keys to a field in a dialog
            return dialog.field(testFx.Controls.TextField, { label: extensionResources.samplesExtensionStrings.BladeWithToolbar.bladeDialogs.filename })
                .sendKeys("Something goes here")
                //clicking a button within a dialog
                .then(() => dialog.clickButton(extensionResources.ok));
            });
```

<a name="blades-blade-navigation"></a>
### Blade navigation

There are several approaches that can be used to  navigate to blades within `msportalfx-test`.

* Use a deep link to the blade using the `portal.navigateToUriFragment` function, as in the following example.

    ```ts
    import testFx = require('MsPortalFx-Test');
    ...
    
        const resourceName = resourcePrefix + guid.newGuid();
        const createOptions = {
            name: resourceName,
            resourceGroup: resourceGroupName,
            location: locationId,
            resourceProvider: resourceProvider,
            resourceType: resourceType,
            resourceProviderApiVersion: resourceProviderApiVersion,
            properties: {
                displacement: "600cc",
                model: "type1",
                status: 0
            }
        };
        return testSupport.armClient.createResource(createOptions)
            //form deep link to the quickstart blade
            .then((resourceId) => {
                return testFx.portal.navigateToUriFragment(`blade/SamplesExtension/EngineQuickStartBlade/id/${encodeURIComponent(resourceId)}`)
                    .then(() =>
                        testFx.portal.wait(ExpectedConditions.isPresent(testFx.portal.blade({ title: resourceId, bladeType: QuickStartBlade }))));
    ```

* Click on another ux component that opens the blade, as in the following example.

    ```ts
    import testFx = require('MsPortalFx-Test');
    ...
    
            .then((blade) => blade.asType(SummaryBlade).essentialsPart.settingsHotSpot.click())
            .then(() => settingsBlade.clickSetting(PortalFxResources.properties))
            .then(() => testFx.portal.wait(until.isPresent(testFx.portal.element(testFx.Blades.PropertiesBlade))));
    ```

* Use `portal.open*` functions that open blades like create, browse and resource summary blades. For more information, see [Opening common portal blades](#common-portal-blades).

* Use the `portal.search` function to locate and open browse and resource blades, as in the following example.

    ```ts
    import testFx = require('MsPortalFx-Test');
    ...
    
        const subscriptionsBlade = testFx.portal.blade({ title: testSupport.subscription });
        
        testFx.portal.portalContext.features.push({ name: "feature.resourcemenu", value: "true" });
        return testFx.portal.goHome().then(() => {
            return testFx.portal.search(testSupport.subscription);
        }).then((results) => {
            return testFx.portal.wait<SearchResult>(() => {
                var result = results[0];
                return result.title.getText().then((title) => {
                    return title === testSupport.subscription ? result : null;
                });
            });
        }).then((result) => {
            return result.click();
        }).then(() => {
            return testFx.portal.wait(until.isPresent(subscriptionsBlade));
        }); 
    ```


 
<a name="parts"></a>
## Parts

<a name="parts-how-to-get-the-reference-to-a-part-on-a-blade"></a>
### How to get the reference to a part on a blade

If it is a specific part, like the essentials for example:

```
	let thePart = blade.element(testFx.Parts.ResourceSummaryPart);
```

For a more generic part:
```
	let thePart = blade.part({innerText: "some part text"});
``` 

To get a handle of this part using something else than simple text you can also do this:

```
	let thePart = blade.element(By.Classname("myPartClass")).AsType(testFx.Parts.Part);
```

<a name="parts-collectionpart"></a>
### CollectionPart

The following example demonstrates how to:

- get a reference to the collection part using `blade.element(...)`. 
- get the rollup count using `collectionPart.getRollupCount()`
- get the rollup count lable using `collectionPart.getRollupLabel()`
- get the grid rows using `collectionPart.grid.rows`

```ts

    it("Can get rollup count, rollup label and grid", () => {
        const collectionBlade = testFx.portal.blade({ title: "Collection" });

        return testFx.portal.navigateToUriFragment("blade/SamplesExtension/CollectionPartIntrinsicInstructions")
            .then(() => testFx.portal.wait(() => collectionBlade.waitUntilBladeAndAllTilesLoaded()))
            .then(() => collectionBlade.element(testFx.Parts.CollectionPart))
            .then((collectionPart) => {
                return collectionPart.getRollupCount()
                    .then((rollupCount) => assert.equal(4, rollupCount, "expected rollupcount to be 4"))
                    .then(() => collectionPart.getRollupLabel())
                    .then((label) => assert.equal(extensionResources.samplesExtensionStrings.Robots, label, "expected rollupLabel is Robots"))
                    .then(() => collectionPart.grid.rows.count())
                    .then((count) => assert.ok(count > 0, "expect the grid to have rows"));
            });
    });
```

Note if you have multiple collection parts you may want to use `blade.part(...)` to search by text.

<a name="parts-collectionpart-grid"></a>
#### Grid

<a name="parts-collectionpart-grid-finding-a-row-within-a-grid"></a>
##### Finding a row within a grid

The following demonstrates how to use `Grid.findRow` to:

- find a `GridRow` with the given text at the specified index
- get the text from all cells within the row using `GridRow.cells.getText`

```ts
                
                return grid.findRow({ text: "John", cellIndex: 0 })
                    .then((row) => row.cells.getText())
                    .then((texts) => texts.length > 2 && texts[0] === "John" && texts[1] === "333");
                
```

<a name="parts-collectionpart-createcomboboxfield"></a>
#### CreateComboBoxField

use this for modeling the resouce group `CreateComboBoxField` on create blades.

- use `selectOption(...)` to chose an existing resource group
- use `setCreateValue(...)` and `getCreateValue(...)` to get and check the value of the create new field respectively 

```ts

        return testFx.portal.goHome(40000).then(() => {
            //1. get a reference to the create blade
            return testFx.portal.openGalleryCreateBlade(
                galleryPackageName,              //the gallery package name e.g "Microsoft.CloudService"
                bladeTitle, //the title of the blade e.g "Cloud Services"
                timeouts.defaultLongTimeout             //an optional timeout to wait on the blade
            )
        }).then((blade: testFx.Blades.CreateBlade) => {
            //2. find the CreateComboBoxField
            var resourceGroup = blade.element(CreateComboBoxField);
            //3. set the value of the Create New text field for the resource group
            return resourceGroup.setCreateValue("NewResourceGroup")
                .then(() =>
                    resourceGroup.getCreateValue()
                ).then((value) =>
                    assert.equal("NewResourceGroup", value, "Set resource group name")
                ).then(() =>
                    resourceGroup.selectOption("NewResourceGroup_4")
                ).then(() =>
                    resourceGroup.getDropdownValue()
                ).then((value) =>
                    assert.equal("NewResourceGroup_4", value, "Set resource group dropdown")
                );
        });
        
```

<a name="parts-collectionpart-editor"></a>
#### Editor

<a name="parts-collectionpart-editor-can-read-and-write-content"></a>
##### Can read and write content

The following example demonstrates how to:

- use `read(...)` to read the content
- use `empty(...)` to empty the content
- use `sendKeys(...)` to write the content

```ts

        let editorBlade: EditorBlade;
        let editor: Editor;
        
        return BladeOpener.openSamplesExtensionBlade(
            editorBladeTitle,
            editorUriFragment,
            EditorBlade,
            10000)
            .then((blade: EditorBlade) => {
                editorBlade = blade;
                editor = blade.editor;
                return editor.read();
            })
            .then((content) => assert.equal(content, expectedContent, "expectedContent is not matching"))
            .then(() => editor.empty())
            .then(() => editor.sendKeys("document."))
            .then(() => testFx.portal.wait(() => editor.isIntellisenseUp().then((isUp: boolean) => isUp)))
            .then(() => {
                let saveButton = By.css(`.azc-button[data-bind="pcControl: saveButton"]`);
                return editorBlade.element(saveButton).click();
            })
            .then(() => testFx.portal.wait(() => editor.read().then((content) => content === "document.")))
            .then(() => editor.workerIFramesCount())
            .then((count) => assert.equal(count, 0, "We did not find the expected number of iframes in the portal.  It is likely that the editor is failing to start web workers and is falling back to creating new iframes"));
        
```

<a name="parts-collectionpart-essentials"></a>
#### essentials


<a name="parts-collectionpart-essentials-essentials-tests"></a>
##### Essentials tests

The following example demonstrates how to:

- use `countItems(...)` to count the number of all items. (MultiLine Item is counted as one)
- use `isDisabled(...)` to get a value that determines whether the essentials is disabled
- use `hasViewAll(...)` to get a value that determines whether the essentials has ViewAll button or not
- use `getViewAllButton(...)` to get a PortalElement of the essentials' viewAll button
- use `getItemByLabelText(...)` to get an EssentialsItem that is found by its label text
- use `getPropertyElementByValue(...)` to get a PortalELement of matching property value
- use `getExpandedState(...)` to get a value that determines the essentials' expanded state
- use `setExpandedState(...)` to set the essentials' expanded state
- use `getExpander(...)` to get the Expander element
- use `getProperties(...)` to get an array of properties
- use `getLabelText(...)` to get the item label text
- use `hasMoveResource(...)` to get whether the item has move resource blade or not
- use `getLabelId(...)` to get the item label id
- use `getSide(...)` to get the item's side

```ts

        let essentialsBlade: EssentialsBlade;
        let essentials: Essentials;

        return BladeOpener.openSamplesExtensionBlade(
            essentialsBladeTitle,
            essentialsUriFragment,
            EssentialsBlade,
            waitTime)
            .then((blade) => blade.waitUntilLoaded(waitTime).then(() => blade))
            .then((blade: EssentialsBlade) => {
                essentialsBlade = blade;
                essentials = blade.essentials;
                return Q.all<any>([
                    essentials.countItems(),
                    essentials.getExpandedState(),
                    essentials.hasViewAll()
                ]);
            })
            .then((values: any[]) => {
                // Essentials item count, expanded state and viewAll button state check
                assert.equal(values[0], 10, "Essentials has 10 items at the beginning");
                assert.ok(values[1], "Essentials should be expanded by default");
                assert.ok(values[2], "Essentials has the ViewAll button at the beginning");
                essentials.getViewAllButton().click();
            })
            .then(() => essentials.countItems())
            .then((count: number) => {
                // Essentials item count after click ViewAll button
                assert.equal(count, 12, "Essentials has 12 items after adding dynamic properties");
                // Item label and properties check
                return Q.all([
                    itemAssertionHelper(essentials, {
                        label: "Resource group",
                        hasMoveResource: true,
                        side: "left",
                        properties: [
                            { type: EssentialsItemPropertyType.Function, value: "snowtraxpsx600" }
                        ]
                    }),
                    itemAssertionHelper(essentials, {
                        label: "Multi-line Item",
                        hasMoveResource: false,
                        side: "right",
                        properties: [
                            { type: EssentialsItemPropertyType.Text, value: "sample string value" },
                            { type: EssentialsItemPropertyType.Link, value: "Bing.com" }
                        ]
                    }),
                    itemAssertionHelper(essentials, {
                        label: "Status",
                        hasMoveResource: false,
                        side: "left",
                        properties: [
                            { type: EssentialsItemPropertyType.Text, value: "--" }
                        ]
                    })
                ]);
            })
            .then(() => essentials.getPropertyElementByValue("status will be changed")
                .then((propElement: testFx.PortalElement) =>  propElement.click()))
                // Item label and properties check after clicking "status will be changed"
                .then(() => itemAssertionHelper(essentials, {
                    label: "Status",
                    hasMoveResource: false,
                    side: "left",
                    properties: [
                        { type: EssentialsItemPropertyType.Text, value: "1 times clicked!" }
                    ]
                }))
            .then(() => essentials.getPropertyElementByValue("snowtraxpsx600")
                .then((propElement: testFx.PortalElement) =>  propElement.click()))
                // Item label and properties check after clicking "snowtraxpsx600"
                .then(() => itemAssertionHelper(essentials, {
                    label: "Status",
                    hasMoveResource: false,
                    side: "left",
                    properties: [
                        { type: EssentialsItemPropertyType.Text, value: "Resource group window is opened" }
                    ]
                }))
            .then(() => essentials.getExpander().click())
            .then(() => Q.all<any>([
                essentials.getExpandedState(),
                essentials.items.isDisplayed()
            ]))
            .then((values: any) => {
                // check expander state and items' visibilities after closing expander
                assert.ok(!values[0], "expander should be closed");
                values[1].forEach((state: boolean) => {
                    assert.ok(!state, "items should be invisible");
                });
                return essentials.getExpander().click()
                    .then(() => Q.all<any>([
                    essentials.getExpandedState(),
                    essentials.items.isDisplayed()
                ]));
            })
            .then((values: any) => {
                // check expander state and items' visibilities after opening expander
                assert.ok(values[0], "expander should be opened");
                values[1].forEach((state: boolean) => {
                    assert.ok(state, "items should be visible");
                });
            });
        
```


 ### Command

<a name="parts-action-bar"></a>
### Action Bar

<a name="parts-delete"></a>
### Delete

<a name="parts-styling-layout-regression-detection"></a>
### Styling / layout regression detection

To detect styling or layout regressions in your tests, use the `portal.detectStylingRegression` function.

    ```ts
    import testFx = require('MsPortalFx-Test');
    ...
    it("Can do action X", () => {    
        // Your test goes here, dummy test follows...
        return testFx.portal.goHome().then(() => {
            return testFx.portal.detectStylingRegression("MyExtension/Home");
        });
    });
    ```
    
The function will upload a screenshot to the "cicss" container of the storage account with the name, key, subscription id and resource group you will provide; 

Put the following values into your config.json:

```
    "CSS_REGRESSION_STORAGE_ACCOUNT_NAME":"myaccountname",
    "CSS_REGRESSION_STORAGE_ACCOUNT_SUBSCRIPTIONID":"mysubscriptionid",
    "CSS_REGRESSION_STORAGE_ACCOUNT_RESOURCE_GROUP":"mygresourcegroupname",
    "CSS_REGRESSION_STORAGE_ACCOUNT_KEY":"myaccountkey",
```

Put the storage account key into Windows Credential Manager using cmdkey i.e

```
    cmdkey /generic:CSS_REGRESSION_STORAGE_ACCOUNT_KEY /user:myaccountname /pass:myaccountkey
```

The screenshot will then be compared with a Last Known Good screenshot and, if different, a diff html file will be produced and uploaded to your storage account.
The link to that html file will be in the failed test's error message and includes a powershell script download to promote the Latest screenshot to Last Known Good.
The initial Last Known Good file is the screenshot taken when there was no Last Known Good screenshot to compare it to; i.e. to seed your test, just run it once.
    
For reference, here's the signature of the `portal.detectStylingRegression` function.
    
    ```ts
    ...
    
    /**
     * Takes a browser screenshot and verifies that it does not differ from LKG screenshot;
     * contains an assert that will fail on screenshot mismatch
     * @param uniqueID Test-specific unique screenshot identifier, e.g. "MyExtension/ResourceGroupTagsTest"
     * @returns Promise resolved once styling regression detection is done (so you can chain on it)
     */
    public detectStylingRegression(uniqueID: string): Q.Promise<void> {
        
    ```


<a name="parts-locators"></a>
### Locators

<a name="parts-consuming-updates"></a>
### Consuming Updates

<a name="parts-code-coverage"></a>
### Code Coverage

<a name="parts-code-coverage-interop-how-to-run-net-code-from-your-tests"></a>
#### Interop, how to run .NET code from your tests
edge.js



 
<a name="parts-mocking"></a>
### Mocking

<a name="parts-mocking-how-to-show-mock-data-into-the-portal"></a>
#### How to show mock data into the Portal

The [MsPortalFx-Mock](https://www.npmjs.com/package/msportalfx-mock) package provides a framework for showing mock data in the portal. It come with builtin support for mocking ARM data.

<a name="parts-mocking-how-to-show-mock-data-into-the-portal-mocking-arm"></a>
##### Mocking ARM

Mock data including providers, subscriptions, resource groups and resources can be defined in JSON object and used to initialize the ArmManager.

```ts

import { ArmProxy } from "MsPortalFx-Mock/lib/src/ArmProxy/ArmProxy";
import { ArmManager } from "MsPortalFx-Mock/lib/src/ArmProxy/ArmManager";

...

const mockData: ArmManager.MockData = {
    providers: [
        {
            namespace: "Providers.Test",
            resourceTypes: [
                {
                    resourceType: "type1",
                    locations: ["WestUS"],
                    apiVersions: ["2014-04-01"]
                },
                {
                    resourceType: "type2",
                    locations: ["East US", "East US 2", "North Central US"],
                    apiVersions: ["2014-04-01"]
                }
            ]
        }
    ],
    subscriptions: [
        {
            subscriptionId: "sub1",
            displayName: "Test sub 1",
            state: "Active",
            subscriptionPolicies: {
                locationPlacementId: "Public_2014-09-01",
                quotaId: "FreeTrial_2014-09-01"
            },
            resourceGroups: [
                {
                    name: "sub1rg1",
                    location: "WestUS",
                    tags: {
                        "env": "prod",
                        "ver": "4.6"
                    },
                    properties: {
                        lockState: "Unlocked",
                        provisioningState: "Succeeded",
                    },
                    resources: [
                        {
                            name: "sub1rg1r1",
                            location: "WestUS",
                            tags: {
                                "env": "prod"
                            },
                            type: "providers.test/type1",
                            kind: null,
                            nestedResources: [
                                {
                                    name: "nr1",
                                    tags: {},
                                    type: "nested"
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "sub1rg2",
                    location: "WestUS",
                    tags: {
                        "env": "prod",
                        "ver": "4.6"
                    },
                    properties: {
                        lockState: "Unlocked",
                        provisioningState: "Succeeded",
                    },
                    resources: [
                        {
                            name: "sub1rg2r1",
                            location: "WestUS",
                            tags: {
                                "env": "prod"
                            },
                            type: "providers.test/type2",
                            kind: null
                        }
                    ]
                }
            ]
        }
    ]
};

...

    let armManager = new ArmManager.Manager();
    armManager.initializeMockData(mockData);
    
```

The ArmProxy needs to initialized at the beginning of your tests with the ArmManager. The ArmProxy supports two modes for showing data 1) mock ONLY and 2) mock + actual.

You will need to initialize the portalContext->patches to the local server address setup by the proxy.

```ts

        return ArmProxy.create(nconf.get("armEndpoint"), 5000, armManager, null, true).then(proxy => {
            armProxy = proxy;
            testFx.portal.portalContext.patches = [proxy.patchAddress];
        });
        
```

The proxy can be disposed at the end of your tests.
```ts

        return testFx.portal.quit().then(() => ArmProxy.dispose(armProxy));
        
```


 
<a name="contributing"></a>
## Contributing

To enlist a contribution, use the following code.

`git clone https://github.com/azure/msportalfx-test.git`

Use Visual Studio or Visual Studio Code to build the source, as in the following code.

`Run ./scripts/Setup.cmd`

To setup the tests you need the following.

1. Create a dedicated test subscription that is used for tests only

1. Locate a user that has access to the test subscription only

1. Create an  AAD Application and service principal with access, as in the following code.

    ```powershell 
        msportalfx-test\scripts\Create-AdAppAndServicePrincipal.ps1 
            -TenantId "someguid" 
            -SubscriptionId "someguid" 
            -ADAppName "some ap name" 
            -ADAppHomePage "https://somehomepage" 
            -ADAppIdentifierUris "https://someidentiferuris" 
            -ADAppPassword $someAdAppPassword 
            -SPRoleDefinitionName "Reader" 
    ```

1. Run `setup.cmd` in the portal repo, or run run `powershell.exe -ExecutionPolicy Unrestricted -file "%~dp0\Setup-OneCloud.ps1" -DeveloperType Shell %*`. You will use the details of the created service principal in the next steps.  

**NOTE**: Store the password for the following procedures in **KeyVault**,  the secret store, or some other safe location. It is not retrieveable by using the commandlets. 

1. Open **test\config.json** and enter appropriate values for:

    ```
    "aadAuthorityUrl": "https://login.windows.net/TENANT_ID_HERE",
    "aadClientId": "AAD_CLIENT_ID_HERE",
    "subscriptionId": "SUBSCRIPION_ID_HERE",
    "subscriptionName": "SUBSCRIPTION_NAME_HERE",
    ```

1. The account that corresponds to the specified credentials should have at least contributor access to the subscription specified in the **config.json** file. The account must be a Live Id account. It cannot be an account that requires two factor authentication (like most @microsoft.com accounts). 

1. Install the Portal SDK from [http://aka.ms/portalfx/download](http://aka.ms/portalfx/download), then open Visual Studio and create a new Portal Extension from File --> New Project --> Azure Portal --> Azure Portal Extension. Name this project **LocalExtension** so that the extension itself is named LocalExtension, which is what many of the tests expect. Then click CTRL+F5 to host the extension in IIS Express.

1. The *Can Find Grid Row* and the *Can Choose A Spec* tests require special configuration described in the tests themselves.

1. Many of the tests currently rely on the CloudService extension. 

<!-- TODO: Determine whether the dependency has been removed."We are working to remove this dependency." -->

For more information about AAD Applications and Service Principals, see [https://aka.ms/portalfx/serviceprincipal](https://aka.ms/portalfx/serviceprincipal).  

 
<a name="running-test-scenarios"></a>
## Running Test Scenarios

Open a command prompt in this directory and run:

```
	npm install --no-optional
	npm test
```

<a name="running-test-scenarios-authoring-documents"></a>
### Authoring documents

- When adding a document create a new *.md file in /docs e.g /docs/foo.md
- Author the document using [markdown syntax](https://daringfireball.net/projects/markdown/syntax)
- Inject content from your documents into the master template in /docs/TEMPLATE.md using [gitdown syntax](https://github.com/gajus/gitdown) E.g


    ```
     {"gitdown": "include", "file": "./foo.md"}
    ```


- To ensure all code samples remain up to date we extended gitdown syntax to support code injection. To reference source code in your document directly from a *.ts file use the include-section extension E.g


    ```
     {"gitdown": "include-section", "file": "../test/BrowseResourceBladeTests.ts", "section": "tutorial-browse-context-menu#step2"}
    ```


    this will find all content in ../test/BrowseResourceBladeTests.ts that is wrapped in comments //tutorial-browse-context-menu#step2 and will inject them directly into the document. see /docs/tutorial-browse-context-menu.md for a working example

<a name="running-test-scenarios-generating-the-docs"></a>
### Generating the docs

You can generate the documentation in one of two ways

- As part of pack the `docs` script from package.json is run to ensure that all docs are up to date

    ```
    npm pack
    ```

-  Or, While you are writing docs you may want to check that your composition or jsdoc for API ref is generating as expected to do this you can execute run the following 

    ```
    npm run docs
    ```

the output of the composed TEMPLATE.md will be written to ./README.md and the generated API reference from your jsdocs will be written to /docs/apiref.md

<a name="running-test-scenarios-to-submit-your-contribution"></a>
### To submit your contribution

Submit a pull request to the repo [http://aka.ms/msportalfx-test](http://aka.ms/msportalfx-test)

<a name="running-test-scenarios-questions"></a>
### Questions?

Send an email to <a href="mailto:ibizadiscuss@microsoft.com">ibizadiscuss@microsoft.com</a>.


