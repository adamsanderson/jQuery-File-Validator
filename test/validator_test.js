- function(){ 
  module('File Validator');
  
  test("Empty Rules", function() {
    equals('function', typeof $.fileValidator({}), 'Parsing an empty rule set should still generate a validation function');
  });

  test("Size Rules", function() {
    var invalid = [];
    var callback = function(type, file){ 
      invalid.push(file); 
      ok(type, 'maxSize');
    };
    
    var validator = $.fileValidator({maxSize: 128, onInvalid: callback});
    var small  = {size: 24}
      , medium = {size: 128}
      , large  = {size: 256};
    
    validator(small);
    validator(medium); 
    validator(large);
    
    deepEqual(invalid, [large]);
  });

  test("Type Rules (String)", function() {
    var invalid = [];
    var callback = function(type, file){ 
      invalid.push(file); 
      ok(type, 'type');
    };
    
    var validator = $.fileValidator({type: "image", onInvalid: callback});
    var png   = {type: 'image/png'}
      , jpg   = {type: 'image/jpg'}
      , text  = {type: 'text/plain'};
    
    validator(png);
    validator(jpg); 
    validator(text);
    
    deepEqual(invalid, [text]);
  });
  
  test("Type Rules (Regexp)", function() {
    var invalid = [];
    var callback = function(type, file){ 
      invalid.push(file); 
      ok(type, 'type');
    };
    
    var validator = $.fileValidator({type: /(image|text)\/.+/, onInvalid: callback});
    var png   = {type: 'image/png'}
      , binary= {type: 'application/octet-stream'}
      , text  = {type: 'text/plain'};
    
    validator(png);
    validator(binary); 
    validator(text);
    
    deepEqual(invalid, [binary]);
  });
  
  test("Type Rules (Function)", function() {
    var invalid = [];
    var callback = function(type, file){ 
      invalid.push(file); 
      ok(type, 'type');
    };
    
    var validator = $.fileValidator({type: function(type){ return type.length < 12; }, onInvalid: callback});
    var png   = {type: 'image/png'}
      , binary= {type: 'application/octet-stream'}
      , text  = {type: 'text/plain'};
    
    validator(png);
    validator(binary); 
    validator(text);
    
    deepEqual(invalid, [binary]);
  });
  
  test("Combined Rules", function() {
    var invalid = [];
    var callback = function(type, file){ 
      invalid.push(file); 
    };
    
    var validator = $.fileValidator({
      type: 'image', 
      maxSize: '128k',
      onInvalid: callback
    });
    
    var smallPng   = {size: 10 * 1024, type: 'image/png'}
      , largePng   = {size: 1024 * 1024, type: 'image/png'}
      , smallText  = {size: 8, type: 'text/plain'};
    
    validator(smallPng);
    validator(largePng); 
    validator(smallText);
    
    deepEqual(invalid, [largePng, smallText]);
  });
  
  module('Dom');
  test('Event Ordering', function(){
    // fake input with two fake files
    var fakeInput = {files: [{size: 10}, {size: 10}]}; 
    var events = [];

    jQuery(fakeInput).fileValidator({
      maxSize: 1,
      onValidation: function(){ events.push('V'); },
      onInvalid: function(){ events.push('I'); }
    });
    
    jQuery(fakeInput).trigger('change');
    deepEqual(events, ['V', 'I', 'I']);
  });
  
  module('Size to Bytes Helper');
  var sizeToBytes = $.fileValidator.sizeToBytes;

  test("Parsing bytes", function() {
    var expected = 7;
    equals(sizeToBytes('7'), expected);
  });

  test("Parsing kilobytes", function() {
    var expected = 7 * 1024;
    equals(sizeToBytes('7k'), expected);
    equals(sizeToBytes('7kb'), expected);
  });

  test("Parsing megabytes", function() {
    var expected = 7 * 1024 * 1024;
    equals(sizeToBytes('7m'), expected);
    equals(sizeToBytes('7mb'), expected);
  });

  test("Parsing gigabytes", function() {
    var expected = 7 * 1024 * 1024 * 1024;
    equals(sizeToBytes('7g'), expected);
    equals(sizeToBytes('7gb'), expected);
  });
}();