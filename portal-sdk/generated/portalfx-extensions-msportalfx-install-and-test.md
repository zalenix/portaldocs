
<a name="installation"></a>
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

1. Copy the `typings.json` file from the `node_modules/msportalfx-test/typescript` folder to your test root directory. Remember to copy the **Typescript** definition files in the `*typings\*` folder from the updated version that is located at `*/node_modules/msportalfx-test/typescript*`.  

1. Navigate to your test root directory.

1. Install the definitions with the following command: `typings install`.

**MsPortalFx-Test** needs a WebDriver server to drive the browser. Currently, only the **ChromeDriver** that is located at [https://sites.google.com/a/chromium.org/chromedriver](https://sites.google.com/a/chromium.org/chromedriver) is supported, therefore it should be downloaded and placed in your computer's PATH.  Alternately, it can be installed from the Web site located at [chromedriver Node module](https://www.npmjs.com/package/chromedriver) by using the command `npm install chromedriver`.

You may also need the C++ compiler that is included in Visual Studio or some other development environment.

<a name="running-tests-in-visual-studio"></a>
### Running tests in Visual Studio

Your computer should have the most recent editions of operating systems and other software installed, as specified in [top-extensions-install-software.md](top-extensions-install-software.md).

1. Launch **Visual Studio 2015** and navigate to `File -> New -> Project`. In the new project dialog, select `Installed ->  Templates -> TypeScript`. Select the `Node.js -> From Existing Node.js code*` project type, and give it a unique name.  The name of the project typically matches the solution name. The location can be the same as any other **Visual Studio** project directory.  Then, click the checkbox next to ```Create directory for solution```.  Then, click the ```OK``` button, as described in the following image.

    ![alt-text](../media/msportalfx-test/NewTypeScriptNodeJsExistingProject.png "NewTypeScriptNodeJsExistingProject")

1. Open the properties on the **TypeScript** file and set the TestFramework property to “mocha”.

    ![alt-text](../media/msportalfx-test/FileSetTestFrameworkPropertyMocha.png "FileSetTestFrameworkPropertyMocha")

1. Now, you should be able to build your test and view it in the Test Explorer.  If you do not see your tests, make sure that there are no build errors.  You can also try restarting **Visual Studio** to determine whether the restart will cause the IDE to display the test results.  


<a name="check-test-results"></a>
### Check test results

<!-- TODO: Determine whether the screen shots work whether or not the developer is using the **mocha** test runner. -->

Screenshots are a handy way to help diagnose issues. The following code takes a screenshot of what is currently displayed in the browser.  

```ts
//1. import test fx
import testFx = require('MsPortalFx-Test');
...
    var screenshotPromise = testFx.portal.takeScreenshot(ScreenshotTitleHere);
```

Sometimes it is useful to get the result of currently running tests.  The following code takes a screenshot only when the test fails.


```ts
import testFx = require('MsPortalFx-Test');
...
    afterEach(function () {
        if (this.currentTest.state === "failed") {
            return testSupport.GatherTestFailureDetails(this.currentTest.title);
        }
    });

```

<a name="capture-browser-console-output"></a>
### Capture browser console output

Console logs of the browser that was used in testing can be used to identify reasons for test failure. They can be captured at a specified level of error, or at all levels using the `LogLevel` parameter. Error levels include warnings, errors, and other severity levels.

The `getBrowserLogs` method returns a `Promise` of type `string[]` which contains the array of logs when resolved. The array can be  viewed during debug or written to the test console for later analysis. The following example demonstrates how to call the `getBrowserLogs` method to work with the result. 

```ts
import testFx = require('MsPortalFx-Test');
...

        return testFx.portal.goHome(20000).then(() => {
            return testFx.portal.getBrowserLogs(LogLevel.All);
        }).then((logs) => {
            assert.ok(logs.length > 0, "Expected to collect at least one log.");
        });

```

<a name="lambda-functions"></a>
### lambda functions

Typescript lambda functions, also known as "the fat arrow" or "() => {}", capture the "this" variable from the surrounding context.  This can cause problems when trying to access Mocha's current test state. For more information, see [http://aka.ms/portalfx/arrowfunctions](http://aka.ms/portalfx/arrowfunctions).

<!-- TODO:  Determine whether the folloiwng sections that were along for the ride are still needed. -->

<a name="lambda-functions-callstack"></a>
#### Callstack

This section was never written.

<a name="lambda-functions-test-output-artifacts"></a>
#### Test output artifacts

This section was never written.

<a name="lambda-functions-localization"></a>
#### Localization

This section intentionally left blank.

<a name="lambda-functions-user-management"></a>
#### User Management

This section intentionally left blank.


