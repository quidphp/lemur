"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// colsSorter
// script containing for the col sorter component

// colsSorter
// gère les comportements pour le popup pour ordonner les colonnes
quid.core.colsSorter = $.fn.colsSorter = function()
{
    var colsPopup = $(this).find(".popup");
    var colsButton = colsPopup.find("button[name='cols']");
    
    // clickOpen
    $(this).clickOpenWithTrigger(".toggler");
    
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
        return $(this).triggerHandler('cols:getCheckboxes').triggerHandlerFalse('validate:isValid');
    })
    .on('cols:invalid', function() {
        $(this).removeClass("valid invalid").addClass('invalid');
    })
    .on('cols:valid', function() {
        $(this).removeClass("valid invalid");
        
        if(!colsButton.triggerHandler('isCurrent'))
        $(this).addClass('valid');
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
    colsButton.block('click').on('getCheckboxSet',function() {
        var checkboxes = colsPopup.triggerHandler('cols:getCheckboxes');
        if(colsPopup.triggerHandler('cols:isValid'))
        return checkboxes.filter(":checked").valSet(colsButton.data("separator"),true);
    })
    .on('isCurrent',function() {
        return (colsButton.triggerHandler('getCheckboxSet') === colsButton.data('current'))? true:false;
    })
    .on('click', function() {
        $(this).trigger('redirect');
    })
    .on('redirect', function() {
        var href = $(this).dataHrefReplaceChar($(this).triggerHandler('getCheckboxSet'));
        
        if(quid.base.isStringNotEmpty(href) && href !== quid.base.currentRelativeUri())
        {
            $(this).trigger('block');
            $(document).trigger('document:go',[href]);
        }
    });
    
    return this;
}