<a name="advanced-hosting-service-topics"></a>
## Advanced Hosting Service Topics

**NOTE**: This section of the document assumes that the reader has reviewed the hosting service document located at [top-extensions-hosting-service-procedures.md](top-extensions-hosting-service-procedures.md). 

**NOTE**: This section is only relevant to extension developers who are using [WARM](top-extensions-glossary.md) and [EV2](top-extensions-glossary.md) for deployment, or who plan to migrate to WARM and EV2 for deployment.

<a name="advanced-hosting-service-topics-ev2-integration-with-hosting-service"></a>
### EV2 Integration with hosting service

If you are not familiar with WARM and EV2, it is recommended that you read the documentation provided by their teams. If you have any questions about these systems please reach out to the respective teams.

* Onboard WARM: [https://aka.ms/warm](https://aka.ms/warm)
* Onboard Express V2: [https://aka.ms/ev2](https://aka.ms/ev2)

Deploying an extension with hosting requires extension developers to upload the zip file that was generated during the build to a  storage account that is read-only to the public.

Since EV2 does not provide an API to upload the zip file, setting up the deployment infrastructure can become an unmanageable task. The deployment process is simplified  by leveraging the EV2 extension that was developed by the Ibiza team. The EV2 extension allows the upload of the zip file to a storage account in a way that is compliant.

<a name="advanced-hosting-service-topics-configuring-contentunbundler-for-ev2-based-deployments"></a>
### Configuring ContentUnbundler for Ev2 based deployments

As of SDK version 5.0.302.817, extension developers can leverage the EV2 mode in **Content Unbundler** to generate the rollout spec, service model schema, and parameter files for EV2 deployment.

In the basic scenario, extension developers can execute **ContentUnbundler** in EV2 mode. This will generate the rollout spec, service model schema and parameter files. The procedure is as follows. 

1.  Specify the `ContentUnbundlerMode` as ExportEv2. This attribute is provided in addition to other properties.

    The following is the `csproj` configuration for the Monitoring Extension in the **CoreXT** environment.

    ```xml
    <!-- ContentUnbundler parameters -->
    <PropertyGroup>
        <ForceUnbundler>true</ForceUnbundler>
        <ContentUnbundlerExe>$(PkgMicrosoft_Portal_Tools_ContentUnbundler)\build\ContentUnbundler.exe</ContentUnbundlerExe>
        <ContentUnbundlerSourceDirectory>$(WebProjectOutputDir.Trim('\'))</ContentUnbundlerSourceDirectory>
        <ContentUnbundlerOutputDirectory>$(BinariesBuildTypeArchDirectory)\ServiceGroupRoot</ContentUnbundlerOutputDirectory>s
        <ContentUnbundlerExtensionRoutePrefix>monitoring</ContentUnbundlerExtensionRoutePrefix>
        <ContentUnbundlerMode>ExportEv2</ContentUnbundlerMode>
    </PropertyGroup>
    .
    .
    .
    .
    <Import Project="$(PkgMicrosoft_Portal_Tools_ContentUnbundler)\build\Microsoft.Portal.Tools.ContentUnbundler.targets" />
    ```
1. Add a `ServiceGroupRootReplacements.json` file to the root of your project.  This will require you to set up a KeyVault for certificates and other items that are used for connectivity. The `ServiceGroupRootReplacements.json` file contains the following parameters.

	**ServiceGroupRootReplacementsVersion**: The schema version of the json file. The current value is 1.

    **AzureSubscriptionId**: The Id of the subscription that contains the storage account.

    **CertKeyVaultUri**: The keyvault uri that contains the certificate required by EV2.

    **ContactEmail**: The contact email of the extension owners. 

    **TargetStorageConStringKeyVaultUri**: The keyvault Uri that contains the storage account connection string.

    **TargetContainerName**: The name of the blob container to which to upload the zip files.

    **PortalExtensionName**: The name of the extension as it is registered in the portal. For example Microsoft_Azure_Compute.

    **FriendlyNames**: A string array that contains friendly names that are managed.

    **MonitorDuration**: The time to wait between each stage of a deployment, specified in hours and days.  Also known as bake time.

1.  Initiate a test deployment

      You can quickly run a test deployment from a local build, previous to onboarding to WARM, by using the `New-AzureServiceRollout` commandlet.  Be sure that you are not testing in production, i.e, that the target storage account in the key vault that is being used is not the production storage account, and the **-RolloutInfra** switch is set to `Test`.  The following is an example of the PowerShell command.

      ```
        New-AzureServiceRollout -ServiceGroupRoot E:\dev\vso\AzureUX-PortalFX\out\ServiceGroupRoot -RolloutSpec E:\dev\vso\AzureUX-PortalFX\out\ServiceGroupRoot\RolloutSpec.24h.json -RolloutInfra Test -Verbose -WaitToComplete
    ```

      Replace \<RolloutSpec> with the path to `RolloutSpec.24h.json` in the build.


    **NOTE**: The Ev2 Json templates perform either a 24-hour or a 6-hour rollout to each stage within the hosting service's safe deployment stages. Currently, the gating health check endpoint returns `true` in all cases, so really the check only provides a time gated rollout.  This means that you need to validate the health of the deployment in each stage, or cancel the deployment using the `Stop-AzureServiceRollout` command if something goes wrong. Once a stop is executed, you need to rollback the content to the previous version using the `New-AzureServiceRollout` command.  This document will be updated once health check rules are defined and enforced.  If you would like to implement your own health check endpoint you can customize the Ev2 json specs that are located in the NuGet.

<a name="advanced-hosting-service-topics-keyvault"></a>
### KeyVault

The following procedure describes how to set up the KeyVault that is required by the  `ServiceGroupRootReplacements.json` file, as specified in [#configuring-contentunbundler-for-Ev2-based-deployments](#configuring-contentunbundler-for-Ev2-based-deployments).

1. Set up KeyVault

    <!--TODO:  Determine who provides the storage account: the extension developer or the Azure Portal -->

    During deployment, the zip file from the official build will be copied to the storage account that was provided when onboarding to the hosting service.  To do this, Ev2 and the hosting service need two secrets:

    1. The certificate that Ev2 will use to call the hosting service to initate a deployment.

        **NOTE**: Azure ignores this certificate but it is still required. The extension is validated based on an allowed list of storage accounts and the storage credential you supply by using the  `TargetStorageConStringKeyVaultUri` and `TargetContainerName` settings.

    1. The connection string to the target storage account where the extension will be deployed. The format of the connection string is the default form `DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1};EndpointSuffix={3}`, which is the format provided from portal.azure.com.
    
1. Onboard to KeyVault

    The official guidance from Ev2 is located at  [https://aka.ms/portalfx/ev2keyvault](https://aka.ms/portalfx/ev2keyvault). Environments that are supported are the Dogfood test environment and the Production environment. Follow the instructions to:

    1. Create a KeyVault. 
    1. Grant Ev2 read access to your KeyVault
    1. Create an Ev2 Certificate and add it to the KeyVault as a secret. In the following `csproj` config example, the name of the certificate in the KeyVault is `PortalHostingServiceDeploymentCertificate`.
    1. Create a KeyVault secret for the storage account connection string. Any configuration for prod environments is done via [jit](top-extensions-glossary.md) access and on your [SAW](top-extensions-glossary.md).

1. Add the file to your project

    Add `ServiceGroupRootReplacements.json` to the extension `csproj`, as in the following example.

    ```xml
    <Content Include="ServiceGroupRootReplacements.json">
        <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </Content>
    ```
    
    The following file is an example of a `ServiceGroupRootReplacements.json` file.

    ```json
        {
        "production": {
            "AzureSubscriptionId": "<SubscriptionId>",
            "CertKeyVaultUri": "https://sometest.vault.azure.net/secrets/PortalHostingServiceDeploymentCertificate",
            "TargetStorageConStringKeyVaultUri": "https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageConnectionString",
            "TargetContainerName": "hostingservice",
            "ContactEmail": "youremail@microsoft.com",
           "PortalExtensionName": "Microsoft_Azure_Monitoring",
            "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ]
        }
        }
    ```

<a name="advanced-hosting-service-topics-what-output-is-generated"></a>
### What output is generated?

The above configuration will result in a build output as required by Ev2 and the hosting service. The following examples are for different versions of the SDK.

* As of version 5.0.302.834

  ```
  out\retail-amd64\ServiceGroupRoot
                  \HostingSvc\1.2.1.0.zip
                  \Parameters\*.json
                  \buildver.txt
                  \RolloutSpec.6h.json
                  \RolloutSpec.24h.json
                  \production.ServiceModel.6h.json
                  \production.ServiceModel.24h.json
                  \production.friendlyname_1.json
                  \production.friendlyname_2.json
                  \production.friendlyname_3.json

  ```

* As of version 5.0.302.837


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

<a name="advanced-hosting-service-topics-specify-contentunbundler-bake-time"></a>
### Specify ContentUnbundler bake time

The **ContentUnbundler** EV2 template files that are shipped are now formatted to accept customized monitor durations, which is the time to wait between each stage of a deployment, also known as bake time. To accommodate this, the files have been renamed from:
`Blackforest.RolloutParameters.PT6H.json`
to:
`Blackforest.RolloutParameters.{MonitorDuration}.json`.

The monitor duration can be specified by updating the  `ServiceGroupRootReplacements.json` file to include a new array called "MonitorDuration", as in the following example.

  ```
  "Test": {
      "AzureSubscriptionId": "0531c8c8-df32-4254-a717-b6e983273e5f",
      "CertKeyVaultUri": "https://stzhao0resourcedf.vault.azure.net/secrets/PortalHostingServiceDeploymentCertificate",
      "TargetStorageConStringKeyVaultUri": "https://stzhao0resourcedf.vault.azure.net/secrets/PortalHostingServiceStorageConnectionString",
      "TargetContainerName": "hostingservicedf",
      "ContactEmail": "rowong@microsoft.com",
      "PortalExtensionName": "Microsoft_Azure_Resources",
      "FriendlyNames": [
        "friendlyname1"
      ],
      "MonitorDuration": [
          "PT1H",
          "PT30M"
      ]
  ```

If no monitor durations are specified, then the **ContentUnbundler** EV2 generation will default to 6 hours (PT6H) and 1 day (P1D).

<a name="advanced-hosting-service-topics-skipping-safe-deployment"></a>
### Skipping safe deployment

**ContentUnbundler** EV2 templates now support generating deployment files that do not include a delay between stages.  This can be enabled by adding the key/value pair 
`"SkipSafeDeployment": "true" ` in the corresponding environment in the `ServiceGroupRootReplacements.json` file.  The following example adds the SkipSafeDeployment key/value pair to the extension named `Microsoft_MyExtension` in the **MOONCAKE** environment.

  ```
  "Mooncake": {
      "AzureSubscriptionId": "00000000-0000-0000-0000-000000000000",
      "certKeyVaultUri": "https://mykeyvault-.vault.azure.net/secrets/MyCertificate",
      "targetStorageConStringKeyVaultUri": "https://mykeyvault-df.vault.azure.net/secrets/MyConnectionString",
      "targetContainerName": "myService",
      "contactEmail": "myEmail@myCompany.com",
      "portalExtensionName": "Microsoft_MyExtension",
      "friendlyNames": [
        "Name1",
        "F2"
      ],
      "SkipSafeDeployment": "true"
    },
  ```

<a name="advanced-hosting-service-topics-friendly-name-removal"></a>
### Friendly name removal

To remove a friendly name, just run an EV2 deployment with the `Rolloutspec.RemoveFriendlyName.<friendlyName>.json` file.

<a name="advanced-hosting-service-topics-warm-integration-with-hosting-service"></a>
### WARM Integration with hosting service

  It is assumed that you have already onboarded to WARM if you will be deploying to production, or deploying by using the WARM UX. The production deployment instructions are  
  specified in the site located at  [https://aka.ms/portalfx/warmproduction](https://aka.ms/portalfx/warmproduction), and the WARM UX deployment instructions are specified in the site located at [https://warm/newrelease/ev2](https://warm/newrelease/ev2).  
  
  If you have not already onboarded to WARM, see the guidance from the Ev2 team that is located at [https://aka.ms/portalfx/warmonboarding](https://aka.ms/portalfx/warmonboarding). If you have questions, you can reach out to ev2sup@microsoft.com.





<a name="advanced-hosting-service-topics-logging"></a>
### Logging

The Portal provides a way for extensions to log to MDS using a feature that can be enabled in the extension. The logs generated by the extension when this feature is enabled are located in tables in the Portal's MDS account. For more information about the Portal logging feature, see [portalfx-telemetry.md#logging](portalfx-telemetry.md#logging).


<a name="advanced-hosting-service-topics-trace-events"></a>
### Trace Events

Trace events are stored in a **po** database, and can be analyzed with the Kusto.WebExplorer tool. The following link contains a query that specifies which trace events to consider for analysis.
[https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/Azportal/databases/AzurePortal?query=ExtEvents%7Cwhere+PreciseTimeStamp%3Eago(10m)](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/Azportal/databases/AzurePortal?query=ExtEvents%7Cwhere+PreciseTimeStamp%3Eago(10m))

The following image contains a list of tables that are a part of the Kusto database schema. It also displays the columns from the `ExtEvents` table that was used in the previous query.

 ![alt-text](../media/portalfx-extensions-hosting-service/KustoWebExplorerQuery.png  "Trace Event Parameters")

For more information about Kusto WebExplorer and associated functions, see [https://kusto.azurewebsites.net/docs/queryLanguage/query_language_syntax.html?q=cross](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_syntax.html?q=cross). For questions to the developer community, use the  Stackoverflow tag [ibiza-deployment](https://stackoverflow.microsoft.com/questions/tagged/ibiza-deployment) and [ibiza-hosting-service](https://stackoverflow.microsoft.com/questions/tagged/ibiza-hosting-service).



<a name="advanced-hosting-service-topics-telemetry-events"></a>
### Telemetry Events

Telemetry events are stored in the **Kusto** database in the `ExtTelemetry` table.  To  review telemetry events, use the following query against the Kusto.WebExplorer site.

[https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/Azportal/databases/AzurePortal?query=ExtTelemetry%7Cwhere+PreciseTimeStamp%3Eago(10m)](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/Azportal/databases/AzurePortal?query=ExtTelemetry%7Cwhere+PreciseTimeStamp%3Eago(10m))

<a name="advanced-hosting-service-topics-monitoring"></a>
### Monitoring

 There are two categories of issues that are monitored for each extension.

1.  Portal loading and running the extension

    The Portal has alerts that notify extensions when they fail to load for any reason. Issues like blade load failures and part load failures are also monitored.

    <!-- TODO: Determine whether the work that needed to be done to monitor blade load failures and part load failures has been done. -->
    <!-- TODO: Determine whether it is the extension that is notified, or the partner that is notified. -->

1. Hosting Service downloading and servicing the extension

    The hosting service pings the endpoint that contains the extension bits once every 5 minutes. It will then download any new configurations and versions that it finds. If it fails to download or process the downloaded files, it logs these as errors in its own MDS tables.

    Alerts and monitors have been developed for any issues. The Ibiza team receives notifications if any errors or warnings are generated by the hosting service. 
    You can access the logs of the hosting service at [https://jarvis-west.dc.ad.msft.net/53731DA4](https://jarvis-west.dc.ad.msft.net/53731DA4).

 

