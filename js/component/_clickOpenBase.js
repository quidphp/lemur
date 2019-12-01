/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenBase
// gère les comportements basique pour un élément clickOpen
Component.clickOpenBase = function(target)
{
    Component.keyboardEscape.call(this,true);
    
    $(this).on('clickOpen:isInit', function(event) {
        return ($(this).data('clickOpen:init') === true)? true:false;
    })
    .on('clickOpen:isOpen', function(event) {
        return $(this).hasClass("active");
    })
    .on('clickOpen:isClose', function(event) {
        return (!triggerFunc(this,'clickOpen:isOpen'))? true:false;
    })
    .on('clickOpen:isEmpty', function(event) {
        return triggerFunc(this,'clickOpen:getTarget').is(":empty");
    })
    .on('clickOpen:getTarget', function(event) {
        let r = target;
        
        if(r == null)
        r = '.popup';
        
        else if(r == true)
        r = $(this);
        
        if(Str.isNotEmpty(r))
        r = $(this).find(r).first();
        
        return r;
    })
    .on('clickOpen:getAttr', function(event) {
        return 'data-click-open';
    })
    .on('clickOpen:allowMultiple', function(event) {
        return false;
    })
    .on('clickOpen:getBackgroundFrom', function(event) {
        return 'clickOpen';
    })
    .on('clickOpen:getParentContainer', function(event) {
        const attr = triggerFunc(this,'clickOpen:getAttr');
        let r = $(this).parents("["+attr+"='1']").first();
        r = (!r.length)? $(document):r;
        return r;
    })
    .on('clickOpen:getAll', function(event) {
        const attr = triggerFunc(this,'clickOpen:getAttr');
        return triggerFunc(this,'clickOpen:getParentContainer').find("["+attr+"='1']");
    })
    .on('escape:prevent', function(event) {
        return (triggerFunc(this,'clickOpen:isOpen'))? true:false;
    })
    .on('escape:blocked', function(event) {
        event.stopPropagation();
        triggerCustom(this,'clickOpen:close');
    })
    .on('clickOpen:setTargetContent', function(event,data) {
        event.stopPropagation();
        triggerFunc(this,'clickOpen:getTarget').html(data);
    })
    .on('clickOpen:unsetTargetContent', function(event) {
        event.stopPropagation();
        triggerFunc(this,'clickOpen:getTarget').html('');
    })
    .on('clickOpen:toggle', function(event) {
        event.stopPropagation();
        const isOpen = triggerFunc(this,'clickOpen:isOpen');
        triggerCustom(this,((isOpen === false))? 'clickOpen:open':'clickOpen:close');
    })
    .on('clickOpen:open', function(event) {
        event.stopPropagation();
        if(!triggerFunc(this,'clickOpen:allowMultiple'))
        triggerCustom(this,'clickOpen:closeOthers');
        
        if(triggerFunc(this,'clickOpen:isOpen') !== true)
        {
            if(triggerFunc(this,'clickOpen:isInit') !== true)
            {
                triggerFunc(this,'clickOpen:firstOpen');
                $(this).data('clickOpen:init',true);
            }
            
            const attr = triggerFunc(this,'clickOpen:getAttr');
            $(this).addClass('active');
            $(this).attr(attr,1);
            triggerCustom(this,'clickOpen:opened');
            
            triggerCustom(this,'clickOpen:focus');
        }
        
        const bgFrom = triggerFunc(this,'clickOpen:getBackgroundFrom');
        $(document).trigger('document:setBackground',[bgFrom,false]);
    })
    .on('clickOpen:close', function(event) {
        event.stopPropagation();
        if(triggerFunc(this,'clickOpen:isOpen') === true)
        {
            const attr = triggerFunc(this,'clickOpen:getAttr');
            $(this).removeClass('active');
            $(this).removeAttr(attr);
            
            $(document).trigger('document:unsetBackground',[triggerFunc(this,'clickOpen:getBackgroundFrom')]);
        }
    })
    .on('clickOpen:closeOthers', function(event) {
        event.stopPropagation();
        triggerFunc(this,'clickOpen:getAll').not($(this)).trigger('clickOpen:close');
    })
    .on('clickOpen:closeAll', function(event) {
        event.stopPropagation();
        triggerFunc(this,'clickOpen:getAll').trigger('clickOpen:close');
    })
    .on('clickOpen:focus', function(event) {
        event.stopPropagation();
        const container = triggerFunc(this,'clickOpen:getTarget');
        if(container.is('[tabindex]'))
        container.focus();
    });
    
    return this;
}