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
    
    
    // handler
    setHandler(this,'colsSorter:getCheckboxes',function() {
        return qsa(this,"input[type='checkbox']");
    });
    
    setHandler(this,'colsSorter:getCheckedCheckboxes',function() {
        return Arr.filter(trigHandler(this,'colsSorter:getCheckboxes'),function() {
            return $(this).is(':checked');
        });
    });
    
    setHandler(this,'colsSorter:getButton',function() {
        return qs(trigHandler(this,'clickOpen:getTarget'),"button[name='cols']");
    });
    
    setHandler(this,'colsSorter:getCheckedSet',function() {
        const button = trigHandler(this,'colsSorter:getButton');
        const checkbox = trigHandler(this,'colsSorter:getCheckedCheckboxes');
        
        return Dom.valueSeparator(checkbox,$(button).data('separator'),true);
    });
    
    setHandler(this,'colsSorter:isCurrent',function() {
        const button = trigHandler(this,'colsSorter:getButton');
        const set = trigHandler(this,'colsSorter:getCheckedSet');
        
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
        const popup = trigHandler(this,'clickOpen:getTarget');
        
        trigSetup(Component.Sorter.call(popup,$option.sorter));
        
        // handler
        setHandler(popup,'verticalSorter:stop',function() {
            trigHandler(this,'popup:refresh');
        });
        
        setHandler(popup,'popup:refresh',function() {
            const checkboxes = trigHandler($this,'colsSorter:getCheckboxes');
            trigHandlers(checkboxes,'validate:trigger');
        });
        
        setHandler(popup,'popup:invalid',function() {
            $(this).attr('data-validate','invalid');
        });
        
        setHandler(popup,'popup:valid',function() {
            if(trigHandler($this,'colsSorter:isCurrent'))
            $(this).removeAttr("data-validate");
            else
            $(this).attr('data-validate','valid');
        });
    }
    
    
    // bindColsCheckboxes
    const bindColsCheckboxes = function() 
    {
        const checkboxes = trigHandler(this,'colsSorter:getCheckboxes');
        const popup = trigHandler(this,'clickOpen:getTarget');
        
        trigSetup(checkboxes);
        
        ael(checkboxes,'validate:invalid',function() {
            trigHandler(popup,'popup:invalid');
        });
        
        ael(checkboxes,'validate:valid',function() {
            trigHandler(popup,'popup:valid');
        });
    }
    
    
    // bindColsButton
    const bindColsButton = function() 
    {
        const $this = this;
        const button = trigHandler(this,'colsSorter:getButton');
        
        // handler
        setHandler(button,'button:redirect',function(clickEvent) {
            const set = trigHandler($this,'colsSorter:getCheckedSet');
            const href = Dom.dataHrefReplaceChar(this,set);
            
            if(Str.isNotEmpty(href) && href !== Request.relative())
            trigHandler(document,'doc:go',href,clickEvent);
        });
        
        // event
        ael(button,'click',function(event) {
            trigHandler(this,'button:redirect',event);
        });
    }

    return this;
}