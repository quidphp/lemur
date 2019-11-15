"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputFiles
// script with logic for the file upload component of the CMS
quid.cms.inputFiles = function()
{
    $(this).each(function(index, el) {
        $(this).find(".file-block").each(function(index, el) 
        {
            var parent = $(this);
            var mediaAction = $(this).find(".action");
            var mediaCancelAction = $(this).find(".message .close");
            
            // mediaAction
            if(mediaAction.length)
            {
                mediaAction.confirm('click').on('confirmed', function(event) {
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
        });
    });
    
    return this;
}