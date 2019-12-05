/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// rowsChecker
// script for the rows checker component in the general page of the CMS
Component.rowsChecker = function()
{
    // triggerHandler
    $(this).on('rowsChecker:getToolsContainer',function() {
        return $(this).find(".above .tools-container").get(0);
    })
    .on('rowsChecker:getTools',function() {
        return triggerFunc(this,'rowsChecker:getToolsContainer').find(".tool-element");
    })
    .on('rowsChecker:getToolsButton',function() {
        return triggerFunc(this,'rowsChecker:getTools').filter("button");
    })
    .on('rowsChecker:getMultiModify',function() {
        return triggerFunc(this,'rowsChecker:getToolsButton').filter(".multi-modify").get(0);
    })
    .on('rowsChecker:getMultiDelete',function() {
        return triggerFunc(this,'rowsChecker:getTools').filter(".multi-delete-form").get(0);
    })
    .on('rowsChecker:getToolsMulti',function() {
        let r = triggerFunc(this,'rowsChecker:getMultiModify');
        r = r.add(triggerFunc(this,'rowsChecker:getMultiDelete'));
        
        return r;
    })
    .on('rowsChecker:getTable',function() {
        return $(this).find("table").get(0);
    })
    .on('rowsChecker:getToggleAll',function() {
        return triggerFunc(this,'rowsChecker:getTable').find("th.rows .toggle-all").get(0);
    })
    .on('rowsChecker:getRows',function() {
        return triggerFunc(this,'rowsChecker:getTable').find("tbody tr");
    })
    .on('rowsChecker:getCheckedRows',function() {
        let r = $();
        const checked = triggerFunc(this,'rowsChecker:getCheckedCheckboxes');
        
        checked.each(function() {
            const row = triggerFunc(this,'checkbox:getTr');
            r = r.add(row);
        });
        
        return r;
    })
    .on('rowsChecker:getCheckboxes',function() {
        return triggerFunc(this,'rowsChecker:getRows').find("td.rows input[type='checkbox']");
    })
    .on('rowsChecker:getCheckedCheckboxes',function() {
        return triggerFunc(this,'rowsChecker:getCheckboxes').filter(':checked');
    })
    .on('rowsChecker:getCheckedSet',function(event,separator) {
        return Dom.valueSeparator(triggerFunc(this,'rowsChecker:getCheckedCheckboxes'),separator,true);
    })
    .on('rowsChecker:areAllChecked',function() {
        const checkboxes = triggerFunc(this,'rowsChecker:getCheckboxes');
        const checked = triggerFunc(this,'rowsChecker:getCheckedCheckboxes');
        
        return (checkboxes.length === checked.length)? true:false;
    })
    .on('rowsChecker:areAllUpdateable',function() {
        const rows = triggerFunc(this,'rowsChecker:getCheckedRows');
        
        return Dom.matchAll("[data-updateable='1']",rows);
    })
    .on('rowsChecker:areAllDeleteable',function() {
        const rows = triggerFunc(this,'rowsChecker:getCheckedRows');
        
        return Dom.matchAll("[data-deleteable='1']",rows);
    })
    
    // trigger
    .on('rowsChecker:refresh',function() {
        const checked = triggerFunc(this,'rowsChecker:getCheckedCheckboxes');
        const toolsContainer = triggerFunc(this,'rowsChecker:getToolsContainer');
        const toggleAll = triggerFunc(this,'rowsChecker:getToggleAll');
        const multiModify = triggerFunc(this,'rowsChecker:getMultiModify');
        const multiDelete = triggerFunc(this,'rowsChecker:getMultiDelete');
        const oneChecked = (checked.length)? true:false;
        const manyChecked = (checked.length > 1)? true:false;
        const allChecked = triggerFunc(this,'rowsChecker:areAllChecked');
        const showMulti = (manyChecked === true && triggerFunc(this,'rowsChecker:areAllUpdateable'))? true:false;
        const showDelete = (oneChecked === true && triggerFunc(this,'rowsChecker:areAllDeleteable'))? true:false;
        
        toolsContainer.trigger((oneChecked === true)? 'toolsContainer:show':'toolsContainer:hide');
        toggleAll.toggleClass('all-checked',allChecked);
        multiModify.trigger((showMulti === true)? 'toolMulti:show':'toolMulti:hide');
        multiDelete.trigger((showDelete === true)? 'toolMulti:show':'toolMulti:hide')
    })
    
    // setup
    .one('component:setup',function() {
        bindToggleAll.call(this);
        bindCheckboxes.call(this);
        bindToolsContainer.call(this);
        bindToolsButton.call(this);
        bindToolsMulti.call(this);
        bindMultiDelete.call(this);
    });
    
    // bindToggleAll
    const bindToggleAll = function() {
        const $this = $(this);
        const toggleAll = triggerFunc(this,'rowsChecker:getToggleAll');
        
        toggleAll.on('click',function() {
            triggerCustom(this,'toggleAll:toggle');
        })
        .on('toggleAll:toggle',function() {
            triggerCustom(this,($this.triggerHandler('rowsChecker:areAllChecked'))? 'toggleAll:uncheck':'toggleAll:check');
        })
        .on('toggleAll:check',function() {
            $this.triggerHandler('rowsChecker:getCheckboxes').trigger('checkbox:check');
            triggerCustom($this,'rowsChecker:refresh');
        })
        .on('toggleAll:uncheck',function() {
            $this.triggerHandler('rowsChecker:getCheckboxes').trigger('checkbox:uncheck');
            triggerCustom($this,'rowsChecker:refresh');
        })
    };
    
    // bindCheckboxes
    const bindCheckboxes = function() {
        const $this = $(this);
        const checkboxes = triggerFunc(this,'rowsChecker:getCheckboxes');
        
        // checkboxes
        checkboxes.on('change',function() {
            triggerCustom(this,($(this).is(":checked"))? 'checkbox:check':'checkbox:uncheck',true);
        })
        .on('checkbox:getTr',function() {
            return $(this).parents("tr").get(0);
        })
        .on('checkbox:check',function(event,refresh) {
            const tr = triggerFunc(this,'checkbox:getTr');
            $(this).prop('checked',true);
            tr.addClass('selected');
            
            if(refresh === true)
            triggerCustom($this,'rowsChecker:refresh');
        })
        .on('checkbox:uncheck',function(event,refresh) {
            const tr = triggerFunc(this,'checkbox:getTr');
            $(this).prop('checked',false);
            tr.removeClass('selected');
            
            if(refresh === true)
            triggerCustom($this,'rowsChecker:refresh');
        })
    };
    
    // bindToolsContainer
    const bindToolsContainer = function() {
        const container = triggerFunc(this,'rowsChecker:getToolsContainer');
        
        container.on('toolsContainer:show',function() {
            $(this).css('visibility','visible');
        })
        .on('toolsContainer:hide',function() {
            $(this).css('visibility','hidden');
        });
    };
    
    // bindToolsButton
    const bindToolsButton = function() {
        const $this = $(this);
        const button = triggerFunc(this,'rowsChecker:getToolsButton');
        
        Component.BlockEvent.call(button,'click');
        
        button.on('click',function(event) {
            triggerCustom(this,'toolButton:redirect',event);
        })
        .on('toolButton:redirect',function(event,clickEvent) {
            const separator = $(this).data("separator");
            const set = $this.triggerHandler('rowsChecker:getCheckedSet',[separator]);
            const href = Dom.dataHrefReplaceChar(this,set);
            
            if(Str.isNotEmpty(href))
            {
                triggerCustom(this,'block');
                $(document).trigger('doc:go',[href,clickEvent]);
            }
        });
    };
    
    // bindToolsMulti
    const bindToolsMulti = function() {
        const tools = triggerFunc(this,'rowsChecker:getToolsMulti');

        tools.on('toolMulti:show',function(cursorDown) {
            $(this).addClass('active');
        })
        .on('toolMulti:hide',function(cursorDown) {
            $(this).removeClass('active');
        });
    };

    // bindMultiDelete
    const bindMultiDelete = function() {
        const $this = $(this);
        const multiDelete = triggerFunc(this,'rowsChecker:getMultiDelete');
        
        Component.BlockEvent.call(multiDelete,'submit');
        Component.confirm.call(multiDelete,'submit');
        
        multiDelete.on('confirmed',function(event,submit) {
            const input = $(this).find("input[name='primaries']");
            const separator = $(this).data('separator');
            const set = $this.triggerHandler('rowsChecker:getCheckedSet',[separator]);
            
            if(Str.isNotEmpty(set))
            {
                input.val(set);
                triggerCustom(this,'block');
            }
            
            else
            submit.preventDefault();
        });
    };
    
    return this;
}