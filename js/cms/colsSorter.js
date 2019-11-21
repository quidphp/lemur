"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// colsSorter
// script for the col sorter component of the general page of the CMS
quid.cms.colsSorter = function()
{
    $(this).each(function(index, el) {
        var colsPopup = $(this).find(".popup");
        var colsButton = colsPopup.find("button[name='cols']");

        // clickOpen
        quid.core.clickOpenWithTrigger.call(this,".trigger");
        
        // colsPopup
        colsPopup.verticalSorting(".choice",'.choice-in')
        .on('verticalSorting:stop', function(event) {
            $(this).trigger('cols:validate');
        })
        .on('cols:getCheckboxes', function(event) {
            return $(this).find("input[type='checkbox']");
        })
        .on('cols:validate', function(event) {
            $(this).triggerHandler('cols:getCheckboxes').trigger('change');
        })
        .on('cols:isValid', function(event) {
            return $(this).triggerHandler('cols:getCheckboxes').triggerHandlerEqual(true,'validate:isValid');
        })
        .on('cols:invalid', function() {
            $(this).attr('data-validate','invalid');
        })
        .on('cols:valid', function() {
            $(this).removeAttr("data-validate");
            
            if(!colsButton.triggerHandler('colsButton:isCurrent'))
            $(this).attr('data-validate','valid');
        });
        
        // colsCheckboxes
        colsPopup.triggerHandler('cols:getCheckboxes').fieldValidate()
        .on('validate:invalid', function() {
            colsPopup.trigger('cols:invalid');
        })
        .on('validate:valid', function() {
            colsPopup.trigger('cols:valid');
        });
        
        // colsButton
        colsButton.block('click').on('click', function(event) {
            $(this).trigger('colsButton:redirect',[event]);
        })
        .on('colsButton:getCheckboxSet',function() {
            var checkboxes = colsPopup.triggerHandler('cols:getCheckboxes');
            if(colsPopup.triggerHandler('cols:isValid'))
            return checkboxes.filter(":checked").valSet(colsButton.data("separator"),true);
        })
        .on('colsButton:isCurrent',function() {
            return (colsButton.triggerHandler('colsButton:getCheckboxSet') === colsButton.data('current'))? true:false;
        })
        .on('colsButton:redirect', function(event,clickEvent) {
            var href = $(this).dataHrefReplaceChar($(this).triggerHandler('colsButton:getCheckboxSet'));
            
            if(quid.base.str.isNotEmpty(href) && href !== quid.base.request.relative())
            {
                $(this).trigger('block');
                $(document).trigger('document:go',[href,clickEvent]);
            }
        });
    });
    
    return this;
}