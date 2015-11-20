/**
 * @file
 * Provides options for chart visualization.
 */

(function ($) {
  var sharedObject;

  Drupal.behaviors.VisualizationEntityCharts = {
    attach: function (context) {
      var currentState = $('#edit-field-ve-settings-und-0-value').val();
      var state;
      var model;

      if(currentState){
        state = new recline.Model.ObjectState(JSON.parse(currentState));
        source = state.get('source');
        if(source){
          source.url = cleanURL(source.url);
          model = new recline.Model.Dataset(source);
          model.fetch(source)
          .done(init)
          .fail(function(){
            alert('An error occured trying to get the file');
            sharedObject = {state: state};
            sharedObject.state.set({step:0});
            init();
          });

          state.set('model', model);
          state.get('model').queryState.attributes = state.get('queryState');
          sharedObject = {state: state};
        }
      }
      else if(!sharedObject) {
        state = new recline.Model.ObjectState();
        state.set('queryState', new recline.Model.Query());
        sharedObject = {state: state};
        init();
      }

      if(state) {
        setActiveStep(state.get('step'));
      } else {
        setActiveStep(0);
      }

      function cleanURL(url){
        var haveProtocol = new RegExp('^(?:[a-z]+:)?//', 'i');
        if(haveProtocol.test(url)){
          url = url.replace(haveProtocol, '//');
        }
        return url;
      }

      function setActiveStep(n){
        var $stages = $('#ve-chart-form .stages li');
        $stages.removeClass('active');
        $stages
          .eq(n)
          .addClass('active');
      }

      function init(){
        var msv = new MultiStageView({
          state: state,
          el: $('#steps')
        });

        // Add steps
        msv.addStep(new LoadDataView(sharedObject));
        msv.addStep(new DataOptionsView(sharedObject));
        msv.addStep(new ChooseChartView(sharedObject));
        msv.addStep(new ChartOptionsView(sharedObject));

        msv.on('multistep:change', function(e){
          setActiveStep(e.step);
        });
        msv.render();

        // Oh my god!!
        $(document).ajaxComplete(function(e, xhr, settings) {
          if(settings.url && settings.url.search('/file/ajax/field_file') !== -1){
            var url = $('.file-widget a').prop('href');
            var source = {backend:'csv', url: url};
            sharedObject.state.set('source', source);
            msv.gotoStep(0);
            msv.render();
          }
        });
        var $resourceField = $('#edit-field-uuid-resource-und-0-target-uuid');

        $resourceField.on('autocompleteSelect', function(event, node) {
          var re = /\[(.*?)\]/;
          var $sourceField = $('#control-chart-source');
          var uuid = re.exec($resourceField.val())[1];
          var url = '/node/' + uuid + '/download';
          var source = {backend:'csv', url: url};
          sharedObject.state.set('source', source);
          $sourceField.val(url);
          msv.gotoStep(0);
          msv.render();
        });

        sharedObject.state.on('change', function(){
          var serializedState = JSON.stringify(sharedObject.state.toJSON());
          $('#edit-field-ve-settings-und-0-value').val(serializedState);
          //console.log(sharedObject.state.toJSON());
        });
        window.msv = msv;
        window.sharedObject = sharedObject;
      }
    }
  };
})(jQuery);
