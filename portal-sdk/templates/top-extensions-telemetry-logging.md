
## Logging

There are two options for collecting error and warning logs. You can use the Portal Framework's built-in telemetry services, as specified in [top-extensions-telemetry.md](top-extensions-telemetry.md), or you can build an entirely custom system. Use of Portalfx Framework services is strongly recommended, because they are likely to be more performant than custom solutions.  However, if you choose to build your own telemetry system, you need to have practices in place that enforce  guidelines that are associated with the collection of personally identifiable information (PII).  It is very important for security and compliance reasons that PII data is not sent to telemetry services.

The Azure Portal SDK provides TypeScript and .NET libraries to assist with custom logging in AJAX and MDS.

**NOTE**: We are currently not onboarding new users to programmatic access.

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. 

* Logging from the Client

    When working on the client side of the extension, you may use your own  logging infrastructure, or opt into the provided APIs. The provided API allows the extension  to write messages are displayed in the browser console. In addition to
    displaying in the console, the portal manages batching these messages and provides an API to send them to the server. An example of this is located at `<dir>\Client\V1\Diagnostics\Logging\ViewModels\LoggingViewModels.ts` and in the following sample.

    ```ts
    MsPortalFx.Base.Diagnostics.Log.writeEntry(
        MsPortalFx.Base.Diagnostics.LogEntryLevel.Error,
        "Area of your application",
        "The message you would like to log",
        "Extra parameter 1",
        "Extra parameter 2");
    ```

    The code submits a new log entry as an error, including the area of  the site, the log message, and (n) parameters. You can retrieve logged  entries using the `MsPortalFx.Base.Diagnostics.LoggedEntries` method.

* Logging from the Server

    When using the MsPortalFx client API, messages are automatically batched and sent to the server. If using the provided `Microsoft.Portal.Framework` DLL,     the endpoint is automatically included in the application. Trace events that are sent     to the provided endpoint are automatically logged to ETW, as specified in [#logging-to-etw](#logging-to-etw).


Types of logging are specified in the following sections.

* [Logging from C Sharp](#logging-from-c-sharp)

* [Logging Ajax errors automatically](#logging-ajax-errors-automatically)

* [Manually accepting log requests](#manually-accepting-log-requests)

* [Logging load failures](#logging-load-failures)

Logs are stored in several different systems for review.  The primary location is **Kusto**, as specified in [top-extensions-telemetry.md#logging](top-extensions-telemetry.md#logging).  Other locations are specified in the following sections.

* [Logging to ETW](#logging-to-etw)

* [Logging to MDS tables](#logging-to-mds-tables)

## Logging from C sharp

In addition to managing trace events from TypeScript, there is framework support for logging to ETW from .NET. To define a list of events, see the sample that is located at `<dir>\Tracing\Tracing.cs` and in the following code.

```cs
/// <summary>
/// Event ids for the events. This is the ETW event id.
/// </summary>
public enum EventIds
{
    /// <summary>
    /// Denotes that a website has been deleted
    /// </summary>
    WebsiteDeleted = 1,
}

/// <summary>
/// Basic tracing in the sample extension.
/// </summary>
[EventSourceDefinition("Microsoft-Portal-Extensions-SamplesExtension", Guid = "763D3D57-E01F-4DD1-BD1E-4FE96054F7A4")]
public interface IBasicTracing
{
    /// <summary>
    /// Trace the deletion of a website.
    /// </summary>
    [EventDefinition((int)EventIds.WebsiteDeleted, EventLevel.Verbose, "The website with '{0}' was deleted.")]
    void WebsiteDeleted(int id);
}
```

After defining all of the possible events, you can log new events. To use logger, export the  class and use the following  import constructor  that includes an instance of the previous interface. An example is located at `<dir>\Controllers\WebsitesController.cs` and in the following code.

```cs
/// <summary>
/// WebsitesController class.
/// </summary>
[Export]
[PartCreationPolicy(CreationPolicy.NonShared)]
public class WebsitesController : ApiController
{
    private IBasicTracing tracing;

    /// <summary>
    /// Initializes a new instance of the WebsitesController class.
    /// </summary>
    [ImportingConstructor]
    public WebsitesController(IBasicTracing tracing)
    {
        this.tracing = tracing;
    }

    /// <summary>
    /// Deletes specific entity from the repository.
    /// </summary>
    /// <param name="id">Entity id.</param>
    /// <returns>A <see cref="HttpResponseMessage" /> with the response.</returns>
    /// <example>Hit /api/nameOfController/id with DELETE verb.</example>
    [HttpDelete]
    public async Task<HttpResponseMessage> DeleteWebsite(int id)
    {
        WebsiteModel model;
        HttpResponseMessage response;

        if (this.Repository.TryRemove(id, out model))
        {
            this.tracing.WebsiteDeleted(id);
            response = Request.CreateResponse(HttpStatusCode.OK, model);
        }
        else
        {
            response = Request.CreateResponse(HttpStatusCode.NotFound);
        }

        // Fake running some heavy operations by waiting before returning result.
        await Task.Delay(this.operationDelay);

        return response;
    }
}
```

## Logging Ajax errors automatically  

Ajax error logging is  enabled through the required `TraceAjaxErrors` property in `extensiondefinition` in Base.net. When this is turned on, ajax calls made through the Base.net ajax methods will log all HTTP 5xx errors to the extension's ClientEvents MDS table.

The new attribute is added to the Extension Definition as in the following code.

```cs
public override bool TraceAjaxErrors
{
    get
    {
        return true;
    }
}
```

## Manually accepting log requests

To manually accept log requests, the developer should change the  extension configuration to update the `fx.environment.clientTraceUri` property that is available on the client at runtime. The request will include a JSON body which includes an array of traces. A typical payload takes the following structure:

```json
[
    {
        "timestamp": 1389849966392,
        "level": 0,
        "area": "Performance",
        "message": "This is an example trace event.",
        "args": [
            "extra arg 1",
            12345,
            "you can have many of these"
        ]
    }
]
```

You should create an endpoint that receives JSON in the body and can accept these requests if the extension uses a non-.NET backend.

These log request messages are sent to `/api/ClientTrace?timeStamp={timestamp}`, which is by default managed by the framework.  The URL is configurable if  custom handling of traces is required. To change the default trace endpoint, modify the extension's `web.config` file to point to your own endpoint, as in the following code.

`web.config (appSettings section)`

```xml
<add key="Microsoft.Portal.Extensions.SamplesExtension.ApplicationConfiguration.ClientTraceUri"
     value="~/MyController/MyTraceAction" />
```

Update the `ApplicationConfiguration.cs` class that is located at `<dir>\Configuration\ApplicationConfiguration.cs` to include a `ClientTraceUri` property, as in the following code.

```cs
[ConfigurationSetting]
public AppRelativePath ClientTraceUri
{
    get;
    private set;
}
```

Finally, update the `CustomApplicationContext.cs` class that is located at `<dir>\Configuration\CustomApplicationContext.cs` to include a `ClientTraceUri` property, as in the following code.

```cs
public override AppRelativePath ClientTraceUri
{
    get
    {
        return this.configuration.ClientTraceUri;
    }
}
```

## Logging load failures

The Portal manages alerts that are sent when first-party extensions fail to load.  The Extension Load Failure alert will create an ICM incident which is routed to your team based on the spreadsheet located at [https://microsoft.sharepoint.com/teams/azureteams/aapt/azureux/RM/_layouts/15/WopiFrame.aspx?sourcedoc=%7bC322B2D3-5F69-4AD4-BA26-AF93D3AE6FAA%7d&file=Partner%20Incident%20Routing.xlsx&action=default](https://microsoft.sharepoint.com/teams/azureteams/aapt/azureux/RM/_layouts/15/WopiFrame.aspx?sourcedoc=%7bC322B2D3-5F69-4AD4-BA26-AF93D3AE6FAA%7d&file=Partner%20Incident%20Routing.xlsx&action=default).  

If you are using MDS logging, you can create additional alerts for your extension through the Geneva Monitoring system that is located at [https://jarvis-west.dc.ad.msft.net/53731DA4](https://jarvis-west.dc.ad.msft.net/53731DA4).  Please ensure that any alerts created are initially routed to your team instead of the Portal team.

If you are using AppInsights, then please contact the <a href="mailto:VSAIDiscussion@microsoft.com?subject=AppInsights&body=Hello, I need some help with the internal alerts for my extension.">AppInsights team</a>.

## Logging to ETW

Now that the extension is receiving logs by using  ClientTrace, the logs can be written to **Event Tracing for Windows** (ETW), as specified in [http://aka.ms/portalfx/etw](http://aka.ms/portalfx/etw). Logs are viewed in Event Viewer, or picked up by a central logging system.  For first-party developers, the logging system is typically **Kusto**, as specified in [top-extensions-telemetry.md#logging](top-extensions-telemetry.md#logging), although extensions can view information in MDS if they  upload logs to ETW. 

To write to ETW, first the Providers must be registered with ETW by using the  `EtwRelatedFilesUtility.exe` utility.  It must be run as a startup task in the  instance, previous to  users of ETW are run.

1. Make sure that `EtwRelatedFilesUtility.exe` is placed in the `\bin` folder of your web role.

1. Create a startup script to run the utility and capture any output, in case something goes wrong, as in the following example.

    ```
    REM SetupEtw.cmd example
    @ECHO OFF
    EtwRelatedFilesUtility.exe >> EtwRelatedFilesUtility.log  2>> EtwRelatedFilesUtility.err
    EXIT %ERRORLEVEL%
    ```

1. Add this startup script to the instance's definition, making sure that it is run as an elevated, "simple" task, as in the following example.

    ```xml
    <Startup>
    <Task commandLine="StartupTasks\SetupEtw.cmd" executionContext="elevated" taskType="simple">
    </Task>
    </Startup>
    ```

1. Once the extension is  deployed with this configuration, new logs should be created in Event Viewer, as in the following image.

![alt-text](../media/portalfx-internal/EventViewerClientTrace.png "Event Viewer Client Trace")

## Logging to MDS tables

If you are a first-party developer, you may have a requirement to write logs to MDS, as specified in [portalfx-telemetry-mds-tables.md](portalfx-telemetry-mds-tables.md).

**NOTE**: Please ensure that you have a requirement to use MDS before you start onboarding. Different teams have different requirements.

<!-- If MDS is obsolete, this section can be removed.  -->

1. Make sure that the logs appear in ETW, as specified in [#logging-to-etw](#logging-to-etw).

1. Onboard to MDS by following the instructions in the  Wiki located at [https://jarvis-west.dc.ad.msft.net/?page=documents&section=1363da01-b6ed-43d4-970e-f89b011d591f&id=f1128883-10e4-472e-a59c-6be8f77f832c#/](https://jarvis-west.dc.ad.msft.net/?page=documents&section=1363da01-b6ed-43d4-970e-f89b011d591f&id=f1128883-10e4-472e-a59c-6be8f77f832c#/).

1. Once you have onboarded to MDS, follow their steps to configure and deploy the Monitoring Agent, as specified in [https://jarvis-west.dc.ad.msft.net/?page=documents&section=9c95f4eb-8689-4c9f-81bf-82d688e860fd&id=8555740f-8605-4e35-8344-b35098e71f01#/](https://jarvis-west.dc.ad.msft.net/?page=documents&section=9c95f4eb-8689-4c9f-81bf-82d688e860fd&id=8555740f-8605-4e35-8344-b35098e71f01#/).

1. After completing this, you should have added a startup task to the instance's definition. Make sure that this task runs **AFTER** the startup task that runs `EtwRelatedFilesUtility.exe`. 

1. Upload your MDS schema configuration files before the start of deployment, as specified in  the MDS documentation located at [https://microsoft.sharepoint.com/teams/WAG/EngSys/Monitor/AmdWiki/MDS.EXE%20Command%20Reference.aspx#UploadMdsConfig](https://microsoft.sharepoint.com/teams/WAG/EngSys/Monitor/AmdWiki/MDS.EXE%20Command%20Reference.aspx#UploadMdsConfig). You should be able to see examples of MDS schema configuration files as part of the ETW NuGet package (`Microsoft.Portal.Tools.Etw.[version].nupkg`) under `Tools\EtwRelatedFilesUtility\MonitoringConfig`. If you have your own MDS schema configuration files, remember to   merge the portal configuration files that contain tables that are part of your schema.

1. The MDS logging  feature is enabled by setting `EnablePortalLogging` to `true` in the extensiondefinition. When this is turned on, all extension traces and telemetry are logged to the portal MDS tables, as in the following `\SamplesDefinition.cs` code.

    ```cs
    [Export(typeof(ExtensionDefinition))]
    internal class SamplesExtensionDefinition : ExtensionDefinition
    {
        [ImportingConstructor]
        public SamplesExtensionDefinition(ArmConfiguration armConfiguration, ApplicationConfiguration applicationConfiguration)
        {
            this.EnablePortalLogging = true;
        }
    ```

The feature is turned on by default for serverless extensions.  When the extension deploys and an instance starts, remember that five to fifteen  minutes are required  for ETW logs to upload to MDS and be displayed in searches.