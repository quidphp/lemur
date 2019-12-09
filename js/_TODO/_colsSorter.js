/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// colsSorter
// script for the col sorter component of the general page of the CMS
Component.colsSorter = function()
{
    // bindings
    Component.clickOpenWithTrigger.call(this,".trigger");
    
    // func
    setFunc(this,'colsSorter:getPopup',function() {
        return $(this).find(".popup");
    });
    
    setFunc(this,'colsSorter:getCheckboxes',function() {
        return $(this).find("input[type='checkbox']");
    });
    
    setFunc(this,'colsSorter:getCheckedCheckboxes',function() {
        return triggerFunc(this,'colsSorter:getCheckboxes').filter(':checked');
    });
    
    setFunc(this,'colsSorter:getButton',function() {
        return triggerFunc(this,'colsSorter:getPopup').find("button[name='cols']");
    });
    
    setFunc(this,'colsSorter:isValid',function() {
        const checkboxes = triggerFunc(this,'colsSorter:getCheckboxes');
        
        return triggerFuncEqual(checkboxes,true,'validate:isValid');
    });
    
    setFunc(this,'colsSorter:getCheckedSet',function() {
        const button = triggerFunc(this,'colsSorter:getButton');
        const checkbox = triggerFunc(this,'colsSorter:getCheckedCheckboxes');
        
        return Dom.valueSeparator(checkbox,button.data('separator'),true);
    });
    
    setFunc(this,'colsSorter:isCurrent',function() {
        const button = triggerFunc(this,'colsSorter:getButton');
        const set = triggerFunc(this,'colsSorter:getCheckedSet');
        
        return (set === button.data('current'))? true:false;
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindColsPopup.call(this);
        bindColsCheckboxes.call(this);
        bindColsButton.call(this);
    });
    
    
    // bindColsPopup
    const bindColsPopup = function() {
        const $this = $(this);
        const popup = triggerFunc(this,'colsSorter:getPopup');
        
        Component.verticalSorter.call(popup,".choice",'.choice-in');
        
        popup.on('verticalSorter:stop',function() {
            triggerEvent(this,'popup:validate');
        })
        .on('popup:validate',function() {
            const checkboxes = triggerFunc($this,'colsSorter:getCheckboxes');
            triggerEvent(checkboxes,'validate:trigger');
        })
        .on('popup:invalid',function() {
            $(this).attr('data-validate','invalid');
        })
        .on('popup:valid',function() {
            $(this).removeAttr("data-validate");
            
            if(!triggerFunc($this,'colsSorter:isCurrent'))
            $(this).attr('data-validate','valid');
        });
    };
    
    // bindColsCheckboxes
    const bindColsCheckboxes = function() {
        const checkboxes = triggerFunc(this,'colsSorter:getCheckboxes');
        const popup = triggerFunc(this,'colsSorter:getPopup');
        
        Component.inputValidate.call(checkboxes);
        
        checkboxes.on('validate:invalid',function() {
            triggerEvent(popup,'popup:invalid');
        })
        .on('validate:valid',function() {
            triggerEvent(popup,'popup:valid');
        });
    };
    
    // bindColsButton
    const bindColsButton = function() {
        const $this = $(this);
        const button = triggerFunc(this,'colsSorter:getButton');
        
        Component.BlockEvent.call(button,'click');
        
        button.on('click',function(event) {
            redirect.call(this,event);
        });
        
        const redirect = function(clickEvent) {
            const set = triggerFunc($this,'colsSorter:getCheckedSet');
            const href = Dom.dataHrefReplaceChar(this,set);
            
            if(Str.isNotEmpty(href) && href !== Request.relative())
            {
                triggerEvent(this,'block');
                triggerEvent(document,'doc:go',href,clickEvent);
            }
        }
    };
        
    return this;
}