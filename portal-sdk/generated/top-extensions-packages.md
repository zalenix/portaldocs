
<a name="available-packages"></a>
## Available Packages

Packages used by extension developers are separated into the following categories.

* [Development](#development)
* [Publishing in the marketplace](#publishing-in-the-marketplace)
* [Testing](#testing)
* [Shared Packages](#shared-packages)
* [Deprecated packages](#deprecated-packages)

The following sections describe the various packages by category. All packages are available both in the Portal SDK MSI and through the deep-linked package source. Some packages are shipped as NuGet packages, and others as Node modules.  All packages in the following tables are NuGet packages unless they are annotated to be a node module.

<a name="available-packages-development"></a>
### Development

After installation, NuGet packages that are used for development can be viewed in the `packages.config` file or in the NuGet **Package Manager** tool in **Visual Studio**.  Node modules can be viewed  in `package.json`.

| Package | Purpose |
| ------- | ------- |
| [Microsoft.Portal.Framework](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=Official%40Local&package=Microsoft.Portal.Framework&protocolType=NuGet&_a=package) | Contains framework assemblies required for extension development. | 
| [Microsoft.Portal.Security.AadCore](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=Official%40Local&package=Microsoft.Portal.Security.AadCore&protocolType=NuGet&_a=package)	| Contains AAD module used for auth. | 
| [Microsoft.Portal.Tools](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=Official%40Local&package=Microsoft.Portal.Tools&protocolType=NuGet&_a=package) | 	Contains PDC, build target files (.target) , Definition files and TypeScript 2.3.3 compiler. | 
| [Microsoft.Portal.Tools.ContentUnbundler](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=Official%40Local&package=Microsoft.Portal.Tools.ContentUnbundler&protocolType=NuGet&_a=package) | Contains the tool that packages an extension UI into a zip file which can be served by the hosting service. | 

<a name="available-packages-publishing-in-the-marketplace"></a>
### Publishing in the marketplace

| Package | Purpose |
| ------- | ------- |
| [Microsoft.Azure.Gallery.AzureGalleryUtility](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=Official%40Local&package=Microsoft.Azure.Gallery.AzureGalleryUtility&version=5.1.0.19&protocolType=NuGet&_a=package) | Contains tools to package, upload and update gallery items in the Azure Portal marketplace.| 
| [Microsoft.Azure.Gallery.Common](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=Official%40Local&package=Microsoft.Azure.Gallery.Common&version=5.1.0.19&protocolType=NuGet&_a=package) | Common packages used by Microsoft.Azure.Gallery.AzureGalleryUtility| 

<a name="available-packages-testing"></a>
### Testing

| Package | Purpose | Document |
| ------- | ------- | -------- |
| [msportalfx-test](https://www.npmjs.com/package/msportalfx-test) (node module) | Provides APIs for authoring UI-based test cases with Selenium in TypeScript. | 
| [msportalfx-ut](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=feed) (node module)	| Provides APIs for authoring Unit Tests against extension code in TypeScript. Includes runtime, APIs, test runner support, trx and junit output for CI and code coverage reporting. See [top-extensions-unit-test.md](top-extensions-unit-test.md) for more details. | 
| [Microsoft.Portal.TestFramework](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=Official%40Local&package=Microsoft.Portal.TestFramework&protocolType=NuGet&_a=package) | Provides APIs for writing UI-based test cases with Selenium authored in CSharp. For more information about using the test framework, see [top-extensions-csharp-test-framework.md](top-extensions-csharp-test-framework.md). | 
| [Microsoft.Portal.TestFramework.UnitTest](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=Official%40Local&package=Microsoft.Portal.TestFramework.UnitTest&protocolType=NuGet&_a=package) | The [msportalfx-ut](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=feed)  node module shipped in a NuGet package for those that cannot consume the internal package source that is located at [https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=feed](https://msazure.visualstudio.com/One/Azure%20Portal/_packaging?feed=AzurePortalNpmRegistry&_a=feed), or are on CoreXT or similar IDE's that require offline/disconnected builds. For more information about unit testing, see [top-extensions-unit-test.md](top-extensions-unit-test.md). |

<a name="available-packages-shared-packages"></a>
### Shared packages

Portal Definition Exports, or PDE's, are extensions that are maintained by teams other than the Ibiza team and your team. These extensions are available for your use. This list of packages are contributed to by extension developers who are exposing functionality from their extension by way of shipping their PDE. The absence of an extension package from the list does not imply that the package does not exist, or does not ship. To verify whether an extension ships a NuGet package, reach out to the respective teams at [portalfx-extensions-contacts.md](portalfx-extensions-contacts.md) or [https://aka.ms/portalfx/uservoice](https://aka.ms/portalfx/uservoice).

| Package | Purpose | Document |
| ------- | ------- | -------- |
| [Microsoft.Portal.Extensions.KeyVault](https://msazure.visualstudio.com/One/_packaging?feed=Official&_a=package&package=Microsoft.Portal.Extensions.KeyVault&protocolType=NuGet) | Blades and parts shared by the KeyVault extension. | [portalfx-pde-keyvault.md](portalfx-pde-keyvault.md) | 
| [Microsoft.Portal.Extensions.AAD](https://msazure.visualstudio.com/One/_packaging?feed=Official&_a=package&package=Microsoft.Portal.Extensions.AAD&protocolType=NuGet) | Blades and parts shared by the AAD extension. | [portalfx-pde-adrbac.md](portalfx-pde-adrbac.md) | 
| [Microsoft.Portal.Extensions.Billing](https://msazure.visualstudio.com/One/_packaging?feed=Official&_a=package&package=Microsoft.Portal.Extensions.Billing&protocolType=NuGet) | Blades and parts shared by the Billing extension. | [portalfx-pde-billing.md](portalfx-pde-billing.md) | 
| [Microsoft.Portal.Extensions.Hubs](https://msazure.visualstudio.com/One/_packaging?feed=Official&_a=package&package=Microsoft.Portal.Extensions.Hub&protocolType=NuGet) | Blades and parts shared by the Hubs extension. | [portalfx-hubsextension-pde.md](portalfx-hubsextension-pde.md) | 
| [Microsoft.Portal.Extensions.Insights](https://msazure.visualstudio.com/One/_packaging?feed=Official&_a=package&package=Microsoft.Portal.Extensions.Hubs&protocolType=NuGet) | Blades and parts shared by the Insights extension. | [portalfx-pde-azureinsights.md](portalfx-pde-azureinsights.md) | 
| [Microsoft.Portal.Extensions.Monitoring](https://msazure.visualstudio.com/One/_packaging?feed=Official&_a=package&package=Microsoft.Portal.Extensions.Monitoring&protocolType=NuGet) | Blades and parts shared by the Monitoring extension. | [portalfx-pde-monitoring.md](portalfx-pde-monitoring.md) | 

<a name="available-packages-deprecated-packages"></a>
### Deprecated packages

The following NuGet packages have been deprecated. Do not use these packages when building new extensions. 

| Package | Purpose |
| ------- | ------- |
| Microsoft.Portal.Azure.Website | Sideload your extension instead, as specified in [top-extensions-sideloading.md](top-extensions-sideloading.md). |
| Microsoft.Portal.Azure.WebsiteNoAuth | Sideload your extension instead, as specified in [top-extensions-sideloading.md](top-extensions-sideloading.md). |
| Microsoft.Portal.Framework.Scripts | Use Microsoft.Portal.TestFramework.UnitTest instead, as specified in [top-extensions-unit-test.md](top-extensions-unit-test.md). |
| Microsoft.Portal.Tools.Etw | The recommended practice is to use the Extension Hosting Service as specified in [top-extensions-hosting-service.md](top-extensions-hosting-service.md) instead of custom deployment, as specified in [top-extensions-custom-deployment.md](top-extensions-custom-deployment.md). If you are self-hosting your extension, then this package provides the `EtwRelatedFilesUtility.exe` tool and sample configurations.  | 
| Microsoft.Portal.TypeMetadata | Author typemetadata directly instead of using this package, as specified in [portalfx-data-typemetadata.md#non-generated-type-metadata](portalfx-data-typemetadata.md#non-generated-type-metadata). |
