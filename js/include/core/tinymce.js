"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tinymce
// script to create a tinymce wysiwyg component

// tinymce
// génère un éditeur de texte à partir de tinycme
quid.core.tinycme = function(data)
{
    var r = null;
    
    $(this).each(function(index, el) {
        $(this).addIds('tinycme');
        var textarea = $(this);
        var id = $(this).prop('id');
        data.selector = "#"+id;
        data.init_instance_callback = function (editor) {
            editor.on('Blur', function (e) {
                editor.save();
            });
        };
        tinymce.init(data);
        r = tinymce.get(id);
    });
    
    return r;
}