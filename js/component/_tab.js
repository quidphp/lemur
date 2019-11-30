/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tab
// script with behaviours for a tab component
Quid.Component.tab = function()
{
    $(this).on('tab:getIndex', function(event,value,loop) {
        var current = $(this).triggerHandler('tab:getCurrent');
        var target = $(this).triggerHandler('tab:getTarget');
        
        if(Quid.Node.isLike(value))
        value = target.index(value);
        
        var max = target.length;
        
        return Quid.Nav.index(value,current,max,loop);
    })
    .on('tab:indexer', function(event,value,loop) {
        var index = $(this).triggerHandler('tab:getIndex',[value,loop]);
        if(Quid.Number.is(index))
        $(this).trigger('tab:change',[index]);
    })
    .on('tab:first', function() {
        $(this).trigger('tab:indexer',['first']);
    })
    .on('tab:prev', function() {
        $(this).trigger('tab:indexer',['prev']);
    })
    .on('tab:next', function() {
        $(this).trigger('tab:indexer',['next']);
    })
    .on('tab:last', function() {
        $(this).trigger('tab:indexer',['last']);
    })
    .on('tab:index', function(event,index) {
        $(this).trigger('tab:indexer',['index']);
    })
    .on('tab:loopNext', function(event) {
        $(this).trigger('tab:indexer',['next',true]);
    })
    .on('tab:loopPrev', function(event) {
        $(this).trigger('tab:indexer',['prev',true]);
    })
    .on('tab:target', function(event,target) {
        $(this).trigger('tab:indexer',[target]);
    })
    .on('tab:getCurrent', function() {
        return $(this).data('tab-current');
    })
    .on('tab:isCurrent', function(event,value) {
        var current = $(this).triggerHandler('tab:getCurrent');
        var index = (Quid.Number.is(value))? value:$(this).triggerHandler('tab:getTarget').index(value);
        return (Quid.Number.is(current) && index === current)? true:false;
    })
    .on('tab:closeAll', function() {
        var target = $(this).triggerHandler('tab:getTarget');
        $(this).data('tab-current',null);
        target.each(function(index) {
            $(this).trigger('tab:close');
        });
    })
    .on('tab:change', function(event,index) {
        var target = $(this).triggerHandler('tab:getTarget');
        var current = $(this).triggerHandler('tab:getCurrent');
        
        if(target.length && Quid.Number.is(index))
        {
            if(index !== current)
            {
                var indexTarget = target.eq(index);
                var currentTarget = (Quid.Number.is(current))? target.eq(current):null;
                
                if(indexTarget.length)
                {
                    if(currentTarget != null)
                    currentTarget.trigger('tab:close');
                    
                    $(this).data('tab-current',index);
                    indexTarget.trigger('tab:open');
                    
                    if(indexTarget.data('tab-init') == null)
                    {
                        indexTarget.data('tab-init',true);
                        indexTarget.trigger('tab:init');
                    }
                }
                
                else
                $(this).trigger('tab:notExist');
            }
            
            else
            $(this).trigger('tab:noChange');
        }
    })
    .on('tab:changeOrFirst', function(event,target) {
        if(target != null && target.length === 1)
        target.trigger('tab:change');
        else
        $(this).trigger('tab:first');
    })
    .on('tab:prepare', function() {
        var tab = $(this);
        var target = $(this).triggerHandler('tab:getTarget');
        
        target.on('tab:getIndex', function() {
            return target.index($(this));
        })
        .on('tab:getTarget', function() {
            return target;
        })
        .on('tab:getCurrent', function() {
            return tab.triggerHandler('tab:getCurrent');
        })
        .on('tab:get', function() {
            return tab;
        })
        .on('tab:change', function() {
            tab.trigger('tab:target',[$(this)]);
        })
        .on('tab:open', function() {
            var index = $(this).triggerHandler('tab:getIndex');
            tab.data('tab-current',index);
        });
    }).trigger('tab:prepare');
    
    return this;
}