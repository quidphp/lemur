"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// colsSorter
// script for the col sorter component of the general page of the CMS
quid.component.colsSorter = function()
{
    // clickOpen
    quid.core.clickOpenWithTrigger.call(this,".trigger");
    
    // triggerHandler
    $(this).on('colsSorter:getPopup', function(event) {
        return $(this).find(".popup");
    })
    .on('colsSorter:getCheckboxes', function(event) {
        return $(this).find("input[type='checkbox']");
    })
    .on('colsSorter:getCheckedCheckboxes', function(event) {
        return $(this).triggerHandler('colsSorter:getCheckboxes').filter(':checked');
    })
    .on('colsSorter:getButton', function(event) {
        return $(this).triggerHandler('colsSorter:getPopup').find("button[name='cols']")
    })
    .on('colsSorter:isValid', function(event) {
        return $(this).triggerHandler('colsSorter:getCheckboxes').triggerHandlerEqual(true,'validate:isValid');
    })
    .on('colsSorter:getCheckedSet', function(event) {
        var button = $(this).triggerHandler('colsSorter:getButton');
        return $(this).triggerHandler('colsSorter:getCheckedCheckboxes').valSet(button.data('separator'),true);
    })
    .on('colsSorter:isCurrent',function() {
        var button = $(this).triggerHandler('colsSorter:getButton');
        return ($(this).triggerHandler('colsSorter:getCheckedSet') === button.data('current'))? true:false;
    })
    
    // setup
    .one('component:setup', function(event) {
        bindColsPopup.call(this);
        bindColsCheckboxes.call(this);
        bindColsButton.call(this);
    });
    
    // bindColsPopup
    var bindColsPopup = function() {
        var $this = $(this);
        var popup = $(this).triggerHandler('colsSorter:getPopup');
        
        quid.core.verticalSorter.call(popup,".choice",'.choice-in');
        
        popup.on('verticalSorter:stop', function(event) {
            $(this).trigger('popup:validate');
        })
        .on('popup:validate', function(event) {
            $this.triggerHandler('colsSorter:getCheckboxes').trigger('validate:trigger');
        })
        .on('popup:invalid', function() {
            $(this).attr('data-validate','invalid');
        })
        .on('popup:valid', function() {
            $(this).removeAttr("data-validate");
            
            if(!$this.triggerHandler('colsSorter:isCurrent'))
            $(this).attr('data-validate','valid');
        });
    };
    
    // bindColsCheckboxes
    var bindColsCheckboxes = function() {
        var checkboxes = $(this).triggerHandler('colsSorter:getCheckboxes');
        var popup = $(this).triggerHandler('colsSorter:getPopup');
        
        quid.main.validate.field.call(checkboxes);
        
        checkboxes.on('validate:invalid', function() {
            popup.trigger('popup:invalid');
        })
        .on('validate:valid', function() {
            popup.trigger('popup:valid');
        });
    };
    
    // bindColsButton
    var bindColsButton = function() {
        var $this = $(this);
        var button = $(this).triggerHandler('colsSorter:getButton');
        
        quid.main.event.block.call(button,'click');
        
        button.on('click', function(event) {
            $(this).trigger('button:redirect',[event]);
        })
        .on('button:redirect', function(event,clickEvent) {
            var set = $this.triggerHandler('colsSorter:getCheckedSet');
            var href = $(this).dataHrefReplaceChar(set);
            
            if(quid.base.str.isNotEmpty(href) && href !== quid.base.request.relative())
            {
                $(this).trigger('block');
                $(document).trigger('document:go',[href,clickEvent]);
            }
        });
    };
        
    return this;
}