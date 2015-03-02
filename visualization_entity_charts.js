/**
 * @file
 * Provides options for chart visualization.
 */

(function ($) {
  Drupal.behaviors.VisualizationEntityCharts = {
    attach: function (context) {
      var currentState = $('#edit-field-ve-settings-und-0-value').val();
      var state;

      if(currentState){
        state = new recline.Model.ObjectState(JSON.parse(currentState));
      } else {
        state = new recline.Model.ObjectState();
      }

      window.sharedObject = {state: state};

      window.msv = new MultiStageView({
        state: state,
        el: $('#steps')
      });

      msv.addStep(new LoadDataView(sharedObject));
      msv.addStep(new DataOptionsView(sharedObject));
      msv.addStep(new ChooseChartView(sharedObject));
      msv.addStep(new ChartOptionsView(sharedObject));
      msv.render();

      // Oh my god!!
      $(document).ajaxComplete(function(e, xhr, settings) {
        if(settings.url && settings.url.search('/file/ajax/field_file') !== -1){
          var url = $('.file-widget a').prop('href');
          var source = {backend:'csv', url: url};
          sharedObject.state.set('source', source);
          msv.render();
        }
      });

      sharedObject.state.on('change', function(){
        $('#edit-field-ve-settings-und-0-value').val(JSON.stringify(sharedObject.state.toJSON()));
      });

    }
  };
})(jQuery);
