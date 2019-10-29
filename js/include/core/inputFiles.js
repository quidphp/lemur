"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// files
// script with some logic for a file upload component

// files
// comportement pour le champ de chargement de fichiers
quid.core.inputFiles = $.fn.inputFiles = function()
{
    var mediaAction = $(this).find(".action");
    var mediaCancelAction = $(this).find(".message .close");
    
    // mediaAction
    if(mediaAction.length)
    {
        mediaAction.confirm('click').on('confirmed', function(event) {
            var parent = $(this).parents(".block");
            var input = parent.find("input[type='file']");
            var name = input.attr('name');
            var hidden = parent.find("input[type='hidden'][name='"+name+"']");
            var actionText = parent.find(".actionText");
            var value = JSON.parse(hidden.val());
            value.action = $(this).data('action');
            parent.addClass('with-action');
            input.hide();
            hidden.prop('disabled',false);
            hidden.val(JSON.stringify(value));
            actionText.html($(this).data('text'));
        })
    }
    
    // mediaCancelAction
    if(mediaCancelAction.length)
    {
        mediaCancelAction.on('click', function(event) {
            var parent = $(this).parents(".block");
            var input = parent.find("input[type='file']");
            var name = input.attr('name');
            var hidden = parent.find("input[type='hidden'][name='"+name+"']");
            var actionText = parent.find(".actionText");
            var value = JSON.parse(hidden.val());
            value.action = null;
            parent.removeClass('with-action');
            input.show();
            hidden.prop('disabled',true);
            hidden.val(JSON.stringify(value));
            actionText.html('');
        });
    }
    
    return this;
}