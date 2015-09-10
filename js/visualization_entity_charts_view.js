/**
 * @file
 * Provides options for chart visualization.
 */

(function ($) {
  Drupal.behaviors.VisualizationEntityChartsView = {
    attach: function (context) {
      var isIframe = !$('.content').is(':visible');
      var state = $('.field-name-field-ve-settings .field-item:eq(0)').text();
      var $el;
      var title;
      var height;
      var $body;

      if(state){
        state = new recline.Model.ObjectState(JSON.parse(state));
        $body = $(document.body);
        $window = $(window);
        $body.removeClass('admin-menu');

        if($('#iframe-shell').length){
          $el = $('#iframe-shell');
          if(state.get('showTitle')){
            title = $el.find('h2 a').html();
            $body.prepend('<h2 class="veTitle">' + title + '</h2>');
            height = getChartHeight(true);
            resize();
          } else {
            height = getChartHeight(false);
          }
          state.set('height', height);
          state.set('width', $window.width() - 10);
          $window.on('resize', resize);
        } else {
          $el = $('#graph');
          state.set('width', $('.field-name-field-ve-settings').width());
        }

        $el.append(('<div class="alert alert-info loader">Loading <span class="spin"></span></div>'));
        var model = state.get('source');
        var graph = null;
        model.url = cleanURL(model.url);
        $.get(model.url).done(function(data){
          data = data.replace(/(?:\r|\n)/g, '\r\n');
          data = CSV.parse(data);
          data = _.map(data, function(record){
            return _.map(record, function(value){
              return !value ? null : value;
            });
          });
          state.set('model', new recline.Model.Dataset({records: data}));
          model = state.get('model');
          model.queryState.set(state.get('queryState'));
          graph = new recline.View.nvd3[state.get('graphType')]({
            model: model,
            state: state,
            el: $el
          });
          graph.render();
          $el.find('.loader').remove();
        });

      }
      function cleanURL(url){
        var haveProtocol = new RegExp('^(?:[a-z]+:)?//', 'i');
        if(haveProtocol.test(url)){
          url = url.replace(haveProtocol, '//');
        }
        return url;
      }

      function resize(){
        var $title = $body.find('h2.veTitle');
        var hasTitle = !!$title.length;
        var height = getChartHeight(hasTitle);
        $('.recline-nvd3').height(height);
        $('#iframe-shell').height(height);

      }
      function getChartHeight(hasTitle) {
        var height = (!hasTitle)
          ? $(window).height()
          : $(window).height() - $body.find('h2.veTitle').outerHeight(true);

        return height;
      }

    }
  };
})(jQuery);
