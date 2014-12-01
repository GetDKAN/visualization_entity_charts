/**
 * @file
 * Provides options for chart visualization.
 */

(function ($) {
  Drupal.behaviors.VisualizationEntityCharts = {
    attach: function (context) {

      var graphInit = function() {
        var dataset = createStateDataset();
        var $graphEl = $('#graph');
        var type = $("#edit-field-ve-type-und option:selected").val() || 'discreteBarChar';
        var height = $("#edit-field-ve-height-und-0-value").val();
        var width = $("#edit-field-ve-width-und-0-value").val();
        var xfield = $("#edit-field-ve-x-field-und-0-value").val() || "state";
        var seriesFields = $("#edit-field-ve-series-fields-und-0-value").val();
        seriesFields = seriesFields.split(",");
        var group = false;
        if ($('#edit-field-ve-group-und').is(':checked')) {
          group = true;
        }
        var graph = new recline.View.nvd3({
          model: dataset,
          el: $graphEl,
          state: {
            height: height,
            width: width,
            graphType: type,
            xfield: "state",
            seriesFields: seriesFields,
            group: true
          }
        });
        graph.render();
        return graph;
      }
      var graph = graphInit();
      var graphListen = function() {
        $("#edit-field-ve-type-und").change(function() {
          update();
        });  
        $("#edit-field-ve-height").change(function() {
          update();
        });  
        $("#edit-field-ve-width").change(function() {
          update();
        });  
        $("#edit-field-ve-group-und").change(function() {
          update();
        });  
        $("#edit-field-ve-x-field-und-0-value").change(function() {
          update();
        });  
        $("#edit-field-ve-series-fields-und-0-value").change(function() {
          update();
        });  
        $("#edit-field-vecd-esource-und").change(function() {
          var nid = $("#edit-field-vecd-esource-und").val();
          $.ajax({
              url: "/resource_by_nid/" + nid,
          }).done(function(data) {
            if (data.type == 'file') {
              console.log(data);
              var options = {delimiter: ","};
              $.ajax({
                  url: data.url,
                  dataType: "text",
                  timeout: 500,
                  success: function(data) {
                    // Converts line endings in either format to unix format.
                    data = data.replace(/(\r\n|\n|\r)/gm,"\n");
                    var dataset = new recline.Model.Dataset({
                        records: recline.Backend.CSV.parseCSV(data, options)
                    });

                    dataset.fetch();
                    graph.model = dataset;
                    graph.render();
                  },
                  error: function(x, t, m) {
                      if (t === "timeout") {
                          $('.data-explorer').append('<div class="messages status">File was too large or unavailable for preview.</div>');
                      } else {
                          $('.data-explorer').append('<div class="messages status">Data preview unavailable.</div>');
                      }
                  }
              });

            }
            else if (data.type == 'api') {
              var dataset = new recline.Model.Dataset({
                endpoint: window.location.origin + Drupal.settings.basePath + '/api',
                url: data.url,
                id: data.uuid,
                backend: 'ckan'
              });
              dataset.fetch();
              graph.model = dataset;
              graph.render();
            }
          });

        });  
      };
      graphListen();

      function update() {
        var type = $("#edit-field-ve-type-und option:selected").val();
        var height = $("#edit-field-ve-height-und-0-value").val();
        var width = $("#edit-field-ve-width-und-0-value").val();
        var xfield = $("#edit-field-ve-x-field-und-0-value").val();
        if (xfield) {
          graph.state.attributes.xfield = xfield;
        }
        var seriesFields = $("#edit-field-ve-series-fields-und-0-value").val();
        if (seriesFields) {
          graph.state.attributes.seriesFields = seriesFields.split(",");
        }
        var group = false;
        if ($('#edit-field-ve-group-und').is(':checked')) {
          group = true;
        }
        graph.state.attributes.graphType = type;
        graph.state.attributes.group = group;
        graph.state.attributes.height = height;
        graph.state.attributes.width = width;
        graph.render(); 
      }

      function createStateDataset() {
        var dataset = new recline.Model.Dataset({
           records: [
            {id: 0, state: 'Idaho', total: 861, ratio: 776},
            {id: 1, state: 'Minnesota', total: 3017, ratio: 778},
            {id: 2, state: 'Hawaii', total: 652, ratio: 797},
            {id: 3, state: 'Iowa', total: 1365, ratio: 979},
            {id: 4, state: 'Oregon', total: 1630, ratio: 1028},
            {id: 5, state: 'Idaho', total: 1000, ratio: 500},

          ]
        });
        return dataset;
      }
    }
  }
})(jQuery);
