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
        var tool = $(this).find(".above .tools-container");
        var multiModify = tool.find(".multi-modify");
        var button = tool.find("button.tool-element");
        var multiDelete = tool.find("form.tool-element");
        var multiDeletePrimaries = multiDelete.find("input[name='primaries']");
        var table = $(this).find("table").first();
        var checkboxes = table.find("td.rows input[type='checkbox']");
        var toggleAll = table.find("th.rows .toggle-all");
        
        // toggleAll
        toggleAll.on('click', function() {
            $(this).trigger('toggleAll:toggle');
        })
        .on('toggleAll:areAllChecked', function(event) {
            var checked = checkboxes.filter(':checked');
            return (checked.length === checkboxes.length)? true:false;
        })
        .on('toggleAll:toggle', function() {
            $(this).trigger(($(this).triggerHandler('toggleAll:areAllChecked'))? 'toggleAll:uncheck':'toggleAll:check');
        })
        .on('toggleAll:allChecked', function() {
            $(this).addClass('all-checked');
        })
        .on('toggleAll:notAllChecked', function() {
            $(this).removeClass('all-checked');
        })
        .on('toggleAll:check', function() {
            checkboxes.trigger('checkbox:check');
        })
        .on('toggleAll:uncheck', function() {
            checkboxes.trigger('checkbox:uncheck');
        })
        
        // tool
        tool.on('tool:show', function() {
            $(this).css('visibility','visible');
        })
        .on('tool:hide', function() {
            $(this).css('visibility','hidden');
        });
        
        // button
        button.block('click').on('click', function(event) {
            $(this).trigger('button:redirect',[event]);
        })
        .on('button:getCheckboxSet',function() {
            var separator = $(this).data("separator");
            return checkboxes.filter(":checked").valSet(separator,true);
        })
        .on('button:redirect', function(event,clickEvent) {
            var href = $(this).dataHrefReplaceChar($(this).triggerHandler('button:getCheckboxSet'));
            
            if(quid.base.str.isNotEmpty(href))
            {
                $(this).trigger('block');
                $(document).trigger('document:go',[href,clickEvent]);
            }
        });
        
        // checkboxes
        checkboxes.on('change', function() {
            $(this).trigger(($(this).is(":checked"))? 'checkbox:check':'checkbox:uncheck');
        })
        .on('checkbox:check', function() {
            $(this).parents("tr").addClass('selected');
            $(this).prop('checked',true).trigger('checkbox:update');
        })
        .on('checkbox:uncheck', function() {
            $(this).parents("tr").removeClass('selected');
            $(this).prop('checked',false).trigger('checkbox:update');
        })
        .on('checkbox:update', function() {
            var checked = checkboxes.filter(':checked');
            var oneChecked = (checked.length)? true:false;
            var manyChecked = (checked.length > 1)? true:false;
            var allChecked = (checked.length === checkboxes.length)? true:false;
            
            tool.trigger((oneChecked === true)? 'tool:show':'tool:hide');
            multiModify.trigger((manyChecked === true)? 'multiModify:show':'multiModify:hide');
            toggleAll.trigger((allChecked === true)? 'toggleAll:allChecked':'toggleAll:notAllChecked');
        });
        
        // multiModify
        multiModify.on('multiModify:show', function(event) {
            $(this).addClass('active');
        })
        .on('multiModify:hide', function(event) {
            $(this).removeClass('active');
        });
        
        // multiDelete
        multiDelete.block('submit').confirm('submit').on('confirmed', function(event,submit) {
            var separator = $(this).data('separator');
            var set = checkboxes.filter(":checked").valSet(separator,true);
            if(quid.base.str.isNotEmpty(set))
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