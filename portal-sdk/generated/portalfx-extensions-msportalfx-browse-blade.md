
<a name="write-a-browse-blade-test"></a>
## Write a browse blade test

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

<a name="write-a-browse-blade-test-configure-compile-and-run"></a>
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

<a name="write-a-browse-blade-test-output"></a>
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

**NOTE**: If you receive compilation errors on the `node.d.ts` file, verify that the `tsc` version you are using is 1.8.x by running the following command: `tsc --version`. If the version is incorrect, then you may need to adjust the path variables or directly call the correct version of `tsc.exe`.  

