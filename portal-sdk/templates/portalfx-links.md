
# Deep links

Use deep links to jump directly into your extension within the portal. Each deep link consists of the portal URL (e.g. https://portal.azure.com), target directory domain name or tenant id (e.g. microsoft.com), a route prefix (i.e. asset, resource, blade, browse, or marketplace), and the actual deep link target.


## Resources

To link to a ARM resource, all you need is the ARM resource id. Tenant resources and nested resources are not supported.

`https://portal.azure.com/#@{directory}resource{resource id}`

For instance:

https://portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/foo/providers/microsoft.web/sites/bar


## Blades

To link to blades, the route prefix is `blade` followed by the owning extension then the blade name:

`https://portal.azure.com/#@{directory}blade/{extension}/{blade}`

For instance:
https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview

Blade inputs are serialized in consecutive name/value pairs, the below example has a single input `resourceType` and the value passed in is `Microsoft.Resources/resources`
https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.Resources%2Fresources


## Create blades

To link to Create blade, include the package id:

`https://portal.azure.com/#create/{package id}`

For instance:
https://portal.azure.com/#create/Microsoft.WindowsServer2016Datacenter-ARM


## Marketplace item details blades

To link to the Marketplace item details blade for your package, add "/preview" to the end of your Create blade link:

`https://portal.azure.com/{directory}#create/{package id}/preview`

For instance:
https://portal.azure.com/#create/Microsoft.WindowsServer2016Datacenter-ARM/preview


## Assets

To link to assets, include the extension name, asset type, and asset id.
`https://portal.azure.com/#{directory}asset/{extension}/{asset type}/{asset id}`

For instance:
https://portal.azure.com/#asset/Microsoft_Azure_KeyVault/Secret/https://mykeyvaultname.vault.azure.net/secrets/secretName/id



