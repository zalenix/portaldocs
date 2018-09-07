## Getting Started

Starting 2016, Portal Telemetry has moved completely to the Kusto based solution. 

### Pre-requisites

Kusto.Explorer: [Application](http://kusto-us/ke/Kusto.Explorer.application)

### Kusto Cluster Info

Name: AzPortal
Data Source: [https://AzPortal.kusto.windows.net](https://AzPortal.kusto.windows.net)

### Permissions

All Azure employees should have access to our Kusto clusters. The way permissions are granted is through inheritance of the overall AAD group (`REDMOND\AZURE-ALL-PSV` for teams in C+E, for teams outside `REDMOND\AZURE-ALL-FPS`). We do not grant individuals access to the kusto, you will need to join your respective team's group. To inherit the valid permissions your team should have a standard access group you can join in //ramweb or //myaccess and that group should be configured to have the correct permissions.

If you don't have access, please follow the below steps:

1. Visit [http://aka.ms/standardaccess](http://aka.ms/standardaccess)
1. On the standard access page you will find a table of team projects 'Active ​Azure  Team Projects'
1. Search the table for your team's group (if you are unware of which group to join ask your colleagues)
1. Once you have found the correct group join that group via //myaccess or reach out to team's support alias for further help.
1. Ensure your request has been approved, if you have been denied for any reason please follow up with the group support alias.

#### What if I can't find a group

If you are unable to find a group to join within the table, you may need to create a new group. First confirm that with your colleagues, there may be a group that is named non-intuitively.

If there is still no group you can join, you will need to create a new group. To do that please follow documentation on [http://aka.ms/standardaccess](http://aka.ms/standardaccess).
Look for the link named ['Azure RBAC Getting Started Guide'](http://aka.ms/portalfx/telemetryaccess/newgroup).
There are various steps to follow, unfortunately the Ibiza team do not own this process. The standard access team have step by step videos you can use to follow along. If you need further assistance with creating a new group please contact the 'MyAccess' support team.

For all other questions please reach out to [Ibiza Telemetry](mailto:ibiza-telemetry@microsoft.com).

#### Programmatic access

We're currently not onboarding any more users on to programmatic access. We're in the process of making some infrastructure changes to support this ask.
We'll update the documentation when we can onboard programmatic access.

### Kusto Documentation & Links

[Documentation](http://kusto.azurewebsites.net/docs)

[Kusto Discussions](http://idwebelements/GroupManagement.aspx?Group=KusTalk&Operation=join)

### Who can I contact ?

[Ibiza Performance/ Reliability](mailto:ibiza-perf@microsoft.com;ibiza-reliability@microsoft.com) - Telemetry PM for Ibiza Performance and Reliability Telemetry

[Ibiza Create](mailto:ibiza-create@microsoft.com) - Telemetry PM for Ibiza Create Telemetry

[Azure Fx Gauge Team](mailto:azurefxg@microsoft.com) - Telemetry Team

