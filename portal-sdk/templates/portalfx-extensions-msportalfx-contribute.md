
## Contributing

Enlisting a contribution makes it available to other extensions within the Azure Portal. The following steps are used to enlist a contribution.

1. Download **msportalfx-test** tools by using the following command.

    `git clone https://github.com/azure/msportalfx-test.git`

1. Build the source

    Use **Visual Studio** or **Visual Studio Code** to build the source. Then run it by using `Run ./scripts/Setup.cmd`.
    
    Create a new Portal Extension from `File --> New Project --> Azure Portal --> Azure Portal Extension`. Name this project **LocalExtension** so that the extension itself is named `LocalExtension`, which is what many of the tests expect. Then click CTRL+F5 to host the extension in IIS Express.

1. Set up the tests by performing the following.

    1. Create a dedicated test subscription that is used for tests only

    1. Locate a user that has access to the test subscription only

    1. Create an AAD Application and service principal with access, as in the following code.

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

        <!-- TODO: Determine whether the dependency has been removed."We are working to remove this dependency." -->

        For more information about AAD Applications and Service Principals, see [https://aka.ms/portalfx/serviceprincipal](https://aka.ms/portalfx/serviceprincipal).  

    1. Run `setup.cmd` in the portal repo, or run `powershell.exe -ExecutionPolicy Unrestricted -file "%~dp0\Setup-OneCloud.ps1" -DeveloperType Shell %*`. You will use the details of the created service principal in the next steps.  

       **NOTE**: Store the password for the following procedures in **KeyVault**,  the secret store, or some other safe location, as specified in [top-extensions-hosting-service-advanced.md#keyvault](top-extensions-hosting-service-advanced.md#keyvault). It is not retrievable by using the commandlets. 

    1. Open **test\config.json** and enter appropriate values for the following parameters.

        ```
        "aadAuthorityUrl": "https://login.windows.net/TENANT_ID_HERE",
        "aadClientId": "AAD_CLIENT_ID_HERE",
        "subscriptionId": "SUBSCRIPION_ID_HERE",
        "subscriptionName": "SUBSCRIPTION_NAME_HERE",
        ```

        The account specified in `aadClientId` should have at least contributor access to the subscription specified in the `subscriptionId` parameter. The account must be a Live Id account, and cannot require two-factor authentication.