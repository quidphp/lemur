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
        inputTarget: "> input[type='text']",
        infoTarget: '> div',
        inputSearch: {
            timeoutHandler: 'inputSearch:validate'
        },
        speed: 300
    },option);
    
    
    // handler
    setHdlrs(this,'searchSlide:',{
        getInput: function() {
            return qs(this,$option.inputTarget);
        },
        
        getInfo: function() {
            return qs(this,$option.infoTarget);
        },
        
        showInfo: function() {
            const info = trigHdlr(this,'searchSlide:getInfo');
            $(info).stop(true,true).slideDown($option.speed);
        },
        
        hideInfo: function() {
            const info = trigHdlr(this,'searchSlide:getInfo');
            $(info).stop(true,true).slideUp($option.speed);
        }
    });
    

    // setup
    aelOnce(this,'component:setup',function() {
        bindInput.call(this);
    });
    
    
    // bindInput
    const bindInput = function()
    {
        const $this = this;
        const input = trigHdlr(this,'searchSlide:getInput');
        
        Component.InputSearchHref.call(input,$option.inputSearch);
        
        // handler
        setHdlr(input,'inputSearch:getButton',function() {
            return $(this).parent().next("button[type='button']").get(0);
        });
        
        // event
        ael(input,'focus',function() {
            trigHdlr($this,'searchSlide:showInfo');
        });
        
        ael(input,'focusout',function() {
            trigHdlr($this,'searchSlide:hideInfo');
        });
        
        trigSetup(input);
    }
    
    return this;
}