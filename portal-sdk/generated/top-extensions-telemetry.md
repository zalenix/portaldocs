
<a name="overview"></a>
## Overview

The Azure Portal tracks several pieces of information as users navigate through the Portal. Extensions do not need to consume any APIs to collect this information. Instead, telemetry is made available to partners through Kusto.

Portal Telemetry is a Kusto-based solution.  The Kusto database is loaded with data that streams from Cosmos, data that is logged from your extension, and data from the Portal that is associated with your extension. The AzPortal data source is located at [https://AzPortal.kusto.windows.net](https://AzPortal.kusto.windows.net). To run or create modified versions of **Kusto** queries, you will need access to the  **Kusto** data tables. All Azure employees should have access. If you cannot access **Kusto**, verify whether  you have joined your team's standard access group as specified in  [http://aka.ms/standardaccess](http://aka.ms/standardaccess). If the access group is not listed,  please reach out to   <a href="mailto:ibiza-telemetry@microsoft.com?subject=Standard Permission Access for Kusto Databases">Ibiza Telemetry</a>.

The **Kusto** Explorer application that can be saved to your local computer is located at [http://kusto-us/ke/Kusto.Explorer.application](http://kusto-us/ke/Kusto.Explorer.application).  Queries can also be run against the Kusto database by using the **Kusto.WebExplorer** that is located at [https://ailoganalyticsportal-privatecluster.cloudapp.net](https://ailoganalyticsportal-privatecluster.cloudapp.net)

The following table contains Ibiza PM contacts for various Portal Telemetry questions.

| Topic | Contact |
| ----- | ------- |
| Performance  | <a href="mailto:ibiza-perf@microsoft.com?subject=Performance and Reliability Telemetry">Ibiza Performance and Reliability Telemetry</a> |
| Create Telemetry | <a href="mailto:ibiza-create@microsoft.com?subject=Extension Create Telemetry">Ibiza Create Telemetry</a> |
| General telemetry questions |  <a href="mailto:ibiza-telemetry@microsoft.com?subject=Portal Telemetry">Ibiza Telemetry</a>  | 
| Azure Fx Gauge Team  | <a href="mailto:azurefxg@microsoft.com?subject=Portal Gauge Telemetry">Ibiza Telemetry</a>  |

<a name="weekly-status-queries"></a>
## Weekly status queries

 On a weekly basis, the Ibiza team sends out an Ibiza Status mail that reviews the KPI numbers for all extensions. If you are not receiving these emails, please join one of the groups in the following image.

<!-- TODO:  Locate the image and transform it to text, or delete the previous sentence. -->

The line items in these emails contain links that help you locate the **Kusto** query that generated the associated numbers. 

![alt-text](../media/portalfx-telemetry/connectionScope.png "Connection Scope")

<a name="cosmos-streams"></a>
## Cosmos streams

Although Portal reporting is primarily supported by **Kusto**, some Portal data is still streamed from Cosmos.  For example,  **ClientTelemetryForKustoExport** is the stream that currently feeds the **AzPtlCosmos** database.  This data might be required if you need to develop queries that are more complex than the Kusto queries, if you need data that is older than 120 days, or if you need to enable  E2E automation.  The following table contains a list of streams and the associated dashboards and Cosmos links.

<!-- TODO:  Verify whether both streams still exist, or if the streams have been merged. -->
<!-- TODO:  Verify the Cosmos links can be replaced with aka.ms links. -->

| Purpose                 | Dashboard Name                | Schema                                                           | Cosmos Link |
| ----------------------- | ----------------------------- | ---------------------------------------------------------------- | ----------- |
| Daily Client Telemetry  | ClientTelemetry               | [DataSet=53004](https://aka.ms/datastudio/#/entity/53004/schema) | [https://cosmos11.osdinfra.net/cosmos/AzureAnalytics.Partner.AAPT/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Daily/ClientTelemetry/](https://cosmos11.osdinfra.net/cosmos/AzureAnalytics.Partner.AAPT/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Daily/ClientTelemetry/)                          |
| Hourly Client Telemetry | ClientTelemetryForKustoExport | [DataSet=93405](https://aka.ms/datastudio/#/entity/93405/schema) | [https://cosmos11.osdinfra.net/cosmos/azureanalytics.partner.azureportal/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Hourly/ClientTelemetryForKustoExport/](https://cosmos11.osdinfra.net/cosmos/azureanalytics.partner.azureportal/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Hourly/ClientTelemetryForKustoExport/)   |

<a name="kusto-portal-databases"></a>
## Kusto portal databases

The following table specifies the Kusto databases that contain Azure Portal telemetry data.

* **AzPtlCosmos**

  This is the main Azure Portal telemetry database. Data here is deduped, geo-coded, expanded and filtered. All the official dashboards and reports are based on this table. It is highly encouraged to use  this database for your needs. Data here is persisted for 120 days and excludes test traffic.
                                                                                                  |
* **AzurePortal**

	This database contains  the raw, unprocessed data that comes from MDS directly to Kusto. There are many scenarios where you may want to debug extension issues, for example, performance or creates. This is the right table to use to review diagnostic events. Data here is persisted for 45 days. To filter out test traffic when performing queries on this database, use `userTypeHint == ""`.       |

For more information about Kusto and the data provided in the Portal Kusto cluster, see [portalfx-telemetry-kusto-databases.md](portalfx-telemetry-kusto-databases.md).

<a name="kusto-portal-databases-kusto-tables"></a>
### Kusto tables

| Database          | Table Name        | Details             |
| ----------------- | ----------------- | ------------------- |
| AzPtlCosmos       | [ClientTelemetry](#clienttelemetry)   | Contains all the Client Telemetry data that is collected from the Portal.     |
| AzPtlCosmos       | ExtTelemetry      | Contains client events data for extensions that use the Extension Telemetry feature. Developers may log additional telemetry to this table.  Your extension will log to this table only if you have previously onboarded to the **ExtTelemetry** and **ExtEvents** tables, as specified in [#onboarding-to-tables](#onboarding-to-tables).   |
| AzurePortal       | ClientEvents      | Contains errors and warnings thrown from Framework and Hubs IFrame.                                        |
| AzurePortal       | ExtEvents         | Contains errors and warnings thrown from an extension's IFrame. Your extension will log to this table only if you have previously onboarded to the **ExtTelemetry** and **ExtEvents** tables,  as specified in [#onboarding-to-tables](#onboarding-to-tables).  |

**NOTE**: Data in both **ClientTelemetry** and **ExtTelemetry** tables only includes rows where the action is present in their respective allow lists. If you need to query for actions that are not present in these tables, Kusto supports cross-databases queries that allow you to query the **ClientTelemetry** or **ExtTelemetry** tables directly from the AzurePortal database. For more information, see [https://kusto.azurewebsites.net/docs/queryLanguage/query_language_syntax.html?q=cross](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_syntax.html?q=cross).

Queries against these tables can be exceedingly complex. The database also contains functions that simplify the complexity of retrieving information in the appropriate format. The following image displays a list of some functions that are located in the  **Functions\Public** directory and that are run against the Kusto databases to perform queries. 

![alt-text](../media/portalfx-telemetry/supportedfunctions.png "Supported Functions")

You can right-click on  a function and then select "Make a command script" to view  the details of that function. This can be performed recursively for any function.  There are other functions in the databases, but they are mainly intended for internal use and are subject to change at any time.

<a name="logging"></a>
## Logging

There are two options for collecting telemetry and error and warning logs. You can configure and use the Portal Framework's built-in telemetry services or you can build an entirely custom telemetry system. It is strongly recommended that your extension should use the Portalfx Framework telemetry controller, because the system which is in place is likely to be more performant than custom solutions.  However, if you choose to build your own telemetry system, you need to have practices in place that enforce  the guidelines that are associated with the collection of personally identifiable information (PII).  It is very important for security and compliance reasons that PII data is not sent to telemetry services.

<a name="logging-onboarding-to-tables"></a>
### Onboarding to tables

To use the built-in controller provided by Framework for collecting telemetry and error/warning logs,  add `this.EnablePortalLogging = true;` in the constructor of the extension definition class, as in the following code.

```cs
  public Definition(ApplicationConfiguration applicationConfiguration)
  {
      this.EnablePortalLogging = true;
  }
```

For more information about using the Portal telemetry controller, see [portalfx-telemetry-logging.md](portalfx-telemetry-logging.md).

<a name="logging-logging-to-the-exttelemetry-table"></a>
### Logging to the ExtTelemetry table

Telemetry logs are stored in the **ExtTelemetry** table. Your extension should initialize the telemetry service so that you can use the Portal telemetry APIs to log telemetry, as in the following code.

```ts
  // Initialize the telemetry functionality and make it available for use.
  MsPortalFx.Base.Diagnostics.Telemetry.initialize("extensionName", false /* traceBrowserInformation */ );
```
To log telemetry, you can call the `trace` method as in the following code.

```ts
  MsPortalFx.Base.Diagnostics.Telemetry.trace({
      extension: "Microsoft_Azure_NewExtension",
      source: "Links",
      action: "LinkClicked",
      name: "Recommended",
      data: {...}
  });
```

The recommended format for `the name` column is `'Extension/<extensionName>/Blade/<bladeName>'`, if the event is related to a blade. 

Do not stringify `data` and `context` columns when sending them through, because these columns usually contain JSON values. Instead, you should send their values as objects, to avoid double-encoding strings. 

Browser information is collected globally, therefore the extension is not required to trace browser information.  However, 
the extension can set `traceBrowserInformation` to `true` to store browser information in your own telemetry.

<a name="logging-logging-to-the-extevents-table"></a>
### Logging to the ExtEvents table

Errors and warnings are logged to the **ExtEvents** table. To log errors and warnings, the extension can call the `error`/`warning` methods as in the following code.

```ts
  var log = new MsPortalFx.Base.Diagnostics.Log("logging_area");
  log.warning(errorMessage, code, args);
  log.error(errorMessage, code, args);
```

Additional information can be logged with the message by sending it in the `args` parameter. Do not stringify the information; instead, send it as an object.

**NOTE:** Verbose logging is disabled in the MPAC and PROD environments to prevent overly aggressive logging. We recommend that verbose logging be used only for debugging.

The Extension Errors Dashboard that is described in the document located at [top-extensions-telemetry-create.md](top-extensions-telemetry-create.md) will help you analyze the errors and warnings thrown by your extension. 
In the dashboard charts, error messages are aggregated by omitting the text which is within double quotes (") or single quotes ('), which are the dynamic part of messages. This includes information  like id's or  timestamps. For example, the  message '[Could not find part "PartName1"]' will be treated as '[Could not find part ""]'. Please use this format for all the logged error messages, if you want them to be aggregated by our queries.

<a name="logging-logging-to-the-clienttelemetry-table"></a>
### Logging to the clientTelemetry table

This is the main table that is used for most scenarios. It includes telemetry events like  `BladeLoaded` or  `PartLoaded`,  and that  are logged by default for any extension which is registered in the Portal.

For more information about actions that are logged to the ClientTelemetry table, see [portalfx-telemetry-actions.md](portalfx-telemetry-actions.md).

<a name="the-clienttelemetry-table"></a>
## The clientTelemetry table

The following columns are in the **clientTelemetry** table.

<!-- TODO:  Determine what happened to the values that are not in bold. -->

* **ActionModifier**: Represents a status of a specific action, and is used in tandem with the `action` field. For example, a BladeReady event might use the `ActionModifier` values of start, complete and cancel.

* Area: Contains the extension name associated with the specific Action. This is derived from either then Name field or the Source field depending on the Action

* Blade: Contains the Blade name associated with the specific Action. This is derived from either then Name field or the Source field depending on the Action

* BrowserFamily: Contains  the name of the Browser used by the User. This is derived from the UserAgent field

* BrowserMajorVersion: Contains  the Major Version of the Browser used by the User. This is derived from the UserAgent field

*  BrowserMinorVersion: Contains the Minor Version of the Browser used by the User. This is derived from the UserAgent field

* **ClientTime**: Contains the actual time of the event according to the client's clock, whose accuracy is based on the client settings. This is a good field to reconstruct the precise sequence of events.

* **Data**:  This is a JSON object with no set structure. It is the most dynamic field in telemetry. It typically contains information specific to a specific action. The following  is an example of the data that is logged for `ProvisioningStarted` action or event.
	
	```json
		{
			"oldCreateApi": true,
			"launchingContext": {
			"galleryItemId": "Microsoft.SQLDatabase",
			"source": [
				"GalleryCreateBlade"
			],
			"menuItemId": "recentItems",
			"itemIndex": 0
			}
		}
	```

* **duration**: Contains the duration, expressed in milliseconds, that a specific Action took to complete. This value is non-zero only for Actions with ActionModifier having values either "complete", "succeeded", etc.

* **journeyId**: Contains the journey Id for each action. A journey is basically a tiny sub-session within which a user navigates a flow of blades. This id helps the Portal  identify the actions that the user took within a specific journey, count how many journeys  a user interacted with, and similar computations.

* Lens: Contains the Lens name associated with the specific Action. This is derived from either then Name field or the Source field depending on the Action

*  Name: Contains the name of the extension\Blade\Lens\Part associated with a specific Action. Its format may change based on the Action. In most scenarios, it usually has the following format: `Extension/<extensionName>/Blade/<BladeName>/Lens/<LensName>/PartInstance/<PartName>`

* **SessionId**: Represents each session that the user opens. This field  refreshes every ime a user logs in or refreshes. 

* Part: Contains the Part name associated with the specific Action. This is derived from either then Name field or the Source field depending on the Action

* **PreciseTimeStamp**: Contains the time that the event was logged by the server, expressed in UTC.

* **UserId**: Identifies a user by PUID. This is used in  identifying queries like daily active users, unique users using a feature, and others.

* **UserAgent**: The user agent of the user, expressed as a standard UserAgentString. [User Agent](https://en.wikipedia.org/wiki/User_agent)

* UserCity: Contains the name of the city that the User has used the Portal from. We derive this from the Users Client IP.

*  UserCountry: Contains the name of the country that the User has used the Portal from. We derive this from the Users Client IP.

<a name="the-clienttelemetry-table-kusto-documentation"></a>
### Kusto documentation

For more information about the Kusto query language, see [https://kusto.azurewebsites.net/docs/queryLanguage/query_language.html](https://kusto.azurewebsites.net/docs/queryLanguage/query_language.html).

For videos and other Kusto documentation, see [http://kusto.azurewebsites.net/docs](http://kusto.azurewebsites.net/docs).

For Kusto discussion groups, see [http://idwebelements/GroupManagement.aspx?Group=KusTalk&Operation=join](http://idwebelements/GroupManagement.aspx?Group=KusTalk&Operation=join).