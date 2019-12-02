/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// accordion
// script of behaviours for an accordion component
Component.accordion = function(until,closeAll,wrap)
{	
    const $this = $(this);
    
    $(this).on('click',function(event) {
        if(closeAll === true)
        $this.trigger('accordion:close');
        
        if(triggerFunc(this,'accordion:isOpen'))
        triggerCustom(this,'accordion:close');
        
        else
        triggerCustom(this,'accordion:open');
    })
    .on('accordion:getContents',function(event) {
        return $(this).nextUntil(until);
    })
    .on('accordion:getActiveClass',function(event) {
        return 'active';
    })
    .on('accordion:getOpenClass',function(event) {
        return 'open';
    })
    .on('accordion:isOpen',function(event) {
        const openClass = triggerFunc(this,'accordion:getOpenClass');
        return $(this).hasClass(openClass);
    })
    .on('accordion:close',function(event) {
        const openClass = triggerFunc(this,'accordion:getOpenClass');
        const activeClass = triggerFunc(this,'accordion:getActiveClass');
        $(this).removeClass(openClass).removeClass(activeClass);
        triggerFunc(this,'accordion:getContents').removeClass(activeClass);
        
        if(Str.isNotEmpty(wrap))
        $(this).parent().removeClass(openClass);
    })
    .on('accordion:open',function(event) {
        const openClass = triggerFunc(this,'accordion:getOpenClass');
        const activeClass = triggerFunc(this,'accordion:getActiveClass');
        $(this).addClass(openClass).addClass(activeClass);
        triggerFunc(this,'accordion:getContents').addClass(activeClass);
        
        if(Str.isNotEmpty(wrap))
        $(this).parent().addClass(openClass);
    });
    
    if(Str.isNotEmpty(wrap))
    {
        const html = "<div class='"+wrap+"'></div>";
        DomChange.wrapConsecutiveSiblings(this,until,html);
    }
    
    return this;
}