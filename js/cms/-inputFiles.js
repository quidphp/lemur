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
    // triggerHandler
    $(this).on('inputFiles:getBlock', function(event) {
        return $(this).find(".file-block");
    })
    
    // bind
    .one('component:setup', function(event) {
        $(this).triggerHandler('inputFiles:getBlock').trigger('component:setup');
    });
    
    // bindBlock 
    var bindBlock = function() {
        var blocks = $(this).triggerHandler('inputFiles:getBlock');
        
        // triggerHandler
        blocks.on('block:getAction', function(event) {
            return $(this).find(".action");
        })
        .on('block:getCancelAction', function(event) {
            return $(this).find(".message .close").first();
        })
        .on('block:getInputFile', function(event) {
            return $(this).find("input[type='file']").first();
        })
        .on('block:getInputHidden', function(event) {
            var inputFile = $(this).triggerHandler('block:getInputFile');
            var name = inputFile.attr('name');
            return $(this).find("input[type='hidden']").filter("[name='"+name+"']").first();
        })
        .on('block:getActionText', function(event) {
            return $(this).find(".action-text").first();
        })
        
        // bind
        .one('component:setup', function(event) {
            bindBlockAction.call(this);
            bindBlockCancelAction.call(this);
        });
        
        // bindBlockAction
        var bindBlockAction = function() {
            var block = $(this);
            var mediaAction = block.triggerHandler('block:getAction');
            var input = block.triggerHandler('block:getInputFile');
            var hidden =  block.triggerHandler('block:getInputHidden');
            var actionText = block.triggerHandler('block:getActionText');
            quid.main.window.confirm.call(mediaAction,'click');
            
            mediaAction.on('confirmed', function(event) {
                var value = JSON.parse(hidden.val());
                value.action = $(this).data('action');
                block.addClass('with-action');
                input.hide();
                hidden.prop('disabled',false);
                hidden.val(JSON.stringify(value));
                actionText.html($(this).data('text'));
            })
        };
        
        // bindBlockCancelAction
        var bindBlockCancelAction = function() {
            var block = $(this);
            var mediaCancelAction = block.triggerHandler('block:getCancelAction');
            var input = block.triggerHandler('block:getInputFile');
            var hidden =  block.triggerHandler('block:getInputHidden');
            var actionText = block.triggerHandler('block:getActionText');
            
            mediaCancelAction.on('click', function(event) {
                var name = input.attr('name');
                var value = JSON.parse(hidden.val());
                value.action = null;
                block.removeClass('with-action');
                input.show();
                hidden.prop('disabled',true);
                hidden.val(JSON.stringify(value));
                actionText.html('');
            });
        };
    };
    
    // initialize
    if($(this).length)
    bindBlock.call(this);
    
    return this;
}