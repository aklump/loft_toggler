/**
 * @file
 * Tests provided against the __QUnit class.
 *
 * @ingroup loft_toggler
 * @{
 */
var QUnit       = QUnit || {};
var LoftToggler = LoftToggler || {};

//
//
// Build your tests below here...
//
QUnit.test("Able to extend subset of options using prototype", function(assert) {
  var $el = $('.toggle');
  var preserve = $.extend({}, LoftToggler.prototype.options);
  $.extend(LoftToggler.prototype.options, {
    classBase: 'expanded',
  });
  var toggler = new LoftToggler($el);

  assert.propEqual(toggler.settings, {
    toggledOnPrefix  : 'is-',
    toggledOffPrefix : 'is-not-',
    classBase        : 'expanded',
    onToggleOn       : false,
    onToggleOff      : false    
  }, 'Settings are correct.');

  assert.propEqual(toggler.classes, {
    toggledOn: 'is-expanded',
    toggledOff: 'is-not-expanded'
  }, 'Classes are correct.');

  LoftToggler.prototype.options = preserve;
});

QUnit.test("Usage as a jQuery plugin.", function(assert) {
  var $box = $('<div class="toggle"/>');
  $('#sandbox').append($box);

  // Can instantiate.
  var instance = $box.loftToggler();
  assert.ok(instance instanceof jQuery);

  // Can obtain object.
  var toggler  = $box.data('loftToggler');
  assert.ok(toggler instanceof LoftToggler);

  // .addClass('loft-toggler-processed');

  // assert.ok($box.hasClass('loft-toggler-processed'));
});

QUnit.test("Assert arguments sent to callbacks are passed through,", function(assert) {
  var toggler = new LoftToggler($('.toggle'), {
    onToggleOn: function () {
      return arguments[1];
    },
    onToggleOff: function () {
      return arguments[2];
    },    
  });
  assert.strictEqual(toggler.toggleOn('on', 'off'), 'on');
  assert.strictEqual(toggler.toggleOff('on', 'off'), 'off');

  assert.strictEqual(toggler.toggle('on', 'off'), 'on');
  assert.strictEqual(toggler.toggle('on', 'off'), 'off');
});

QUnit.test("Code example to preserve this in callbacks.", function(assert) {

  // Set up an object to provide our callbacks that references this in
  // it's methods.
  var callbacks = {
    on: function (obj) {
      return this;
    },
    off: function (obj) {
      return this;
    }
  };

  // Proper instantiation so that this has the correct value when
  // used int he callbacks.on and .off methods.
  var toggler = new LoftToggler($('.toggle'), 'toggled', function (obj) {
    return callbacks.on(obj);
  }, function (obj) {
    return callbacks.off(obj);
  });

  assert.strictEqual(callbacks, toggler.toggleOn());
  assert.strictEqual(callbacks, toggler.toggleOff());

  // The following code will not work because the value of this gets
  // lost due to scope
  var toggler2 = new LoftToggler($('.toggle'), 'toggled', callbacks.on, callbacks.off);

  // These tests are here to assert the code fails.
  assert.notStrictEqual(callbacks, toggler2.toggleOn());
  assert.notStrictEqual(callbacks, toggler2.toggleOff());
});

QUnit.test("Able to set options using prototype", function(assert) {
  var $el = $('.toggle');
  var preserve = $.extend({}, LoftToggler.prototype.options);
  $.extend(LoftToggler.prototype.options, {
    toggledOnPrefix: 'er-',
    toggledOffPrefix: 'er-ikkje-',
    classBase: 'activ',
  });
  var toggler = new LoftToggler($el);

  assert.strictEqual(toggler.setState(true), toggler, 'setState returns this.');
  assert.ok($el.hasClass('er-activ'));  

  LoftToggler.prototype.options = preserve;
});

QUnit.test("Assert callbacks as functions work.", function(assert) {
  var $el = $('.toggle');
  var toggler = new LoftToggler($el, {
    onToggleOn: function (obj) {
      return {toggledOn: obj};
    },
    onToggleOff: function (obj) {
      return {detoggledOn: obj};
    },
  });
  assert.deepEqual({toggledOn: toggler}, toggler.toggleOn());
  assert.deepEqual({detoggledOn: toggler}, toggler.toggleOff());
});

QUnit.test("Assert callbacks as literals work.", function(assert) {
  var $el = $('.toggle');
  var toggler = new LoftToggler($el, {
    onToggleOn: 4,
    onToggleOff: 5,
  });
  assert.deepEqual(4, toggler.toggleOn());
  assert.deepEqual(5, toggler.toggleOff());
});

QUnit.test("Able to use toggle method", function(assert) {
  var $el = $('.toggle');
  var toggler = new LoftToggler($el);

  toggler.setState(true);

  assert.notOk(toggler.toggle());
  assert.notOk(toggler.getState());

  assert.notOk(toggler.toggle());
  assert.ok(toggler.getState());
});

QUnit.test("Able to get state", function(assert) {
  var $el = $('.toggle');
  var toggler = new LoftToggler($el);
  
  assert.notOk(toggler.getState());

  toggler.setState(true);
  assert.ok(toggler.getState());

  toggler.setState(false);
  assert.notOk(toggler.getState());
});

QUnit.test("Able to set state with settings as string", function(assert) {
  var $el = $('.toggle');
  var toggler = new LoftToggler($el, 'fish');
  
  toggler.setState(true);
  assert.ok($el.hasClass('is-fish'));
  assert.notOk($el.hasClass('is-not-fish'));
  
  toggler.setState(false);
  assert.ok($el.hasClass('is-not-fish'));
  assert.notOk($el.hasClass('is-fish'));
  
  toggler.setState(true);
  assert.ok($el.hasClass('is-fish'));
  assert.notOk($el.hasClass('is-not-fish'));
});

QUnit.test("Able to set state with custom classes", function(assert) {
  var $el = $('.toggle');
  var toggler = new LoftToggler($el, {
    toggledOnPrefix: 'er-',
    toggledOffPrefix: 'er-ikkje-',
    classBase: 'activ',
  });
  
  toggler.setState(true);
  assert.ok($el.hasClass('er-activ'));
  assert.notOk($el.hasClass('er-ikkje-activ'));
  
  toggler.setState(false);
  assert.ok($el.hasClass('er-ikkje-activ'));
  assert.notOk($el.hasClass('er-activ'));
  
  toggler.setState(true);
  assert.ok($el.hasClass('er-activ'));
  assert.notOk($el.hasClass('er-ikkje-activ'));
});

QUnit.test("Able to set state", function(assert) {
  var $el = $('.toggle');
  var toggler = new LoftToggler($el);
  
  toggler.setState(true);
  assert.ok($el.hasClass('is-toggled'));
  assert.notOk($el.hasClass('is-not-toggled'));
  
  toggler.setState(false);
  assert.ok($el.hasClass('is-not-toggled'));
  assert.notOk($el.hasClass('is-toggled'));
  
  toggler.setState(true);
  assert.ok($el.hasClass('is-toggled'));
  assert.notOk($el.hasClass('is-not-toggled'));
});

QUnit.test("Able to instantiate and find version", function(assert) {
  var toggler = new LoftToggler();
  assert.ok(toggler instanceof LoftToggler);
  assert.ok(toggler.version);
});

QUnit.testStart(function () {
  var structure = $('<div class="toggle"></div>');
  $('#sandbox').html(structure);
});

QUnit.done(function () {
  $('#sandbox').html('');
});