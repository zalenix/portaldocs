<a name="overview"></a>
## Overview

<!-- TODO: Compare doc against list of items to update in 
https://stackoverflow.microsoft.com/questions/82011/msportalfx-test-documentation-issues
-->
There are many different ways to test an extension.

* In the development environment, you can test from Visual Studio or from the command line. 

* In the Windows Azure Engineering System (WAES), you can use the procedures that are described in [http://aka.ms/WAES](http://aka.ms/WAES). 

* If you run **mocha** in **Visual Studio** with the `--debug-brk` flag, you can press F5 and the project will attach to a debugger.

* There are instructions that describe how to set up test run parallelization in **Jenkins**.

* You can use The **MsPortalFx-Test** framework that runs tests against the Microsoft Azure Portal. 

**MsPortalFx-Test** is an end-to-end test framework that runs tests against the Microsoft Azure Portal. It tests extension interactions with user behavior, moreso than extension interactions with the Portal.  Its open source contribution model focuses on partner needs instead of internal Portal needs. It is distributed independently from the SDK to allow developers to develop tests in the same language as the extension.

The test framework interacts with the Portal as a user would, and helps developers make performant and robust extensions when they decrease breaking changes to partner team CI.

<a name="overview-general-architecture"></a>
### General Architecture

**MsPortalFx-Test** is arranged into three layers of abstraction. The names of the layers may not be consistent in all instances, but the general idea is the same.  There may also be some future refactoring to easily differentiate between the layers.

1. Controls layer

    The controls layer contains the basic controls used in the Portal, like blades, checkboxes, textboxes, and others.  It is not used directly by tests in most cases, because it is mainly for composing the action layer and the  test layers. It is built on webdriver primitives and there is little or no retry logic.  

 1. Actions layer

    The actions layer performs an action and verifies whether it was successful. It can retry the action if necessary. It is  used in writing tests like `portal.openBrowseBlade`. It is built upon the controls layer.

1. Test layer

    The test layer contains wrappers that are used for testing common functionality. It is built upon the action and control layers, and is used in writing business-case tests or other forms of suite-test functionality, like `parts.canPinAllBladeParts`. It can re-run the test if necessary, and throws an exception if the test or verification fails.

The following table contains several topics that are associated with running  **MsPortalFx-Test** tests.

| Document | Description |
| -------- | ----------- |
| [portalfx-extensions-msportalfx-install-and-test.md](portalfx-extensions-msportalfx-install-and-test.md) | Installation and Visual Studio Testing |
| [portalfx-extensions-msportalfx-npm-tests.md](portalfx-extensions-msportalfx-npm-tests.md) | Running npm tests |
| [portalfx-extensions-msportalfx-cloudtest-create-browse.md](portalfx-extensions-msportalfx-cloudtest-create-browse.md) | Running tests in cloudtest.  Create and Browse testing |
| [portalfx-extensions-msportalfx-browse-blade.md](portalfx-extensions-msportalfx-browse-blade.md) |  Write a browse blade test |
| [portalfx-extensions-msportalfx-resource.md](portalfx-extensions-msportalfx-resource.md) | Create and test a resource |
| [portalfx-extensions-msportalfx-blades.md](portalfx-extensions-msportalfx-blades.md) | Testing with blades |
| [portalfx-extensions-msportalfx-mock.md](portalfx-extensions-msportalfx-mock.md) | Creating tests that use mockup ARM data  |
| [portalfx-extensions-msportalfx-components.md](portalfx-extensions-msportalfx-components.md) | Parts, components and other topics  |

When testing is complete, you can send a pull request by using the procedures specified in [top-extensions-publishing.md](top-extensions-publishing.md).

<a name="overview-generate-internal-documentation"></a>
### Generate internal documentation

<!-- TODO:  Determine whether this sentence is accurate.  If not, 
1)  Is there any documentation to generate
2)  Where will it be located after it is generated
3)  Are there any reminders while the code is being created that this 
    documentation should exist
-->

If there is documentation that should accompany your code, it should be generated  in a manner that includes it into the `.azpkg` file. This documentation is separate from the Azure documentation that is located at [http://aka.ms/portalfx/docs](http://aka.ms/portalfx/docs).

You can generate the documentation in one of two ways.

* Run the `docs` script from `package.json` to ensure that all docs are up to date as part of the packaging process.  Use the following command.

    ```
    npm pack
    ```

* While you are authoring docs, you may want to check that your composition or jsdoc for API ref is generating as expected.   Use the following command.

    ```
    npm run docs
    ```

    The output of the composed `TEMPLATE.md` file will be written to the `./README.md` file, and the generated API reference from your jsdocs will be written to `/docs/apiref.md`.


If you have questions, you can send an email to <a href="mailto:ibizadiscuss@microsoft.com">ibizadiscuss@microsoft.com</a>.

<a name="overview-more-examples"></a>
### More Examples

Examples and test scripts are located at [https://github.com/Azure/msportalfx-test/tree/master/test](https://github.com/Azure/msportalfx-test/tree/master/test), and in various folders located at  [https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx), including `src/SDK/AcceptanceTests/Extensions/SamplesExtension/Tests`.

If you do not have access to the AzureUX-PortalFx dashboard, you can enlist by following the instructions specified in [top-onboarding.md](top-onboarding.md). 

 
The page you requested has moved to  [portalfx-extensions-msportalfx-components.md#parts](portalfx-extensions-msportalfx-components.md#parts).



 
<a name="how-to-show-mock-arm-data-in-the-portal"></a>
## How to show mock ARM data in the Portal

Mockup data includes items like providers, subscriptions, resource groups and resources that can be defined in JSON objects and used to initialize the ArmManager. The **MsPortalFx-Mock**  package that is located at [https://www.npmjs.com/package/msportalfx-mock](https://www.npmjs.com/package/msportalfx-mock) provides a framework for displaying mock data in the Portal. It come with builtin support for mocking ARM data. 


At the beginning of your tests, the extension should initialize the `ArmProxy` with the `ArmManager`. The `ArmProxy` supports two modes; it can show mock and actual data, or it can show mock data only, as in the following example.

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

In the following sample, the test initializes the `portalContext->patches` to the local server address that was set up by the proxy.

```ts

        return ArmProxy.create(nconf.get("armEndpoint"), 5000, armManager, null, true).then(proxy => {
            armProxy = proxy;
            testFx.portal.portalContext.patches = [proxy.patchAddress];
        });
        
```

Remember to dispose of the proxy at the end of the test, as in the following example.
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

