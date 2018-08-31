
## Create Flow PowerBi dashboard

## Overview

The Create Flow PowerBi dashboard that is located at [needs link](needs link) gives you live access to your extension's create flow telemetry.

<!-- TODO: Validate that this security group is still needed to access the create flow dashboard. -->

To access to the Create Flow Dashbaord, you will need to join the Security Group 'Azure Portal Data' (auxdatapartners) by using the site located at [http://idwebelements/GroupManagement.aspx?Group=auxdatapartners&Operation=join](http://idwebelements/GroupManagement.aspx?Group=auxdatapartners&Operation=join).

All report-generating queries are performed against the **AzurePortal.AzPtlCosmos** database **ClientTelemetry** table. To become familiar with the table, you may want to review the PortalFx Telemetry - Kusto Databases  the document located at [portalfx-telemetry-getting-started.md](portalfx-telemetry-getting-started.md).

To run or create modified versions of the Kusto queries, you will need access to the  **Kusto** data tables. How to get setup using Kusto and getting access is explained in the document located at [portalfx-telemetry-getting-started.md](portalfx-telemetry-getting-started.md).

The following reports contain information that will help you tune the performance of your extension.

* [Create Flow reports](#create-flow-reports)

* [Error Distribution Reports](#error-distribution-reports)


## Create flow reports

There are several reports for the Create Flow.

* The Create Flow Funnel report  that is specified in [#create-flow-funnel-reports](#create-flow-funnel-reports) allows you to view live create flow telemetry, which is an overview of the blade's usage and deployment success numbers.

The Create Flow Origin report  that is specified in [#create-flow-origin-report](#create-flow-origin-report) provides an overview of link and launch data for the blade. It indicates which extensions are linking to the blade and which ones are launching the blade.

The Create Flow Errors Report  that is specified in [#create-flow-errors-report](#create-flow-errors-report)  contains information about create errors, billing issues, and cancellations for the blade.

### Create flow funnel reports

The Create Flow Funnel reports allow you to view live create flow telemetry, which is an overview of the blade's usage and deployment success numbers. The data fields in the report are as follows.

* **Create Flow Launched**: The number of times the blade was opened by users.

* **Deployment Started**: The number of times that a create was started by the blade.

* **Deployment Started %**: A percentage representing how often the opening of the blade being opened leads to a create being started. 

* **Deployment Succeeded**: The number of successful create deployements.

* **Deployment Succeeded %**: The percentage of creates that led to a successful deployment. Unsuccessful deployments would include cancellations and failures.

* **Old Create API**:  If this field contains the value `true`, the blade is using a deprecated Parameter Collector, as specified in [portalfx-extension-reference-obsolete-bundle.md](portalfx-extension-reference-obsolete-bundle.md).  This implies that its create telemetry may be undependable and is potentially inaccurate. You should  update the blade to use the new V3 Parameter Collector, as specified in  [portalfx-parameter-collection-getting-started.md](portalfx-parameter-collection-getting-started.md).  This code upgrade will set the value of the field to `false`.
       
* **Custom Deployment**:  If this field contains the value `true`, the create blade does not go through the official ARM Provisioner,  and therefore only receives limited telemetry reporting. If your experience's create deployments go through ARM  but you are not using ARM provisioning then see the Create Engine documentation located at [portalfx-create-engine-sample.md](portalfx-create-engine-sample.md).

The following four Kusto queries are used to retrieve create flow data to generate these numbers.

*  Create Flow Funnel 

    ```js
    let timeSpan = 30d;
    let startDate = GetStartDateForLastNDays(timeSpan);
    let endDate = GetEndDateForTimeSpanQueries();
    GetCreateFunnel(startDate, endDate)
    ```

* Create Flow Funnel By Resource Name

    ```js
    let timeSpan = 30d;
    let startDate = GetStartDateForLastNDays(timeSpan);
    let endDate = GetEndDateForTimeSpanQueries();
    GetCreateFunnelByResourceName(startDate, endDate)
    ```

* Create Flow Funnel Success Rate 

    ```js
    let timeSpan = 30d;
    let startDate = GetStartDateForLastNDays(timeSpan);
    let endDate = GetEndDateForTimeSpanQueries();
    GetCreateFunnelByDay(startDate, endDate)
    | extend DeploymentSucceededPerc = iff(DeploymentStarted == 0, 0.0, todouble(DeploymentSucceeded)/DeploymentStarted)
    | project Date, ExtensionName, CreateBladeName, DeploymentSucceededPerc 
    ```

* Create Flow Funnel Weekly Deployment Success 

    ```js
    let today = floor(now(),1d); 
    let fri= today - dayofweek(today) - 2d; 
    let sat = fri - 6d; 
    let startDate = sat-35d; 
    let endDate = fri; 
    GetCreateFunnelByDay(startDate, endDate) 
    | where Unsupported == 0 and CustomDeployment == 0 
    | extend startOfWeek = iff(dayofweek(Date) == 6d,Date , Date - dayofweek(Date) - 1d) 
    | summarize sum(CreateFlowLaunched), sum(DeploymentStartedWithExclusions), sum(DeploymentSucceeded) by startOfWeek, ExtensionName 
    | extend ["Deployment Success %"] = iff(sum_DeploymentStartedWithExclusions == 0, todouble(0), bin(todouble(sum_DeploymentSucceeded)/sum_DeploymentStartedWithExclusions*100 + 0.05, 0.1)) 
    | project startOfWeek, ["Extension"] = ExtensionName, ["Deployment Success %"]
    ```

### Create flow origin report

The data fields in the Create Flow Origin report are as follows.

* **Create Flow Launched**:  The number of times the blade was opened by users.
* **New (%)**:  The percentage representing how often the blade is opened from +New.
* **Browse (%)**:  The percentage representing how often the  blade is opened from Browse.
* **Marketplace (%)**:  The percentage representing how often the  blade is opened from the Marketplace.
* **DeepLink (%)**:  The percentage representing how often the  blade is opened from an internal or external link.

The following code can be used to generate these numbers.

* Create Flow Origins 
 
    ```js
    let timeSpan = 30d;
    let selectedData = 
    GetClientTelemetryByTimeSpan(timeSpan, false)
    | union (GetExtTelemetryByTimeSpan(timeSpan, false));

    selectedData
    | where Action == "CreateFlowLaunched"
    | extend 
        CreateBladeName = _GetCreateBladeNameFromData(Data, ActionModifier),
        ExtensionId = _GetCreateExtensionNameFromData(Data, ActionModifier),
        OriginFromMenuItemId = extractjson("$.menuItemId", Data, typeof(string)),
        DataContext = extractjson("$.context", Data, typeof(string))
    | extend OriginFromDataContext = extract('([^,"]*Blade[^,"]*)', 1, DataContext)
    | project CreateBladeName, ExtensionId, Origin = iff(OriginFromMenuItemId == "recentItems" or OriginFromMenuItemId == "deepLinking", OriginFromMenuItemId, OriginFromDataContext), DataContext 
    | extend Origin = iff(Origin == "", DataContext, Origin)
    | summarize CreateFlowLaunched = count() by ExtensionId, CreateBladeName, Origin
    | summarize 
        CreateFlowLaunched = sum(CreateFlowLaunched), 
        New = sum(iff(Origin contains "recentItems" or Origin contains "GalleryCreateMenuResultsListBlade", CreateFlowLaunched, 0)),
        Browse = sum(iff(Origin contains "BrowseResourceBlade", CreateFlowLaunched, 0)),
        Marketplace = sum(iff(Origin contains "GalleryItemDetailsBlade" or Origin contains "GalleryResultsListBlade" or Origin contains "GalleryHeroBanner", CreateFlowLaunched, 0)),
        DeepLink = sum(iff(Origin contains "deepLinking", CreateFlowLaunched, 0))
    by ExtensionId, CreateBladeName 
    | join kind = inner (ExtensionLookup | extend ExtensionId = Extension) on ExtensionId
    | project
        ["Extension Name"] = ExtensionName, 
        ["Create Blade Name"] = CreateBladeName, 
        ["Create Flow Launched"] = CreateFlowLaunched,
        ["+New"] = New,
        ["+New (%)"] = todouble(New) / CreateFlowLaunched,
        ["Browse"] = Browse,
        ["Browse (%)"] = todouble(Browse) / CreateFlowLaunched,
        ["Marketplace"] = Marketplace,
        ["Marketplace (%)"] = todouble(Marketplace) / CreateFlowLaunched,
        ["DeepLink"] = DeepLink,
        ["DeepLink (%)"] = todouble(DeepLink) / CreateFlowLaunched
    ```

### Create Flow Errors report

The Create Flow Errors report gives you an overview of create blades create errors, billing issues, and cancellations. The data fields in the report are as follows.

* **Deployment Cancelled Count**: The number of cancalled deployments.

* **Billing Error Count**: The number of deployments that resulted in the biling error "no credit card on file".

* **Total Errors Count**: The total number of deployments that resulted in a  failure or error.

* **Deployment Failed %**: The percentage of deployments that resulted in a failure or error.

* **Error Submitting Deployment Request %**: The percentage of failed deployments that were due to the error "Error Submitting Deployment Request".

* **Error Provisiong Resource Group %**: The percentage of failed deployments that were due to  the error "Error Provisiong Resource Group".

* **Error Registering Resource Providers %**: The percentage of failed deployments that were due to  the error "Error Registering Resource Providers".

* **Unknown Failure %**: The percentage of failed deployments that were due to  the error "Unknown Failure".

* **Deployment Request Failed %**: The percentage of failed deployments that were due to  the error "Deployment Request Failed".

* **Error Getting Deployment Status %**: The percentage of failed deployments that were due to  the error "Error Getting Deployment Status".

* **Deployment Status Unknown %**: The percentage of failed deployments that were due to  the error "Deployment Status Unknown".

* **Invalid Args %**: The percentage of failed deployments that were due to  the error "Invalid Args".

* **Old Create API**:  If this field contains the value `true`, the blade is using a deprecated Parameter Collector, as specified in [portalfx-extension-reference-obsolete-bundle.md](portalfx-extension-reference-obsolete-bundle.md).  This implies that its create telemetry may be undependable and is potentially inaccurate. You should  update the blade to use the new V3 Parameter Collector, as specified in  [portalfx-parameter-collection-getting-started.md](portalfx-parameter-collection-getting-started.md).  This code upgrade will set the value of the field to `false`.

* **Custom Deployment**:  If this field contains the value `true`, the create blade does not go through the official ARM Provisioner,  and therefore only receives limited telemetry reporting. If your experience's create deployments go through ARM  but you are not using ARM provisioning then see the Create Engine documentation located at [portalfx-create-engine-sample.md](portalfx-create-engine-sample.md).

The following code can be used to generate these numbers.

* Create Flow Errors 

    ```js
    let timeSpan = 30d;
    let startDate = GetStartDateForLastNDays(timeSpan);
    let endDate = GetEndDateForTimeSpanQueries();

    let errors = 
    (GetClientTelemetryByDateRange(startDate, endDate, false)
    | union (GetExtTelemetryByDateRange(startDate, endDate, false))
    | where Action == "ProvisioningEnded" and ActionModifier == "Failed" and isnotempty(Name))
    | union (_GetArmCreateEvents(startDate, endDate) | where ExecutionStatus in ("Failed", "Cancelled", "BillingError") and isnotempty(Name))
    | extend
        Date = bin(PreciseTimeStamp, 1d)
        | join kind = leftouter (
            _GetCreateBladesMapping(startDate, endDate)
            | project Date, Name, 
                ExtensionIdCurrent = ExtensionId, 
                CreateBladeNameCurrent = CreateBladeName, 
                UnsupportedCurrent = Unsupported, 
                CustomDeploymentCurrent = CustomDeployment
        ) on Date, Name 
        // Join again on previous day's mappings to cover case when mapping is not found in current day
        | join kind = leftouter (
            _GetCreateBladesMapping(startDate - 1d, endDate - 1d)
            | project Date, Name, 
                ExtensionIdPrev = ExtensionId, 
                CreateBladeNamePrev = CreateBladeName, 
                UnsupportedPrev = Unsupported, 
                CustomDeploymentPrev = CustomDeployment
            | extend Date = Date + 1d
        ) on Date, Name 
        // Use current day's mapping if available, otherwise, use previous day
        | extend 
            ExtensionId = iff(isnotempty(ExtensionIdCurrent), ExtensionIdCurrent, ExtensionIdPrev),
            CreateBladeName = iff(isnotempty(ExtensionIdCurrent), CreateBladeNameCurrent, CreateBladeNamePrev),
            Unsupported = iff(isnotempty(ExtensionIdCurrent), UnsupportedCurrent, UnsupportedPrev),
            CustomDeployment = iff(isnotempty(ExtensionIdCurrent), CustomDeploymentCurrent, CustomDeploymentPrev)
    | where isnotempty(ExtensionId) and isnotempty(CreateBladeName)
    | extend ExecutionStatus = iff(Action == "ProvisioningEnded", extractjson("$.provisioningStatus", Data, typeof(string)), ExecutionStatus);

    errors
    | summarize
        CustomDeploymentErrorsCount = count(Action == "ProvisioningEnded" and ActionModifier == "Failed"),
        // We exclude ProvisioningEnded events with ExecutionStatus in ("DeploymentFailed", "DeploymentCanceled") from ARMDeploymentErrorsCount as in this case, we get the number of deployments that failed or were cancelled from ARM.
        ARMDeploymentErrorsCount = count((Action startswith "CreateDeployment") or (Action == "ProvisioningEnded" and ExecutionStatus !in ("DeploymentFailed", "DeploymentCanceled")))
    by ExtensionId, CreateBladeName, Unsupported, CustomDeployment
    | join kind = inner (
        errors
        | summarize
            ARMFailed = count(Action startswith "CreateDeployment" and ExecutionStatus == "Failed"),
            ARMCancelled = count(Action startswith "CreateDeployment" and ExecutionStatus == "Cancelled"),
            ARMBillingError = count(Action startswith "CreateDeployment" and ExecutionStatus == "BillingError"),
            Failed = count(Action == "ProvisioningEnded" and ExecutionStatus == "DeploymentFailed"),
            Cancelled = count(Action == "ProvisioningEnded" and ExecutionStatus == "DeploymentCanceled"),
            ErrorSubmitting = count(Action == "ProvisioningEnded" and ExecutionStatus == "ErrorSubmittingDeploymentRequest"),
            ErrorProvisioning = count(Action == "ProvisioningEnded" and ExecutionStatus == "ErrorProvisioningResourceGroup"),
            ErrorRegistering = count(Action == "ProvisioningEnded" and ExecutionStatus == "ErrorRegisteringResourceProviders"),
            ErrorGettingStatus = count(Action == "ProvisioningEnded" and ExecutionStatus == "ErrorGettingDeploymentStatus"),
            InvalidArgs = count(Action == "ProvisioningEnded" and ExecutionStatus == "InvalidArgs"),
            UnknownFailure = count(Action == "ProvisioningEnded" and ExecutionStatus == "UnknownFailure"),
            RequestFailed = count(Action == "ProvisioningEnded" and ExecutionStatus == "DeploymentRequestFailed"),
            StatusUnknown = count(Action == "ProvisioningEnded" and ExecutionStatus == "DeploymentStatusUnknown")
        by ExtensionId, CreateBladeName, Unsupported, CustomDeployment)
    on ExtensionId, CreateBladeName, Unsupported, CustomDeployment
    | extend Failed = iff(CustomDeployment, Failed, ARMFailed)
    | extend Cancelled = iff(CustomDeployment, Cancelled, ARMCancelled)
    | extend BillingError = iff(CustomDeployment, 0, ARMBillingError)
    | extend TotalCount = iff(CustomDeployment, CustomDeploymentErrorsCount, ARMDeploymentErrorsCount) - Cancelled - BillingError
    | extend TotalCountDbl = todouble(TotalCount)
    | join kind = leftouter (ExtensionLookup | extend ExtensionId = Extension) on ExtensionId
    | project
        ["Extension Name"] = ExtensionName,
        ["Create Blade Name"] = CreateBladeName,
        ["Deployment Cancelled Count"] = Cancelled,
        ["Billing Error Count"] = BillingError,
        ["Total Errors Count"] = TotalCount,
        ["Deployment Failed %"] = iff(TotalCountDbl == 0.0, 0.0, Failed / TotalCountDbl),
        ["Error Submitting Deployment Request %"] = iff(TotalCountDbl == 0.0, 0.0, ErrorSubmitting / TotalCountDbl),
        ["Error Provisioning Resource Group %"] = iff(TotalCountDbl == 0.0, 0.0, ErrorProvisioning / TotalCountDbl),
        ["Error Registering Resource Providers %"] = iff(TotalCountDbl == 0.0, 0.0, ErrorRegistering / TotalCountDbl),
        ["Error Getting Deployment Status %"] = iff(TotalCountDbl == 0.0, 0.0, ErrorGettingStatus / TotalCountDbl),
        ["Invalid Args %"] = iff(TotalCountDbl == 0.0, 0.0, InvalidArgs / TotalCountDbl),
        ["Unknown Failure %"] = iff(TotalCountDbl == 0.0, 0.0, UnknownFailure / TotalCountDbl),
        ["Deployment Request Failed %"] = iff(TotalCountDbl == 0.0, 0.0, RequestFailed / TotalCountDbl),
        ["Deployment Status Unknown %"] = iff(TotalCountDbl == 0.0, 0.0, StatusUnknown / TotalCountDbl),
        ["Old Create API"] = Unsupported,
        ["Custom Deployment"] = CustomDeployment
    ```

## Error Distribution Report 

The  Error Distribution report gives an overview of the errors that have occurred over the last week, including the progress from the previous week's errors. This is also known as Week or Week (WoW).

* Error Distribution

    The high level errors that occurred for all deployments in the last week.

* Error Distribution By Extension

    The number of create deployment errors that occurred  over the last week for  each extension.

* Error Distribution By Error Code

    The number of create deployment errors that occurred  over the last week for  each extension.

* Inner Error Distribution

    Reviews  the 'innermost error' in error messages  for create deployment failures. Error messages are often nested as they they reach different points of provisioning and have different stages record the failure reason. Consequently, the 'innermost error' should be the original reason why a create deployment failed.

The following code can be used to generate these numbers.

* Create Error Distribution 

    ```js
    let today = floor(now(),1d);
    let sat = today - dayofweek(today) - 8d;
    let fri =  sat + 6d;
    ClientTelemetry
    | where PreciseTimeStamp >= sat and PreciseTimeStamp < fri + 1d
    | where Action == "ProvisioningEnded" and ActionModifier == "Failed"
    | extend provisioningStatus = extractjson("$.provisioningStatus", Data, typeof(string)),
    isCustomProvisioning = extractjson("$.isCustomProvisioning", Data, typeof(string)),
    oldCreateApi = extractjson("$.oldCreateApi", Data, typeof(string)),
    launchingContext = extract('"launchingContext"\\s?:\\s?{([^}]+)', 1, Data)
    | where isnotempty(launchingContext) and isempty(extract("^(\"telemetryId\":\"[^\"]*\")$", 1, launchingContext)) and oldCreateApi != "true" and isCustomProvisioning != "true" and provisioningStatus != "DeploymentCanceled"
    | where Data !contains "We could not find a credit card on file for your azure subscription." 
    | summarize ["Error Count"] = count() by ["Error"] = provisioningStatus
    | order by ["Error Count"] desc
    ```

* Create Error Distribution By Extension 

    ```js
    let today = floor(now(),1d);
    let sat = today - dayofweek(today) - 8d;
    let fri =  sat + 6d;
    ClientTelemetry
    | where PreciseTimeStamp >= sat and PreciseTimeStamp < fri + 1d
    | where Action == "ProvisioningEnded" and ActionModifier == "Failed"
    | extend provisioningStatus = extractjson("$.provisioningStatus", Data, typeof(string)),
    isCustomProvisioning = extractjson("$.isCustomProvisioning", Data, typeof(string)),
    oldCreateApi = extractjson("$.oldCreateApi", Data, typeof(string)),
    launchingContext = extract('"launchingContext"\\s?:\\s?{([^}]+)', 1, Data)
    | where isnotempty(launchingContext) and isempty(extract("^(\"telemetryId\":\"[^\"]*\")$", 1, launchingContext)) and oldCreateApi != "true" and isCustomProvisioning != "true" and provisioningStatus != "DeploymentCanceled"
    | where Data !contains "We could not find a credit card on file for your azure subscription." 
    | summarize ["Error Count"] = count() by Extension
    | order by ["Error Count"] desc
    ```

* Create Error Distribution By Error Code 

    ```js
    let today = floor(now(),1d);
    let sat = today - dayofweek(today) - 8d;
    let fri =  sat + 6d;
    ClientTelemetry
    | where PreciseTimeStamp >= sat and PreciseTimeStamp < fri + 1d
    | where Action == "ProvisioningEnded" and ActionModifier == "Failed"
    | extend provisioningStatus = extractjson("$.provisioningStatus", Data, typeof(string)),
    isCustomProvisioning = extractjson("$.isCustomProvisioning", Data, typeof(string)),
    oldCreateApi = extractjson("$.oldCreateApi", Data, typeof(string)),
    eCode = extractjson("$.details.code", Data, typeof(string)),
    launchingContext = extract('"launchingContext"\\s?:\\s?{([^}]+)', 1, Data)
    | where isnotempty(launchingContext) and isempty(extract("^(\"telemetryId\":\"[^\"]*\")$", 1, launchingContext)) and oldCreateApi != "true"
    | where provisioningStatus != "DeploymentFailed" and provisioningStatus != "DeploymentCanceled" and isCustomProvisioning != "true"
    | where Data !contains "We could not find a credit card on file for your azure subscription." 
    | summarize ["Error Count"] = count() by ["Error Code"] = eCode
    | order by ["Error Count"] desc 
    ```

* Create Innermost Error Distribution 

    ```js
    let today = floor(now(),1d);
    let sat = today - dayofweek(today) - 8d;
    let fri =  sat + 6d;
    ClientTelemetry
    | where PreciseTimeStamp >= sat and PreciseTimeStamp < fri+1d
    | where Action == "ProvisioningEnded" and ActionModifier == "Failed"
    | join kind = inner (ExtensionLookup | project Extension, ExtensionName) on Extension
    | where Data !contains "We could not find a credit card on file for your azure subscription."
    | extend datajson = parsejson(Data)
    | extend provisioningStatus = tostring(datajson.provisioningStatus), isCustomProvisioning = tostring(datajson.isCustomProvisioning), oldCreateApi = tostring(datajson.oldCreateApi), launchingContext = extract('"launchingContext"\\s?:\\s?{([^}]+)', 1, Data)
    | where isnotempty(launchingContext) and isempty(extract("^(\"telemetryId\":\"[^\"]*\")$", 1, launchingContext)) and oldCreateApi != "true" and isCustomProvisioning != "true" and provisioningStatus != "DeploymentCanceled"
    | extend code1 = tostring(datajson.details.code), statusCode = tostring(datajson.details.deploymentStatusCode), details = datajson.details.properties.error.details[0]
    | extend message= tostring(details.message), code2 = tostring(details.code)
    | extend messagejson = parsejson(message)
    | extend code3 = tostring(messagejson.code), code4 = tostring(messagejson.error.code), code5= tostring(messagejson.error.details[0].code)
    | extend errorCode1 = iff(code5 == "", code4, code5)
    | extend errorCode2 = iff(errorCode1 == "", code3, errorCode1)
    | extend errorCode3 = iff(errorCode2 == "", code2, errorCode2)
    | extend errorCode4 = iff(errorCode3 == "", code1, errorCode3)
    | extend errorCode5 = iff(errorCode4 == "", statusCode, errorCode4)
    | summarize ["ErrorCount"] = count() by ["Extension"] = ExtensionName, errorCode5
    | order by ErrorCount desc
    ```

## Troubleshooting Create Regressions and ICM alerts

## Overview

Creates are when a user tries to provision a resource using the portal.  The goal of the Create Flow Regressions alert is to  generate awareness when our create reliability seems to be degrading.  This can happen for a number of reasons, this alert does not attempt to distinguish the reasons why.

The alert fires any time the success rate drops more than 5% below the bar on average over an hour.  MDM will send an alert each time this happens.  The first thing to do is take a look at MDM by selecting the link at the bottom of the ICM, this will show a trend of how long the alert has been active and to what degree.

The numbers are the percentage of regression.  For example, if latest value is 10 it means the success rate has regressed by 10% below the bar.  If it seems to be trending up then this is a much bigger concern than one that spiked then went down.

This bar is set on a blade by blade basis and can be adjusted as needed.

## Types of Create Failures

There are three types of create failures:

1. The create was successfully sent to ARM, but ARM eventually reported Failure rather than Success or Cancel
    - Billing errors such as no credit card are considered canceled creates rather than failures
2. The create request was not accepted by ARM for any reason
3. This is a custom create where the *ProvisioningEnded* is either missing or reports an error

## Debugging Alerts

Follow the below documentation to understand and debug your create regressions that caused the alert.

### Alert Regression Error Count 
 
If you want to see what errors are making up your regression percentage *(over the last 24 hours ending at the datetime provided)* and how many times these errors are occurring then the following query will give you the break down you are looking for (using websites as an example): 
 
`GetCreateRegressionErrorCount(now(),"websitesextension","webhostingplancreateblade")` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLXEuSk0sSQ1KTS9KLS7OzM9zrSgJLs3NTSyq1MjLL9fQ1FEqT00qzixJLU6tKEnNAylR0lTg5QIAqPv6pjsAAAA%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAB3MQQqAMAwF0bt01YK3KOLeG7T6qYGSSBKpxxe7HR6zwbOiOHY0hRkJr6qiWR72yDJiWsJANXIYXgf%2fJMx2iTlxu3vhYz5qLydC%2bgAfaEluVAAAAA%3d%3d) 

 
This function is best used when trying to identify the main error that is causing your regression numbers to increase. 
 
Input Parameters:
 
* **End time** – 24 hours ending at this end time will be the time span which is scanned for errors. Time range: [end time – 24 hours, end time] 
* **Extension** – the extension you are looking into 
* **CreateBladeName** – the name of the create blade which the errors occurred on 

Output Result Columns: 

* **extension** – the extension specified 
* **CreateBladeName** – the create blade name specified 
* **ErrorCode** – the error code that specifies the type of error that occurred 
* **Hits** – the number of times this error occurred 

### Alert regression details 

When things go wrong you will need to drill down. Once you have used GetCreateRegressionErrorCount to understand the main errors that are causing your regressions numbers *(over the last 24 hours ending at the datetime provided)* to spike, you will now need to understand what caused them.  The following query shows all of the failed creates with their error messages for a specific extension and blade (using websites as an example): 

`GetCreateRegressionDetails(now(),"websitesextension","webhostingplancreateblade")` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLXEuSk0sSQ1KTS9KLS7OzM9zSS1JzMwp1sjLL9fQ1FEqT00qzixJLU6tKEnNA8krgcUy8otLMvPSC3IS85LBBiTlJKakKmnycgEAg5C8UlMAAAA%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAHNPLXEuSk0sSQ1KTS9KLS7OzM9zSS1JzMwp1sjLL9fQ1FEqT00qzixJLU6tKEnNA8krgcUy8otLMvPSC3IS85LBBiTlJKakKmnycgEAg5C8UlMAAAA%3d)

Input Parameters: 

* **End time** – 24 hours ending at this end time will be the time span which is scanned for errors. Time range: [end time – 24 hours, end time]. 
* **Extension** – The extension you are looking into. 
* **CreateBladeName** – The name of the create blade which the errors occurred on. 

Output Result Columns: 

* **extension** – The name of the extension. 
* **name** – The name of the resource attempted to be created. 
* **CreateBladeName** – The name of the create blade from which the create flow originated.  
* **status** – The resulting status of the create. Regressions are represented only by failed creates, so this should always be marked as "Failed". 
* **MessageCode** - In the case of a Failed status create flow, this typically is the name of the error which occurred. We try to always fill this information in for you, but if it is blank then you may have to go digging for this information in the **data** field. More information regarding this below. 
* **Message** – In the case of a Failed status create flow, this typically is the resulting message of the error which occurred which provides context as to why the create flow was a failure.  We try to always fill this information in for you, but if it is blank then you may have to go digging for this information in the data field. More information regarding this below. 
* **StartTime** – When the create was initiated. 
* **EndTime** – When the create completed. If the EndTime is the same as the StartTime then the create failed to be initiated correctly or the information regarding its completion is lost. 
* **Duration** – The length in time of the create from start to finish. If the duration is 00:00:00 then the create failed to be initiated correctly or the information regarding its completion is lost. 
* **telemetryId** – The id which is used to identify the creates events which make up a create flow. 
* **userId** – ID which represents the user that initiated the create. 
* **sessionId** – ID which represents the sessions in which the create was initiated. 
* **CustomDeployment** – Boolean representing if the create is a custom deployment and therefore was not initiated through the ARM provisioner.  
* **data** – Contains all of the in-depth information regarding the different stages of the create flow  

The most interesting field is the **data** field. It contains JSON describing details of the create.  **Understanding the data field is crucial to debugging simple to complicated regression issues.**

**The data field:**

To understand how the data field is created, one must understand the life cycle of the create flow. This process is slightly different for a standard deployment through ARM vs a custom deployment (one that does not use the ARM provisioner). 

1. When a create is initiated a **ProvisioningStarted** events is logged.  
2. Once the request for that deployment is received and acknowledge by ARM a **CreateDeploymentStart** event is logged. *(not logged for custom deployment) *
3. When the status of the completion of that deployment  is available a **CreateDeploymentEnd** event is logged.  *(not logged for custom deployment) *
4. Once the deployment is finished and the Portal has finished the create process a **ProvisioningEnded** event is logged. 

The data field contains all of the data from each of these logged create events (if available) to give you the information from each stage of the lifecycle.  Each of these are represented by 3 main fields: 

* **action** – The action logged (ProvisioningStarted, CreateDeploymentStart, CreateDeploymentEnd, ProvisioningEnded) 
* **actionModifier** – The context in which the action was being logged.
    Here are the available different combinations of **action** and **actionModifier**:

    |      action         |actionModifier|
    |---------------------|--------------|
    |ProvisioningStarted  |   mark       |
    |CreateDeploymentStart|   Failed     |
    |CreateDeploymentStart|   Succeeded  |
    |CreateDeploymentEnd  |   Canceled   |
    |CreateDeploymentEnd  |   Failed     |
    |CreateDeploymentEnd  |   Succeeded  |
    |ProvisioningEnded    |   Failed     |
    |ProvisioningEnded    |   Succeeded  |
* **data** – the data field for this particular create event which makes up part of the greater create flow

**Digging for the error MessageCode field and Message field in the data field**

So, we were either unable to provide you with the correct error code or message, or you are looking for more context and information. The way to go about this is to start digging into the **data** field.  

1. Locate the last create event with data available inside of the data field. This is typically the **ProvisioningEnded** event, but if that is not available then use the **CreateDeploymentEnd** event. If neither of these are available, then the information has been lost for an unknown reason and it isn't available at all. 
2. Look into the **data** field of the event until you find the details field  
3. The details field should contains a hierarchy of error codes and error message. The inner mode error code or message should be the underlying cause of the deployment failure. 


### All Creates

When looking for patterns it is sometimes better to see the good with the bad.  The following query returns a single row for each create:

`GetCreatesByDateRange(ago(1d),now())` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLXEuSk0sSS12qnQBUkGJeempGonp%2bRqGKZo6efnlGpqavFwAGPlBOSYAAAA%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAHNPLXEuSk0sSS12qnQBUkGJeempGonp%2bRqGKZo6efnlGpqavFwAGPlBOSYAAAA%3d)
 
The results include:

* Extension
* Name - name of the asset type
* CreateBladeName
* Status - has one of the following values
    * Succeeded
    * Failed
    * Unknown
    * Canceled - (billing errors are included here)
* telemetryId - unique ID for the deployment
* CustomDeployment - if not an ARM deployment this is true
        
### All Creates With Additional Details

To query with more details the following query:

`GetCreateDetailsByDateRange(ago(1d),now())` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net/AzurePortal?query=H4sIAAAAAAAEAHNPLXEuSk0sSQ1KTS9KLS7OzM9zSS1JzMwp1sjLL9fQ1FEqT00qzixJLU6tKEnNA8krgcUy8otLMvPSC3IS85LBBiTlJKakKmnycgEAg5C8UlMAAAA%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAB3MQQqAMAwF0bt01YK3KOLeG7T6qYGSSBKpxxe7HR6zwbOiOHY0hRkJr6qiWR72yDJiWsJANXIYXgf%2fJMx2iTlxu3vhYz5qLydC%2bgAfaEluVAAAAA%3d%3d)
 
 Adds the following properties with multiple rows per telemetryId (each telemetryId == 1 create):

* userId
* sessionId
* action
* actionModifier
* Data - this has a JSON string that contains most of the information needed for debugging

This function is best used when trying to identify the main error that is causing your regression numbers to increase.

Input Parameters:

* **End time** – 24 hours ending at this end time will be the time span which is scanned for errors. Time range: [end time – 24 hours, end time]
* **Extension** – the extension you are l

Output Result Columns:

* **Extension** – the extension specified
* **CreateBladeName** – the create blade name specified
* **ErrorCode** – the overall error code that specifies the type of error that occurred
* **Hits** – the number of times this error

### Alert query 
The alert itself is driven from the following query:

`CreateFlowRegressions(now())` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHMuSk0sSXXLyS8PSk0vSi0uzszPK9bIyy%2fX0NRU4OUCAOcPvacfAAAA) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAHMuSk0sSXXLyS8PSk0vSi0uzszPK9bIyy%2fX0NRU4OUCAOcPvacfAAAA)

This has strangely named columns that are required by MDM, but essentially it tracks success percentage over the last 24 hours versus the success bar:

* `d_ExtensionName`
* `d_CreateBladeName`
* `m_CreateRegressionPercent - percentage of regression below the bar`
* `m_CreateRegressionCount - number of creates over the last 24 hours`
* `timestamp`

The alert is generated any time the regression is more than 5% from the bar.

### Alert bar 
The bar is a value we've captured based on current performance.  This should be raised over time as the create becomes more reliable.  PMs from the portal team will help you remember that this is needed.

To see the current bar settings use the following query:

`_CreateFlowRegressionOverrides()` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAIt3LkpNLEl1y8kvD0pNL0otLs7Mz%2fMvSy0qykxJLdbQVODlAgAOtIVvIwAAAA%3d%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAHMuSk0sSXXLyS8PSk0vSi0uzszPK9bIyy%2fX0NRU4OUCAOcPvacfAAAA) 

* Extension
* CreateBladeName
* Ignore - if true this extension is excluded from alerting
* Bar - this is the success percentage expected
* NormalizedCount - not used
* Reason - notes about why the bar was set
    
### Alert summaries base
    
The alert is very specific as per the rules of MDM and does not provide any context.  To see the state of creates more clearly try the following query:

`_CreateFlowRegressionsBase(now(),24h,50)` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAIt3LkpNLEl1y8kvD0pNL0otLs7Mzyt2SixO1cjLL9fQ1DEyydAxNdDk5QIAWr8chSoAAAA%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAIt3LkpNLEl1y8kvD0pNL0otLs7Mzyt2SixO1cjLL9fQ1DEyydAxNdDk5QIAWr8chSoAAAA%3d)

The parameters are the start time, number of hours to check, minimum number of creates required.  The parameters shown are what drives the alert query.  Using this and adding a filter for your extension will give you a pretty clear idea of the current state.

This query gives:
* EndTime
* Extension
* CreateBladeName
* Count
* SuccessRate
* SuccessBar
* Regression

The simple version of this takes an extension name parameter and automatically filters to the necessary section.  For example, for websites the query would be:

`GetCreateRegressionExtSummary(now(),"websitesextension")` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLXEuSk0sSQ1KTS9KLS7OzM9zrSgJLs3NTSyq1MjLL9fQ1FEqT00qzixJLU6tKEnNAylR0lTg5QIAqPv6pjsAAAA%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAHNPLXEuSk0sSQ1KTS9KLS7OzM9zrSgJLs3NTSyq1MjLL9fQ1FEqT00qzixJLU6tKEnNAylR0lTg5QIAqPv6pjsAAAA%3d)

- [For General Telemetry](portalfx-telemetry.md)
- [For Kusto Documentation](https://aka.ms/kusto)
