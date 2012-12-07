/*!
 * @preserve
 * Delegate.js
 * v0.2.4
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

  var domLoadEvt = isLegacy ? 'onreadystatechange' : 'DOMContentLoaded';


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
    var anchorEl = document.createElement('a');
    anchorEl.href = '#';
    document.body.appendChild(anchorEl);
    anchorEl[addEvtMethod](
      isLegacy ? 'onfocusin' : 'focusin'
    , function(){ isFocusinSupported = true; }
    , false
    );
    anchorEl.focus();
    document.body.removeChild(anchorEl);
  });


  var matches = (function() {
    if (!window.Element) return;
    var fns = [
      'oMatchesSelector'
    , 'msMatchesSelector'
    , 'mozMatchesSelector'
    , 'webkitMatchesSelector'
    , 'matchesSelector'
    , 'matches'
    ];
    for (var i = fns.length; i--;) {
      if (fns[i] in Element.prototype) return fns[i];
    }
  })();


  var processEvtType = function(evtType) {
    evtType = evtType.replace(/^\s+|\s+$/g, '');
    if (isFocusinSupported) {
      if      (evtType === 'focus') evtType = 'focusin';
      else if (evtType === 'blur')  evtType = 'focusout';
    }
    if (isLegacy) evtType = 'on' + evtType;
    return evtType;
  };


  var doCancelReadyState = function(evt) {
    return document.readyState !== 'complete'
      && (/(on)?readystatechange/).test(evt.type);
  };


  var createEvent = function(origEvt) {
    if (isLegacy) origEvt = window.event;
    var evt = {};
    for (var key in origEvt) {
      evt[key] = origEvt[key];
    }
    evt.target = evt.srcElement = evt.target || origEvt.srcElement;
    return evt;
  };


  var listenerBody = function(evt, target, selector, listener) {
    if (!selector) {
      listener.call(target, evt);
      return;
    }
    if (matches && evt.target[matches]) {
      if (evt.target[matches](selector)) {
        listener.call(evt.target, evt);
      }
      return;
    }
    if (target.querySelectorAll) {
      var els = target.querySelectorAll(selector);
      for (var len = els.length; len--;) {
        if (evt.target === els[len]) {
          listener.call(evt.target, evt);
          break;
        }
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
      evtType = domLoadEvt;
      target  = document;
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
      evt = createEvent(evt);
      if (doCancelReadyState(evt)) return;
      listenerBody(evt, target, selector, listener);
      // Remove DOM ready listener
      if (evtType === domLoadEvt) remove();
    };

    var remove = function() {
      target[removeEvtMethod](evtType, listenerProxy, !!selector);
    };

    target[addEvtMethod](evtType, listenerProxy, !!selector);

    return remove;
  };


  delegate.VERSION = '0.2.4';


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
