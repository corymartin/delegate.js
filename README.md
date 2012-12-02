Delegate.js
===========

Utility to delegate DOM events (>= IE8)


Download
--------
[Development](https://raw.github.com/corymartin/delegate/master/build/delegate.js)

[Production](https://raw.github.com/corymartin/delegate/master/build/delegate.min.js)
~700 bytes Minified and Gzipped.


API
---

### delegate( target, eventType, [selector,] listener )

__Parameters__

- __*target*__ `element|document|window` Parent to delegate events.
- __*eventType*__ `string` Event type, e.g. `'click'`, `'blur'`, etc.
- __*selector*__ `string` *Optional.* Selector to filter elements that trigger event.
  If not passed or is `null` or `undefined`, the event is triggered on the target.
- __*listener*__ `function` Function to invoke when event is triggered.

__Returns__
`function` Function to remove the event.

```js
var tgt = document.getElementById('#somediv');
delegate(tgt, 'focus', 'input[type=text]', function(evt) {
  // `this` and `evt.target` are the focused text input
});
```

```js
var btn = document.getElementById('#somebtn');
var remove = delegate(btn, 'click', function(evt) {
  // `this` and `evt.target` are `#somebtn`
});

// Remove listener
remove();
```

If only a listener is passed, it will be invoked on DOM ready.

```js
delegate(function() {
  // DOM is loaded
});
```


<a name="noConflict"></a>
### delegate.noConflict()

```js
var mydelegate = delegate.noConflict();

// Former `delegate` has now been restored.
```


