/**
 * @file
 * Provides options for chart visualization.
 */

(function ($) {
  Drupal.behaviors.VisualizationEntityCharts = {
    attach: function (context) {
      // Demo dataset.
      var dataset = createStateDataset();
      var graph = veChartInitChart(dataset);
      var grid = veChartInitGrid(dataset);
      var config = $('#edit-field-ve-settings-und-0-value').val();
      if (config) {
        config = $.parseJSON(config);
        fieldsSet(config);
      }
      var datasource = $("#edit-field-file a").attr('href');
      if (datasource) {
        if (config.seriesFields) {
          update('load');
        }
        else {
          update('init');
        }
      }

      function fieldsSet(config) {
        if (config.fields) {
          $(".series-fields").select2("destroy");
          $(".series-fields").empty();
          $(".series-fields").select2({
            data: config.fields
          });
          $("#xfield").select2("destroy");
          $("#xfield").empty();
          $("#xfield").select2({
            data: config.fields
          });
        }
        var seriesFields = config.seriesFields.split(",");
        var defaultSeriesFields = []
        for (var x = 0; x < config.fields.length; x++) {
          for (var i = 0; i < seriesFields.length; i++) {
            if (seriesFields[i] == config.fields[x].text) {
              defaultSeriesFields.push(config.fields[x].id);
            }
            if (config.xfield == config.fields[x].text) {
              $("#xfield").val([config.fields[x].id]).trigger("change");
            }
          };
        };
        if (defaultSeriesFields) {
          $(".series-fields").val(defaultSeriesFields).trigger("change");
        }

        $("#height").val(config.height);
        $("#width").val(config.width);
        $("#switch option:selected").val(config.type);
        if (config.group) {
          $('#group').prop('checked', true);
        }
        if (config.staggerLabels) {
          $('#stagger-labels').prop('checked', true);
        }
        if (config.tooltips) {
          $('#tooltips').prop('checked', true);
        }
        if (config.showValues) {
          $('#show-values').prop('checked', true);
        }
          //config. = $('#').is(':checked');
        $("#x-axis-label").val(config.xLabel);
        $("#y-axis-label").val(config.yLabel);

      }

      function veChartInitGrid(dataset) {
        var $gridEl = $('#grid');
        var grid = new recline.View.SlickGrid({
          model:dataset,
          el: $gridEl,
          state: {
            gridOptions: {
              enableColumnReorder: false
            }
          }
        });
        grid.visible = true;
        grid.render();
        return grid;
      }
      function veChartInitChart(dataset) {
        var $graphEl = $('#graph');
        var graph = new recline.View.nvd3({
          model: dataset,
          el: $graphEl,
          state: {
            height: 400,
            width: 600,
            graphType: "discreteBarChart",
            xfield: "state",
            seriesFields: ["total.foreclosures", "foreclosure.ratio"],
            group: true,
            options: {
              staggerLabels: true,
              tooltips: true
            }
          },
        });
        graph.render();

        $(".series-fields").select2({
          data: [{id: 0, text: "total.foreclosures"}, {id:1, text: "foreclosure.ratio"}, {id:2, text: "state"}]
        })
        $(".series-fields").val([0,1]).trigger("change");
        $("#xfield").select2({
          data: [{id: 0, text: "total.foreclosures"}, {id:1, text: "foreclosure.ratio"}, {id:2, text: "state"}]
        })
        $("#xfield").val([2]).trigger("change");
        return graph;
      }

      $(".bind").change(update.bind());

      function update(change) {
        var datasource = $("#edit-field-file a").attr('href');
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
          var fields = [];
          for (var i = 0; i < dataset.fields.length; i++) {
            fields.push({"id": i, "text": dataset.fields.models[i].id});
          };
          if (change == 'init') {
            $(".series-fields").select2("destroy");
            $(".series-fields").empty();
            $(".series-fields").select2({
              data: fields
            });
            $(".series-fields").val([1]).trigger("change");
            $("#xfield").select2("destroy");
            $("#xfield").empty();
            $("#xfield").select2({
              data: fields
            });
            $("#xfield").val([0]).trigger("change");
          }

          var seriesFields = [];
          $('.series-fields :selected').each(function(s, select) {
            seriesFields[s] = $(select).text();
          });
          var config = {};
          config.dataset = dataset;
          config.seriesFields = seriesFields.join(',');
          config.height = $("#height").val();
          config.width = $("#width").val();
          config.type = $("#switch option:selected").val();
          config.xfield = fields[$("#xfield").val()].text;
          config.group = $('#group').is(':checked');
          config.staggerLabels = $('#stagger-labels').is(':checked');
          config.tooltips = $('#tooltips').is(':checked');
          config.showValues = $('#show-values').is(':checked');
          config.xLabel = $("#x-axis-label").val();
          config.yLabel = $("#y-axis-label").val();
          config.fields = fields;
          graphSet(config);
          configWrite(config);
        });
      };
      function configWrite(config) {
        delete config.dataset;
        $("#field-ve-settings-add-more-wrapper textarea").html(JSON.stringify(config, null, '\t'));
      }

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
        graph.state.attributes.options.staggerLabels = config.staggerLabels;
        graph.state.attributes.options.tooltips = config.tooltips;
        graph.state.attributes.options.showValues = config.showValues;
        graph.state.attributes.height = config.height;
        graph.state.attributes.width = config.width;
        graph.state.set('seriesFields', config.seriesFields.split(","));
        graph.model = config.dataset;
        graph.render();
        grid.model = config.dataset;
        grid.render();
      }



    function createStateDataset() {
      var dataset = new recline.Model.Dataset({
         records: [
          {id: 0, state: 'Idaho', "total.foreclosures": 861, "foreclosure.ratio": 776},
          {id: 1, state: 'Minnesota', "total.foreclosures": 3017, "foreclosure.ratio": 778},
          {id: 2, state: 'Hawaii', "total.foreclosures": 652, "foreclosure.ratio": 797},
          {id: 3, state: 'Iowa', "total.foreclosures": 1365, "foreclosure.ratio": 979},
          {id: 4, state: 'Oregon', "total.foreclosures": 1630, "foreclosure.ratio": 1028},
          {id: 5, state: 'Idaho', "total.foreclosures": 1000, "foreclosure.ratio": 500},
        ]
      });
      return dataset;
    };

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
