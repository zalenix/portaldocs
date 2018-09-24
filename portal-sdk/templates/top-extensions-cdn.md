
# Using the Content Delivery Network

The Azure Content Delivery Network (CDN) is designed to send audio, video, images, and other files faster and more reliably to customers by using servers that are closest to the users. These built-in CDN capabilities in the SDK dramatically increase speed and availability, and result in significant improvements in the user experience.

Developers may use a Content Delivery Network(CDN) to serve static images, scripts, and stylesheets. The Azure Portal SDK does not require the use of a CDN, or the use of a specific CDN. However, the CDN changes the location of the files that are downloaded most often to servers that may be closer to the user than the typical file servers and similar endpoints. Extensions that are served from Azure can take advantage of the built-in CDN capabilities in the SDK. The benefits of using the CDN to cache web site assets include the following.

* Better performance and user experience for end users

    This is especially true for applications that require multiple round-trips to load content.

* Large scaling to better handle single-event high loads
    
    For example, the start of a product launch event will cause a sharp increase in user access that is not predictable on an annual basis

* Less traffic is sent to the origin

    User requests are distributed, which allows edge servers to serve content

The `CdnIntegrationBlade` allows customers to create and manage CDN endpoints for their existing Azure resources, as in the following example.

![alt-text](../media/portalfx-pde/CdnIntegrationBlade.png "Cdn integration blade")

 **NOTE**: The CdnIntegrationBlade only works in public Azure and is NOT available in national clouds.
  
 <!-- TODO:  Verify whether this is the correct process to onboard to the CDN. -->
If you want to develop extensions that use the Content Delivery Network, create a code review and add "cdneng" as reviewers. You can also contact the Azure CDN Engineering team for questions, concerns, or bug reports by using the StackOverflow tag [ibiza-deployment](https://stackoverflow.microsoft.com/questions/tagged/ibiza-deployment).

### The CdnIntegration blade

<!-- TODO: Determine whether the CdnIntegration blade should be included in top-extensions-blades.md. -->
Through simple integration, your customers can enable CDN on their Azure resources within your extension without navigating to the CDN extension. The CdnIntegrationBlade uses the following inputs. The contents of the fields are constants if the  CdnIntegrationBlade  will be displayed in the Resource Menu, as specified in [reference the CDN Integration Blade](#reference-the-cdn-integration-blade).

**resourceId**: The id of your ARM resource. For example, if the Azure CDN blade is called from a Storage resource menu, the resourceId for a storage account would resemble the following string. 
`/subscriptions/93456ca3-e4aa-4986-ab1c-98afe7a12345/resourceGroups/rg1/providers/Microsoft.ClassicStorage/storageAccounts/storagetest1`. 

**location**: The geographic location of your resource, like "West US", or "East Asia". More information about extension versioning is specified in [top-extensions-hosting-service.md#upload-safe-deployment-config](top-extensions-hosting-service.md#upload-safe-deployment-config).

**originHostname**: The hostname of the service which is used as an origin for the created CDN endpoints. The hostname cannot contain slashes or protocols; instead it can contain only the domain name, like "storagetest1.blob.core.windows.net" or "webapptest2.azurewebsites.net".

Use the following steps to embed the CDN integration blade into your extension.

1. [Import the CDN Extension NuGet Package](#import-the-cdn-extension-nuget-package)
1. [Reference the CDN PDE](#reference-the-cdn-pde)
1. [Reference the CDN Integration Blade](#reference-the-cdn-integration-blade)
1. [Telemetry and Monitoring](#telemetry-and-monitoring)

## Import the CDN extension nuget package

To use the CDN integration blade, the extension should reference the `Microsoft.Portal.Extensions.Cdn` NuGet package.
For CoreXT-based environments, the project should have a reference to the package in the  `corext.config`  file or the  `packages.config` file as in the following example. Otherwise, reference the package as appropriate in your development environment.

```xml
<package id="Microsoft.Portal.Extensions.Cdn" version="1.0.13.177" />
```

*NOTE**: Remember to use the latest version that is located at [https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.extensions.cdn](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.extensions.cdn).

## Reference the CDN PDE

In the extension *.csproj file, add a reference to the `Microsoft_Azure_Cdn.pde` similar to the following code.
```xml
<ExtensionReference Include="$(PkgMicrosoft_Portal_Extensions_Cdn)\content\Client\_extensions\Cdn\Microsoft_Azure_Cdn.pde" />
```

## Reference the CDN Integration Blade

For the CdnIntegrationBlade to show up in your extension, you may reference it in one of two ways.

 1. It can be an item in the Resource menu, as in the following code. 
	```ts
	{
		id: "cdnIntegration",
		displayText: "Azure CDN",
		enabled: ko.observable(true),
		visible: ko.observable(true), //Shouldn't be visible in national clouds
		keywords: [
			"cdn",
			"endpoint",
			"profile",
			"domain"
		],
		icon: MsPortalFx.Base.Images.Polychromatic.Cdn(),
		supplyBladeReference: () => {
			return new CdnBladeReferences.CdnIntegrationBladeReference(
				{
					resourceId: <your resource Id>,
					location: <your resource location>,
					originHostname: <your resource hostname>
				});
		}
	}
	```

**id**: Contains the value "cdnIntegration". The id is used for the resource menu item `id`, and to track blade loads and create telemetry.

**displayText**: Contains the value "Azure CDN".  This field should be localized, and should be located in  the `Resources.resx` file.

**visible**:  Specifies whether menu can be displayed. It can be set to `true` or can be controlled by a feature flag  in your extension, as in the following code.

	```ts
	visible: ko.observable(MsPortalFx.isFeatureEnabled("cdnintegration"))
	```


1. It can be opened as a DynamicBladeSelection, which does not require importing the CDN NuGget package.  An example is in the following code.
	```ts
	this._container.selectable.selectedValue(<MsPortalFx.ViewModels.DynamicBladeSelection>{
			extension: "Microsoft_Azure_Cdn",
			detailBlade: "CdnIntegrationBlade",
			detailBladeInputs: {
				resourceId: this.resourceUri(),
				location: this._siteView.item().Location(),
				originHostname: this._siteView.item().DefaultHostName()
			}
		});            
	```

## Telemetry and monitoring

Ibiza tracks the usage and actions on the CDN integration blade by using the  following metrics.

* Number of CDN Endpoints created from partner extensions as opposed to CDN extensions.
* Number of customers clicking Azure CDN from partner extensions.
* Number of customers managing CDN from partner extensions.
* Percentage of customers initiating a CDN create operation after landing into the Azure CDN blade. 
* Percentage of success and failure of create operations from the Azure CDN blade.

No extra telemetry is required from the extension.

### Creating the CDN account

Follow the guide located at [http://aka.ms/portalfx/cdn](http://aka.ms/portalfx/cdn) to set up your CDN account.

After creating your CDN, there are a few options that need to be set.

* Click the "Enable HTTPS" command to enable HTTP and HTTPS.

* Click the "Enable Query String" to enable query string status.

### Configuring the extension

To take advantage of the CDN capabilities in the Portal SDK, there are a few pieces to configure. After setting up your CDN, you will receive a URL with which to access your content. It will be in the following format.

    `//<CDNNamespace>.vo.msecnd.net/`

This is the prefix for the CDN service. The production service should be configured to use it by using the following `appSetting` in the local `web.config` file.

```xml
<add key="Microsoft.Portal.Extensions.SamplesExtension.ApplicationConfiguration.CdnPrefix" 
     value="//<CDNNamespace>.vo.msecnd.net/" />
```

Neither `http` nor `https` are included in the url, so that the page can request content based on the current protocol. Sometimes, like for a cloud service, this setting is blank in `web.config`, and configured instead in a `cscfg`.

You can configure  versioning of  your extension by ensuring that  `IsDevelopmentMode` in the `*.config` file  is set to `false`.

**NOTE**:  If the CDN goes down, the increase in latency by falling back to a different server location may result in a negative impact to your users.  Typically, messages across long distances suffer more from latency than throughput. For example, total network latency is not as noticeable for one long steady stream of data as it is for many small individual requests for status on many storage accounts. This is because the steady stream of data that is a file upload would be more of a "delay expected" moment that is infrequent, whereas the status messages are needed right away and very often. Consequently, for file uploads, the extension would benefit from fewer servers that are strategically placed, but for messages, the extension benefits from working with more servers that are geolocated with your clients.

### Reading the prefix from configuration

To read any FX configuration, the extension uses a class which inherits from `ApplicationContext`, as in the following example.

```
\SamplesExtension\Configuration\CustomApplicationContext.cs
```

This class includes a `CdnPrefix` property, as in the following code.

```cs
[Export(typeof(ApplicationContext))]
internal class CustomApplicationContext : ApplicationContext
{
    private ApplicationConfiguration configuration;

    [ImportingConstructor]
    public CustomApplicationContext(ApplicationConfiguration configuration)
    {
        this.configuration = configuration;
    }

    public override bool IsDevelopmentMode
    {
        get
        {
            return this.configuration.IsDevelopmentMode;
        }
    }

    public override string CdnPrefix
    {
        get
        {
            return this.configuration.CdnPrefix;
        }
    }
}
```

This class assigns properties that are located in the `web.config` or `*.cscfg` files. To read the values from those files, the extension uses a C# class that  inherits from `ConfigurationSettings` and exports `ApplicationConfiguration`, as in the following example.

    `\SamplesExtension\Configuration\ApplicationConfiguration.cs`

This class is in the following code.

```cs
[Export(typeof(ApplicationConfiguration))]
public class ApplicationConfiguration : ConfigurationSettings
{
    /// <summary>
    /// Gets a value indicating whether development mode is enabled.
	/// Development mode turns minification off
    /// </summary>
    /// <remarks>
	/// Development mode turns minification off. 
	/// It also disables any caching that be happening.
	/// </remarks>
    [ConfigurationSetting]
    public bool IsDevelopmentMode
    {
        get;
        private set;
    }

    /// <summary>
    /// Gets a value indicating a custom location where browser should 
	/// find cache-able content (rather than from the application itself).
    /// </summary>
    [ConfigurationSetting]
    public string CdnPrefix
    {
        get;
        private set;
    }
}
```

### IIS and ASP.NET Configuration

Files are pushed to the CDN using the following process.

1. The browser makes a request to a specific CDN address, for example,  `http://exampleCDN.vo.msecnd.net/Content/jquery.js`.

1. If the file is already cached on the CDN, it is sent to the browser.

1. If the file is not cached, the CDN service makes a request to the origin server for the resource, for example,  `http://exampleCDN.vo.msecnd.net/CDN/Content/jquery.js`.

1. The file is cached and sent to the client.

To enable this workflow, the CDN makes an HTTP request to the extension. This is typically  not an issue, but some CDNs will make an HTTP 1.0 request. HTTP 1.0 technically does not support gzip/deflated content, therefore IIS does not enable compression by default. To turn compression on, set the `noCompressionForHttp10` setting in `<httpCompression>` to `false`.

The url for the request is in the following form.

`http://exampleCDN.vo.msecnd.net/CDN/Content/jquery.js`

The literal "/CDN/" is inserted into the url immediately after the host address. The request handling code in the SDK automatically handles incoming requests of the form `/CDN/Content/...` and `/Content/...`.   

For more information, see [http://www.iis.net/configreference/system.webserver/httpcompression](http://www.iis.net/configreference/system.webserver/httpcompression).

### Invalidating content on the CDN

Versioning should be configured when a new release of an extension is made available, to ensure that users are served the latest static content. Invalidating previous or stale content causes the Portal to    .

* AMD Bundles are invalidated using a hash value that is generated on the file content, as in the following example.

https://hubs-s3-portal.azurecomcdn.net/AzureHubs/Content/Dynamic/AmdBundleDefinition_**83A1A15A39494B7BB1F704FDB5F32596D4498792**.js?root=*HubsExtension/ServicesHealth/ServicesHealthArea

* Static content is invalidated using the extension version that is associated with a specific version, as in the following example. 

https://hubs-s3-portal.azurecomcdn.net/AzureHubs/Content/**5.0.202.7608987.150717-1541**/Images/HubsExtension/Tour_Tile_Background_Normal.png
