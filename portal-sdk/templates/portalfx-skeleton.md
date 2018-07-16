# Skeleton
<!-- topic name is a level 1 header at the beginning of the doc-->

This document contains the skeleton for authoring Azure documents that are stored in gitHub. The skeleton will be used by gitHub to generate the document for the entire topic.  This information is contained in this document as gitHub commands so that an author can fill them in when the subtopics are written, and then generate the topic document.
This is the only document within the topic that contains an H1-level header.

1. Documents are organized by  major areas.  Some major areas are as follows:

   * blades
   * controls 
   * create
   * data
   * forms
   * parameters
   * parts
   * samples
   * styling
   * telemetry
   * ux

1. Within these major areas, documents are organized by topic. Some topics are object names or specific principles. For example, some filenames are `portalfx-blades-outputs.md`, `portalfx-controls-editor.md`, and `portalfx-forms-designing.md`.

1. There are some topics that do not have a major area. They are not specific to one topic, and consequently, may be linked to within several topics. A partial list is as follows.

   * portalfx-extensions-branches.md
   * portalfx-extensions-cnames.md
   * portalfx-extensions-contacts.md
   * top-extensions-developmentPhases.md
   * top-extensions-production-ready-metrics.md
   * top-extensions-publishing.md
   * portalfx-extensions-qualityEssentials.md
   * portalfx-stackoverflow.md
   * portalfx-extensions-status-codes.md

1. Subtopics that occur within topics, like overviews or procedures, will always use that word as the last node within the filename.  However, the author has the option of including the overview and the procedure in the topic document instead of using a GitHub include statement. 

Subtopics that are specific to a topic are self-naming, in one or two words. The last node of the file is the name of the subtopic, and is used to sort subtopics within the topic. Some filenames are `portalfx-telemetry-alerting-overview.md`, `portalfx-telemetry-alerting-performance.md` or `portalfx-style-guide-utility-classes.md`. 

1. Best Practices, FAQ's, and glossaries use a slightly different naming convention, in that they are named `portalfx-extensions-bp-<major-area>`,  `portalfx-extensions-faq-<major-area>`, `portalfx-extensions-glossary-<major-area>`, respectively.

1. Subtopic files are contained within the topic document in the following order.

    | Name                                           | Purpose |
    | ---------------------------------------------- | ------- |
    | `portalfx-<major-area>-<topic>-overview.md`    | Required. General discussion of topic. May be included in the topic document instead of remaining a separate file. |
    | `portalfx-<major-area>-<topic>-<subtopic1>.md` | Optional. A section that is used when the topic goes deeper than an overview.  The last item in the overview may be a table that links to these sections, in addition to relying on the gitHub includes that are a part of the overarching document. |
    | `portalfx-<major-area>-<topic>-<subtopic2>.md` | Optional. A section that is used when the topic goes deeper than an overview. |
    | `portalfx-<major-area>-<topic>-procedure.md`   | Optional.  Checklist document. Used when there are specific steps to follow, or when there are specific tasks whose completion must be verified. May be included in the topic document instead of remaining a separate file. |
    | `portalfx-extensions-bp-<topic>.md`            | Optional. Best Practices for the topic. |
    | `portalfx-extensions-faq-<topic>.md`           | Optional. Frequently Asked Questions for the topic. |
    | `portalfx-extensions-glossary-<topic>.md`      | Required. Glossary for the topic. |

1. Sections that have been written for other documents can be linked to within the subtopics using normal gitHub linking procedures. This is best practice, and is preferred over copying and modifying paragraphs from file to file. If the section is a separate file, the link would resemble the following: `[portalfx-<major-area>-<topic>-<subtopic1>.md](portalfx-<major-area>-<topic>-<subtopic1>.md)`. Otherwise, if the section is a paragraph within a separate topic, the link would resemble the following `[portalfx-<major-area>-<topic>.md#<subtopic1>](portalfx-<major-area>-<topic>.md#<subtopic1>)`.

1. Files are included in a topic by gitHub, based on the topic-subtopic relationship. They are linked to in this overarching document with gitHub commands.  Because this skeleton file also functions as a sample document, the gitHub commands in the following section are slightly malformed.  To use this skeleton to create a new topic, fill in the parameters that are designated with angle brackets, and then enclose the gitHub command in curly brackets.

 **NOTE**: The command "gitdown" is at the beginning of each inclusion line and is enclosed in double quotes.
 
<!-- required Overview document.  -->
<!-- gitdown": "include-file", "file": "../templates/portalfx-<topic>-overview.md"} -->
   {"gitdown": "include-file", "file": "../templates/portalfx-skeleton-overview.md"}

<!--  optional subtopic documents. Use these when the topic goes deeper than an overview. The overview may contain a table that links to these sections, in addition to (or instead of) relying on the following gitHub includes. -->
<!-- gitdown": "include-file", "file":  "../templates/portalfx-<major-area>-<topic>-<subtopic1>.md"  -->
<!-- gitdown": "include-file", "file":  "../templates/portalfx-<major-area>-<topic>-<subtopic2>.md"  -->

<!-- optional checklist document. Use this when there are specific steps to follow, or when there are specific tasks that the developer must verify as being completed. -->
<!-- gitdown": "include-file", "file": "../templates/portalfx-<major-area>-<topic>-procedure.md"  -->
   {"gitdown": "include-file", "file": "../templates/portalfx-skeleton-procedure.md"}
  
<!--  optional subtopic documents. Use these when the topic goes deeper than an overview. The overview may contain a table that links to these sections, in addition to (or instead of) relying on the following gitHub includes. -->
<!-- gitdown": "include-file", "file":  "../templates/portalfx-<major-area>-<topic>-<subtopic1>.md"  -->
<!-- gitdown": "include-file", "file":  "../templates/portalfx-<major-area>-<topic>-<subtopic2>.md"  -->

<!-- optional Best Practices document -->
<!-- gitdown": "include-file", "file": "../templates/portalfx-<major-area>-bp-<topic>.md"  -->
   {"gitdown": "include-file", "file": "../templates/portalfx-extensions-bp-skeleton.md"}

<!-- optional FAQ document -->
<!-- gitdown": "include-file", "file": "../templates/portalfx-<major-area>-faq-<topic>.md"  -->
   {"gitdown": "include-file", "file": "../templates/portalfx-extensions-faq-skeleton.md"}
   
<!-- required Glossary document. -->
<!-- gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-<major-area>.md"  -->
   {"gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-skeleton.md"}