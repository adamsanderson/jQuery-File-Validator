jQuery File Validation
======================

Uploading files, only to find that they are too large, or the wrong type is frustrating.
The `fileValidator` plugin lets you warn users before they start uploading 
enormous files.

Usage
-----
Simply select the file inputs you wish to validate, and pass in a callbacks to handle invalid files.

    $( el ).fileValidator({
      onValidation: function(files){ /* Called once before validating files */ },
      onInvalid:    function(validationType, file){ /* Called once for each invalid file */ },
      maxSize:      '2m', //optional
      type:         'image' //optional
    });
    
See http://adamsanderson.github.com/jQuery-File-Validator for more information.