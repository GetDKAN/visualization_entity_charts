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
      if(currentState && !sharedObject){
        state = new recline.Model.ObjectState(JSON.parse(currentState));
        model = state.get('model');

        if(model && !model.records){
          model = new recline.Model.Dataset(state.get('model'));
          model.fetch().done(init);
          state.set('model', model);
          sharedObject = {state: state};
        }
      } else if(!sharedObject) {
        state = new recline.Model.ObjectState();
        sharedObject = {state: state};
        init();
      }

      if(state) {
        setActiveStep(state.get('step'));
      } else {
        setActiveStep(0);
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

        sharedObject.state.on('change', function(){
          $('#edit-field-ve-settings-und-0-value').val(JSON.stringify(sharedObject.state.toJSON()));
        });
        window.msv = msv;
        window.sharedObject = sharedObject;
      }
    }
  };
})(jQuery);
