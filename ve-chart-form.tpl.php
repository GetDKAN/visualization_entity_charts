<section class="col-sm-12">
  <?php print drupal_render($title); ?>
  <?php if ($fields): ?>
    <?php foreach ($fields as $instance): ?>
      <?php print drupal_render($instance); ?>
    <?php endforeach ?>
  <?php endif ?>
</section>
<section class="col-sm-3">
  <h2>Chart Settings</h2>
    <ul class="nav nav-pills" role="tablist">
      <li role="presentation" class="active"><a href="#type" aria-controls="type" role="tab" data-toggle="tab">Type</a></li>
      <li role="presentation"><a href="#fields" aria-controls="fields" role="tab" data-toggle="tab">Fields</a></li>
      <li role="presentation"><a href="#size" aria-controls="size" role="tab" data-toggle="tab">Size</a></li>

      <li role="presentation"><a href="#options" aria-controls="options" role="tab" data-toggle="tab">Options</a></li>

    </ul>
  <form class="form-horizontal" role="form">
    <div class="tab-content">
      <div role="tabpanel" class="tab-pane active" id="type">
        <label for="type" class="control-label">type</label>
        <select id="switch" class="form-control bind">
          <option value="discreteBarChart">Discrete Bar</option>
          <option value="multiBarChart">Multi Bar</option>
          <option value="stackedAreaChart">Stacked Area</option>
          <option value="multiBarHorizontalChart">Mulit Bar Horizontal</option>
          <option value="pieChart">Pie</option>
          <option value="lineChart">Line</option>
          <option value="lineWithFocusChart">Line with Focus</option>
          <option value="scatterChart">Scatter</option>
          <option value="linePlusBarWithFocusChart">Line Plus Bar With Focus</option>
          <!--
          <option value="multiBarWithBrushChart">multiBarWithBrushChart</option>
          <option value="multiChart">multiChart</option>
          <option value="linePlusBarChart">linePlusBarChart</option>-->
        </select>
      </div>
      <div role="tabpanel" class="tab-pane" id="fields">
        <label for="xfield" class="control-label">X-Field</label>
        <select class="form-control" id="xfield"></select>
        <label for="series-field" class="control-label">Series Fields</label>
        <select class="series-fields form-control" multiple="multiple"></select>
        <label for="group" class="control-label">Group</label>
        <input type="checkbox" class="form-control bind" id="group" checked="true">

        <label for="x-axis-label" class="control-label">X-Axis Label</label>
        <input type="text" class="form-control bind" id="x-axis-label" placeholder="x-axis label">
        <label for="y-axis-label" class="control-label">Y-Axis Label</label>
        <input type="text" class="form-control bind" id="y-axis-label" placeholder="y-axis label">
      </div>
      <div role="tabpanel" class="tab-pane" id="size">
        <label for="width" class="control-label">Width</label>
        <input type="text" class="form-control bind" id="width" placeholder="400" value="600">
        <label for="height" class="control-label">Height</label>
        <input type="text" class="form-control bind" id="height" placeholder="400" value="400">
      </div>
      <div role="tabpanel" class="tab-pane" id="options">
        <label class="control-label">Stagger Labels</label>
        <input type="checkbox" class="form-control bind" id="stagger-labels" checked="true">
        <label class="control-label">Tooltips</label>
        <input type="checkbox" class="form-control bind" id="tooltips" checked="true">
        <label class="control-label">Show Values</label>
        <input type="checkbox" class="form-control bind" id="show-values">
      </div>
    </div>
  </form>
</section>
<section class="col-sm-9">
  <div role="tabpanel">
    <h2>Chart</h2>
    <ul class="nav nav-tabs" role="tablist">
      <li role="presentation" class="active"><a href="#chart" aria-controls="chart" role="tab" data-toggle="tab">Chart</a></li>
      <li role="presentation"><a href="#data" aria-controls="data" role="tab" data-toggle="tab">Data</a></li>
    </ul>
    <div class="tab-content">
      <div role="tabpanel" class="tab-pane active" id="chart">
        <div id="graph" style="position: relative;"></div>
      </div>
      <div role="tabpanel" class="tab-pane" id="data">
        <div id="grid" style="height:400px; width: 400px; padding: 20px"></div>
      </div>
    </div>
  </div>
</section>
<section class="col-sm-12">
  <?php print drupal_render($settings); ?>
</section>
<section class="col-sm-12">
  <?php print drupal_render($save); ?>
</section>
<?php print drupal_render_children($form);?>
