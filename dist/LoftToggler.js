/**
 * Loft Toggler JavaScript Module v1.0.5
 * http://www.intheloftstudios.com/packages/js/loft_toggler
 *
 * Handles the classes and callbacks for a toggled element.
 *
 * Copyright 2015-2017, Aaron Klump <sourcecode@intheloftstudios.com>
 * @license Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Thu May 18 10:46:27 PDT 2017
 */
/**
 *
 * Use case: This class may be used when you need to do something when an
 * element is clicked, such as display/hide a menu. It handles the css classes
 * and allows for callbacks associated with each state. Finally it provides a
 * means of triggering each state and toggling between them.
 *
 * Be aware that the callbacks receive the following arguments as well as
 * any arguments passed to them.
 * - LoftToggler instance
 *
 * EXAMPLE ONE:
 *
 * The most basic usage with no callbacks, using default classes:
 * @code
 *   var toggler = new LoftToggler($('.toggle'));
 *   toggler.toggle();
 * @endcode
 *
 * The same thing showing jQuery syntax:
 * @code
 *   $('.toggle').loftToggler();
 *   var toggler = $('.toggle').data('loftToggler');
 *   toggler.toggle();
 * @endcode
 *
 * Or written slightly differently:
 * @code
 *   var toggler = $('.toggle').loftToggler().data('loftToggler');
 *   toggler.toggle();
 * @endcode
 *
 *
 * EXAMPLE TWO:
 *
 * In this example we modify the baseClass from 'toggledOn' to 'toggled'
 * so that we end up with 'is-toggled' and 'is-not-toggled'.
 * @code
 *   var toggler = new LoftToggler($('.toggle'), 'toggled');
 * @endcode
 *
 *
 * EXAMPLE THREE:
 *
 * In this example we add callbacks to be fired on each event:
 * @code
 *   // Set up an object to provide our callbacks that references 'this' in
 *   // it's methods to demonstrate using 'this'.
 *   var callbacks = {
 *     on: function (obj) {
 *       return this;
 *     },
 *     off: function (obj) {
 *       return this;
 *     }
 *   };

 *   // Proper instantiation so that 'this' has the correct value when
 *   // used in the callbacks.on and .off methods.
 *   var toggler = new LoftToggler($('.toggle'), 'toggled', function (obj) {
 *     return callbacks.on(obj);
 *   }, function (obj) {
 *     return callbacks.off(obj);
 *   });

 *   // The following code WILL NOT WORK because the value of 'this' gets
 *   // lost due to scope.
 *   var toggler2 = new LoftToggler($('.toggle'), 'toggled', callbacks.on, callbacks.off);
 * @endcode
 *
 *
 * EXAMPLE FOUR
 *
 * To defind new options for all instances of LoftToggler do something like
 * this, but it must be done before you instantiate your objects.
 * @code
 *   $.extend(LoftToggler.prototype.options, {
 *     classBase: 'expanded'
 *   });
 *   var toggler = new LoftToggler($el);
 * @endcode
 */
var LoftToggler = (function ($) {
  "use strict";

  $.fn.loftToggler = function (settings, onToggleOn, onToggleOff) {
    return this.each(function () {
      var $el = $(this);
      $el.data('loftToggler', new LoftToggler($el, settings, onToggleOn, onToggleOff));
    });
  };

  /**
   * Constructor
   *
   * @param $element jQuery object The element that will receive the toggling
   *   classes.
   * @param classBase string The common suffix of is- and is-not-.
   * @param onToggleOn mixed|function A value to return when toggled on.
   * @param onToggleOff mixed|function A value to return when toggled on.
   */
  function LoftToggler($element, settings, onToggleOn, onToggleOff) {
    var _ = this;
    _.version = "1.0.3";
    _.$el = $element;

    // When settings is passed as a string it will be the classBase.
    if (typeof settings === 'string') {
      settings = {classBase: settings};
    }
    _.settings = $.extend({}, _.options, settings, {
      onToggleOn: onToggleOn,
      onToggleOff: onToggleOff,
    });

    _.classes = {
      toggledOn: _.settings.toggledOnPrefix + _.settings.classBase,
      toggledOff: _.settings.toggledOffPrefix + _.settings.classBase,
    };
  }

  /**
   * Default options definition.
   *
   * Extend globally like this:
   * @code
   *   $.extend(LoftToggler.prototype.options, {
   *     classBase: 'enabled'
   *   });
   * @endcode
   */
  LoftToggler.prototype.options = {
    toggledOnPrefix: 'is-',
    toggledOffPrefix: 'is-not-',
    classBase: 'toggled',
    onToggleOn: false,
    onToggleOff: false
  };

  /**
   * Toggles to the opposite state
   *
   * @params... Optional.  Passed to the callbacks.
   *
   * @return mixed
   */
  LoftToggler.prototype.toggle = function () {
    var _ = this;
    _.stateBefore = _.getState();
    var args = [].slice.call(arguments);
    var method = _.getState() ? 'toggleOff' : 'toggleOn';
    return _[method].apply(_, args);
  };

  /**
   * Sets the state of the toggle NOT calling the callbacks.
   *
   * @param bool state
   *
   * @return this;
   */
  LoftToggler.prototype.setState = function (state) {
    var _ = this;
    if (state) {
      _.$el
      .addClass(_.classes.toggledOn)
      .removeClass(_.classes.toggledOff);
    }
    else {
      _.$el
      .removeClass(_.classes.toggledOn)
      .addClass(_.classes.toggledOff);
    }

    return _;
  };

  /**
   * Returns the current state of the toggle.
   *
   * @return bool
   */
  LoftToggler.prototype.getState = function () {
    var _ = this;
    return _.$el.hasClass(_.classes.toggledOn);
  };

  /**
   * Sets state to true AND returns onToggleOn
   *
   * @params... Optional.  Passed to the callbacks.
   *
   * @return mixed The (return) value of the onToggleOn.
   */
  LoftToggler.prototype.toggleOn = function () {
    var _ = this;
    _.stateBefore = _.getState();
    _.setState(true);
    if (typeof _.settings.onToggleOn !== 'function') {
      return _.settings.onToggleOn;
    }
    var args = [].slice.call(arguments);
    args.unshift(_);
    return _.settings.onToggleOn.apply(_, args);
  };

  /**
   * Sets state to false AND returns onToggleOff
   *
   * @params... Optional.  Passed to the callbacks.
   *
   * @return mixed The (return) value of the onToggleOff.
   */
  LoftToggler.prototype.toggleOff = function () {
    var _ = this;
    _.stateBefore = _.getState();
    _.setState(false);
    if (typeof _.settings.onToggleOff !== 'function') {
      return _.settings.onToggleOff;
    }
    var args = [].slice.call(arguments);
    args.unshift(_);
    return _.settings.onToggleOff.apply(_, args);
  };

  return LoftToggler;
})(jQuery);
