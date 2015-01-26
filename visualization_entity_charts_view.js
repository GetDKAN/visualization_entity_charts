/**
 * @file
 * Provides options for chart visualization.
 */

(function ($) {
  Drupal.behaviors.VisualizationEntityChartsView = {
    attach: function (context) {
      // Demo dataset.
      var config = $('.field-name-field-ve-settings .field-item').text();
      config = $.parseJSON(config);
      var graph = veChartViewInitChart();

      function veChartViewInitChart() {
        var $graphEl = $('#graph');
        var dataset = new recline.Model.Dataset({
           records: []
        });
        var graph = new recline.View.nvd3({
          model:dataset,
          el: $graphEl,
          state: {
            height: 400,
            width: 600,
            graphType: "discreteBarChart",
            xfield: "state",
            seriesFields: ["total.foreclosures", "foreclosure.ratio"],
          },
        });
        graph.render();
        return graph;
      }

      var datasource = $(".file a").attr('href');
      var ajax_options = reclineCSV(datasource);
      $.ajax(ajax_options).done(function(data) {
        var dataset;
        // Converts line endings in either format to unix format.
        data = data.replace(/(\r\n|\n|\r)/gm,"\n");
        var records = CSV.parse(data);
        dataset = new recline.Model.Dataset({
          records: records,
          size: 10,
          query: {
            size: 10
          }
        });
        var query = new recline.Model.Query({size:10});
        dataset.query(query);
        dataset.fetch();
        var config = $('.field-name-field-ve-settings .field-item').text();
        $('.field-name-field-ve-settings .field-item').toggle();
        config = $.parseJSON(config);
        config.dataset = dataset;
        graphSet(config);
      });

      function graphSet(config) {
        if (config.xLabel) {
          graph.state.attributes.options.xAxis = graph.state.attributes.options.xAxis || {};
          graph.state.attributes.options.xAxis.axisLabel = config.xLabel;
        }
        if (config.yLabel) {
          graph.state.attributes.options.yAxis = graph.state.attributes.options.yAxis || {};
          graph.state.attributes.options.yAxis.axisLabel = config.yLabel;
        }
        graph.state.set('xfield', config.xfield);
        graph.state.set('graphType', config.type);
        graph.state.set('group', config.group);
        if (config.staggerLabels) {
          graph.state.attributes.options.staggerLabels = config.staggerLabels;
        }
        graph.state.attributes.options.tooltips = config.tooltips;
        graph.state.attributes.options.showValues = config.showValues;
        graph.state.attributes.height = config.height;
        graph.state.attributes.width = config.width;
        graph.state.set('seriesFields', config.seriesFields.split(","));
        graph.model = config.dataset;
        graph.render();
      }

      function reclineCSV(file) {
        var options = {delimiter: ","};

        var ajax_options = {
            type: 'GET',
            url: file,
            dataType: 'text'
        };
        ajax_options.timeout = 500;
        ajax_options.error = function(x, t, m) {
            if (t === "timeout") {
                $('.data-explorer').append('<div class="messages status">File was too large or unavailable for preview.</div>');
            } else {
                $('.data-explorer').append('<div class="messages status">Data preview unavailable.</div>');
            }
        };
        return ajax_options;
      }
    }
  }
})(jQuery);
