<section class="col-sm-12">
  <?php print drupal_render($title); ?>
  <?php if ($fields): ?>
    <?php foreach ($fields as $instance): ?>
      <?php print drupal_render($instance); ?>
    <?php endforeach ?>
  <?php endif ?>
</section>

<section class="col-sm-12">
  <div id="steps">
  </div>
</section>
<section class="col-sm-12">
  <?php print drupal_render($settings);?>
</section>
<?php print drupal_render_children($form);?>
