/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenBase
// gère les comportements basique pour un élément clickOpen
Quid.Component.clickOpenBase = function(target)
{
    Quid.Component.keyboardEscape.call(this,true);
    
    $(this).on('clickOpen:isInit', function(event) {
        return ($(this).data('clickOpen:init') === true)? true:false;
    })
    .on('clickOpen:isOpen', function(event) {
        return $(this).hasClass("active");
    })
    .on('clickOpen:isClose', function(event) {
        return (!$(this).triggerHandler('clickOpen:isOpen'))? true:false;
    })
    .on('clickOpen:isEmpty', function(event) {
        return $(this).triggerHandler('clickOpen:getTarget').is(":empty");
    })
    .on('clickOpen:getTarget', function(event) {
        var r = target;
        
        if(r == null)
        r = '.popup';
        
        else if(r == true)
        r = $(this);
        
        if(Quid.Str.isNotEmpty(r))
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
        var attr = $(this).triggerHandler('clickOpen:getAttr');
        var r = $(this).parents("["+attr+"='1']").first();
        r = (!r.length)? $(document):r;
        return r;
    })
    .on('clickOpen:getAll', function(event) {
        var attr = $(this).triggerHandler('clickOpen:getAttr');
        return $(this).triggerHandler('clickOpen:getParentContainer').find("["+attr+"='1']");
    })
    .on('escape:prevent', function(event) {
        return ($(this).triggerHandler('clickOpen:isOpen'))? true:false;
    })
    .on('escape:blocked', function(event) {
        event.stopPropagation();
        $(this).trigger('clickOpen:close');
    })
    .on('clickOpen:setTargetContent', function(event,data) {
        event.stopPropagation();
        $(this).triggerHandler('clickOpen:getTarget').html(data);
    })
    .on('clickOpen:unsetTargetContent', function(event) {
        event.stopPropagation();
        $(this).triggerHandler('clickOpen:getTarget').html('');
    })
    .on('clickOpen:toggle', function(event) {
        event.stopPropagation();
        var isOpen = $(this).triggerHandler('clickOpen:isOpen');
        $(this).trigger(((isOpen === false))? 'clickOpen:open':'clickOpen:close');
    })
    .on('clickOpen:open', function(event) {
        event.stopPropagation();
        if(!$(this).triggerHandler('clickOpen:allowMultiple'))
        $(this).trigger('clickOpen:closeOthers');
        
        if($(this).triggerHandler('clickOpen:isOpen') !== true)
        {
            if($(this).triggerHandler('clickOpen:isInit') !== true)
            {
                $(this).triggerHandler('clickOpen:firstOpen');
                $(this).data('clickOpen:init',true);
            }
            
            var attr = $(this).triggerHandler('clickOpen:getAttr');
            $(this).addClass('active');
            $(this).attr(attr,1);
            $(this).trigger('clickOpen:opened');
            
            $(this).trigger('clickOpen:focus');
        }
        
        var bgFrom = $(this).triggerHandler('clickOpen:getBackgroundFrom');
        $(document).trigger('document:setBackground',[bgFrom,false]);
    })
    .on('clickOpen:close', function(event) {
        event.stopPropagation();
        if($(this).triggerHandler('clickOpen:isOpen') === true)
        {
            var attr = $(this).triggerHandler('clickOpen:getAttr');
            $(this).removeClass('active');
            $(this).removeAttr(attr);
            
            $(document).trigger('document:unsetBackground',[$(this).triggerHandler('clickOpen:getBackgroundFrom')]);
        }
    })
    .on('clickOpen:closeOthers', function(event) {
        event.stopPropagation();
        $(this).triggerHandler('clickOpen:getAll').not($(this)).trigger('clickOpen:close');
    })
    .on('clickOpen:closeAll', function(event) {
        event.stopPropagation();
        $(this).triggerHandler('clickOpen:getAll').trigger('clickOpen:close');
    })
    .on('clickOpen:focus', function(event) {
        event.stopPropagation();
        var container = $(this).triggerHandler('clickOpen:getTarget');
        if(container.is('[tabindex]'))
        container.focus();
    });
    
    return this;
}