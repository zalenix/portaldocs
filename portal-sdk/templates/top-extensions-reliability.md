
## Overview

Reliability of the Portal is one of the top priorities for our customers. As an extension author you have a duty to uphold your extension to the reliability bar at a minimum. 

| Area          | Reliability Bar     | Telemetry Actions                  | How is it measured? |
| ---------     | ------------------- | ------------------------            | ------------------- |
| Extension     | See Power BI        | ExtensionLoad | (# of ExtensionLoad completes / (# of ExtensionLoad completes + cancels)) * 100 |
| Blade         | See Power BI        | BladeLoaded vs BladeLoadErrored     | (( # of BladeLoaded started - # of BladeLoadErrored's) / # of BladeLoaded started) * 100 |
| Part          | See Power BI        | PartLoaded                          | (( # of PartLoaded started - # of PartLoaded canceled) / # of PartLoaded started) * 100 |

Extension reliability is the core of the customer experience. If the Portal is unable to load your extension, it will be unable to surface any of your experience. Consequently, your customers will be unable to manage or monitor their resources through the Portal.

Second to extension reliability, Blade reliability is the next level of critical reliability. It is similar to a page loading in a website, and failing to load is a critical issue.

Parts are used throughout the Portal, from a blade and dashboard perspective. Parts that fail to load, result in an inability to navigate to a blade or the next blade.  They may also fail to display critical data that the user expects to see on the dashboard, and other factors.

## Assessing extension reliability

There are two methods to assess the reliability of an extension, blade or part.
Performance metrics are located on the PowerBi dashboard, and indicate how well  an extension, blade, or part is performing. These metrics are describe in [Performance metrics](#performance-metrics).

The other method is to examine and correct error conditions that are reported on the dashboard, as specified in [#extension-errors-powerbi-dashboard](#extension-errors-powerbi-dashboard).

### Performance metrics

You can access the PowerBi dashboard by using the Telemetry onboarding guide that is located at [portalfx-telemetry-getting-started.md](portalfx-telemetry-getting-started.md).  Then, access the Extension performance/reliability report that is located at [http://aka.ms/portalfx/dashboard/extensionperf](http://aka.ms/portalfx/dashboard/extensionperf). This is the easiest way to determine how performant the extension is, as this is maintained on a regular basis by the Ibiza team. You can run queries locally but ensure you are using the Azure-provided Kusto functions to calculate the assessment.

## Extension Errors PowerBi dashboard

The Extension Errors PowerBi dashboard gives you the ability to view the errors and warnings thrown by your extension. It is located at  [http://aka.ms/portalfx/dashboard/ExtensionErrors](http://aka.ms/portalfx/dashboard/ExtensionErrors). Accessing the dashboard requires telemetry access, as specified in  [portalfx-telemetry-getting-started.md#permissions](portalfx-telemetry-getting-started.md#permissions). Extension errors and warnings will be tracked only if it has been onboarded to the  ExtTelemetry/ExtEvents tables, as specified in [portalfx-telemetry.md](portalfx-telemetry.md). 

All time stamps that are displayed  in this dashboard are UTC time stamps. Currently, the dashboard is  refreshed automatically eight times a day, which is the maximum number of scheduled refreshes allowed by PowerBI. The refreshes occur at the following times during working hours: 8:00 AM, 9:30 AM, 11:00 AM, 12:30 PM, 2:00 PM, 3:30 PM, 5:00 PM and 6:30 PM (Pacific Time).



"Errors by Environment" and "Warnings by Environment" are the charts that you need to monitor. You can  check to see if there are any significant spikes in the report. An example of the "Errors by Environment" report is in the following image.


![alt-text](../media/top-extensions-performance/overallErrors.png "Errors by Environment")


The following three charts are located in each column.

* Affected Users % 
    
    This is the percentage of users which had at least one error, divided by the total number of users that  were using the Portal. This chart is used to detect changes in the error percentage pattern.

* Affected Users Count 

    This is the total number of users that had an error that was thrown by the Portal.

* Error Count 

    The total number of errors that were thrown by the Portal.

To hide irrelevant spikes, where the portal is used by less than 10 users, you can use the options on the left navigation bar. select the option "Show Data" -> "Where total users > 10".


Error messages are aggregated by omitting the text that is contained in double quotes (") or single quotes ('). Those parts of the message are the dynamic part of the message, like an id or  a timestamp. For example, the message `[Could not find part "PartName1"]` is treated as `[Could not find part ""]`. Your extension should use this format for all logged error messages, so that they can be  aggregated by our queries.


 Another useful chart is the "Last 24 Hours Error Summary", which shows the errors thrown by an extension aggregated for the last 24 hours.

If you want to analyze a spike, you can drill down into the top errors thrown by your extension in a specific hour by navigating  to the "1 Hour Error Drilldown" chart. You can drill down into the errors thrown by the extension by using the following functions from Kusto on the Azure Portal database.

* Retrieve the error counts for a specific environment between a startTime and an endTime, grouped by a specific time granularity (e.g. 1 hour):

    ```sql
    GetExtensionErrorCounts(datetime("2016-07-25 00:00:00"), datetime("2016-07-26 00:00:00"), "Compute", "Error", "portal.azure.com", 1h)
    | where clientVersion == "4.12.102.0 (82a67ee.160722-1641)"
    ```

* Retrieve the top 10 errors from last hour, independent of client version:

    ```sql
    Top10ExtErrorsFromLastHour("Compute", "Error", "portal.azure.com")
    ```

* Retrieve all the error messages for a specific environment that follow a message pattern between a startTime and an endTime:

    ```sql
    GetExtensionErrorsByAggregatedErrorMessage(datetime("2016-07-25 18:15:00"), datetime("2016-07-26 18:30:00"), "Compute", "Error", "portal.azure.com", 'message: Script error')
    | where clientVersion == "4.12.102.0 (82a67ee.160722-1641)"
    | take 1000
    ```

1. Run Kusto queries locally to determine your numbers. The queries differ slightly, depending on whether the focus of the inquiry is the extension, the blade, or the part.  The queries are as follows.

    ```txt
    GetExtensionFailuresSummary(ago(1d), now())
    | where extension contains "<extensionName>"
    ```

    ```txt
    GetBladeFailuresSummary(ago(1d), now())
    | where extension contains "<extensionName>"
    ```

    ```txt
    GetPartFailuresSummary(ago(1d), now())
    | where extension contains "<extensionName>"
    ```

Run the query with your extension name, without the angle brackets. Include a meaningful time range, if the last 24 hours is not sufficient.  Other parameters for the queries are in the following table.

| Field name        | Definition |
| ----------------- | ---------- |
| extension         | The extension in question |
| blade             | Blades only. The blade in question |
| blade             | Parts only. The blade that contains the part. If blade === 'Dashboard' then the part was loaded from a dashboard |
| part              | Parts only. The part the error correlates to |
| errorState        | Extensions only. The type of error that occurred |
| error             | Extensions only. The specific error that occurred |
| errorReason       | The error reason associated with the failure |
| Occurences        | Number of occurrences |
| AffectedUsers     | Number of affected users |
| AffectedSessions  | Number of affected sessions |
| any_sessionId     | A sample of an affected session |
| any_details       | A sample message of what would normally be returned given extension/blade/errorReason |


For more information on how to 
## Checklist

The following are topics that the Ibiza team recommends for improved extension performance.

1. [Extension HomePage Caching](portalfx-performance-caching-homepage.md)

1. [Persistent Caching of scripts across extension updates](portalfx-performance-caching-scripts.md)

1. Geo-distribution
  Ensure that your extension is served from a location as close as possible to your users. The Ibiza team provides an [Extension Hosting Service](top-extensions-hosting-service.md) which handles geo-distribution.

1. To assess extension performance by data center, see the Extension performance/reliability report that is located at [http://aka.ms/portalfx/dashboard/extensionperf](http://aka.ms/portalfx/dashboard/extensionperf). 

1. Turn on IIS compression, as specified in [http://aka.ms/portalfx/iiscompression](http://aka.ms/portalfx/compression).

## Code optimisations to improve extension reliability

The `setDataContext` API on `ViewModel` factories was designed previous to AMD support in TypeScript. It slows down extension load by increasing the amount of code downloaded on extension initialization. This also increases the risk of extension load failures due to increase in network activity. By switching to the `setDataContextFactory` method, the amount of code downloaded is reduced to the bare minimum. In addition, the individual data contexts are loaded if and when required, for example, if a blade that's opened requires it.

The legacy code is in the following example. 

```javascript
this.viewModelFactories.Blades().setDataContext(new Blades.DataContext());
```

The new method to use in your extensions is in the following example. 

```javascript
this.viewModelFactories.Blades().setDataContextFactory<typeof Blades>(
        "./Blades/BladesArea",
        (contextModule) => var x = new contextModule.DataContext()
);
```

### Extension Error States

Correlate the error state with the action items to see the guided next steps.

| Error state  | Definition | Action items |
| ------------ | ---------- | ------------ |
|  FirstResponseNotReceived |  The shell loaded the extension URL obtained from the config into an IFrame, however there wasn't any response from the extension |  * Scan the events table to see if there are any other relevant error messages during the time frame of the alert. <br> * Next, try opening the extension URL directly in the browser - it should show the default page for the extension. <br>* Open the dev tools network tab in your browser and try opening the extension URL appending the following query string parameter sessionId=testSessionId - this should open a blank page and all requests in the network tab should be 200 or 300 level responses (no failures). If there is a server error in the extension - it will print out the error and a call stack if available. In case the failures are from a CDN domain, check if the same URL is accessible from the extension domain - if so, the CDN might be corrupt/out of sync. In this case, flushing the CDN would mitigate the issue. |
|  HomePageTimedOut |  The index page failed to load within the max time period  |  // Need steps to action on |
| ManifestNotReceived |  This error state means that the bootstrap logic was completed, however the extension did not return a manifest to the shell. The shell waits for a period of time and then timed out. |   *              Open the dev tools network tab in your browser and try opening the extension URL appending the following query string parameter sessionId=testSessionId - this should open a blank page and all requests in the network tab should be 200 or 300 level responses (no failures). If there is a server error in the extension - it will print out the error and a call stack if available. In case the failures are from a CDN domain, check if the same URL is accessible from the extension domain - if so, the CDN might be corrupt/out of sync. In this case, flushing the CDN would mitigate the issue. <br> * Scan the events table to see if there are any other relevant error messages during the time frame of the alert |
|  InvalidManifest |             This error state means that the manifest that was received from an extension was invalid, i.e. it had validation errors | Scan the error logs for all the validation errors in the extension manifest. |
| InvalidDefinition |           This error state means that the definition that was received from an extension was invalid, i.e. it had validation errors |             Scan the error logs for all the validation errors in the extension definition. |
| FailedToInitialize |             This error state means that the extension failed to initialize one or more calls to methods on the extension's entry point class failing |  *              Look for the error code and if it is present the call stack in the  message to get more details. <br>* Then, scan the events table to get all the relevant error messages during the time frame of the alert.  <br> *        These errors should have information about what exactly failed while trying to initialize the extension e.g. the initialize endpoint, the getDefinition endpoint, etc. |
|  TooManyRefreshes |  This error state means that the extension try to reload itself within the IFrame multiple times. The error should specify the number of times it refreshed before the extension was disabled |              Scan the events table to see if there are any other relevant error messages during the time frame of the alert |
|  TooManyBootGets |             This error state means that the extension try to send the bootGet message to request for Fx scripts multiple times. The error should specify the number of times it refreshed before the extension was disabled  |             Scan the events table to see if there are any other relevant error messages during the time frame of the alert |
|             TimedOut  | This error signifies that the extension failed to load after the predefined timeout. |          *           Scan the events table to see if there are any other relevant error messages during the time frame of the alert. <br>*                   Analyze the error messages to try to deduce whether the problem is on the extension side or the shell.        <br>*          If the issue is with the extension, look at CPU utilization of the cloud service instances. If the CPU utilization is high, it might explain why clients are timing out when requesting resources from the server. |
|   MaxRetryAttemptsExceeded | This a collation of the above events |   Inspect the sample message and follow appropriate step above |

### Blade  Error States

| Error reason | Definition | Action items |
| ------------ | ---------- | ------------ |
| ErrorInitializing | The Portal failed to initialize the blade due to an invalid definition. | Verify the PDL definition of the given blade. Verify the source opening the blade is passing the correct parameters. Reference a sample session in the ClientEvents kusto table there should be correlating events before the blade failure. |
|  ErrorLoadingExtension | The extension failed to load and therefore the blade was unable to load.   | Refer to the guidance provided for extension reliability  |
|  ErrorLoadingDefinition |     The FX was unable to retrieve the blade defintion from the Extension.   |       Reference a sample session in the ClientEvents kusto table there should be correlating events before the blade failure  |
| ErrorLoadingExtensionAndDefinition |            The FX was unable to retrieve the blade defintion from the Extension. |             Reference a sample session in the ClientEvents kusto table there should be correlating events before the blade failure |
|      ErrorUnrecoverable |              The FX failed to restore the blade during journey restoration because of an unexpected error. |         This should not occur but if it does file a [shell bug](http://aka.ms/portalfx/shellbug). |

### Part Error States

| Error reason | Definition | Action items |
| ------------ | ---------- | ------------ |
| TransitionedToErrorState  |         The part was unable to load and failed through its initialization or OnInputsSet  |          Consult the any_details column, there should be sample message explaining explicitly what the issue was. Commonly this is a nullRef. |
|      ErrorLocatingPartDefinition |    The FX was unable to determine the part definition. |   The likely cause of this is the extension has removed the part entirely from the PDL, this is not the guided pattern.
            See deprecating parts for the explicit guidance. __NEED LINK__ |
|  ErrorAcquiringViewModel |  The FX was unable to retrieve the part view model from the Extension. |        You can correlate the start of thesample message with one of the below for common explanations. <br> *        ETIMEOUT - This may be caused by a flooding of the RPC layer. <br> *                      Script error - Dependent on the exact message, this may be due to timeouts/latency issues/connection problems. <br> *   Load timeout for modules - This may be caused by a slow or loss of connection. <br> *    description: - This is generic bucket, here the message will define the issue further. For example if there were null references<br>              For all the above if enough information was not provided via the message explore the raw events function or reference a sample session in            the ClientEvents kusto table as there should be correlating events before the failure.             |
|        ErrorLoadingControl |  The FX was unable to retrieve the control module. |  Reach out to the FX team if you see a large amount of these issues. |
|  ErrorCreatingWidget |   The FX failed to create the widget. |   Check the sample message this is indicate the explicit reason why it failed, this was probably a ScriptError or failure to load the module. |
|  OldInputsNotHandled |        In this case a user has a pinned representation of a old version of the tile. The extension author has changed the inputs in a breaking fashion. | If this happens you need follow the guided pattern. __NEED LINK__ |


### Find the cause of error/warning spikes

Query hints:

- You can select all the error messages between startTime and endTime by using "*" when looking for the error message. Otherwise, you can search by the entire aggregated error message or just by a part of it.  One example is  'message: Script error'.
- ErrorType can be: "Error", "Warning" or "Verbose".


