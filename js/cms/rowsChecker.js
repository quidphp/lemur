/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// rowsChecker
// script for the rows checker component in the general page of the CMS
const RowsChecker = Component.RowsChecker = function()
{
    // handler
    setHandler(this,'rowsChecker:getToolsContainer',function() {
        return qs(this,".above .tools-container");
    });
    
    setHandler(this,'rowsChecker:getTools',function() {
        return qsa(trigHandler(this,'rowsChecker:getToolsContainer'),".tool-element");
    });
    
    setHandler(this,'rowsChecker:getToolsButton',function() {
        return Arr.filter(trigHandler(this,'rowsChecker:getTools'),function() {
            return $(this).is('button');
        });
    });
    
    setHandler(this,'rowsChecker:getMultiModify',function() {
        return Arr.find(trigHandler(this,'rowsChecker:getToolsButton'),function() {
            return $(this).is('.multi-modify');
        });
    });
    
    setHandler(this,'rowsChecker:getMultiDelete',function() {
        return Arr.find(trigHandler(this,'rowsChecker:getTools'),function() {
            return $(this).is(".multi-delete-form");
        }); 
    });
    
    setHandler(this,'rowsChecker:getToolsMulti',function() {
        const multiModify = trigHandler(this,'rowsChecker:getMultiModify');
        const multiDelete = trigHandler(this,'rowsChecker:getMultiDelete');
        
        return (multiModify != null && multiDelete != null)? [multiModify,multiDelete]:null;
    });
    
    setHandler(this,'rowsChecker:getTable',function() {
        return qs(this,'table');
    });
    
    setHandler(this,'rowsChecker:getToggleAll',function() {
        return qs(trigHandler(this,'rowsChecker:getTable'),"th.rows .toggle-all");
    });
    
    setHandler(this,'rowsChecker:getRows',function() {
        return qsa(trigHandler(this,'rowsChecker:getTable'),"tbody tr");
    });
    
    setHandler(this,'rowsChecker:getCheckedRows',function() {
        const r = [];
        const checked = trigHandler(this,'rowsChecker:getCheckedCheckboxes');
        
        Arr.each(checked,function() {
            const row = trigHandler(this,'checkbox:getTr');
            r.push(row);
        });
        
        return r;
    });
    
    setHandler(this,'rowsChecker:getCheckboxes',function() {
        return mergedQsa(trigHandler(this,'rowsChecker:getRows'),"td.rows input[type='checkbox']");
    });
    
    setHandler(this,'rowsChecker:getCheckedCheckboxes',function() {
        return Arr.filter(trigHandler(this,'rowsChecker:getCheckboxes'),function() {
            return $(this).is(':checked');
        });
    });
    
    setHandler(this,'rowsChecker:getCheckedSet',function(separator) {
        return Dom.valueSeparator(trigHandler(this,'rowsChecker:getCheckedCheckboxes'),separator,true);
    });
    
    setHandler(this,'rowsChecker:areAllChecked',function() {
        const checkboxes = trigHandler(this,'rowsChecker:getCheckboxes');
        const checked = trigHandler(this,'rowsChecker:getCheckedCheckboxes');
        
        return (checkboxes.length === checked.length)? true:false;
    });
    
    setHandler(this,'rowsChecker:areAllUpdateable',function() {
        return Dom.matchAll("[data-updateable='1']",trigHandler(this,'rowsChecker:getCheckedRows'));
    });
    
    setHandler(this,'rowsChecker:areAllDeleteable',function() {
        return Dom.matchAll("[data-deleteable='1']",trigHandler(this,'rowsChecker:getCheckedRows'));
    });
    
    setHandler(this,'rowsChecker:refresh',function() {
        const checked = trigHandler(this,'rowsChecker:getCheckedCheckboxes');
        const toolsContainer = trigHandler(this,'rowsChecker:getToolsContainer');
        const toggleAll = trigHandler(this,'rowsChecker:getToggleAll');
        const multiModify = trigHandler(this,'rowsChecker:getMultiModify');
        const multiDelete = trigHandler(this,'rowsChecker:getMultiDelete');
        const oneChecked = (checked.length)? true:false;
        const manyChecked = (checked.length > 1)? true:false;
        const allChecked = trigHandler(this,'rowsChecker:areAllChecked');
        const showMulti = (manyChecked === true && trigHandler(this,'rowsChecker:areAllUpdateable'))? true:false;
        const showDelete = (oneChecked === true && trigHandler(this,'rowsChecker:areAllDeleteable'))? true:false;
        
        $(toggleAll).toggleClass('all-checked',allChecked);
        
        trigHandler(toolsContainer,(oneChecked === true)? 'toolsContainer:show':'toolsContainer:hide');
        trigHandler(multiModify,(showMulti === true)? 'toolMulti:show':'toolMulti:hide');
        trigHandler(multiDelete,(showDelete === true)? 'toolMulti:show':'toolMulti:hide');
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
        const toggleAll = trigHandler(this,'rowsChecker:getToggleAll');
        
        // handler
        setHandler(toggleAll,'toggleAll:toggle',function() {
            trigHandler(this,(trigHandler($this,'rowsChecker:areAllChecked'))? 'toggleAll:uncheck':'toggleAll:check');
        });
        
        setHandler(toggleAll,'toggleAll:check',function() {
            const checkboxes = trigHandler($this,'rowsChecker:getCheckboxes');
            trigHandlers(checkboxes,'checkbox:check');
            trigHandler($this,'rowsChecker:refresh');
        });
        
        setHandler(toggleAll,'toggleAll:uncheck',function() {
            const checkboxes = trigHandler($this,'rowsChecker:getCheckboxes');
            trigHandlers(checkboxes,'checkbox:uncheck');
            trigHandler($this,'rowsChecker:refresh');
        });
        
        // event
        ael(toggleAll,'click',function() {
            trigHandler(this,'toggleAll:toggle');
        });
    }
    
    
    // bindCheckboxes
    const bindCheckboxes = function() 
    {
        const $this = this;
        const checkboxes = trigHandler(this,'rowsChecker:getCheckboxes');
        
        // handler
        setHandler(checkboxes,'checkbox:getTr',function() {
            return $(this).parents("tr").get(0);
        });
        
        setHandler(checkboxes,'checkbox:check',function(refresh) {
            const tr = trigHandler(this,'checkbox:getTr');
            $(this).prop('checked',true);
            $(tr).addClass('selected');
            
            if(refresh === true)
            trigHandler($this,'rowsChecker:refresh');
        });
        
        setHandler(checkboxes,'checkbox:uncheck',function(refresh) {
            const tr = trigHandler(this,'checkbox:getTr');
            $(this).prop('checked',false);
            $(tr).removeClass('selected');
            
            if(refresh === true)
            trigHandler($this,'rowsChecker:refresh');
        });
        
        // event
        ael(checkboxes,'change',function() {
            trigHandler(this,($(this).is(":checked"))? 'checkbox:check':'checkbox:uncheck',true);
        });
    }
    
    
    // bindToolsContainer
    const bindToolsContainer = function() 
    {
        const container = trigHandler(this,'rowsChecker:getToolsContainer');
        
        // handler
        setHandler(container,'toolsContainer:show',function() {
            $(this).attr('data-status','visible');
        });
        
        setHandler(container,'toolsContainer:hide',function() {
            $(this).removeAttr('data-status');
        });
    }
    
    
    // bindToolsButton
    const bindToolsButton = function() 
    {
        const $this = this;
        const button = trigHandler(this,'rowsChecker:getToolsButton');
        
        // handler
        setHandler(button,'toolButton:redirect',function(clickEvent) {
            const separator = $(this).data("separator");
            const set = trigHandler($this,'rowsChecker:getCheckedSet',separator);
            const href = Dom.dataHrefReplaceChar(this,set);
            
            if(Str.isNotEmpty(href))
            trigHandler(document,'doc:go',href,clickEvent);
        });
        
        // event
        ael(button,'click',function(event) {
            trigHandler(this,'toolButton:redirect',event);
        });
    }
    
    
    // bindToolsMulti
    const bindToolsMulti = function() 
    {
        const tools = trigHandler(this,'rowsChecker:getToolsMulti');
        
        // handler
        setHandler(tools,'toolMulti:show',function() {
            $(this).addClass('active');
        });
        
        setHandler(tools,'toolMulti:hide',function() {
            $(this).removeClass('active');
        });
    }
    

    // bindMultiDelete
    const bindMultiDelete = function() 
    {
        const $this = this;
        const multiDelete = trigHandler(this,'rowsChecker:getMultiDelete');
        
        // handler
        setHandler(multiDelete,'multiDelete:getPrimaries',function() {
            return qsa(this,"input[name='primaries']");
        });
        
        // event 
        ael(multiDelete,'confirm:yes',function(event,submit) {
            const input = trigHandler(this,'multiDelete:getPrimaries');
            const separator = $(this).data('separator');
            const set = trigHandler($this,'rowsChecker:getCheckedSet',separator);
            
            if(Str.isNotEmpty(set))
            $(input).val(set);
            
            else
            submit.preventDefault();
        });
    }
    
    return this;
}