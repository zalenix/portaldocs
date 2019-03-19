## EV2 Integration with hosting service

**NOTE**: This section of the document assumes that the reader has reviewed the hosting service document located at [top-extensions-hosting-service.md](top-extensions-hosting-service.md). 

**NOTE**: This section is only relevant to extension developers who are using WARM and EV2 for deployment, or who plan to migrate to WARM and EV2 for deployment.

## EV2 Integration with hosting service

If you are not familiar with WARM and EV2, it is recommended that you read the documentation provided by their teams. If you have any questions about these systems please reach out to the respective teams.

* Onboard WARM: [https://aka.ms/warm](https://aka.ms/warm)
* Onboard Express V2: [https://aka.ms/ev2](https://aka.ms/ev2)

Deploying an extension with hosting requires extension developers to upload the zip file that was generated during the build to a  storage account that is read-only to the public.

Since EV2 does not provide an API to upload the zip file, setting up the deployment infrastructure can become an unmanageable task. The deployment process is simplified  by leveraging the EV2 extension that was developed by the Ibiza team. The EV2 extension allows the upload of the zip file to a storage account in a way that is compliant.

### Configuring Builds for Ev2 based deployments

In the basic scenario Microsoft.Portal.Tools.v2.targets will generate Ev2 templates. This includes the rollout spec, service model schema and parameter files. The procedure is as follows. 

1.  Configure Build.

 Microsoft.Portal.Tools.v2.targets provides the following properties to control hosting service output generation.  The properties have default values that you can override in your Extension.csproj file to meet the needs of your extension.
- `HostingServiceCreateDeploymentArtifacts`: defaults is undefined. Set to  `true` to generate versioned hosting service zip file. 
- `HostingServiceRoutePrefix`: Defaults to `$(MSBuildProjectName)`. The prefix name of your extension e.g scheduler that is supplied as part of onboarding to the extension host.
- `HostingServicePackageOutputRootDir`: Defaults to `$(OutDir)`. This is the output directory in which the build create a HostingSvc directory with generated zip file.
- `HostingServiceEv2ExportTemplates`: Defaults to `true`. When true will generate ev2 deployment artifacts to `HostingServiceEv2ServiceGroupRootSourceDir`.
- `HostingServiceEv2OutputRootDir`: Defaults to `$(HostingServicePackageOutputRootDir)`. Root directory where generated Ev2 Rollout specs will placed.
- `HostingServiceEv2ServiceGroupRootReplacementsFilePath`: Defaults to `$(MSBuildProjectDirectory)\ServiceGroupRootReplacements.json`.
- `HostingServiceEv2ServiceGroupRootSourceDir`: Defaults to `$(MSBuildThisFileDirectory)\Ev2\ServiceGroupRoot`. Use to change the default templates used for Ev2 spec generation.

For example this is the customized configuration for playground extension in CoreXT

```xml
<PropertyGroup>
    <HostingServiceCreateDeploymentArtifacts>$(IsOfficialBuild)</HostingServiceCreateDeploymentArtifacts>
    <HostingServiceRoutePrefix>[YourExtensionNameInHostingService]<</HostingServiceRoutePrefix>
    <HostingServiceEv2ExportTemplates>true</HostingServiceEv2ExportTemplates>
</PropertyGroup>
 ```

`[YourExtensionNameInHostingService]` should be replaced by an alphanumeric string that will be used when registering the extension in the hosting service. This string will be used to create the extension host name as well. Once the extension is registered in the hosting service, this value should not be changed.  Outside of CoreXT, you may want to set `HostingServiceCreateDeploymentArtifacts` to default to true as IsOfficialBuild will not be defined.  Note to change the output path of the built zip use `HostingServiceCreateDeploymentArtifacts`.  To change the outputpath of Generated Ev2Artifacts set `HostingServiceEv2OutputRootDir`.

1. Add a ServiceGroupRootReplacements.json file to the root of your project (right next to your web.config file). 

    The `ServiceGroupRootReplacements.json` is a JSON file that defines few properties which are used to generate artifacts that can be used to deploy the extension using EV2. You can define multiple objects in this file, each of those objects will map to an environment to which  you would like to deploy your extension. Below are the properties that should be added to those objects.

	**ServiceGroupRootReplacementsVersion**: The schema version of the json file. The current value is 2.

    **AzureSubscriptionId**: The Id of the subscription that contains the storage account.

    **CertKeyVaultUri**: The keyvault uri that contains the certificate required by EV2. This will require you to set up keyvault.

    **ContactEmail**: The contact email of the extension owners. 

    **TargetStorageCredentialsKeyVaultUri**: The keyvault Uri that contains the storage account connection string, account key, or SASToken. This will require you to set up keyvault.

    **StorageAccountCredentialsType**: The type of credential provided in the `TargetStorageCredentialsKeyVaultUri` property.  Valid values are "ConnectionString", "AccountKey", or "SASToken".

    **TargetContainerName**: The name of the blob container to which to upload the zip files.

    **PortalExtensionName**: The name of the extension as it is registered in the portal, for example, `Microsoft_Azure_Compute`.

    **FriendlyNames**: A string array that contains friendly names that are managed.

    **MonitorDuration**: The time to wait between each stage of a deployment, specified in hours and days.  Also known as bake time.  The minimum allowed value is 30 minutes (PT30M).

    **SkipSafeDeployment**: A boolean value that will generate EV2 templates that will allow you to deploy your extension without following the Safe Deployment Procedures. 

	**SkipHealthCheck**: A boolean value which allows you to skip health check during deployment and just use wait times to do safe deployment.

    Add `ServiceGroupRootReplacements.json` to the extension csproj, as in the following example.

    ```json
    <Content Include="ServiceGroupRootReplacements.json">
        <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </Content>
    ```

    The following file is an example of a `ServiceGroupRootReplacements.json` file.

    ```json
    {
    "production": { 
        "ServiceGroupRootReplacementsVersion": 2, 
        "AzureSubscriptionId": "<SubscriptionId>", 
        "CertKeyVaultUri": "https://sometest.vault.azure.net/secrets/PortalHostingServiceDeploymentCertificate", 
        "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>", 
        "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageAccountKey | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorage-SASToken>", 
        "TargetContainerName": "hostingservice", 
        "ContactEmail": "youremail@microsoft.com", 
        "PortalExtensionName": "Microsoft_Azure_Monitoring", 
        "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ] 
        },
    "mooncake": { 
        "ServiceGroupRootReplacementsVersion": 2, 
        "AzureSubscriptionId": "<SubscriptionId>", 
        "CertKeyVaultUri": "https://sometest.vault.azure.cn/secrets/PortalHostingServiceDeploymentCertificate", 
        "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>", 
        "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorageAccountKey | https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorage-SASToken>", 
        "TargetContainerName": "hostingservice", 
        "ContactEmail": "youremail@microsoft.com", 
        "PortalExtensionName": "Microsoft_Azure_Monitoring", 
        "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ] 
        }
    }
    ```

    Other environments that are supported: 

    1. Test i.e. Dogfood 

    1. Production 

    1. Fairfax 

    1. Blackforest 
    
    1. Mooncake

Note: If using a non standard path for ServiceGroupRootReplacements set build property `HostingServiceEv2ServiceGroupRootReplacementsFilePath` to the non standard location.  This already defaults toDefaults to `$(MSBuildProjectDirectory)\ServiceGroupRootReplacements.json`.

1. KeyVault

    The following procedure describes how to set up the KeyVault that is required by the  `ServiceGroupRootReplacements.json` file, as specified in [#configuring-builds-for-Ev2-based-deployments](#configuring-builds-for-Ev2-based-deployments).

    1. Set up KeyVault

        During deployment, the zip file from the official build will be copied to the storage account that was provided when onboarding to the hosting service.  To do this, Ev2 and the hosting service need two secrets:

        1. The certificate that Ev2 will use to call the hosting service to initate a deployment.

            **NOTE**: Azure ignores this certificate but it is still required. The extension is validated based on an allowed list of storage accounts and the storage credential you supply by using the   `PortalExtensionName`, `TargetStorageCredentialsKeyVaultUri` and `TargetContainerName` settings.

        1. The credentials to the target storage account where the extension will be deployed. The format of the connection string is the default form `DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1};EndpointSuffix={3}`, which is the format provided from `portal.azure.com`.
    
    1. Onboard to KeyVault

        The official guidance from Ev2 is located at  [https://aka.ms/portalfx/ev2keyvault](https://aka.ms/portalfx/ev2keyvault). Environments that are supported are the Dogfood test environment and the Production environment. Follow the instructions to:

        1. Create a KeyVault. 

        1. Grant Ev2 read access to your KeyVault.

        1. Create an Ev2 Certificate and add it to the KeyVault as a secret. In the following `csproj` config example, the name of the certificate in the KeyVault is `PortalHostingServiceDeploymentCertificate`.
        
        1. Create a KeyVault secret for the storage account connection string. Any configuration for prod environments is done via jit access and on your SAW.

1.  Initiate a test deployment

      You can quickly run a test deployment from a local build, previous to onboarding to WARM, by using the `New-AzureServiceRollout` commandlet.  Be sure that you are not testing in production, i.e, that the target storage account in the key vault that is being used is not the production storage account, and the **-RolloutInfra** switch is set to `Test`.  The following is an example of the PowerShell command.

      ```
        New-AzureServiceRollout -ServiceGroupRoot E:\dev\vso\AzureUX-PortalFX\out\ServiceGroupRoot -RolloutSpec E:\dev\vso\AzureUX-PortalFX\out\ServiceGroupRoot\RolloutSpec.24h.json -RolloutInfra Test -Verbose -WaitToComplete
    ```

      Replace `\<RolloutSpec>` with the path to `RolloutSpec.24h.json` in the build.


    **NOTE**: The Ev2 Json templates perform either a 24-hour or a 6-hour rollout to each stage within the hosting service's safe deployment stages. Currently, the gating health check endpoint returns `true` in all cases, so really the check only provides a time gated rollout.  This means that you need to validate the health of the deployment in each stage, or cancel the deployment using the `Stop-AzureServiceRollout` command if something goes wrong. Once a stop is executed, you need to rollback the content to the previous version using the `New-AzureServiceRollout` command.  This document will be updated once health check rules are defined and enforced.  If you would like to implement your own health check endpoint you can customize the Ev2 json specs that are located in the NuGet.
    
    To perform a production deployment as specified in [https://aka.ms/portalfx/howtodeploy](https://aka.ms/portalfx/howtodeploy), or deployment by using the Warm UX that is specified in [https://warm/newrelease/ev2](https://warm/newrelease/ev2), we assume that you have already onboarded to WARM. If not please see the Ev2 WARM onboarding guidance located at [https://aka.ms/portalfx/warmonboarding](https://aka.ms/portalfx/warmonboarding). For questions please reach out to  <a href="mailto:ev2sup@microsoft.com?subject=Ev2 WARM onboarding">ev2sup@microsoft.com</a>.

### What output is generated?

The preceding  configuration will result in a build output as required by Ev2 and the hosting service. The following  is a sample of the output that gets generated.

  ```
  out\retail-amd64\ServiceGroupRoot
                  \HostingSvc\1.2.1.0.zip
                  \Production.Parameters\*.json
                  \buildver.txt
                  \Production.RolloutSpec.6h.json
                  \Production.RolloutSpec.24h.json
                  \Production.ServiceModel.6h.json
                  \Production.ServiceModel.1D.json
                  \Production.friendlyname_1.json
                  \Production.friendlyname_2.json
                  \Production.friendlyname_3.json
  ```

### Specify Ev2 bake time

The EV2 template files that are shipped are now formatted to accept customized monitor durations, which is the time to wait between each stage of a deployment, also known as bake time. To accommodate this, the files have been renamed from `Blackforest.RolloutParameters.PT6H.json` to 
`Blackforest.RolloutParameters.{MonitorDuration}.json`.

The monitor duration can be specified by updating the  `ServiceGroupRootReplacements.json` file to include a new array called "MonitorDuration", as in the following example.

  ```json
    { 
    "production": { 
            "ServiceGroupRootReplacementsVersion": 2, 
        "AzureSubscriptionId": "<SubscriptionId>", 
        "CertKeyVaultUri": "https://sometest.vault.azure.net/secrets/PortalHostingServiceDeploymentCertificate", 
        "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>", 
        "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageAccountKey>", 
        "TargetContainerName": "hostingservice", 
        "ContactEmail": "youremail@microsoft.com", 
        "PortalExtensionName": "Microsoft_Azure_Monitoring", 
        "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ], 
        "MonitorDuration": [ "P30M", "PT1H" ], 
        }
    }
  ```

If no monitor durations are specified, then the EV2 generation will default to 6 hours (PT6H) and 1 day (P1D).

### Skipping safe deployment

EV2 templates now support generating deployment files that do not include a delay between stages.  This can be enabled by adding the key/value pair `"SkipSafeDeployment": "true" ` in the corresponding environment in the `ServiceGroupRootReplacements.json` file.  The following example adds the SkipSafeDeployment key/value pair to the extension named `Microsoft_MyExtension` in the **MOONCAKE** environment.

  ```
    { 
        "production": {
        "ServiceGroupRootReplacementsVersion": 2, 
        "AzureSubscriptionId": "<SubscriptionId>", 
        "CertKeyVaultUri": "https://sometest.vault.azure.net/secrets/PortalHostingServiceDeploymentCertificate", 
        "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>", 
        "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageAccountKey>", 
        "TargetContainerName": "hostingservice", 
        "ContactEmail": "youremail@microsoft.com", 
        "PortalExtensionName": "Microsoft_Azure_Monitoring", 
        "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ], 
        "SkipSafeDeployment": "true" 
        } 
    }
  ```

### Friendly name removal

To remove a friendly name, just run an EV2 deployment with the `Rolloutspec.RemoveFriendlyName.<friendlyName>.json` file.

### WARM Integration with hosting service

  It is assumed that you have already onboarded to WARM if you will be deploying to production, or deploying by using the WARM UX. The production deployment instructions are    specified in the site located at  [https://aka.ms/portalfx/warmproduction](https://aka.ms/portalfx/warmproduction), and the WARM UX deployment instructions are specified in the site located at [https://warm/newrelease/ev2](https://warm/newrelease/ev2).  
  
  If you have not already onboarded to WARM, see the guidance from the Ev2 team that is located at [https://aka.ms/portalfx/warmonboarding](https://aka.ms/portalfx/warmonboarding). If you have questions, you can reach out to  <a href="mailto:ev2sup@microsoft.com?subject=Ev2 WARM onboarding">ev2sup@microsoft.com</a>.
