## Overview

MsPortalFx-Test is an end-to-end test framework that runs tests against the Microsoft Azure Portal. It uses an open source contribution model to focus on partner needs instead of  internal Portal needs. It is  distributed independently from the SDK in an  effort to allow developers to develop tests in the same language as the extension.
It interacts with the Portal  as a user would, and helps developers make performant and robust extensions when they strive for zero breaking changes to partner team CI.

* [General Architecture](#general-architecture)

* [Installation](#installation)

* [Write a test](#write-a-test)

* [Configure, compile and run](#configure,-compile-and-run)

### General Architecture

**MsPortalFx-Test** is arranged into three layers of abstraction.  The names of the layers may not be consistent in all instances, but the general idea is the same.  There may also be some future refactoring to easily differentiate between the layers.

1. Controls layer 

 The controls layer contains the basic controls used in the Portal, like blades, checkboxes, textboxes, and others.  It is not used directly by tests in most cases, because it is mainly for composing the action layer and the  test layers. It is built on webdriver primitives and there is little or no retry logic.  

 1. Action layer 

The action layer performs an action and verifies whether it was successful. It can retry the action if necessary. It is  used in writing tests like `portal.openBrowseBlade`. It is built upon the controls layer.

1. Test layer 

  The test layer contains wrappers that are used for testing common functionality. It is built upon the action and control layers, and is used in writing business-case tests or other forms of suite-test functionality, like `parts.canPinAllBladeParts`. It can re-run the test if necessary, and throws an exception if the test or verification fails.  
   
### Installation

Your computer should have the most recent editions of operating systems and other software installed, as specified in [top-extensions-install-software.md](top-extensions-install-software.md).

In addition, you should perform the following verifications to ensure that your development environment is ready for the msportalfx-test suite.

* node version is v4.5 or v5.1 using `node -v`

* npm version is 3.10.6 or greater using `npm -v`. 
    
    To update npm version use `npm install npm -g`

* tsc version is 1.8.10 or greater, but less than Typescript 2+, by using `tsc -v`.

Then, open a command prompt and create a directory for your test files, by using the following command:  `md e2etests`. Switch to the new directory and install the **MsPortalFx-Test** module by using `npm`, as in the following command.

```
	cd e2etests
	npm install msportalfx-test --no-optional
```

The **MsPortalFx-Test** module includes useful TypeScript definitions and dependencies. You can make them available to your tests by using the **Typescript Definition Manager** located at [https://www.npmjs.com/package/typings](https://www.npmjs.com/package/typings). It can be installed by using the following command: `npm install typings -g`.

Now you can install the provided definitions by performming the following steps.

1. Copy the `typings.json` file from the `node_modules/msportalfx-test/typescript` folder to your test root directory.

1. Navigate to your test root directory.

1. Install the definitions with the following command: `typings install`.

**MsPortalFx-Test** needs a WebDriver server to drive the browser. Currently, only the **ChromeDriver** that is located at [https://sites.google.com/a/chromium.org/chromedriver](https://sites.google.com/a/chromium.org/chromedriver) is supported, therefore it should be downloaded and placed in your computer's PATH.  Alternately, it can be installed from the Web site located at [chromedriver Node module](https://www.npmjs.com/package/chromedriver) by using the command `npm install chromedriver`.

You may also need the C++ compiler that is included in Visual Studio or some other development environment.
 
### Write a test

This test scenario is that the user opens the Cloud Services Browse blade, filters the list of cloud services, checks that the grid has only one row after the filter, selects the only row and waits for the correct blade to open. Finally, the browser is closed when the user is done. The test uses the **Mocha** testing framework that is located at [https://mochajs.org/](https://mochajs.org/), but you can use any framework that supports **Node.js** modules and promises. The **Mocha** **Typescript** definitions were installed when **typings** was installed, but if you need to install Mocha, you can do so by using the following command: `npm install mocha`.

This test requires an existing cloud service, so if you need one, you can create a new cloud service by using the site located at [https://ms.portal.azure.com/#create/Microsoft.CloudService](https://ms.portal.azure.com/#create/Microsoft.CloudService). Make a note of the DNS name of your cloud service for later use. Also, you need to create a **portaltests.ts** file in your `e2etests` directory and paste the following Typescript code into it. 

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

The **Windows Credential Manager** needs user credentials for the  **MsPortalFx-Test** suite. These should be the credentials of a user that already has an active Azure subscription. Use the following command in the command window to create the credentials.

```
    cmdkey /generic:msportalfx-test/johndoe@outlook.com/signInPassword /user:johndoe@outlook.com /pass:somePassword
```

After the **MsPortalFx-Test** module is imported and the credentials are specified for the user, we can use the Portal object to drive the test. The scenario completes when the call to `quit()` closes the browser.

### Configure, compile and run

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

### Output

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

**NOTE**: If you receive compilation errors on the `node.d.ts` file, verify that the `tsc` version you are using is 1.8.x by running the following command: `tsc --version`. If the version is incorrect, then you may need to adjust the path variables or directly call the correct version of tsc.exe.  

### Updating MsportalFx-Test

To stay current with the latest changes, we recommend updating whenever a new version of **MsportalFx-Test** is released.  The `npm install` command will automatically pull the latest version of `msportalfx-test`. 
 
**NOTE**: Remember to copy the **Typescript** definition files in the `*typings\*` folder from the updated version that is located at `*\node_modules\msportalfx-test\typescript*`.  

### More Examples

Examples and test scripts are located at [https://github.com/Azure/msportalfx-test/tree/master/test](https://github.com/Azure/msportalfx-test/tree/master/test), and in various folders located at  [https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx), including `src/SDK/AcceptanceTests/Extensions/SamplesExtension/Tests`.

If you do not have access to the AzureUX-PortalFx dashboard, you can enlist by following the instructions specified in [top-onboarding.md](top-onboarding.md). 

### Running tests in Visual Studio
 
Your computer should have the most recent editions of operating systems and other software installed, as specified in [top-extensions-install-software.md](top-extensions-install-software.md).


1. Launch **Visual Studio 2015** and navigate to `File -> New -> Project`. In the new project dialog, select `Installed ->  Templates -> TypeScript`. Select the `Node.js -> From Existing Node.js code*` project type, and give it a unique name.  The name of the project typically matches the solution name. The location can be the same as any other **Visual Studio** project directory.  Then, click the checkbox next to ```Create directory for solution```.  Then, click the ```OK``` button, as described in the following image.

    ![alt-text](../media/msportalfx-test/NewTypeScriptNodeJsExistingProject.png "NewTypeScriptNodeJsExistingProject")

1. Open the properties on the **TypeScript** file and set the TestFramework property to “mocha”.

    ![alt-text](../media/msportalfx-test/FileSetTestFrameworkPropertyMocha.png "FileSetTestFrameworkPropertyMocha")

1. Now, you should be able to build your test and view it in the Test Explorer.  If you do not see your tests, make sure that there are no build errors.  You can also try restarting Visual Studio to see if that makes them show up.  

  {"gitdown": "include-file", "file": "../templates/msportalfx-test-procedure-installation.md"}

  {"gitdown": "include-file", "file": "../templates/msportalfx-test-sideloading.md"}

  {"gitdown": "include-file", "file": "../templates/msportalfx-test-running.md"}

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

