/*!
 * @preserve
 * Delegate.js
 * v0.1.0
 * Utility to delegate DOM events (>= IE8)
 * https://github.com/corymartin/delegate
 * Copyright (c) 2012 Cory Martin
 * Distributed under the MIT License
 */
!function(window, undefined) {
  'use strict';

  var document = window.document;

  var previousDelegate = window.delegate;

  var isLegacyEvtModel = !document.addEventListener;

  var addEvtMethod    = isLegacyEvtModel ? 'attachEvent' : 'addEventListener';
  var removeEvtMethod = isLegacyEvtModel ? 'detachEvent' : 'removeEventListener';

  var domLoadEvt = isLegacyEvtModel
    ? (isLegacyEvtModel ? 'on' : '') + 'readystatechange'
    : 'DOMContentLoaded';

  // Test support for focusin/focusout events.
  // Firefox has not implemented them yet.
  //   https://bugzilla.mozilla.org/show_bug.cgi?id=687787
  var isFocusinSupported = false;
  document[addEvtMethod](
      domLoadEvt
    , function testFocusin() {
        var a = document.createElement('a');
        a.href = '#';
        document.body.appendChild(a);
        a[addEvtMethod](
            isLegacyEvtModel ? 'onfocusin' : 'focusin'
          , function(){ isFocusinSupported = true; }
          , false
        );
        a.focus();
        document.body.removeChild(a);
        document[removeEvtMethod](domLoadEvt, testFocusin, false);
      }
    , false
  );

  var trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
  };

  var processEvtType = function(evtType) {
    evtType = trim(evtType);
    if (isFocusinSupported) {
      if      (evtType === 'focus') evtType = 'focusin';
      else if (evtType === 'blur')  evtType = 'focusout';
    }
    if (isLegacyEvtModel) evtType = 'on' + evtType;
    return evtType;
  };

  var listenerBody = function(evt, target, selector, listener) {
    if (!selector) {
      listener.call(target, evt);
      return;
    }
    var t = evt.target;
    var els = target.querySelectorAll(selector);
    for (var len = els.length; len--;) {
      if (t === els[len]) {
        listener.call(t, evt);
        break;
      }
    }
  };


  /**
   * @param {HTMLElement|document|window} target
   * @param {String} evtType
   * @param {String} selector Optional.
   * @param {Function} listener
   * @returns {Function} Function to remove the listener.
   * @api public
   */
  function delegate(target, evtType, selector, listener) {
    if (arguments.length === 3) {
      listener = selector;
      selector = undefined;
    }

    evtType = processEvtType(evtType);

    var listenerProxy = function(evt) {
      if (isLegacyEvtModel) {
        evt = window.event;
        evt.target = evt.srcElement;
      }
      listenerBody(evt, target, selector, listener);
    };

    target[addEvtMethod](evtType, listenerProxy, true);

    return function() {
      target[removeEvtMethod](evtType, listenerProxy, true);
    };
  };


  delegate.VERSION = '0.1.0';


  /*
   * Export
   */
  window.delegate = delegate;


  /**
   * @returns {Function}
   * @api public
   */
  delegate.noConflict = function() {
    window.delegate = previousDelegate;
    return delegate;
  };

}(this);