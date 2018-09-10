//------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//------------------------------------------------------------

var gulpCommon = require('../gulpcommon.js');
var fs = require('fs');
var storage = require('azure-storage');
var Q = require('q');
var gulp = require('gulp');
var path = require('path');
var util = require('util');
var dir = require('node-dir');
var chalk = require('chalk');

//directories have to work within both AzureUx-PortalFx and portalfx-docs-pr repos.
const sdkDir = __dirname;
const generatedDir = path.resolve(sdkDir, 'generated');
const templatesDir = path.resolve(sdkDir, 'templates');
const fourMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 4));

const vstfrdWorkItemUrl = "http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=";
const msazureWorkItemUrl = "https://msazure.visualstudio.com/DefaultCollection/One/_queries?id=";

/**  
 * generates docs for ux design team
 */
gulp.task('ux', function () {
    if (!fs.existsSync(generatedDir)) {
        fs.mkdirSync(generatedDir);
    }
    return gulpCommon.processFile(path.resolve(templatesDir, "index-portalfx-ux.md"), generatedDir, {}, true);
});

/**  
 * generates all documentation for both legacy auxdocs.azurewebsites.net and new github documentation
 */
gulp.task('portal', function () {
    //required for short path to SamplesExtension
    gulpCommon.createSymlink("portal-sdk/samples/SamplesExtension", "../src/SDK/AcceptanceTests/Extensions/SamplesExtension");
    gulpCommon.createSymlink("portal-sdk/samples/InternalSamplesExtension", "../src/SDK/AcceptanceTests/Extensions/InternalSamplesExtension");
    gulpCommon.createSymlink("portal-sdk/samples/VS", "../src/SDK/devkit/VS");

    if (!fs.existsSync(generatedDir)) {
        fs.mkdirSync(generatedDir);
    }

    console.log("templates Dir " + templatesDir);

    return Q.ninvoke(dir, "paths", templatesDir, true).then(function(paths) {
        try {
            var filePromises = [Q()];
            
            var dirs = paths.filter(function (file) {
                return file.endsWith(".md");
            });

            filePromises = dirs.map(function (f) {
                var relativePath = f.replace(templatesDir, "");
                var newGeneratedDir = path.join(generatedDir, path.dirname(relativePath));

                if (!fs.existsSync(newGeneratedDir)) {
                    fs.mkdirSync(newGeneratedDir);
                }

                return gulpCommon.processFile(f, newGeneratedDir, {}, true);
            });

            return Q.all(filePromises);
        }
        catch (err) {
           console.log("An error occured: " + err);

           throw err;
        }
    }).then(function () {
        try {
            var checkLinkPromises = [Q()];
            if (process.argv.indexOf("--verify") !== -1) {
                return Q.ninvoke(dir, "paths", generatedDir, true)
                .then(function(generatedFiles) {
                    console.log("Verifying urls are valid... (This may take a a couple of minutes)");
                    checkLinkPromises = generatedFiles.filter(function (fileName) {
                        var filesToSkip = [
                            "breaking-changes.md",
                            "release-notes.md",
                        ]
                        
                        return !filesToSkip.some(function(p) { return fileName.toUpperCase().endsWith(p.toUpperCase()) })
                    }).map(function (fileName) {
                        return gulpCommon.checkLinks(path.resolve(generatedDir, fileName));
                    });
                    return Q.allSettled(checkLinkPromises);
                }).then(function (brokenLinks) {
                    //console.log(chalk.red(brokenLinks.length + " broken links/fragments found.  Please fix them!"));
                    brokenLinks.forEach(function(l) {
                        if (l.state === "fulfilled" && l.value && l.value.length > 0) {
                            l.value.forEach(function(v) {
                                if (!v.url)
                                {
                                    console.log(chalk.bgRed("Broken link/fragment found: " + JSON.stringify(v)));
                                }
                                console.log(chalk.bgRed("Broken link/fragment found in " + v.inputFile + " for url: " + v.url + " reason: " + v.reason));
                            });
                        }
                        else if (l.state === "rejected") {
                            console.log(chalk.bgCyan("Rejected Broken link/fragment found: " + JSON.stringify(l)));
                        }
                    });
                });
            }
            
            return Q.defer().resolve();
        }
        catch (err) {
           console.log("An error occured: " + err);

           throw err;
        }
    });
});

//gulp task to generate auxdocs website content that was dynamic to static markdown docs 
gulp.task('dynamicdocs', function () {
    const prodSdkVersionMapIdx = process.argv.indexOf("--prodSdkMap");
    let prodSdkVersionTags = {};
    if (prodSdkVersionMapIdx !== -1 && process.argv.length - 1 >= prodSdkVersionMapIdx + 1) {
        prodSdkVersionTags = JSON.parse(process.argv[prodSdkVersionMapIdx + 1]);
    }

    var query = new storage.TableQuery()
        .where("InProductionDate ge datetime?", fourMonthsAgo.toISOString())
        .and("InProduction eq ?", true)
        .and("Type ne ?", "");
    console.log("querying portalfx commit logs");
    return queryPortalFxLogs(query, null, null)
        .then(function (results) {
            console.log("generating docs for %s commit logs", results.length);
            return generateDynamicDocs(results, generatedDir, prodSdkVersionTags);
        });
});

/**
 * Generates breaking-changes.md document from content written table storage from the SDK pipeline tools.
 * will recursively follow continuation tokens until all breaking changes are merged into mergedResults
 */
function queryPortalFxLogs(query, continuationToken, mergedResults) {
    mergedResults = mergedResults || [];
    //table service uses environmental var AZURE_STORAGE_CONNECTION_STRING
    if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
        var tableSvc = storage.createTableService().withFilter(new storage.ExponentialRetryPolicyFilter());
        return Q.ninvoke(tableSvc, "queryEntities", "PortalFxChangeLog", query, continuationToken)
            .then(function (result) {
                var body = result[0];
                mergedResults = mergedResults.concat(body.entries);

                if (body.continuationToken) {
                    //recurse continuation token 
                    return queryPortalFxLogs(query, body.continuationToken, mergedResults);
                } else {
                    return Q.resolve(mergedResults);
                }
            });
    } else {
        return Q.reject("environmental var AZURE_STORAGE_CONNECTION_STRING required to generate breaking-changes.md document");
    }
}

/** 
 * Generates release-notes.md, breaking-changes.md and downloads.md docs given an array of portalFxLogs
 */
function generateDynamicDocs(portalFxLogs, outputDir, prodSdkVersionTags) {
    const blobSvc = storage.createBlobService();
    const downloadUrlPromises = [];
    const aggregate = {};
    const noChangesRowTemplate = "<tr><td>None</td><td>None</td><td>No public work items listed in this build.</td></tr>"
    const releaseNoteRowTemplate = "<tr><td><a href='%s%s'>%s</a></td><td>%s</td><td>%s</td></tr>";
    const breakingChangeRowTemplate = "<tr><td><a href='%s%s'>%s</a></td><td><a href='%s%s'>%s</a><p>%s</p></td></tr>";
    var previousRNVersion, previousBCVersion;
    var rnRows = "", bcRows = "";

    prodSdkVersionTags = prodSdkVersionTags || {};

    //iterate in reverse to preserve order descending version order from storage. aggregate content by version for the three docs
    for (var i = portalFxLogs.length - 1; i >= 0; i--) {
        const entity = portalFxLogs[i];
        const changeType = entity.Type._;
        const sdkVersion = entity.PartitionKey._;
        const isBreakingChange = entity.IsBreakingChange._;
        const title = entity.Title ? entity.Title._ : "";
        const workItemUrl = getWorkItemUrl(changeType);
        aggregate[sdkVersion] = aggregate[sdkVersion] || { breakingCount: 0, featureCount: 0, bugFixCount: 0, downloadUrl: "", dateInProd: entity.Date._, breakingChanges: { rows: "", titles: [] } };

        if (previousRNVersion !== sdkVersion) {
            if (previousRNVersion) {
                if (!rnRows) { // If there aren't any bug fixes/features then insert an empty row
                    rnRows = noChangesRowTemplate;
                }
                aggregate[previousRNVersion].releaseNotes = rnRows;
                rnRows = "";
            }

            //removing sas generation and linking to auxdocs for auth download
            downloadUrlPromises.push(getBlobDownloadUrl(blobSvc, "daily", util.format("%s/Portal-%s.msi", sdkVersion, sdkVersion), sdkVersion).then(function (result) {
                aggregate[result.version].downloadUrl = result.downloadUrl;
            }));

            previousRNVersion = sdkVersion;
        }

        //add row to release notes
        if (changeType != "Commit") {
            rnRows = rnRows.concat(util.format(releaseNoteRowTemplate,
                workItemUrl,
                entity.RowKey._,
                entity.RowKey._,
                getPrettyChangeType(isBreakingChange, changeType),
                title));
        }

        //add row to breaking changes
        if (isBreakingChange) {
            if (previousBCVersion !== sdkVersion) {
                if (previousBCVersion) {
                    aggregate[previousBCVersion].breakingChanges.rows = bcRows;
                    bcRows = "";
                }
                previousBCVersion = sdkVersion;
            }

            aggregate[sdkVersion].breakingChanges.titles.push(title);
            bcRows = bcRows.concat(util.format(breakingChangeRowTemplate,
                workItemUrl,
                entity.RowKey._,
                entity.RowKey._,
                workItemUrl,
                entity.RowKey._,
                title,
                entity.BreakingChangeDescription ? entity.BreakingChangeDescription._ : "No description available for this breaking change."));

            if (entity.BreakingChangeDescription && !entity.BreakingChangeDescription._) {
                console.error(util.format("*** The following breaking change has no description https://msazure.visualstudio.com/One/Azure%20Portal/_workitems/edit/%s", entity.BreakingChangeDescription._ || entity.RowKey._));
            }
        }

        updateAggregate(aggregate[sdkVersion], isBreakingChange, changeType);
    }

    for (var sdkVersion in prodSdkVersionTags) {
        aggregate[sdkVersion] = aggregate[sdkVersion] || { breakingCount: 0, featureCount: 0, bugFixCount: 0, downloadUrl: "", dateInProd: undefined, breakingChanges: { rows: "", titles: [] } };
        aggregate[sdkVersion].prodSdkVersionTags = prodSdkVersionTags[sdkVersion];
    }

    aggregate[previousRNVersion].releaseNotes = rnRows;
    if (previousBCVersion) {
        aggregate[previousBCVersion].breakingChanges.rows = bcRows;
    }

    return Q.allSettled(downloadUrlPromises).then(function (results) {
        writeDocsToFile(aggregate, outputDir, prodSdkVersionTags);
    });
}

/**
 * Takes the aggregate content for all versions and writes it to release-notes.md, breaking-changes.md and downloads.md
 */
function writeDocsToFile(aggregate, outputDir, prodSdkVersionTags) {
    var releaseNotesFile = fs.createWriteStream(path.resolve(outputDir, "release-notes.md"));
    var breakingChangesFile = fs.createWriteStream(path.resolve(outputDir, "breaking-changes.md"));
    var downloadsDoc = fs.createWriteStream(path.resolve(outputDir, "downloads.md"));
    var latestDownloadableSdkVersion = "";

    // Find the highest version with a download link
    var sortedVersions = Object.keys(aggregate).sort(versioncompare).reverse();
    var latestDownloadableSdkVersion = sortedVersions.find(function (version) {
        var aVersion = aggregate[version];
        return !!aVersion.downloadUrl;
    });

    releaseNotesFile.write(util.format("# Release Notes since %s", fourMonthsAgo.toLocaleDateString("en-US")));
    breakingChangesFile.write(util.format("# Breaking Changes since %s \n* Additional Q&A about breaking changes can be found [here](./breaking-changes.md) \n* To ask a question about breaking changes [use this](https://aka.ms/ask/ibiza-breaking-change)  \n", fourMonthsAgo.toLocaleDateString("en-US")));
    const downloadLinks = util.format("Download Latest Release: <a href=\"%s\">%s</a>", aggregate[latestDownloadableSdkVersion].downloadUrl, latestDownloadableSdkVersion);
    const sortedProdSdkVersionTag = Object.keys(prodSdkVersionTags).sort(versioncompare).reverse();
    let perCloudDownloadLinks = "";
    sortedProdSdkVersionTag.forEach(function (version) {
        perCloudDownloadLinks += util.format("<br/> Download <a href=\"%s\">%s</a> : %s", aggregate[version].downloadUrl, version, prodSdkVersionTags[version].join(","));
    });

    downloadsDoc.write(util.format("# Download Portal SDK \n %s \n <table><tr><th>Download</th><th>Detail</th><th>Breaking Changes</th></tr>", perCloudDownloadLinks || downloadLinks));

    sortedVersions.forEach(function (version) {
        var result = aggregate[version];
        var versionFragment = version.replace(/\./g, '');

        releaseNotesFile.write(util.format("\n\n## %s\n%d Breaking Changes, %d Features added and %d Bugs Fixed\n<table>%s</table>",
            version,
            result.breakingCount,
            result.featureCount,
            result.bugFixCount,
            result.releaseNotes));

        if (result.breakingCount > 0) {
            breakingChangesFile.write(util.format("\n\n## %s\n<table>%s</table>",
                version,
                result.breakingChanges.rows));
        }

        downloadsDoc.write(util.format("<tr><td name=\"%s\">%s<br/>%s<br/>%s</td><td>%s<br/>%s</td><td>%s</td></tr>",
            versionFragment,
            result.downloadUrl
                ? util.format("<a href=\"%s\">%s</a>", result.downloadUrl, version)
                : version,
            result.dateInProd && result.dateInProd.toLocaleDateString("en-US") || "",
            result.prodSdkVersionTags && result.prodSdkVersionTags.join(", ") || "",
            util.format("%d Breaking Changes, %d Features added and %d Bugs Fixed", result.breakingCount, result.featureCount, result.bugFixCount),
            util.format("<a href=\"./release-notes.md#%s\">more details...</a>", versionFragment),
            result.breakingChanges.titles.length > 0
                ? result.breakingChanges.titles.reduce(function (content, item) {
                    return content.concat(util.format("%s", item));
                }).concat(util.format("<br/><a href='./breaking-changes.md#%s'>more details...</a>", versionFragment)) : ""
        ));
    });
    //write results to release-notes.md, breaking-changes.md and downloads.md
    releaseNotesFile.end("");
    breakingChangesFile.end("");
    downloadsDoc.end("</table>");
}

/**
 * updates versionAggregate the # of breaking changes, tasks and bugs
 */
function updateAggregate(versionAggregate, isBreakingChange, changeType) {
    if (isBreakingChange) {
        versionAggregate.breakingCount += 1;
    } else if (changeType === "RDTask" || changeType === "Task" || changeType === "Product Backlog Item") {
        versionAggregate.featureCount += 1;
    } else if (changeType === "RDBug" || changeType == "Bug") {
        versionAggregate.bugFixCount += 1;
    }

    return versionAggregate;
};

/**
 * Check if the blob exists.
 */
function getBlobDownloadUrl(blobSvc, container, blobName, sdkVersion) {
    var result = { version: sdkVersion };
    return Q.ninvoke(blobSvc, "doesBlobExist", container, blobName).then(function (existResult) {
        result.downloadUrl = (existResult && existResult[0].exists) ? util.format("https://auxdocs.azurewebsites.net/en-us/Downloads/Download/%s", sdkVersion.replace(/\./g, '_')) : "";
        return result;
    });
}

/**
 * returns pretty string for breaking changes, features and bugs
 */
function getPrettyChangeType(isBreaking, changeType) {
    if (isBreaking) {
        return "<strong>Break</strong>";
    } else if (changeType === "RDTask" || changeType == "Task" || changeType === "Product Backlog Item") {
        return "Feature";
    } else if (changeType === "RDBug" || changeType == "Bug") {
        return "Bug Fix";
    } else {
        return changeType;
    }
}

function getWorkItemUrl(changeType) {
    // We assume that if the change type starts with "RD" then its from VSTFRD, else its from MSAZURE.  While not perfect, this should catch most cases
    return changeType.startsWith("RD") ? vstfrdWorkItemUrl : msazureWorkItemUrl
}

/**
 * Compares version numbers for sorting ascended.  Modified from semver-compare to look at 4 numbers rather than 3
 */
function versioncompare(a, b) {
    var pa = a.split('.');
    var pb = b.split('.');
    for (var i = 0; i < 4; i++) {
        var na = Number(pa[i]);
        var nb = Number(pb[i]);
        if (na > nb) return 1;
        if (nb > na) return -1;
        if (!isNaN(na) && isNaN(nb)) return 1;
        if (isNaN(na) && !isNaN(nb)) return -1;
    }
    return 0;
};
