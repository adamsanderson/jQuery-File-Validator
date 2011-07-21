/**

Uploading files, only to find that they are too large, or the wrong type is frustrating.
The `fileValidator` plugin lets you warn users before they start uploading 
enormous files.

Usage
-----

Simply select the file inputs you wish to validate, and pass in a callbacks to handle invalid files.

    $( el ).fileValidator({
      onValidation: function(files){ ... },
      onInvalid:    function(validationType, file){ ... },
      maxSize:      '2m', //optional
      type:         'image' //optional
    });

    

*/
(function($){
  
  $.fileValidator = function(options){
    var validations = [];
    var onInvalid = options.onInvalid;
    
    for (var key in $.fileValidator.validations){
      if (!options[key]){ continue; }
      validations.push( $.fileValidator.validations[key](options[key], onInvalid));
    }
    
    
    return function(file){
      for(var i=0, len = validations.length; i < len; i++){
        validations[i].call(this, file);
      }
    };
  };
  
  $.fileValidator.validations = {
    maxSize: function(maxSize, invalid){
      if( typeof maxSize == 'string' ){ 
        maxSize = $.fileValidator.sizeToBytes(maxSize);
      }
        
      return function(file){
        if (file.size > maxSize){ invalid.call(this,'maxSize',file); }
      };
    },
    
    type: function(contentType, invalid){
      var isValid;
      if( typeof contentType == 'function' ){ 
        isValid = contentType; 
      } else if (contentType.constructor === RegExp ) { 
        isValid = function(type){ return type.match(contentType); }; 
      } else { 
        isValid = function(type){ return ~type.indexOf(contentType); }; 
      }
      
      return function(file){
        if (!isValid(file.type)) invalid.call(this,'type', file);
      };
    }
  };
  
  $.fn.fileValidator = function(userOptions) {
		var options = $.extend({
		  // Validations
		  maxSize: null,
		  type: null,
		  
		  // Callbacks
		  onValidation: $.fileValidator.doNothing,
		  onInvalid: $.fileValidator.doNothing
		}, userOptions);
		
		return this.each(function() {
			var el = $(this);
			var validator = $.fileValidator( $.extend({}, options, el.data()) );
						
		  el.bind('change', function(event){
		    var files = this.files || [];
		    options.onValidation.call(this, files);
		    for(var i=0, len=files.length; i < len; i++){
		      validator.call(this, files[i]);
		    }
		  });
		});		
	};
  
  $.fileValidator.doNothing   = function doNothing(){};
  $.fileValidator.sizeToBytes = function sizeToBytes(size){
    var scale = 1;
    
    if (~ size.indexOf('k')){ 
      scale = 1024; 
    } else if (~ size.indexOf('m')){ 
      scale = 1024 * 1024; 
    } else if (~ size.indexOf('g')){ 
      scale = 1024 * 1024 * 1024; 
    }
    return parseInt(size,10) * scale;
  };
})( jQuery );
