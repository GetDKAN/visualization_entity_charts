/**
 * @file
 * Provides options for chart visualization.
 */

(function ($) {
  Drupal.behaviors.VisualizationEntityChartsView = {
    attach: function (context) {

      var graphs = $('.graph');
      $.each(graphs, function(key, graph){
        var $el = '#' + $(graph).attr('id');
        var state = $($el).siblings(".entity").find(".field-name-field-ve-settings .field-item:eq(0)").text();
        if($('#iframe-shell').length){
          $el = $('#iframe-shell');
        }
        createGraph(state, $el);
      });



      function createGraph(state,$el) {
        var isIframe = !$('.content').is(':visible');
        var title;
        var height;
        var $body;

        if(state){
          state = new recline.Model.ObjectState(JSON.parse(state));
          $body = $(document.body);
          $window = $(window);
          $body.removeClass('admin-menu');

          if($('#iframe-shell').length){
            if(state.get('showTitle')){
              title = $el.find('h2 a').html();
              $body.prepend('<h2 class="chartTitle">' + title + '</h2>');
              height = getChartHeight(true);
              resize();
            } else {
              height = getChartHeight(false);
            }
            state.set('height', height);
            state.set('width', $window.width() - 10);
            $window.on('resize', resize);
          } else {
            state.set('width', $($el).width());
          }

          var model = state.get('source');
          var graph = null;
          model.url = cleanURL(model.url);
          $.get(model.url).done(function(data){
            data = data.replace(/(?:\r|\n)/g, '\r\n');
            data = CSV.parse(data);
            state.set('model', new recline.Model.Dataset({records: data}));
            model = state.get('model');
            model.queryState.set(state.get('queryState'));
            graph = new recline.View.nvd3[state.get('graphType')]({
              model: model,
              state: state,
              el: $el
            });
            graph.render();
          });

        }
      }
      function cleanURL(url){
        var haveProtocol = new RegExp('^(?:[a-z]+:)?//', 'i');
        if(haveProtocol.test(url)){
          url = url.replace(haveProtocol, '//');
        }
        return url;
      }

      function resize(){
        var $title = $body.find('h2.chartTitle');
        var hasTitle = !!$title.length;
        $title.css({marginTop:'0px', padding:'20px', marginBottom:'0px'});
        var height = getChartHeight(hasTitle);
        $('.recline-nvd3').height(height);
        $('#iframe-shell').height(height);

      }
      function getChartHeight(hasTitle) {
        var height = (!hasTitle)
          ? $(window).height()
          : $(window).height() - $body.find('h2.chartTitle').outerHeight(true);

        return height;
      }

    }
  };
})(jQuery);
