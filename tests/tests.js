QUnit.test("Able to instantiate.", function(assert) {
  var loftToggler = new LoftToggler;
  assert.ok(typeof loftToggler === 'object');
  assert.ok(loftToggler.version);
});

QUnit.testStart(function (details) {
  var structure = $('<div>Any necessary html markup...</div>');
  $('#sandbox').html(structure);
});

QUnit.done(function () {
  $('#sandbox').html('');
});