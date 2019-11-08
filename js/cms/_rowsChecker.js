"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// rowsChecker
// script for the rows checker component in the general page of the CMS
quid.cms.rowsChecker = function()
{
    $(this).each(function(index, el) {
        var rowsTool = $(this).find(".above .tool");
        var rowsInNotIn = rowsTool.find(".plus, .minus");
        var multiDelete = rowsTool.find(".multi-delete form");
        var multiDeletePrimaries = multiDelete.find("input[name='primaries']");
        var table = $(this).find("table").first();
        var rowsCheckboxes = table.find("td.rows input[type='checkbox']");
        var rowsToggleAll = table.find("th.rows .toggle-all");
        
        // rowsToggleAll
        rowsToggleAll.on('click', function() {
            $(this).trigger('toggleAll');
        })
        .on('toggleAll', function() {
            var allChecked = rowsCheckboxes.triggerHandlerFalse('isChecked');
            $(this).trigger((allChecked === true)? 'uncheck':'check');
        })
        .on('check', function() {
            rowsCheckboxes.trigger('check');
        })
        .on('uncheck', function() {
            rowsCheckboxes.trigger('uncheck');
        })
        .on('allChecked', function() {
            $(this).addClass('all-checked');
        })
        .on('notAllChecked', function() {
            $(this).removeClass('all-checked');
        });
        
        // rowsTool
        rowsTool.on('show', function() {
            $(this).css('visibility','visible');
        })
        .on('hide', function() {
            $(this).css('visibility','hidden');
        });
        
        // rowsIn + notIn
        rowsInNotIn.block('click').on('getCheckboxSet',function() {
            var separator = $(this).data("separator");
            return rowsCheckboxes.filter(":checked").valSet(separator,true);
        })
        .on('click', function() {
            $(this).trigger('redirect');
        })
        .on('redirect', function() {
            var href = $(this).dataHrefReplaceChar($(this).triggerHandler('getCheckboxSet'));
            
            if(quid.base.isStringNotEmpty(href))
            {
                $(this).trigger('block');
                $(document).trigger('document:go',[href]);
            }
        });
        
        // rowsCheckboxes
        rowsCheckboxes.on('isChecked',function() {
            return $(this).is(":checked");
        })
        .on('change', function() {
            $(this).trigger(($(this).triggerHandler('isChecked') === true)? 'check':'uncheck');
        })
        .on('check', function() {
            $(this).parents("tr").addClass('selected');
            $(this).prop('checked',true).trigger('update');
        })
        .on('uncheck', function() {
            $(this).parents("tr").removeClass('selected');
            $(this).prop('checked',false).trigger('update');
        })
        .on('update', function() {
            var oneChecked = rowsCheckboxes.triggerHandlerTrue('isChecked');
            var allChecked = rowsCheckboxes.triggerHandlerFalse('isChecked');
            rowsTool.trigger((oneChecked === true)? 'show':'hide');
            rowsToggleAll.trigger((allChecked === true)? 'allChecked':'notAllChecked');
        });
        
        // multiDelete
        multiDelete.block('submit').confirm('submit').on('confirmed', function(event,submit) {
            var separator = $(this).data('separator');
            var set = rowsCheckboxes.filter(":checked").valSet(separator,true);
            if(quid.base.isStringNotEmpty(set))
            {
                multiDeletePrimaries.val(set);
                $(this).trigger('block');
            }
            
            else
            submit.preventDefault();
        });
    });
    
    return this;
}