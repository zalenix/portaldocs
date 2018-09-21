
## Overview

Developers can examine telemetry while debugging an extension. The Azure Portal tracks several pieces of information as users navigate through the Portal.

Extensions do not need to consume any APIs to collect this information. Instead, debugging telemetry is made available as specified in [#live-telemetry](#live-telemetry), and production telemetry is made available to partners through **Kusto**.

Portal Telemetry is a Kusto-based solution.  The Kusto database contains data that streams from Cosmos, data that is logged from your extension, survey data that is collected from your users, and data from the Portal that is associated with your extension. The AzPortal data source is located at [https://AzPortal.kusto.windows.net](https://AzPortal.kusto.windows.net). 

The telemetry data can be viewed a number of ways. Developers can review telemetry data by using existing dashboards, or they can run queries on the **Kusto** databases.

## Permissions

To run or create modified versions of **Kusto** queries, you will need access to the  **Kusto** data tables in the appropriate cluster. All Azure employees should have access to the Kusto clusters. Permissions are granted through inheritance of the overall AAD group, which is `REDMOND\AZURE-ALL-PSV` for teams in C+E, and `REDMOND\AZURE-ALL-FPS` for teams outside. We do not grant individual access.

If you cannot access **Kusto**, verify whether  you have joined your team's standard access group as specified in  [http://aka.ms/standardaccess](http://aka.ms/standardaccess).   Some group names in the table of team projects  named 'Active ​Azure Team Projects' are non-intuitive, so if you are unable to locate the correct group within the table, you may need to create a new group. To do that please follow the instructions in the section named '[Azure RBAC Getting Started Guide](http://aka.ms/portalfx/telemetryaccess/newgroup)'.  Ensure your request has been approved. If you have been denied for any reason, or if the access group is not listed,  please reach out to   <a href="mailto:ibiza-telemetry@microsoft.com?subject=Standard Permission Access for Kusto Databases">Ibiza Telemetry</a>.

The **Kusto** Explorer application that can be saved to your local computer is located at [http://kusto-us/ke/Kusto.Explorer.application](http://kusto-us/ke/Kusto.Explorer.application).  Queries can also be run against **Kusto**  by using the **Kusto.WebExplorer** that is located at [https://ailoganalyticsportal-privatecluster.cloudapp.net](https://ailoganalyticsportal-privatecluster.cloudapp.net).

The following table contains dashboards that are used to review telemetry data.  If you do not have access to the ones you need, please contact <a href="mailto:ibiza-telemetry@microsoft.com?subject=Do not have dashboard access">Ibiza Telemetry</a>.

| Name        | Dashboard Link       | Documentation                           |
| ----------- | -------------------- | --------------------------------------- |
| Portal Performance and Reliability | [http://aka.ms/portalfx/dashboard/extensionperf](http://aka.ms/portalfx/dashboard/extensionperf)                               | [Perf Docs](portalfx-performance-overview.md) and Reliability Docs that are located at [top-extensions-reliability.md](top-extensions-reliability.md)           |
| Portal Create                      | [http://aka.ms/portalfx/dashboard/create](http://aka.ms/portalfx/dashboard/create)                                | Create Docs that are located at [top-extensions-telemetry-create.md#create-flows](top-extensions-telemetry-create.md#create-flows)                      |
| Extension Errors                   | [http://aka.ms/portalfx/dashboard/ExtensionErrors](http://aka.ms/portalfx/dashboard/ExtensionErrors)                             | Extension Errors Docs that are located at [top-extensions-telemetry-create.md#error-distribution-reports](top-extensions-telemetry-create.md#error-distribution-reports)   |

The following table contains Ibiza PM contacts for various Portal Telemetry questions.

| Topic | Contact |
| ----- | ------- |
| Performance  | <a href="mailto:ibiza-perf@microsoft.com?subject=Performance and Reliability Telemetry">Ibiza Performance and Reliability Telemetry</a> |
| Create Telemetry | <a href="mailto:ibiza-create@microsoft.com?subject=Extension Create Telemetry">Ibiza Create Telemetry</a> |
| General telemetry questions |  <a href="mailto:ibiza-telemetry@microsoft.com?subject=Portal Telemetry">Ibiza Telemetry</a>  | 
| Azure Fx Gauge Team  | <a href="mailto:azurefxg@microsoft.com?subject=Portal Gauge Telemetry">Ibiza Telemetry</a>  |
| Updating alerts | <a href="mailto:ibizafxhot@microsoft.com;azurefxg@microsoft.com?subject=Extension Alert Configuration&body=My team would like to update the correlation rules for our extension.  The configuration to update is for alert <Alert_YOUR_EXTENSION_NAME>.  The updated configuration is attached.">ibizafxhot@microsoft.com; azurefxg@microsoft.com</a> | 

Ask Stackoverflow questions on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-telemetry](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-telemetry)

## Weekly status queries

 On a weekly basis, the Ibiza team sends out an Ibiza Status mail that reviews the KPI numbers for all extensions. If you are not receiving these emails, please join one of the groups in the following image.

<!-- TODO:  Locate the image and transform it to text, or delete the previous sentence. -->

The line items in these emails contain links that help you locate the **Kusto** query that generated the associated numbers. 

![alt-text](..//media/top-extensions-telemetry/connectionScope.png "Connection Scope")

## Programmatic onboarding

The email to `azurefxg@microsoft.com` to update extension alerts should confirm the following items.

1. A brief reason why you need access.

1. Which databases (AzurePortal, AzPtlCosmos, hostingservice) you need to access.

    **NOTE**: Ibiza only provides Viewer (read) access to the log databases.

1. You understand that programmatic access to these databases potentially allows anonymous access to the uncensored production logs.

1. You are following Microsoft procedures for key storage.  Typically, this means storing the certificate in KeyVault and rotating the key at the appropriate frequency, as specified in [top-extensions-hosting-service.md#configuring-contentunbundler-for-ev2-based-deployments](top-extensions-hosting-service.md#configuring-contentunbundler-for-ev2-based-deployments).

1. Your handling of any data you access this way complies with Microsoft PII & [GDPR](https://www.microsoft.com/en-us/trustcenter/Privacy/GDPR) policies. This means, but is no way limited to:

   1. Not copying or downloading non-anonymized logs, even to secure systems, unless you have registered those systems with GDPR for deletion and export. 

   1. Not making available anonymous access by proxy. For example, a web site or other access mechanism that allows the caller, whether or not they are authenticated, to make non-delegated requests as the service principal is a proxy access. One  specific example is  a log search tool that connects directly as the Service Principal or dSTS Service Identity, as described in [http://aka.ms/portalfx/kusto-dsts](http://aka.ms/portalfx/kusto-dsts), instead of using delegated authentication.

1. Your application must not put excessive loads on the cluster that contains its Kusto databases and tables, especially during peak times like 5 - 7pm PST, or midnight - 1am UTC. 

    * Please supply examples of the queries you will be executing, in addition to the schedule or frequency.
    
    * The AAD App ID of your Service Principal or the certificate thumbprint of your dSTS Service Identity. If using an AAD Service Principal, your application uses certificate-based authentication for its Service Principal, as specified in [top-extensions-alerting.md#creating-a-certificated-partner-service-principal](top-extensions-alerting.md#creating-a-certificated-partner-service-principal).

1. A contact e-mail for this application that Ibiza can reach out to in cases of outage, capacity planning, and similar support features. This is a team alias instead of an individual email.

1. If you are using the **Kusto** Client SDK to connect, that  `ClientRequestProperties.Application` is set to an appropriate value. If you are using another access method that supports a similar feature, ensure that the extension connects to **Kusto**.

1. Whether you need to create your own functions and tables, including write access, in **Kusto**. This means creating a dedicated database for your team with a suitable name that you supply, for which you will then be responsible for maintaining, including registering with the GDPR scanner, or other similar entities.  If you are not sure  whether you need your own functions or tables, answer this as "No" and file a new request with <a href="mailto:ibizafxhot@microsoft.com;azurefxg@microsoft.com?subject=Extension Alert Configuration Changes&body=My team would like to update the correlation rules for our extension.  The configuration to update is <Alert_YOUR_EXTENSION_NAME>.  The updated configuration is attached.">ibizafxhot@microsoft.com; azurefxg@microsoft.com</a>  if the answer changes.  The email to azurefxg@microsoft.com should contain the information in this list. 

Once azurefxg@microsoft.com receives and approves the onboarding request, they will reach out to you.  When your identities are validated, they will enable your app ID with Viewer access for the requested databases. There is no propagation delay associated with enabling programmatic access.

**NOTE**: **Kusto** is a shared capacity system. As such, we reserve the right to shut down applications that put excessive load on the system. 

## Cosmos streams

Although Portal reporting is primarily supported by **Kusto**, some Portal data is still streamed from Cosmos.  For example,  **ClientTelemetryForKustoExport** is the stream that currently feeds the **AzPtlCosmos** database.  This data might be required if you need to develop queries that are more complex than the Kusto queries, if you need data that is older than 120 days, or if you need to enable  E2E automation.  The following table contains a list of streams and the associated dashboards and Cosmos links.

<!-- TODO:  Verify whether both streams still exist, or if the streams have been merged. -->
<!-- TODO:  Verify the Cosmos links can be replaced with aka.ms links. -->

| Purpose                 | Dashboard Name                | Schema                                                           | Cosmos Link |
| ----------------------- | ----------------------------- | ---------------------------------------------------------------- | ----------- |
| Daily Client Telemetry  | ClientTelemetry, DataSet=53004 | [https://datastudio.msftcloudes.com/#/entity/53004/schema](https://aka.ms/datastudio/#/entity/53004/schema) | [https://cosmos11.osdinfra.net/cosmos/AzureAnalytics.Partner.AAPT/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Daily/ClientTelemetry/](https://cosmos11.osdinfra.net/cosmos/AzureAnalytics.Partner.AAPT/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Daily/ClientTelemetry/)                          |
| Hourly Client Telemetry | ClientTelemetryForKustoExport, DataSet=93405 | [https://aka.ms/datastudio/#/entity/93405/schema](https://aka.ms/datastudio/#/entity/93405/schema) | [https://cosmos11.osdinfra.net/cosmos/azureanalytics.partner.azureportal/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Hourly/ClientTelemetryForKustoExport/](https://cosmos11.osdinfra.net/cosmos/azureanalytics.partner.azureportal/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Hourly/ClientTelemetryForKustoExport/)   |

## Kusto Portal databases

**Kusto** is a fantastic product, but it has some limitations when it comes to parallel access. For example, Kusto is somewhat single user, in that a specific block of data is located on one and only one machine. This means it is possible to write queries that reduce cluster performance for all other processes, including the ingestion of new data and the execution of core alerting queries.

To mitigate this performance issue, we have deployed a `Follower Cluster`. A follower cluster is a read-only view of the data with its own set of machines to handle querying. Empirical testing shows the data is typically available in well under a minute. 

Consequently, we only offer access to the follower cluster to partners. The database names (AzurePortal, AzPtlCosmos, hostingservice) remain the same; however,  the cluster name has changed from `AzPortal` to `AzPortalPartner`. Your queries will run unchanged on the new cluster unless they  contain references to  `cluster("AzPortal")`. If they contain this reference,  change `'cluster("AzPortal")'` to `'cluster("AzPortalPartner")'`.

The following table specifies the Kusto databases that contain Azure Portal telemetry data. Please run through your query on the database or cluster that makes the most sense to you.

* **AzPtlCosmos**: The main Azure Portal telemetry database. Data here is deduped, geo-coded, expanded and filtered. All the official dashboards and reports are based on this table. It is highly encouraged to use  this database for your needs. Data here is persisted for 120 days and excludes test traffic.
                                                  
* **AzurePortal**: Contains the raw, unprocessed data that comes from MDS directly to **Kusto**. There are many scenarios where you may want to review diagnostic events or debug extension issues, for example, performance or creates. Data here is persisted for 45 days. To filter out test traffic when performing queries, use `userTypeHint == ""`.

* **AzPortalPartner**:  The replacement for the shared database named **Partner**, which is  obsolete. Partners who need to create their own alerting and telemetry functions and tables can request their own  database. The statistics and load history for the **AzPortalPartner** cluster are located at [https://aka.ms/GaugePartnerCluster](https://aka.ms/GaugePartnerCluster). 

### Kusto tables

| Database          | Table Name        | Details             |
| ----------------- | ----------------- | ------------------- |
| AzPtlCosmos       | ClientTelemetry | Contains all the Client Telemetry data that is collected from the Portal, as specified in [#clientTelemetry](#clientTelemetry).     |
| AzPtlCosmos       | ExtTelemetry      | Contains client events data for extensions that use the Extension Telemetry feature. Developers may log additional telemetry to this table.  Your extension will log to this table only if you have previously onboarded to the **ExtTelemetry** and **ExtEvents** tables, as specified in [#onboarding-to-tables](#onboarding-to-tables).   |
| AzurePortal       | ClientEvents      | Contains errors and warnings thrown from Framework and Hubs IFrame.                                        |
| AzurePortal       | ExtEvents         | Contains errors and warnings thrown from an extension's IFrame. Your extension will log to this table only if you have previously onboarded to the **ExtTelemetry** and **ExtEvents** tables,  as specified in [#onboarding-to-tables](#onboarding-to-tables).  |

**NOTE**: Data in both **ClientTelemetry** and **ExtTelemetry** tables only includes rows where the action is present in their respective allow lists. If you need to query for actions that are not present in these tables, Kusto supports cross-databases queries that allow you to query the **ClientTelemetry** or **ExtTelemetry** tables directly from the AzurePortal database. For more information, see [https://kusto.azurewebsites.net/docs/queryLanguage/query_language_syntax.html?q=cross](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_syntax.html?q=cross).

Queries against these tables can be exceedingly complex. The database also contains functions that simplify the complexity of retrieving information in the appropriate format. The following image displays a list of some functions that are located in the  **Functions\Public** directory and that are run against the **Kusto** databases to perform queries. 

![alt-text](..//media/top-extensions-telemetry/supportedfunctions.png "Supported Functions")

You can right-click on  a function and then select "Make a command script" to view  the details of that function. This can be performed recursively for any function.  There are other functions in the databases, but they are mainly intended for internal use and are subject to change at any time.

When testing queries, the performance cost of the current query is displayed in the Query Summary tab of the results window. Thirty  days of query history can be displayed by using the `.show queries` command. You can apply `where` and other clauses to the output of this command.

## Logging

There are two options for collecting telemetry and error and warning logs. You can configure and use the Portal Framework's built-in telemetry services or you can build an entirely custom telemetry system. It is strongly recommended that your extension should use the Portalfx Framework telemetry controller, because it is likely to be more performant than custom solutions.  However, if you choose to build your own telemetry system, you need to have practices in place that enforce  the guidelines that are associated with the collection of personally identifiable information (PII).  It is very important for security and compliance reasons that PII data is not sent to telemetry services.

For more information about logging, see [top-extensions-telemetry-logging.md](top-extensions-telemetry-logging.md).

### Onboarding to tables

Your team should onboard as specified in [top-extensions-alerting.md#onboarding-to-the-alert-infrastructure](top-extensions-alerting.md#onboarding-to-the-alert-infrastructure) to use the Framework alert infrastructure and the Kusto tables.

After all permissions have been granted, your extension can  use the built-in controller  by  adding `this.EnablePortalLogging = true;` in the constructor of the extension definition class, as in the following code.

```cs
  public Definition(ApplicationConfiguration applicationConfiguration)
  {
      this.EnablePortalLogging = true;
  }
```

For more information about using the Portal telemetry controller, see [top-extensions-telemetry-logging.md](top-extensions-telemetry-logging.md).

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

Browser information is collected globally, therefore the extension is not required to trace browser information.  However, the extension can set `traceBrowserInformation` to `true` to store browser information in your own telemetry.

### Logging to the ExtEvents table

Errors and warnings are logged to the **ExtEvents** table. To log errors and warnings, the extension can call the `error`/`warning` methods as in the following code.

```ts
  var log = new MsPortalFx.Base.Diagnostics.Log("logging_area");
  log.warning(errorMessage, code, args);
  log.error(errorMessage, code, args);
```

Additional information can be logged with the message by sending it in the `args` parameter. Do not stringify the information; instead, send it as an object.

**NOTE:** Verbose logging is disabled in the MPAC and PROD environments to prevent overly aggressive logging. We recommend that verbose logging be used only for debugging.

The Extension Errors Dashboard that is described in the document located at [top-extensions-telemetry-create.md](top-extensions-telemetry-create.md) will help you analyze the errors and warnings thrown by your extension. In the dashboard charts, error messages are aggregated by omitting the text which is within double quotes (") or single quotes ('), which are the dynamic part of messages. This includes information  like id's or  timestamps. For example, the  message '[Could not find part "PartName1"]' will be treated as '[Could not find part ""]'. Please use this format for all the logged error messages, if you want them to be aggregated by our queries.

### Logging to the clientTelemetry table

This is the main table that is used for most scenarios. It includes telemetry events like  `BladeLoaded` or  `PartLoaded`,  and that  are logged by default for any extension which is registered in the Portal.

For more information about actions that are logged to the **ClientTelemetry** table, see [#clientTelemetry](#clienttelemetry).

## Surveys

### Resource deleted survey

There is a standardized pane that collects non-real-time user feedback. Extensions can display this pane to ask a user why they deleted a resource, by using the `openResourceDeletedFeedbackPane` method, as in the following code.

```
  import * as FxFeedback from "Fx/Feedback";
  FxFeedback.openResourceDeletedFeedbackPane("displayNameOfTheDeletedResource", optionalObjectWithAnyAdditionalDataYouWantToLog);
```

This method is called after a user starts the deletion process.  The name of the resource is sent to the method, and the Shell displays it in the feedback pane that contains the survey. Responses to this survey are logged to the telemetry tables. If the feedback pane is already open, calls to this method do not perform any operations.

## Live telemetry

### Console Logs
	
Enable Console Telemetry by using the `consoletelemetry` flag in the address bar, as in the following example.
  
  [https://portal.azure.com/?feature.consoletelemetry=true](https://portal.azure.com/?feature.consoletelemetry=true) 

When the Portal starts, press F12 to view the "Console" Tab. You can view most of the telemetry logs within this window. The only known **Action** that is not displayed in this window is the  **CreateFlowLaunched** event. The following image displays the console logs for an extension.

  ![alt-text](..//media/top-extensions-telemetry/consoleLogs.png "Fiddler")

### Fiddler

Extension telemetry can also be viewed by using the **Fiddler** tool.  It is located at [http://www.telerik.com/fiddler](http://www.telerik.com/fiddler). 

**NOTE**: If you are not already signed in, and the sign-in flow would normally require two-factor authentication (2FA), **Fiddler** will break the sign in flow. Also, **Fiddler** can capture passwords.  Password storage is highly discouraged.

After the tool is installed, open **Fiddler** and configure the filters as in the following image.

 ![alt-text](..//media/top-extensions-telemetry/fiddler.png "Fiddler filters")

When you open the Portal, all relevant telemetry logs should now be displayed in the **Fiddler** interface.

### Other debugging tools 

When you press CTRL-ALT-D in the Azure Portal, it displays  component loading times and other information, as specified in [top-extensions-debugging.md#debug-mode](top-extensions-debugging.md#debug-mode).

## ClientTelemetry

There is a correspondence between the events and actions that are logged, and the fields in which the data is stored. However, that correspondence might be specific to the event.  For example, a duration can be used by one event to store the amount of time that was used to accomplish a specific task, whereas a different event might use timestamps to accomplish the same effect.

* [ClientTelemetry actions and events](#clientTelemetry-actions-and-events)

* [ClientTelemetry table columns](#clientTelemety-table-columns)

### ClientTelemetry actions and events

The following actions and events are logged to **ClientTelemetry** table.

If the rules that correlate table entries to alerts need to be updated for your extension, reach out to <a href="mailto:ibizafxhot@microsoft.com;azurefxg@microsoft.com?subject=Extension Alert Configuration&body=My team would like to update the correlation rules for our extension.  The configuration to update is for alert <Alert_YOUR_EXTENSION_NAME>.  The updated configuration is attached.">ibizafxhot@microsoft.com; azurefxg@microsoft.com</a>  and attach the updated configuration. The email to azurefxg@microsoft.com should contain the information specified in [#programmatic-onboarding](#programmatic-onboarding). We will inform you when the updates are applied. 

**NOTE**: These are the names of the actions, which is different from the names of the table columns.

* Blade events

    The `name` column provides the name of the blade. This name is provided in `Extension/<extension_name>/Blade/<blade_name>` format.

    * **BladeLoaded**: Tracks the time it takes to open the blade and start seeing the part frames show up. BladeLoaded also includes loading and opening the action bar.

    * **BladeLoadErrored**:  Triggered when loading a blade failed. This event is used to track blade errors in Portal Reliability metrics.

    * **BladeOpened**:  Tracks the time it takes for BladeLoaded + all the parts to start loading.  More specifically, it is when the blade’s Above The Fold lenses, parts and widgets have been created. It includes setting up the input bindings. The inputs themselves aren’t necessarily available yet (onInputsSet is not necessarily called yet). It also includes loading the collapsed state of the essentials part (if there is one).

    * **BladeRevealed**:  All parts above the fold have called reveal content or resolved onInputsSet(). This action is triggered when a Blade is revealed but the parts within the blade may still be loading. This event is used in Portal blade performance metrics.

    * **BladeReady**: All parts above the fold have resolved onInputsSet(). This action is triggered when a Blade Load is complete and it's ready for consumption by the user.

    * **BladeFullOpened**:  Is the same as BladeOpened except it is for all the parts, not just the parts above the fold.

    * **BladeFullRevealed**:  Is the same as BladeRevealed except it is for the all parts, not just the parts above the fold.

    * **BladeFullReady**:  Is the same as BladeReady except it is for all the parts, not just the parts above the fold.

    * **BladeButtonClicked**:  When the pin, unpin, maximize, minimize or close button on a blade is clicked.

    * **CommandExecuted** :  When any of the Commands on a blade is clicked - like start or  stop.

* Part events

    The `name` column provides the name of the part. This name is provided in "Extension/extension_name/Blade/blade_name/Part/part_name" format.

    * **PartClick**: Triggered when a part is clicked.

    * **PartLoaded**: Tracks the time it takes for a part to start getting filled with a UI, like a  spinner.

    * **PartErrored**: Triggered when loading a part failed. This event is used to track part errors in Portal Reliability metrics.

    * **PartReady**: Triggered when the part has resolved the `onInputsSet()` method.

* Portal Ready events

    * **TotalTimeToPortalReady**: Tracks the time it takes to load the portal  splash screen and display the startboard, or start rendering the the deep linked blade. 

    * **TotalTimeToStartBoardReady**: Tracks the time to load the portal and show the startboard.

    * **TotalTimeToDeepLinkReady**:  Tracks the time it takes to load the portal and start rendering the deep linked blade. This event is triggered only if a user is using a deep link to call the Portal. 
    
    * **Duration**:  Tracks the time it takes to load the Portal.
     
* Extension events

    The `name` column provides the name of the extension which is being loaded or initialized.

    * **LoadExtensions**: The time between the time it takes the Shell to create the extension's IFrame and the time the Shell receives the extension's manifest. The value of the `actionModifier` field specifies the action that was triggered in the extension loading flow. The values of the `actionModifier` field are as follows.

        * `actionModifier` = start: Triggered when an extension starts loading.

        * `actionModifier` = cancel: Triggered when an extension fails loading.

        * `actionModifier` = complete: Triggered when an extension finishes loading.

    * **InitializeExtensions**: The time between the time the Shell receives the extension manifest and the time the Shell receives an RPC response stating that the extension's state is initialized. The value of the `actionModifier` field specifies the action that was triggered in the extension initialization flow. The values of the `actionModifier` field are as follows.

        * `actionModifier` = start: Triggered when an extension starts being initialized.

        * `actionModifier` = cancel: Triggered when an extension initialization fails.

        * `actionModifier` = complete: Triggered when an extension finishes initialization.
    
* Create events

    The `name` column provides the name of the package getting deployed, while the `data` column provides more information about the deployment.

    * **CreateFlowLaunched**: Triggered when a user expresses the intent to create a resource in the Portal by launching its create blade. This event is typically  logged from the Marketplace extension. Most of the event flow is logged to the **ExtTelemetry** table, with other Marketplace extension logs; some of the event flow is logged to the **ClientTelemetry** table.

    * **ProvisioningStarted**:  Triggered when a new deployment starts. This event is logged for both custom and ARM deployments.

    * **ProvisioningEnded**:  Triggered when a new deployment ends. This event is logged for both custom and ARM deployments.

    * **CreateDeploymentStart**: Contains the correlationId that can be used to search for the deployment's status in ARM.  This event is logged only if the deployment is accepted by ARM is done using the ARM Provisioner provided by Framework. 

    * **CreateDeploymentEnd**: Contains the correlationId that can be used to search for the deployment's status in ARM.  This event is logged only if the deployment is accepted by ARM and is done using the ARM Provisioner provided by Framework. 

* Side Bar events

    * **SideBarItemClicked**: When one of the items on the Side Bar except `+` or `Browse All` is clicked.

    * **SideBarFavorite**:  When a resource type is marked as a favorite.

    * **SideBarUnFavorite**: When a resource type is removed as a favorite.

### ClientTelemetry table columns

The following columns are in the **clientTelemetry** table.

**NOTE**: These are the table column names, which is different from the names of the actions or events that are associated with the data.

* **ActionModifier**: Represents a status of a specific action, and is used in tandem with the `action` field. For example, a BladeReady event might use the `ActionModifier` values of start, complete and cancel.

* **Area**: Contains the extension name associated with the specific Action. This is derived from either then Name field or the Source field depending on the Action

* **Blade**: Contains the Blade name associated with the specific Action. This is derived from either then Name field or the Source field depending on the Action

* **BrowserFamily**: Contains  the name of the Browser used by the User. This is derived from the UserAgent field

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

* **Lens**: Contains the Lens name associated with the specific Action. This is derived from either then Name field or the Source field depending on the Action

* **Name**: Contains the name of the extension\Blade\Lens\Part associated with a specific Action. Its format may change based on the Action. In most scenarios, it usually has the following format: `Extension/<extensionName>/Blade/<BladeName>/Lens/<LensName>/PartInstance/<PartName>`

* **SessionId**: Represents each session that the user opens. This field  refreshes every ime a user logs in or refreshes. 

* **Part**: Contains the Part name associated with the specific Action. This is derived from either then Name field or the Source field depending on the Action

* **PreciseTimeStamp**: Contains the time that the event was logged by the server, expressed in UTC.

* **UserId**: Identifies a user by PUID. This is used in  identifying queries like daily active users, unique users using a feature, and others.

* **UserAgent**: The user agent of the user, expressed as a standard UserAgentString. [User Agent](https://en.wikipedia.org/wiki/User_agent)

* **UserCity**: Contains the name of the city that the User has used the Portal from. We derive this from the Users Client IP.

* **UserCountry**: Contains the name of the country that the User has used the Portal from. We derive this from the Users Client IP.

### Kusto documentation

For more information about the Kusto query language, see [https://kusto.azurewebsites.net/docs/query](https://kusto.azurewebsites.net/docs/query).

For videos and other Kusto documentation, see [http://kusto.azurewebsites.net/docs](http://kusto.azurewebsites.net/docs).

For Kusto discussion groups, see [http://idwebelements/GroupManagement.aspx?Group=KusTalk&Operation=join](http://idwebelements/GroupManagement.aspx?Group=KusTalk&Operation=join).
