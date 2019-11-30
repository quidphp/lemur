/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// rowsChecker
// script for the rows checker component in the general page of the CMS
quid.component.rowsChecker = function()
{
    // triggerHandler
    $(this).on('rowsChecker:getToolsContainer', function() {
        return $(this).find(".above .tools-container").first();
    })
    .on('rowsChecker:getTools', function() {
        return $(this).triggerHandler('rowsChecker:getToolsContainer').find(".tool-element");
    })
    .on('rowsChecker:getToolsButton', function() {
        return $(this).triggerHandler('rowsChecker:getTools').filter("button");
    })
    .on('rowsChecker:getMultiModify', function() {
        return $(this).triggerHandler('rowsChecker:getToolsButton').filter(".multi-modify").first();
    })
    .on('rowsChecker:getMultiDelete', function() {
        return $(this).triggerHandler('rowsChecker:getTools').filter(".multi-delete-form").first();
    })
    .on('rowsChecker:getToolsMulti', function() {
        var r = $(this).triggerHandler('rowsChecker:getMultiModify');
        r = r.add($(this).triggerHandler('rowsChecker:getMultiDelete'));
        
        return r;
    })
    .on('rowsChecker:getTable', function() {
        return $(this).find("table").first();
    })
    .on('rowsChecker:getToggleAll', function() {
        return $(this).triggerHandler('rowsChecker:getTable').find("th.rows .toggle-all").first();
    })
    .on('rowsChecker:getRows', function() {
        return $(this).triggerHandler('rowsChecker:getTable').find("tbody tr");
    })
    .on('rowsChecker:getCheckedRows', function() {
        var r = $();
        var checked = $(this).triggerHandler('rowsChecker:getCheckedCheckboxes');
        
        checked.each(function() {
            var row = $(this).triggerHandler('checkbox:getTr');
            r = r.add(row);
        });
        
        return r;
    })
    .on('rowsChecker:getCheckboxes', function() {
        return $(this).triggerHandler('rowsChecker:getRows').find("td.rows input[type='checkbox']");
    })
    .on('rowsChecker:getCheckedCheckboxes', function() {
        return $(this).triggerHandler('rowsChecker:getCheckboxes').filter(':checked');
    })
    .on('rowsChecker:getCheckedSet', function(event,separator) {
        return quid.node.valueSeparator($(this).triggerHandler('rowsChecker:getCheckedCheckboxes'),separator,true);
    })
    .on('rowsChecker:areAllChecked', function() {
        var checkboxes = $(this).triggerHandler('rowsChecker:getCheckboxes');
        var checked = $(this).triggerHandler('rowsChecker:getCheckedCheckboxes');
        
        return (checkboxes.length === checked.length)? true:false;
    })
    .on('rowsChecker:areAllUpdateable', function() {
        var rows = $(this).triggerHandler('rowsChecker:getCheckedRows');
        
        return quid.node.isAll("[data-updateable='1']",rows);
    })
    .on('rowsChecker:areAllDeleteable', function() {
        var rows = $(this).triggerHandler('rowsChecker:getCheckedRows');
        
        return quid.node.isAll("[data-deleteable='1']",rows);
    })
    
    // trigger
    .on('rowsChecker:refresh', function() {
        var checked = $(this).triggerHandler('rowsChecker:getCheckedCheckboxes');
        var toolsContainer = $(this).triggerHandler('rowsChecker:getToolsContainer');
        var toggleAll = $(this).triggerHandler('rowsChecker:getToggleAll');
        var multiModify = $(this).triggerHandler('rowsChecker:getMultiModify');
        var multiDelete = $(this).triggerHandler('rowsChecker:getMultiDelete');
        var oneChecked = (checked.length)? true:false;
        var manyChecked = (checked.length > 1)? true:false;
        var allChecked = $(this).triggerHandler('rowsChecker:areAllChecked');
        var showMulti = (manyChecked === true && $(this).triggerHandler('rowsChecker:areAllUpdateable'))? true:false;
        var showDelete = (oneChecked === true && $(this).triggerHandler('rowsChecker:areAllDeleteable'))? true:false;
        
        toolsContainer.trigger((oneChecked === true)? 'toolsContainer:show':'toolsContainer:hide');
        toggleAll.toggleClass('all-checked',allChecked);
        multiModify.trigger((showMulti === true)? 'toolMulti:show':'toolMulti:hide');
        multiDelete.trigger((showDelete === true)? 'toolMulti:show':'toolMulti:hide')
    })
    
    // setup
    .one('component:setup', function() {
        bindToggleAll.call(this);
        bindCheckboxes.call(this);
        bindToolsContainer.call(this);
        bindToolsButton.call(this);
        bindToolsMulti.call(this);
        bindMultiDelete.call(this);
    });
    
    // bindToggleAll
    var bindToggleAll = function() {
        var $this = $(this);
        var toggleAll = $(this).triggerHandler('rowsChecker:getToggleAll');
        
        toggleAll.on('click', function() {
            $(this).trigger('toggleAll:toggle');
        })
        .on('toggleAll:toggle', function() {
            $(this).trigger(($this.triggerHandler('rowsChecker:areAllChecked'))? 'toggleAll:uncheck':'toggleAll:check');
        })
        .on('toggleAll:check', function() {
            $this.triggerHandler('rowsChecker:getCheckboxes').trigger('checkbox:check');
            $this.trigger('rowsChecker:refresh');
        })
        .on('toggleAll:uncheck', function() {
            $this.triggerHandler('rowsChecker:getCheckboxes').trigger('checkbox:uncheck');
            $this.trigger('rowsChecker:refresh');
        })
    };
    
    // bindCheckboxes
    var bindCheckboxes = function() {
        var $this = $(this);
        var checkboxes = $(this).triggerHandler('rowsChecker:getCheckboxes');
        
        // checkboxes
        checkboxes.on('change', function() {
            $(this).trigger(($(this).is(":checked"))? 'checkbox:check':'checkbox:uncheck',[true]);
        })
        .on('checkbox:getTr', function() {
            return $(this).parents("tr").first();
        })
        .on('checkbox:check', function(event,refresh) {
            var tr = $(this).triggerHandler('checkbox:getTr');
            $(this).prop('checked',true);
            tr.addClass('selected');
            
            if(refresh === true)
            $this.trigger('rowsChecker:refresh');
        })
        .on('checkbox:uncheck', function(event,refresh) {
            var tr = $(this).triggerHandler('checkbox:getTr');
            $(this).prop('checked',false);
            tr.removeClass('selected');
            
            if(refresh === true)
            $this.trigger('rowsChecker:refresh');
        })
    };
    
    // bindToolsContainer
    var bindToolsContainer = function() {
        var container = $(this).triggerHandler('rowsChecker:getToolsContainer');
        
        container.on('toolsContainer:show', function() {
            $(this).css('visibility','visible');
        })
        .on('toolsContainer:hide', function() {
            $(this).css('visibility','hidden');
        });
    };
    
    // bindToolsButton
    var bindToolsButton = function() {
        var $this = $(this);
        var button = $(this).triggerHandler('rowsChecker:getToolsButton');
        
        quid.component.block.call(button,'click');
        
        button.on('click', function(event) {
            $(this).trigger('toolButton:redirect',[event]);
        })
        .on('toolButton:redirect', function(event,clickEvent) {
            var separator = $(this).data("separator");
            var set = $this.triggerHandler('rowsChecker:getCheckedSet',[separator]);
            var href = quid.node.dataHrefReplaceChar(this,set);
            
            if(quid.str.isNotEmpty(href))
            {
                $(this).trigger('block');
                $(document).trigger('document:go',[href,clickEvent]);
            }
        });
    };
    
    // bindToolsMulti
    var bindToolsMulti = function() {
        var tools = $(this).triggerHandler('rowsChecker:getToolsMulti');

        tools.on('toolMulti:show', function(cursorDown) {
            $(this).addClass('active');
        })
        .on('toolMulti:hide', function(cursorDown) {
            $(this).removeClass('active');
        });
    };

    // bindMultiDelete
    var bindMultiDelete = function() {
        var $this = $(this);
        var multiDelete = $(this).triggerHandler('rowsChecker:getMultiDelete');
        
        quid.component.block.call(multiDelete,'submit');
        quid.component.confirm.call(multiDelete,'submit');
        
        multiDelete.on('confirmed', function(event,submit) {
            var input = $(this).find("input[name='primaries']");
            var separator = $(this).data('separator');
            var set = $this.triggerHandler('rowsChecker:getCheckedSet',[separator]);
            
            if(quid.str.isNotEmpty(set))
            {
                input.val(set);
                $(this).trigger('block');
            }
            
            else
            submit.preventDefault();
        });
    };
    
    return this;
}