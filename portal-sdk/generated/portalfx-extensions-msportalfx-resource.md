<a name="create-and-test-a-resource"></a>
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

<a name="create-and-test-a-resource-entire-test-script"></a>
#### Entire test script

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
