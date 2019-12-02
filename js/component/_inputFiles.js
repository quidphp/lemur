/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputFiles
// script with logic for the file upload component of the CMS
Component.inputFiles = function()
{
    // triggerHandler
    $(this).on('inputFiles:getBlock',function() {
        return $(this).find(".file-block");
    })
    
    // bind
    .one('component:setup',function() {
        bindBlock.call(this);
        triggerFunc(this,'inputFiles:getBlock').trigger('component:setup');
    });
    
    // bindBlock 
    const bindBlock = function() {
        const blocks = triggerFunc(this,'inputFiles:getBlock');
        
        // triggerHandler
        blocks.on('block:getAction',function() {
            return $(this).find(".action");
        })
        .on('block:getCancelAction',function() {
            return $(this).find(".message .close").first();
        })
        .on('block:getInputFile',function() {
            return $(this).find("input[type='file']").first();
        })
        .on('block:getInputHidden',function() {
            const inputFile = triggerFunc(this,'block:getInputFile');
            const name = inputFile.attr('name');
            return $(this).find("input[type='hidden']").filter("[name='"+name+"']").first();
        })
        .on('block:getActionText',function() {
            return $(this).find(".action-text").first();
        })
        
        // bind
        .one('component:setup',function() {
            bindBlockAction.call(this);
            bindBlockCancelAction.call(this);
        });
        
        // bindBlockAction
        const bindBlockAction = function() {
            const block = $(this);
            const mediaAction = block.triggerHandler('block:getAction');
            const input = block.triggerHandler('block:getInputFile');
            const hidden =  block.triggerHandler('block:getInputHidden');
            const actionText = block.triggerHandler('block:getActionText');
            Component.confirm.call(mediaAction,'click');
            
            mediaAction.on('confirmed',function() {
                const value = Json.decode(hidden.val());
                value.action = $(this).data('action');
                block.addClass('with-action');
                input.hide();
                hidden.prop('disabled',false);
                hidden.val(Json.encode(value));
                actionText.html($(this).data('text'));
            })
        };
        
        // bindBlockCancelAction
        const bindBlockCancelAction = function() {
            const block = $(this);
            const mediaCancelAction = block.triggerHandler('block:getCancelAction');
            const input = block.triggerHandler('block:getInputFile');
            const hidden =  block.triggerHandler('block:getInputHidden');
            const actionText = block.triggerHandler('block:getActionText');
            
            mediaCancelAction.on('click',function() {
                const name = input.attr('name');
                const value = Json.decode(hidden.val());
                value.action = null;
                block.removeClass('with-action');
                input.show();
                hidden.prop('disabled',true);
                hidden.val(Json.encode(value));
                actionText.html('');
            });
        };
    };
    
    return this;
}