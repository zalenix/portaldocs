## Charts

Chart controls allow users to visualize and analyze their data. A  chart is included in the following example.

![alt-text](../media/portalfx-ui-concepts/chart.png "Extensions can host multiple areas")

The chart can be used as an intrinsic part, as specified in [top-legacy-parts.md](top-legacy-parts.md). The intrinsic part is maintained by the Framework and provides a layout that is consistent with the rest of the portal.

If the extension uses a custom part template instead, charts can be added with the following html:

```xml
<div data-bind='pcChart: chartVM' style='height:500px'></div>
```


Our charts include the following **chart view** types which can be used separately or in tandem.

* Line
* Grouped bar
* Stacked bar
* Scatter
* Area
* Stacked area 

### Chart views

Chart views are the high-level view type for the chart, as in the following code.

```ts
// Initialize the view.  This is the code that makes this chart a bar chart.
var barChartView = new MsPortalFx.ViewModels.Controls.Visualization.Chart.BarChartView<string, number>(MsPortalFx.ViewModels.Controls.Visualization.Chart.BarChartType.Grouped);
this.chartVM.views([barChartView]);
```

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. 

A ViewModel that includes a single chart view type is located at `<dir>\Client\V1\Controls\Chart\ViewModels\BarChartViewModels.ts`.

A ViewModel that includes  multiple chart view types is located at `<dir>\Client\V1\Controls\Chart\ViewModels\OverlayedViewChartViewModel.ts`.

### Series views

Series views are visualizations of individual data series. Series views allow developers to modify the color, display name, and interaction behavior of a specific series.

By default, series views will be generated for each of the chart views and each data series that is added to the chart. For example, there are  three data series respectively named seriesA, seriesB, and seriesC. There is also a chart that has two chart views, a bar chart view and a line chart view. The resulting chart would have six series views, specifically one  bar chart view and one line chart view for each series. This default behavior is ideal for simple charts, especially those with one chart view type.

Series views allow developers to create more interesting views. For example, seriesA and seriesB should be visualized as bars, and seriesC should be visualized as a line. To achieve this behavior, turn off the auto-generate behavior, as in the following code.

```ts
this.chartVM.autogenerateSeriesViews(false);
```

Then, create and specialize the series views in accordance with the extension design, or as in the following code.

```ts
var lineSeriesView = new MsPortalFx.ViewModels.Controls.Visualization.Chart.LineChartSeriesView<string, number>();
lineSeriesView.seriesName("LineSeries");
lineSeriesView.cssClass("msportalfx-bgcolor-c1");

var barSeriesView = new MsPortalFx.ViewModels.Controls.Visualization.Chart.SeriesView<string, number>(MsPortalFx.ViewModels.Controls.Visualization.Chart.BarChartType.Stacked);
barSeriesView.seriesName("BarSeries");

lineChartView.seriesView([lineSeriesView]);
barChartView.seriesView([barSeriesView]);
```

<!-- TODO: Determine the whereabouts of this sample, because it no longer ships with the SDK under the following name. -->
Another example of using the auto-generated series views functionality is located at 
`<dir>\Client\V1\Controls\Chart\ViewModels\LineChartDateBasedViewModels.ts`.

For an example that demonstrates how series views are created explicitly by the extension, see 
`<dir>\Client\V1\Controls\Chart\ViewModels\OverlayedViewChartViewModels.ts`.

### Metrics

Metrics are the [big data](top-extensions-glossary.md) call-outs that are associated with chart controls to provide interactive insights into data patterns and trends, as in the following image.

![alt-text](../media/portalfx-ui-concepts/chartMetrics.png "Chart metrics")

Metrics can be configured manually by handling chart events, calculating values, and sending information to the metrics controls, or by setting up metrics rules.

### Metrics rules

Metrics rules are a rule-based system that automatically hooks up metric values to different user interactions. For instance, when the user is not interacting with the chart area, the chart metrics might display the average value of each data series. This default behavior is configured with the following rule. 

```ts
metricRule1.scope(Chart.MetricRuleScope.Default);
metricRule1_metric1.aggregationScope(Chart.MetricRuleAggregationScope.AllSeparately);
metricRule1_metric1.aggregationType(Chart.MetricRuleAggregationType.AverageY);
```

This rule displays one metric that represents the average value of each data series on the chart.

<!-- TODO: Determine the whereabouts of this sample, because it no longer ships with the SDK under the following name. Might it be Client\V1\Controls\Metrics\ViewModels\MetricsViewModels.ts -->

For a full example of the metrics rules implementation, see `<dir>\Client\Controls\Chart\ViewModels\LineChartDateTimeViewModels.ts`.
