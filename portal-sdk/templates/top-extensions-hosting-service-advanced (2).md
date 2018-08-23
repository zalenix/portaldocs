## Advanced Section 

### EV2 Integration with hosting service

This section is only relevant to extension developers who are using WARM and EV2 for deployment or who plan to migrate to WARM and EV2 for deployment. 

If you are not familiar with WARM and EV2 we recommend that you read the documentation provided by WARM and EV2 team. If you have any questions about these systems please reach out to the respective teams.

1. Onboard WARM: https://aka.ms/warm
2. Onboard Express V2: https://aka.ms/ev2

Deploying an extension with hosting requires extension developers to upload the zip file generated during build to a publicly read-only storage account.
Since EV2 does not provide an API to upload zip file to extension developer's storage account setting up deployment infrastructure can become a herculean task.
Therefore, to simplify the deployment process you can leverage EV2 extension developed by Ibiza team that will allow you to upload the zip file to storage account in a compliant way.

### Configuring ContentUnbundler for Ev2 based deployments

As of SDK version 5.0.302.817, extension developers can leverage the EV2 mode in Content Unbundler to generate the rollout spec, service model schema and parameter files for EV2 deployment.

** NOTE:** If you are reading this section of the document we assume you have followed the Step-By-Step documentation for hosting service. At this point, the only missing piece in your deployment is EV2 integration.
If that is not the case, we recommend you go through the Step-By-Step documentation.

**Basic Scenario**:

In the most common scenario, extension developers can leverage ContentUnbundler

1. Execute ContentUnbundlerMode in EV2 mode

For the content unbundler to generate rollout spec, service model schema and parameter files extension developers need to specify the `ContentUnbundlerMode` as ExportEv2. This attribute is provided in addition to other properties for content unbundler.

For example, this is the csproj configuration for Monitoring Extension in the CoreXT environment.

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


2. Add valid ServiceGroupRootReplacements.json

In order to author ServiceGroupRootReplacements.json you will need ServiceGroupRootReplacementsVersion,TargetContainerName, AzureSubscriptionId, CertKeyVaultUri,StorageAccountCredentialsType,TargetStorageCredentialsKeyVaultUri, and extension name.  See below for a sample ServiceGroupRootReplacements.json. This will require you to set up keyvault.

i. Set up KeyVault

During deployment we need to copy the zip from your official build to the storage account used provided when onboarding to the hosting service.  To do this you Ev2 and hosting service need two secrets:
    1. The Certificate Ev2 will use to call the hosting service to initiate a deployment.
      **Note:** we ignore this certificate but it is still required. We validate you based on an allow list of storage accounts and the storage credential you supply via your `TargetStorageCredentialsKeyVaultUri` and `TargetContainerName` setting.
    1. The Connection string to the target storage account where you want your extension deployed

ii. Onboard to KeyVault

Follow this to [official guidance from Ev2](https://microsoft.sharepoint.com/teams/WAG/EngSys/deploy/_layouts/OneNote.aspx?id=%2Fteams%2FWAG%2FEngSys%2Fdeploy%2FSiteAssets%2FExpress%20v2%20Notebook&wd=target%28Ev2%20Documentation.one%7CD41B1200-A6DE-4B4D-A019-8318B6F3A084%2FStep-1.3%3A%20KeyVault%20Onboarding%20%28Admins%20Only%5C%29%7C2D1105B2-9518-404F-821C-85452A63E86D%2F%29) to:

    1. Create a KeyVault. 
    1. Grant Ev2 read access to your KeyVault
    1. Create an Ev2 Certificate and add it to the vault as a secret (this is needed by Ev2 for authentication). In the csproj config example above we named the certificate in key vault `PortalHostingServiceDeploymentCertificate` 
    1. Create a KeyVault secret for the storage account connection string, account key, or SAS Token. 
      **NOTE: ** The format for connection strings need to be in the default form `DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1};EndpointSuffix={3}` i.e the format provided by default from portal.azure.com

Please ensure that any configuration for prod environments is done via jit access and on your SAW.

iii. Add to your project

Add `ServiceGroupRootReplacements.json` to your extension csproj

```xml
<Content Include="ServiceGroupRootReplacements.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
</Content>
```
    
Sample `ServiceGroupRootReplacements.json` 
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
  }
}
```
Other environments that are supported:
i. Test i.e. Dogfood
i. Production
i. Fairfax
i. Blackforest
i. Mooncake

iv Initiate a test deployment

You can quickly run a test deployment prior to onboarding to WARM from a local build using the `New-AzureServiceRollout` commandlet.  Below is an example, be sure that you are **NOT testing on prod** i.e that the target storage account you setup in key vault you're using is not your prod storage account and the -RolloutInfra switch is set to Test.

``` PowerShell

 New-AzureServiceRollout -ServiceGroupRoot E:\dev\vso\AzureUX-PortalFX\out\ServiceGroupRoot -RolloutSpec E:\dev\vso\AzureUX-PortalFX\out\ServiceGroupRoot\RolloutSpec.PT1D.json -RolloutInfra Test -Verbose -WaitToComplete

```
Replace RolloutSpec with the path to RolloutSpec.PT1D.json in your build

**Note:** The Ev2 Json templates provided perform either a PT1D (24 hour) or PT6H (6 hour) rollout by default to each stage within the hosting services safe deployment stages. Currently the gating health check endpoint returns true in all cases so really only provides a time gated rollout.  This means that you need to validate the health of your deployment in each stage and cancel the deployment using the `Stop-AzureServiceRollout` command if something were wrong. Once a stop is executed you need to rollback your content to the prior version using `New-AzureServiceRollout`.  This document will be updated once health check rules are defined and enforced.  If you would like to implement your own health check endpoint you can customize the Ev2 json specs found in the NuGet.

To perform a [production deployment](https://microsoft.sharepoint.com/teams/WAG/EngSys/deploy/_layouts/OneNote.aspx?id=%2Fteams%2FWAG%2FEngSys%2Fdeploy%2FSiteAssets%2FExpress%20v2%20Notebook&wd=target%28Ev2%20Documentation.one%7CD41B1200-A6DE-4B4D-A019-8318B6F3A084%2FHOWTO%3A%20Deploy%20a%20service%7C15090502-728B-4C84-AD7B-52D403590963%2F%29) or deployment via the [Warm UX](https://warm/newrelease/ev2) we assume that you have already onboarded to WARM. If not please see the following guidance from the Ev2 team  [Ev2 WARM onboarding guidance](https://microsoft.sharepoint.com/teams/WAG/EngSys/deploy/_layouts/15/WopiFrame.aspx?sourcedoc={ecdfb10d-7616-4efd-8499-f210056f808f}&action=edit&wd=target%28%2F%2FEv2%20Documentation.one%7C3c50b523-523e-452c-b153-6bfac92f4926%2FStep-1%20Onboarding%20to%20PROD%20dependencies%7C4c8d1b1e-8e27-41c2-b36e-f60c3d25ab3e%2F%29) for questions please reach out to ev2sup@microsoft.com

### Auto rotating SAS Tokens
You can provide an auto-rotating SAS token that is managed by Key Vault.  See [Azure Key Vault Storage Account Keys](https://docs.microsoft.com/en-us/azure/key-vault/key-vault-ovw-storage-keys) for an overview on how Key Vault can manage SAS tokens for you.  You will need to provide the SAS Token with read, write, and list permissions to the service, container, and object resource types.  

Here is an example powershell script that will setup a Key Vault managed SAS Token for you (please be sure to read how [Azure Key Vault Storage Account Keys](https://docs.microsoft.com/en-us/azure/key-vault/key-vault-ovw-storage-keys) work if you run into issues).

``` Powershell
$validityPeriod = [System.Timespan]::FromDays(1)
$sctx = New-AzureStorageContext -StorageAccountName $storage.StorageAccountName -Protocol Https -StorageAccountKey Key1
$start = [System.DateTime]::Now.AddDays(-1)
$end = [System.DateTime]::Now.AddMonths(1)
$at = New-AzureStorageAccountSasToken -Service Blob -ResourceType Service,Container,Object -Permission "rwl" -Protocol HttpsOnly -StartTime $start -ExpiryTime $end -Context $sctx
Set-AzureKeyVaultManagedStorageSasDefinition -VaultName <vault name> -AccountName $storage.StorageAccountName -Name "Ev2DeploymentSas" -TemplateUri $at -SasType 'account' -ValidityPeriod $validityPeriod
```

Once you have your key generated, open your ServiceGroupRootReplacements.json file to specify the StorageAccountCredentialsType as SASToken and TargetStorageCredentialsKeyVaultUri as the Storage Account Key secret url.  The secret url should be a format similar to:
`https://<yourvault>.vault.azure.net/secrets/<YourStorageAccountName>-<YourSecretName>` 

```json
{
  "production": {   
    "ServiceGroupRootReplacementsVersion": 2,
    "AzureSubscriptionId": "<SubscriptionId>",
    "CertKeyVaultUri": "https://sometest.vault.azure.net/secrets/PortalHostingServiceDeploymentCertificate",
    "StorageAccountCredentialsType": "SASToken",
    "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.net/secrets/StorageAccountName-Ev2DeploymentSas>",
    "TargetContainerName": "hostingservice",
    "ContactEmail": "youremail@microsoft.com",
    "PortalExtensionName": "Microsoft_Azure_Monitoring",
    "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ],
    "SkipSafeDeployment": "true"
  }
}
```

### What output is generated?

The above config will result in a build output as required by Ev2 and the hosting service. It looks like the following:

```

out\retail-amd64\ServiceGroupRoot
                \HostingSvc\1.2.1.0.zip
                \Production\*.json
                \buildver.txt
                \Production.RolloutSpec.P1D.json
                \Production.RolloutSpec.PT6H.json
                \Production.RolloutSpec.RemoveFriendlyName.friendlyname_1.json
                \Production.RolloutSpec.RemoveFriendlyName.friendlyname_2.json
                \Production.RolloutSpec.RemoveFriendlyName.friendlyname_3.json
                \Production.RolloutSpec.SetFriendlyName.friendlyname_1.json
                \Production.RolloutSpec.SetFriendlyName.friendlyname_2.json
                \Production.RolloutSpec.SetFriendlyName.friendlyname_3.json

```


### FAQs

1. Support for friendly names

The support for friendly name is now available in 5.0.302.834.

1. Skipping safe deployment

A template where safe deployment is skipped (no health checks are performed) can be generated by adding the property *"SkipSafeDeployment": "true"* to the ServiceGroupRootReplacements.json file.  
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
    "SkipSafeDeployment": "true"
  }
}
```

1. Configurable Monitor durations (bake time)

Templates with different monitor durations (time between each stage, also known as bake time) can be generated by adding the property *"MonitorDuration": [ "<ISO 8601 Duration specification>" ]* to the ServiceGroupRootReplacements.json file.  Please refer to your organization's safe deployment practices for recommended durations.

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
