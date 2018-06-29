
# Working with data

The following list of data subtopics follows the Model-View-View-Model methodology.

| Type                             | Document                                                                     | Description |
| -------------------------------- | ---------------------------------------------------------------------------- | ---- |
| Data modeling and organization   | [portalfx-data-modeling.md](portalfx-data-modeling.md)                       | The data model for the extension project source. | 
| The data cache object            | [portalfx-data-caching.md](portalfx-data-caching.md)                         | Caching data from the server |
| The data view object             | [portalfx-data-views.md](portalfx-data-views.md)                             | Presenting data to the ViewModel | 
| Loading data | [portalfx-data-loading.md](portalfx-data-loading.md) | `QueryCache` and `EntityCache` methods that request data from servers and other sources  | 
| Merging and refreshing data | [portalfx-data-refreshing.md](portalfx-data-refreshing.md) |   `DataCache` / `DataView` object methods like `refresh` and `forceremove`.  |
| Querying for virtualized data  | [portalfx-data-virtualizedgriddata.md](portalfx-data-virtualizedgriddata.md) |  Sequential and random-access data retrieval | 
<!--| Child lifetime managers  | [portalfx-data-lifetime.md](portalfx-data-lifetime.md) | Fine-grained memory management that allows resources to be destroyed previous to the closing of the blade. | 
-->
| The browse sample | [portalfx-data-masterdetailsbrowse.md](portalfx-data-masterdetailsbrowse.md) | Extension that allows a user to select a Website from a list of websites, using the QueryCache-EntityCache data models | 

* * * 

   {"gitdown": "include-file", "file": "../templates/portalfx-data-modeling.md"}

   {"gitdown": "include-file", "file": "../templates/portalfx-data-caching.md"}

   {"gitdown": "include-file", "file": "../templates/portalfx-data-views.md"}

   {"gitdown": "include-file", "file": "../templates/portalfx-data-masterdetailsbrowse.md"}

   {"gitdown": "include-file", "file": "../templates/portalfx-data-loading.md"}

   {"gitdown": "include-file", "file": "../templates/portalfx-data-lifetime.md"}

   {"gitdown": "include-file", "file": "../templates/portalfx-data-refreshing.md"}

   {"gitdown": "include-file", "file": "../templates/portalfx-data-virtualizedgriddata.md"}

   {"gitdown": "include-file", "file": "../templates/portalfx-extensions-bp-data.md"}

   {"gitdown": "include-file", "file": "../templates/portalfx-extensions-faq-data.md"}
   
   {"gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-data.md"}