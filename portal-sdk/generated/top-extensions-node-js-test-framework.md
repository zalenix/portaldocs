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

* The *Can Find Grid Row* and the *Can Choose A Spec* tests require special configuration, as specified in [portalfx-extensions-msportalfx-resource.md](portalfx-extensions-msportalfx-resource.md) and [portalfx-extensions-msportalfx-browse-blade.md](portalfx-extensions-msportalfx-browse-blade.md).

* Many tests currently rely on the CloudService extension, as specified in [portalfx-extensions-msportalfx-cloudtest-create-browse.md](portalfx-extensions-msportalfx-cloudtest-create-browse.md).

* You can use The **MsPortalFx-Test** framework that runs tests against the Microsoft Azure Portal. 

**MsPortalFx-Test** is an end-to-end test framework that runs tests against the Microsoft Azure Portal. It tests extension interactions with user behavior, moreso than extension interactions with the Portal.  Its open source contribution model focuses on partner needs instead of internal Portal needs. It is distributed independently from the SDK to allow developers to develop tests in the same language as the extension.

The test framework interacts with the Portal as a user would, and helps developers make performant and robust extensions when they decrease breaking changes to partner team CI.

The test framework searches for a `config.json` file in the current working directory, which is typically the directory from which  the test is invoked.  If the file is not found, then it will check the parent folder for the file.


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
| [portalfx-extensions-msportalfx-mocha-tests.md](portalfx-extensions-msportalfx-mocha-tests.md) | Running npm tests with mocha |
| [portalfx-extensions-msportalfx-cloudtest-create-browse.md](portalfx-extensions-msportalfx-cloudtest-create-browse.md) | Running tests in cloudtest.  Create and Browse testing |
| [portalfx-extensions-msportalfx-browse-blade.md](portalfx-extensions-msportalfx-browse-blade.md) |  Write a browse blade test |
| [portalfx-extensions-msportalfx-resource.md](portalfx-extensions-msportalfx-resource.md) | Create and test a resource |
| [portalfx-extensions-msportalfx-blades.md](portalfx-extensions-msportalfx-blades.md) | Testing with blades |
| [portalfx-extensions-msportalfx-mock.md](portalfx-extensions-msportalfx-mock.md) | Creating tests that use mockup ARM data  |
| [portalfx-extensions-msportalfx-components.md](portalfx-extensions-msportalfx-components.md) | Parts, components and other topics  |
| [portalfx-extensions-msportalfx-contribute.md](portalfx-extensions-msportalfx-contribute.md) | Enlisting a contribution into **msportalfx-test**   |

**NOTE**: `https://github.com/azure/msportalfx-test.git` contains a `README.md` file that is similar to this document. This document supercedes the `README.md` file  in the **msportalfx-test** download location.

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

<a name="overview-portalcontext"></a>
### PortalContext

This file contains configuration values that are used by the test framework to establish the extension context. Some values are described in  [https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities](https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities). Test developers can set values programmatically, as in the following example, instead of storing them in the `config.json` file. 

**NOTE**: Never store passwords in the `config.json` file.

```ts
﻿import TestExtension = require("./TestExtension");
import Feature = require("./Feature");
import BrowserResolution = require("./BrowserResolution");
import Timeout = require("./Timeout");

/**
 * Represents The set of options used to configure a Portal instance.
 */
interface PortalContext {
    /**
     * The set of capabilities enabled in the webdriver session. 
     * For a list of available capabilities, see https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
     */    
    capabilities: {
        /**
         * The name of the browser being used; should be one of {chrome} 
         */
        browserName: string;

        /**
         * Chrome-specific supported capabilities. 
         */
        chromeOptions: {
            /**
             * List of command-line arguments to use when starting Chrome.
             */
            args: string[]
        };

        /**
         * The desired starting browser's resolution in pixels.
         */
        browserResolution: BrowserResolution;
    },
    /**
     * The path to the ChromeDriver binary. 
     */
    chromeDriverPath?: string;
    /**
     * The url of the Portal.
     */
    portalUrl: string;
    /**
     * The url of the page where signin is performed.
     */
    signInUrl?: string;
    /**
     * Email of the user used to sign in to the Portal.
     */
    signInEmail?: string;
    /**
     * Password of the user used to sign in to the Portal.
     */
    signInPassword?: string;    
    /**
     * The set of features to enable while navigating within the Portal.
     */
    features?: Feature[];
    /**
     * The list of patch files to load within the Portal.
     */
    patches?: string[];
    /**
     * The set of extensions to side load while navigating within the Portal.
     */
    testExtensions?: TestExtension[];
    /**
     * The set of timeouts used to override the default timeouts.
     * e.g. 
     * timeouts: {
     *      timeout: 15000  //Overrides the default short timeout of 10000 (10 seconds).
     *      longTimeout: 70000 //Overrides the default long timetout of 60000 (60 seconds).
     * }
     */
    timeouts?: Timeout;
}

export = PortalContext;
```

<a name="overview-more-examples"></a>
### More Examples

Examples and test scripts are located at [https://github.com/Azure/msportalfx-test/tree/master/test](https://github.com/Azure/msportalfx-test/tree/master/test), and in various folders located at  [https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx), including `src/SDK/AcceptanceTests/Extensions/SamplesExtension/Tests`.

If you do not have access to the AzureUX-PortalFx dashboard, you can enlist by following the instructions specified in [top-onboarding.md](top-onboarding.md). 