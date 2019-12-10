/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// rowsChecker
// script for the rows checker component in the general page of the CMS
const RowsChecker = Component.RowsChecker = function()
{
    // func
    setFunc(this,'rowsChecker:getToolsContainer',function() {
        return qs(this,".above .tools-container");
    });
    
    setFunc(this,'rowsChecker:getTools',function() {
        return qsa(triggerFunc(this,'rowsChecker:getToolsContainer'),".tool-element");
    });
    
    setFunc(this,'rowsChecker:getToolsButton',function() {
        return Arr.filter(triggerFunc(this,'rowsChecker:getTools'),function() {
            return $(this).is('button');
        });
    });
    
    setFunc(this,'rowsChecker:getMultiModify',function() {
        return Arr.find(triggerFunc(this,'rowsChecker:getToolsButton'),function() {
            return $(this).is('.multi-modify');
        });
    });
    
    setFunc(this,'rowsChecker:getMultiDelete',function() {
        return Arr.find(triggerFunc(this,'rowsChecker:getTools'),function() {
            return $(this).is(".multi-delete-form");
        }); 
    });
    
    setFunc(this,'rowsChecker:getToolsMulti',function() {
        const multiModify = triggerFunc(this,'rowsChecker:getMultiModify');
        const multiDelete = triggerFunc(this,'rowsChecker:getMultiDelete');
        
        return (multiModify != null && multiDelete != null)? [multiModify,multiDelete]:null;
    });
    
    setFunc(this,'rowsChecker:getTable',function() {
        return qs(this,'table');
    });
    
    setFunc(this,'rowsChecker:getToggleAll',function() {
        return qs(triggerFunc(this,'rowsChecker:getTable'),"th.rows .toggle-all");
    });
    
    setFunc(this,'rowsChecker:getRows',function() {
        return qsa(triggerFunc(this,'rowsChecker:getTable'),"tbody tr");
    });
    
    setFunc(this,'rowsChecker:getCheckedRows',function() {
        const r = [];
        const checked = triggerFunc(this,'rowsChecker:getCheckedCheckboxes');
        
        Arr.each(checked,function() {
            const row = triggerFunc(this,'checkbox:getTr');
            r.push(row);
        });
        
        return r;
    });
    
    setFunc(this,'rowsChecker:getCheckboxes',function() {
        return mergedQsa(triggerFunc(this,'rowsChecker:getRows'),"td.rows input[type='checkbox']");
    });
    
    setFunc(this,'rowsChecker:getCheckedCheckboxes',function() {
        return Arr.filter(triggerFunc(this,'rowsChecker:getCheckboxes'),function() {
            return $(this).is(':checked');
        });
    });
    
    setFunc(this,'rowsChecker:getCheckedSet',function(separator) {
        return Dom.valueSeparator(triggerFunc(this,'rowsChecker:getCheckedCheckboxes'),separator,true);
    });
    
    setFunc(this,'rowsChecker:areAllChecked',function() {
        const checkboxes = triggerFunc(this,'rowsChecker:getCheckboxes');
        const checked = triggerFunc(this,'rowsChecker:getCheckedCheckboxes');
        
        return (checkboxes.length === checked.length)? true:false;
    });
    
    setFunc(this,'rowsChecker:areAllUpdateable',function() {
        return Dom.matchAll("[data-updateable='1']",triggerFunc(this,'rowsChecker:getCheckedRows'));
    });
    
    setFunc(this,'rowsChecker:areAllDeleteable',function() {
        return Dom.matchAll("[data-deleteable='1']",triggerFunc(this,'rowsChecker:getCheckedRows'));
    });
    
    setFunc(this,'rowsChecker:refresh',function() {
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
        
        $(toggleAll).toggleClass('all-checked',allChecked);
        
        triggerFunc(toolsContainer,(oneChecked === true)? 'toolsContainer:show':'toolsContainer:hide');
        triggerFunc(multiModify,(showMulti === true)? 'toolMulti:show':'toolMulti:hide');
        triggerFunc(multiDelete,(showDelete === true)? 'toolMulti:show':'toolMulti:hide');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindToggleAll.call(this);
        bindCheckboxes.call(this);
        bindToolsContainer.call(this);
        bindToolsButton.call(this);
        bindToolsMulti.call(this);
        bindMultiDelete.call(this);
    });
    
    
    // bindToggleAll
    const bindToggleAll = function() 
    {
        const $this = this;
        const toggleAll = triggerFunc(this,'rowsChecker:getToggleAll');
        
        // func
        setFunc(toggleAll,'toggleAll:toggle',function() {
            triggerFunc(this,(triggerFunc($this,'rowsChecker:areAllChecked'))? 'toggleAll:uncheck':'toggleAll:check');
        });
        
        setFunc(toggleAll,'toggleAll:check',function() {
            const checkboxes = triggerFunc($this,'rowsChecker:getCheckboxes');
            triggerFuncs(checkboxes,'checkbox:check');
            triggerFunc($this,'rowsChecker:refresh');
        });
        
        setFunc(toggleAll,'toggleAll:uncheck',function() {
            const checkboxes = triggerFunc($this,'rowsChecker:getCheckboxes');
            triggerFuncs(checkboxes,'checkbox:uncheck');
            triggerFunc($this,'rowsChecker:refresh');
        });
        
        // event
        ael(toggleAll,'click',function() {
            triggerFunc(this,'toggleAll:toggle');
        });
    }
    
    
    // bindCheckboxes
    const bindCheckboxes = function() 
    {
        const $this = this;
        const checkboxes = triggerFunc(this,'rowsChecker:getCheckboxes');
        
        // func
        setFunc(checkboxes,'checkbox:getTr',function() {
            return $(this).parents("tr").get(0);
        });
        
        setFunc(checkboxes,'checkbox:check',function(refresh) {
            const tr = triggerFunc(this,'checkbox:getTr');
            $(this).prop('checked',true);
            $(tr).addClass('selected');
            
            if(refresh === true)
            triggerFunc($this,'rowsChecker:refresh');
        });
        
        setFunc(checkboxes,'checkbox:uncheck',function(refresh) {
            const tr = triggerFunc(this,'checkbox:getTr');
            $(this).prop('checked',false);
            $(tr).removeClass('selected');
            
            if(refresh === true)
            triggerFunc($this,'rowsChecker:refresh');
        });
        
        // event
        ael(checkboxes,'change',function() {
            triggerFunc(this,($(this).is(":checked"))? 'checkbox:check':'checkbox:uncheck',true);
        });
    }
    
    
    // bindToolsContainer
    const bindToolsContainer = function() 
    {
        const container = triggerFunc(this,'rowsChecker:getToolsContainer');
        
        // func
        setFunc(container,'toolsContainer:show',function() {
            $(this).attr('data-status','visible');
        });
        
        setFunc(container,'toolsContainer:hide',function() {
            $(this).removeAttr('data-status');
        });
    }
    
    
    // bindToolsButton
    const bindToolsButton = function() 
    {
        const $this = this;
        const button = triggerFunc(this,'rowsChecker:getToolsButton');
        
        // func
        setFunc(button,'toolButton:redirect',function(clickEvent) {
            const separator = $(this).data("separator");
            const set = triggerFunc($this,'rowsChecker:getCheckedSet',separator);
            const href = Dom.dataHrefReplaceChar(this,set);
            
            if(Str.isNotEmpty(href))
            triggerFunc(document,'doc:go',href,clickEvent);
        });
        
        // event
        ael(button,'click',function(event) {
            triggerFunc(this,'toolButton:redirect',event);
        });
    }
    
    
    // bindToolsMulti
    const bindToolsMulti = function() 
    {
        const tools = triggerFunc(this,'rowsChecker:getToolsMulti');
        
        // func
        setFunc(tools,'toolMulti:show',function() {
            $(this).addClass('active');
        });
        
        setFunc(tools,'toolMulti:hide',function() {
            $(this).removeClass('active');
        });
    }
    

    // bindMultiDelete
    const bindMultiDelete = function() 
    {
        const $this = this;
        const multiDelete = triggerFunc(this,'rowsChecker:getMultiDelete');
        
        // func
        setFunc(multiDelete,'multiDelete:getPrimaries',function() {
            return qsa(this,"input[name='primaries']");
        });
        
        // event 
        ael(multiDelete,'confirm:yes',function(event,submit) {
            const input = triggerFunc(this,'multiDelete:getPrimaries');
            const separator = $(this).data('separator');
            const set = triggerFunc($this,'rowsChecker:getCheckedSet',separator);
            
            if(Str.isNotEmpty(set))
            $(input).val(set);
            
            else
            submit.preventDefault();
        });
    }
    
    return this;
}