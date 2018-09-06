

#### Tracked Actions

For more information about tracked actions, see [portalfx-telemetry-actions.md](portalfx-telemetry-actions.md).


### Available Power BI Dashboards

Following are some of the dashboards that we support. If you do not have access to any of these please contact <a href="mailto:ibiza-telemetry@microsoft.com?subject=Do not have dashboard access">Ibiza Telemetry</a>.

|Name                            | PowerBi Link                                                                                                                                     | Metrics Description                                                                    |
|--------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
|Portal Performance and Reliability Dashboard    | [http://aka.ms/portalfx/dashboard/extensionperf](http://aka.ms/portalfx/dashboard/extensionperf)                                         | [Perf Docs](portalfx-performance-overview.md) and Reliability Docs that are located at [top-extensions-reliability.md](top-extensions-reliability.md)           |
|Portal Create Dashboard         | [http://aka.ms/portalfx/dashboard/PortalCreate](http://aka.ms/portalfx/dashboard/PortalCreate)                                                   | Create Docs that are located at [top-extensions-telemetry-create.md](top-extensions-telemetry-create.md)                      |
|Extension Errors Dashboard      | [http://aka.ms/portalfx/dashboard/ExtensionErrors](http://aka.ms/portalfx/dashboard/ExtensionErrors)                                             | Extension Errors Docs that are located at [top-extensions-telemetry-create.md](top-extensions-telemetry-create.md)   |


### Collecting Feedback From Your Users

In February 2016 we introduced a standardized pane for collecting user feedback. We currently expose one method to extension developers.

#### Resource Deleted Survey

To ask a user why they deleted a resource use the `openResourceDeletedFeedbackPane` method:

```
  import * as FxFeedback from "Fx/Feedback";
  FxFeedback.openResourceDeletedFeedbackPane("displayNameOfTheDeletedResource", optionalObjectWithAnyAdditionalDataYouWantToLog);
```

Call this method after a user starts the deletion process for a resource. Shell will open the feedback pane with a standardized survey. The name of the resource you pass to the method will be shown to the user in the survey. Responses to this survey are logged to the telemetry tables. If the feedback pane is already open calls to this method will be no-ops.

#### Questions?

Read more about [Kusto query language](https://kusto.azurewebsites.net/docs/queryLanguage/query_language.html).

Ask questions on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-telemetry](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-telemetry)

