/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// searchSlide
// component with a search input, and an info box that slides on focus
const SearchSlide = Component.SearchSlide = function(option) 
{
    // option
    const $option = Pojo.replaceRecursive({
        inputTarget: "> input[type='text']",
        infoTarget: '> div',
        inputSearch: {},
        speed: 300
    },option);
    
    
    // func
    setFunc(this,'searchSlide:getInput',function() {
        return qs(this,$option.inputTarget);
    });
    
    setFunc(this,'searchSlide:getInfo',function() {
        return qs(this,$option.infoTarget);
    });
    
    setFunc(this,'searchSlide:showInfo',function() {
        const info = triggerFunc(this,'searchSlide:getInfo');
        $(info).stop(true,true).slideDown($option.speed);
    });
    
    setFunc(this,'searchSlide:hideInfo',function() {
        const info = triggerFunc(this,'searchSlide:getInfo');
        $(info).stop(true,true).slideUp($option.speed);
    });
    

    // setup
    aelOnce(this,'component:setup',function() {
        bindInput.call(this);
    });
    
    
    // init
    aelOnce(this,'component:init',function() {
        const input = triggerFunc(this,'searchSlide:getInput');
        Component.InputSearch.call(input,$option.inputSearch);
    });
    
    
    // bindInput
    const bindInput = function()
    {
        const $this = this;
        const input = triggerFunc(this,'searchSlide:getInput');
        
        // event
        ael(input,'focus',function() {
            triggerFunc($this,'searchSlide:showInfo');
        });
        
        ael(input,'focusout',function() {
            triggerFunc($this,'searchSlide:hideInfo');
        });
    }
    
    return triggerInit(this);
}