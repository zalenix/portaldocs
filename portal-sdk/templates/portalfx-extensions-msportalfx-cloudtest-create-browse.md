
### Running a test in cloudtest

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
### Create functions for test scenarios

Test scenarios will open blades that are in local and deployed gallery packages.

#### Opening from a deployed gallery package

The `portal.openGalleryCreateBlade` method opens and navigates to a create blade gallery package that was previously deployed to the Azure Marketplace.  The returned promise will resolve with the CreateBlade defined by that gallery package, as in the following example.

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

#### Opening from a local gallery package

The `portal.openGalleryCreateBladeFromLocalPackage` method opens and navigates to a create blade gallery package that is sideloaded locally into the Portal along with your extension. The returned promise will resolve with the CreateBlade defined by that gallery package, as in the following example.

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

#### Validation States

The `FormElement` object exposes two useful functions for working with the validation state of controls.

* The `getValidationState` method

    The function `getValidationState` returns a promise that resolves with the current state of the control, as in the following code.

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

* The `waitOnValidationState` function

    The function `waitOnValidationState(someState, optionalTimeout)` returns a promise that resolves when the current state of the control is equivalent to the state represented by the `someState` parameter.  This is typically used when an extension is performing server-side validation and the control remains in a pending state for the duration of the network transmission.

    ```ts
    import TestFx = require('MsPortalFx-Test');
    ...

    //change the value to initiate validation
    .then(() => this.name.sendKeys(nameTxt + webdriver.Key.TAB))
    //wait for the control to reach the valid state
    .then(() => this.name.waitOnValidationState(testFx.Constants.ControlValidationState.valid))
    ...

    ```

### Browse functions for test scenarios

The following code that is located in `MsPortalFx.Tests.Browse` tests the context menu in Browse and shows the commands used by your extension.

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

The following code that is located in `MsPortalFx.Tests.Browse` tests the grid in Browse. It displays the expected default columns for your extension resource.

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

The following code that is located in `MsPortalFx.Tests.Browse` asserts  resource-specific columns. After the resource is  selected in browse, the `canSelectResourceColumns` function displays the columns in the browse grid.  

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



