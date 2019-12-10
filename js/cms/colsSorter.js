/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// colsSorter
// script for the col sorter component of the general page of the CMS
const ColsSorter = Component.ColsSorter = function(option)
{
    // option
    const $option = Pojo.replaceRecursive({
        clickOpen: {
            trigger: ".trigger",
            target: ".popup"
        },
        sorter: {
            items: ".choice",
            handle: '.choice-in'
        }
    },option);
    
    
    // component
    Component.ClickOpenTrigger.call(this,$option.clickOpen);
    
    
    // func
    setFunc(this,'colsSorter:getCheckboxes',function() {
        return qsa(this,"input[type='checkbox']");
    });
    
    setFunc(this,'colsSorter:getCheckedCheckboxes',function() {
        return Arr.filter(triggerFunc(this,'colsSorter:getCheckboxes'),function() {
            return $(this).is(':checked');
        });
    });
    
    setFunc(this,'colsSorter:getButton',function() {
        return qs(triggerFunc(this,'clickOpen:getTarget'),"button[name='cols']");
    });
    
    setFunc(this,'colsSorter:isValid',function() {
        const checkboxes = triggerFunc(this,'colsSorter:getCheckboxes');
        return triggerFuncEqual(checkboxes,true,'validate:isValid');
    });
    
    setFunc(this,'colsSorter:getCheckedSet',function() {
        const button = triggerFunc(this,'colsSorter:getButton');
        const checkbox = triggerFunc(this,'colsSorter:getCheckedCheckboxes');
        
        return Dom.valueSeparator(checkbox,$(button).data('separator'),true);
    });
    
    setFunc(this,'colsSorter:isCurrent',function() {
        const button = triggerFunc(this,'colsSorter:getButton');
        const set = triggerFunc(this,'colsSorter:getCheckedSet');
        
        return (set === $(button).data('current'))? true:false;
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindColsPopup.call(this);
        bindColsCheckboxes.call(this);
        bindColsButton.call(this);
    });
    
    
    // bindColsPopup
    const bindColsPopup = function() 
    {
        const $this = this;
        const popup = triggerFunc(this,'clickOpen:getTarget');
        
        triggerSetup(Component.Sorter.call(popup,$option.sorter));
        
        // func
        setFunc(popup,'verticalSorter:stop',function() {
            triggerFunc(this,'popup:refresh');
        });
        
        setFunc(popup,'popup:refresh',function() {
            const checkboxes = triggerFunc($this,'colsSorter:getCheckboxes');
            triggerFuncs(checkboxes,'validate:trigger');
        });
        
        setFunc(popup,'popup:invalid',function() {
            $(this).attr('data-validate','invalid');
        });
        
        setFunc(popup,'popup:valid',function() {
            if(triggerFunc($this,'colsSorter:isCurrent'))
            $(this).removeAttr("data-validate");
            else
            $(this).attr('data-validate','valid');
        });
    }
    
    
    // bindColsCheckboxes
    const bindColsCheckboxes = function() 
    {
        const checkboxes = triggerFunc(this,'colsSorter:getCheckboxes');
        const popup = triggerFunc(this,'clickOpen:getTarget');
        
        triggerSetup(checkboxes);
        
        ael(checkboxes,'validate:invalid',function() {
            triggerFunc(popup,'popup:invalid');
        });
        
        ael(checkboxes,'validate:valid',function() {
            triggerFunc(popup,'popup:valid');
        });
    }
    
    
    // bindColsButton
    const bindColsButton = function() 
    {
        const $this = this;
        const button = triggerFunc(this,'colsSorter:getButton');
        
        // func
        setFunc(button,'button:redirect',function(clickEvent) {
            const set = triggerFunc($this,'colsSorter:getCheckedSet');
            const href = Dom.dataHrefReplaceChar(this,set);
            
            if(Str.isNotEmpty(href) && href !== Request.relative())
            triggerFunc(document,'doc:go',href,clickEvent);
        });
        
        // event
        ael(button,'click',function(event) {
            triggerFunc(this,'button:redirect',event);
        });
    }

    return this;
}