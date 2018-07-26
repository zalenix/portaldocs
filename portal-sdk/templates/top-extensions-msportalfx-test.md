## Overview

There are many different ways to test an extension.  In the development environment, you can test from Visual Studio or from the command line.  In the Windows Azure Engineering System (WAES), you can use the procedures that are described in [http://aka.ms/WAES](http://aka.ms/WAES). If you run **mocha** with the `--debug-brk` flag, you can press F5 and the project will attach to a debugger. 
There are instructions that describe how to set up test run parallelization in **Jenkins**.

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

### General Architecture

**MsPortalFx-Test** is arranged into three layers of abstraction. The names of the layers may not be consistent in all instances, but the general idea is the same.  There may also be some future refactoring to easily differentiate between the layers.

1. Controls layer

    The controls layer contains the basic controls used in the Portal, like blades, checkboxes, textboxes, and others.  It is not used directly by tests in most cases, because it is mainly for composing the action layer and the  test layers. It is built on webdriver primitives and there is little or no retry logic.  

 1. Actions layer 

    The actions layer performs an action and verifies whether it was successful. It can retry the action if necessary. It is  used in writing tests like `portal.openBrowseBlade`. It is built upon the controls layer.

1. Test layer 

    The test layer contains wrappers that are used for testing common functionality. It is built upon the action and control layers, and is used in writing business-case tests or other forms of suite-test functionality, like `parts.canPinAllBladeParts`. It can re-run the test if necessary, and throws an exception if the test or verification fails.  

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

## Running tests in Visual Studio

Your computer should have the most recent editions of operating systems and other software installed, as specified in [top-extensions-install-software.md](top-extensions-install-software.md).

1. Launch **Visual Studio 2015** and navigate to `File -> New -> Project`. In the new project dialog, select `Installed ->  Templates -> TypeScript`. Select the `Node.js -> From Existing Node.js code*` project type, and give it a unique name.  The name of the project typically matches the solution name. The location can be the same as any other **Visual Studio** project directory.  Then, click the checkbox next to ```Create directory for solution```.  Then, click the ```OK``` button, as described in the following image.

    ![alt-text](../media/msportalfx-test/NewTypeScriptNodeJsExistingProject.png "NewTypeScriptNodeJsExistingProject")

1. Open the properties on the **TypeScript** file and set the TestFramework property to “mocha”.

    ![alt-text](../media/msportalfx-test/FileSetTestFrameworkPropertyMocha.png "FileSetTestFrameworkPropertyMocha")

1. Now, you should be able to build your test and view it in the Test Explorer.  If you do not see your tests, make sure that there are no build errors.  You can also try restarting **Visual Studio** to determine whether the restart will cause the IDE to display the test results.  
 
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

## Debugging

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

### lambda functions

Typescript lambda functions, also known as "the fat arrow" or "() => {}", capture the "this" variable from the surrounding context.  This can cause problems when trying to access Mocha's current test state.  See [arrow functions](https://basarat.gitbooks.io/typescript/content/docs/arrow-functions.html) for details.


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

### Callstack

### Test output artifacts

        
---------------------------

### More Examples

Examples and test scripts are located at [https://github.com/Azure/msportalfx-test/tree/master/test](https://github.com/Azure/msportalfx-test/tree/master/test), and in various folders located at  [https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx), including `src/SDK/AcceptanceTests/Extensions/SamplesExtension/Tests`.

If you do not have access to the AzureUX-PortalFx dashboard, you can enlist by following the instructions specified in [top-onboarding.md](top-onboarding.md). 
--------------


  {"gitdown": "include-file", "file": "../templates/msportalfx-test-debugging.md"}

   {"gitdown": "include-file", "file": "../templates/msportalfx-test-scenarios-localization.md"}

   {"gitdown": "include-file", "file": "../templates/msportalfx-test-scenarios-user-management.md"}

   {"gitdown": "include-file", "file": "../templates/msportalfx-test-scenarios-create.md"}

 {"gitdown": "include-file", "file": "../templates/msportalfx-test-scenarios-browse.md"}

 {"gitdown": "include-file", "file": "../templates/msportalfx-test-scenarios-blades.md"}

 {"gitdown": "include-file", "file": "../templates/msportalfx-test-scenarios-parts.md"}

 {"gitdown": "include-file", "file": "../templates/msportalfx-test-scenarios-several.md"}

 {"gitdown": "include-file", "file": "../templates/msportalfx-test-scenarios-mocking.md"}

 {"gitdown": "include-file", "file": "../templates/msportalfx-test-scenarios-contributing.md"}

 {"gitdown": "include-file", "file": "../templates/msportalfx-test-scenarios-running.md"}

