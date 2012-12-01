describe('delegate.js', function() {

  var byId = function(id) {
    return document.getElementById(id);
  };

  var fixtures;
  var buttonSet;
  var inputSet;
  var btnOne;
  var btnTwo;
  var btnThree;
  var btnFour;
  var btnFive;
  var firstname;
  var email;

  var listener01;
  var listener02;
  var listener03;

  beforeEach(function() {
    listener01 = jasmine.createSpy('listener01');
    listener02 = jasmine.createSpy('listener02');
    listener03 = jasmine.createSpy('listener03');

    fixtures  = byId('fixtures');
    buttonSet = byId('button_set');
    inputSet  = byId('input_set');
    btnOne    = byId('btn_one');
    btnTwo    = byId('btn_two');
    btnThree  = byId('btn_three');
    btnFour   = byId('btn_four');
    btnFive   = byId('btn_five');
    firstname = byId('firstname');
    email     = byId('email');
  });

  afterEach(function() {
    // Clear events
    /*
    document.body.replaceChild(
        fixtures.cloneNode(true)
      , fixtures
    );
    */
  });


  describe('invoking and parameters', function() {
    it('should add an event to the target if no selector is passed', function() {
      delegate(btnFour, 'click', listener01);

      expect(listener01).not.toHaveBeenCalled();
      btnFour.click();
      expect(listener01).toHaveBeenCalled();
      btnFour.click();
      expect(listener01.calls.length).toBe(2);
      btnFour.click();
      btnFour.click();
      expect(listener01.calls.length).toBe(4);

      var test = false;
      delegate(btnOne, 'click', function(evt) {
        expect(evt.target).toBe(btnOne);
        expect(this).toBe(btnOne);
        test = true;
      });
      btnOne.click();
      expect(test).toBe(true);
    });

    it('should add an event to the target if the selector is `null` or `undefined`', function() {
      delegate(btnThree, 'click', null, listener02);

      expect(listener02).not.toHaveBeenCalled();
      btnThree.click();
      btnThree.click();
      expect(listener02).toHaveBeenCalled();
      expect(listener02.calls.length).toBe(2);
      btnThree.click();
      expect(listener02.calls.length).toBe(3);

      var test = false;
      delegate(btnFive, 'click', undefined, function(evt) {
        expect(evt.target).toBe(btnFive);
        expect(this).toBe(btnFive);
        test = true;
      });
      btnFive.click();
      expect(test).toBe(true);
    });

    it('should delegate an event using the selector', function() {
      delegate(buttonSet, 'click', '.btn', listener01);

      btnFour.click();
      btnFive.click();
      expect(listener01).not.toHaveBeenCalled();
      btnOne.click();
      btnTwo.click();
      btnThree.click();
      expect(listener01).toHaveBeenCalled();
      expect(listener01.calls.length).toBe(3);

      var test = false;
      delegate(buttonSet, 'click', '.btn', function(evt) {
        expect(evt.target).toBe(btnTwo);
        expect(this).toBe(btnTwo);
        test = true;
      });
      btnTwo.click();
      expect(test).toBe(true);
    });
  });


  describe('return value', function() {
    it('should return a function that removes the event listener(s)', function() {
      var remove01 = delegate(inputSet, 'click', listener01);
      var remove02 = delegate(inputSet, 'click', null, listener02);
      var remove03 = delegate(inputSet, 'click', '#btn_five', listener03);

      expect(typeof remove01).toBe('function');
      expect(typeof remove02).toBe('function');
      expect(typeof remove03).toBe('function');

      btnFive.click();
      btnFive.click();
      expect(listener01.calls.length).toBe(2);
      expect(listener02.calls.length).toBe(2);
      expect(listener03.calls.length).toBe(2);

      remove02();
      btnFive.click();
      expect(listener01.calls.length).toBe(3);
      expect(listener02.calls.length).toBe(2);
      expect(listener03.calls.length).toBe(3);

      remove03();
      btnFive.click();
      expect(listener01.calls.length).toBe(4);
      expect(listener02.calls.length).toBe(2);
      expect(listener03.calls.length).toBe(3);

      remove01();
      btnFive.click();
      btnFive.click();
      expect(listener01.calls.length).toBe(4);
      expect(listener02.calls.length).toBe(2);
      expect(listener03.calls.length).toBe(3);
    });
  });


  describe('specific event behaviour', function() {
    it('should bubble up focus events', function() {
      delegate(inputSet, 'focus', 'input[name=firstname]', listener01);
      expect(listener01).not.toHaveBeenCalled();
      firstname.focus();
      expect(listener01).toHaveBeenCalled();
      firstname.blur();
      firstname.focus();
      firstname.blur();
      firstname.focus();
      expect(listener01.calls.length).toBe(3);

      var test = false;
      delegate(inputSet, 'focus', 'input[name=email]', function(evt) {
        expect(evt.target).toBe(email);
        expect(this).toBe(email);
        test = true;
      });
      email.focus();
      expect(test).toBe(true);
    });

    it('should bubble up focus events', function() {
      delegate(inputSet, 'blur', 'input[name=firstname]', listener01);
      expect(listener01).not.toHaveBeenCalled();
      firstname.focus();
      firstname.blur();
      expect(listener01).toHaveBeenCalled();
      firstname.focus();
      firstname.blur();
      firstname.focus();
      firstname.blur();
      expect(listener01.calls.length).toBe(3);

      var test = false;
      delegate(inputSet, 'blur', 'input[name=email]', function(evt) {
        expect(evt.target).toBe(email);
        expect(this).toBe(email);
        test = true;
      });
      email.focus();
      email.blur();
      expect(test).toBe(true);
    });
  });


  describe('delegate.noConflict()', function() {
    it('should restore the original `delegate` and return a reference to this one', function() {
      var original = delegate;

      expect(typeof delegate.noConflict).toBe('function');
      var del2 = delegate.noConflict();
      expect(window.delegate).toBe(undefined); // No prior def here
      expect(del2).toBe(original);
      expect(delegate).toBe(undefined);

      // Reset
      delegate = del2.noConflict();
      expect(delegate).toBe(original);
    });
  });

});
