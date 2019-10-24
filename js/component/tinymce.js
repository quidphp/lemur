"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tinymce
// script to create a tinymce wysiwyg component
(function ($, document, window) {
	
	// tinymce
	// génère un éditeur de texte à partir de tinycme
	$.fn.tinymce = function(data)
	{
		var r = null;

		if($(this).length === 1)
		{
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
		}
		
		return r;
	}
	
    // tinymceWithTableRelation
    // génère un éditeur de texte tinycme avec les binding pour les table relation
    $.fn.tinymceWithTableRelation = function()
	{
        $(this).each(function(index, el) {
            var target = $(this).find(".tinymce");
            var data = target.data('tinymce') || { };
            var textarea = target.parent().find("textarea");
            var hasTableRelation = $(this).is("[data-table-relation='1']");
            
            if(hasTableRelation === true)
            {
                var filters = $(this).find(".relations .filter");
                data.setup = function(editor) {
                    editor.on('click', function(e) {
                      filters.trigger('clickOpen:close');
                    });
                };
                
                textarea.on('textarea:insert', function(event,html) {
                    var r = false;
                    var editor = $(this).data('editor');
                    
                    if($.isStringNotEmpty(html) && editor)
                    editor.execCommand('mceInsertContent',false,html);
                    
                    return r;
                });
            }
            
            var editor = target.tinymce(data);
            textarea.data('editor',editor);
        });
        
        return this;
    }
    
}(jQuery, document, window));