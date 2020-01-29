/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// searchSlide
// component with a search input, and an info box that slides on focus
Component.SearchSlide = function(option) 
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replaceRecursive({
        background: false,
        targetHeight: true,
        transitionTimeout: 300,
        triggerToggle: false,
        triggerFocusClose: false,
        inputSearch: {
            timeoutHandler: 'inputSearch:validate'
        },
    },option);
    
    
    // component
    Component.ClickOpenTrigger.call(this,$option)
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindInput.call(this);
    });
    
    
    // bindInput
    const bindInput = function()
    {
        const $this = this;
        const input = trigHdlr(this,'clickOpen:getTrigger');
        Component.InputSearchHref.call(input,$option.inputSearch);
        
        // handler
        setHdlr(input,'inputSearch:getButton',function() {
            const parent = Nod.parent(this);
            return Nod.next(parent,"button[type='button']");
        });
        
        // event
        ael(input,'focus',function() {
            trigHdlr($this,'clickOpen:open');
        });
        
        ael(input,'focusout',function() {
            trigHdlr($this,'clickOpen:close');
        });
        
        trigSetup(input);
    }
    
    return this;
}