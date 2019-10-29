"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// rowsChecker
// script containing for the rows checker component

// rowsChecker
// gère les comportements pour les checkboxes à gauche des lignes d'une table
quid.core.rowsChecker = $.fn.rowsChecker = function(parent)
{
    var rowsCheckboxes = $(this);
    var rowsToggleAll = parent.find("table th.rows .toggleAll");
    var rowsTool = parent.find(".tool");
    var rowsInNotIn = parent.find(".tool .in, .tool .notIn");
    var multiDelete = parent.find(".tool .multi-delete form");
    var multiDeletePrimaries = multiDelete.find("input[name='primaries']");
    
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
    if(multiDelete.length)
    {
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
    }
    
    return this;
}