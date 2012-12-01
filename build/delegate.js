/*!
 * @preserve
 * Delegate.js
 * v0.2.0
 * Utility to delegate DOM events (>= IE8)
 * https://github.com/corymartin/delegate
 * Copyright (c) 2012 Cory Martin
 * Distributed under the MIT License
 */
!function(window, undefined) {
  'use strict';

  var document = window.document;

  var previousDelegate = window.delegate;

  var isLegacy = !document.addEventListener;

  var addEvtMethod    = isLegacy ? 'attachEvent' : 'addEventListener';
  var removeEvtMethod = isLegacy ? 'detachEvent' : 'removeEventListener';

  var domLoadEvt = isLegacy
    ? (isLegacy ? 'on' : '') + 'readystatechange'
    : 'DOMContentLoaded';

  var trimRegex             = /^\s+|\s+$/g;
  var readyStateChangeRegex = /(on)?readystatechange/;

  // Firefox has not yet implemented focusin/focusout
  //   https://bugzilla.mozilla.org/show_bug.cgi?id=687787
  var isFocusinSupported = false;
  var isDOMReady         = false;
  var domLoadEvent       = {};

  /*
   * Focusin detect, isDOMReady
   */
  delegate(function(evt) {
    isDOMReady   = true;
    domLoadEvent = evt;
    var a = document.createElement('a');
    a.href = '#';
    document.body.appendChild(a);
    a[addEvtMethod](
        isLegacy ? 'onfocusin' : 'focusin'
      , function(){ isFocusinSupported = true; }
      , false
    );
    a.focus();
    document.body.removeChild(a);
  });


  var processEvtType = function(evtType) {
    evtType = evtType.replace(trimRegex, '');
    if (isFocusinSupported) {
      if      (evtType === 'focus') evtType = 'focusin';
      else if (evtType === 'blur')  evtType = 'focusout';
    }
    if (isLegacy) evtType = 'on' + evtType;
    return evtType;
  };


  var doCancelReadyState = function(evt) {
    return document.readyState !== 'complete'
      && readyStateChangeRegex.test(evt.type);
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
    if (arguments.length === 1) {
      // DOM ready
      listener = target;
      if (isDOMReady) {
        listener.call(document, domLoadEvent);
        return function(){}; // noop since no event is actually added
      }
      evtType  = domLoadEvt;
      target   = document;
    }
    else {
      // No selector passed
      if (arguments.length === 3) {
        listener = selector;
        selector = undefined;
      }
      evtType = processEvtType(evtType);
    }

    var listenerProxy = function(evt) {
      if (isLegacy) {
        evt = window.event;
        evt.target = evt.srcElement;
      }
      if (doCancelReadyState(evt)) return;

      listenerBody(evt, target, selector, listener);

      if (evtType === domLoadEvt) {
        // Remove DOM ready listener
        remove();
      }
    };

    var remove = function() {
      target[removeEvtMethod](evtType, listenerProxy, true);
    };

    target[addEvtMethod](evtType, listenerProxy, true);

    return remove;
  };


  delegate.VERSION = '0.2.0';


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
