/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tab
// script with behaviours for a tab component
Component.tab = function()
{
    $(this).on('tab:getIndex', function(event,value,loop) {
        const current = triggerFunc(this,'tab:getCurrent');
        const target = triggerFunc(this,'tab:getTarget');
        
        if(Dom.is(value))
        value = target.index(value);
        
        const max = target.length;
        
        return Nav.index(value,current,max,loop);
    })
    .on('tab:indexer', function(event,value,loop) {
        const index = triggerFunc(this,'tab:getIndex',[value,loop]);
        if(Num.is(index))
        triggerCustom(this,'tab:change',[index]);
    })
    .on('tab:first', function() {
        triggerCustom(this,'tab:indexer',['first']);
    })
    .on('tab:prev', function() {
        triggerCustom(this,'tab:indexer',['prev']);
    })
    .on('tab:next', function() {
        triggerCustom(this,'tab:indexer',['next']);
    })
    .on('tab:last', function() {
        triggerCustom(this,'tab:indexer',['last']);
    })
    .on('tab:index', function(event,index) {
        triggerCustom(this,'tab:indexer',['index']);
    })
    .on('tab:loopNext', function(event) {
        triggerCustom(this,'tab:indexer',['next',true]);
    })
    .on('tab:loopPrev', function(event) {
        triggerCustom(this,'tab:indexer',['prev',true]);
    })
    .on('tab:target', function(event,target) {
        triggerCustom(this,'tab:indexer',[target]);
    })
    .on('tab:getCurrent', function() {
        return $(this).data('tab-current');
    })
    .on('tab:isCurrent', function(event,value) {
        const current = triggerFunc(this,'tab:getCurrent');
        const index = (Num.is(value))? value:triggerFunc(this,'tab:getTarget').index(value);
        return (Num.is(current) && index === current)? true:false;
    })
    .on('tab:closeAll', function() {
        const target = triggerFunc(this,'tab:getTarget');
        $(this).data('tab-current',null);
        target.each(function(index) {
            triggerCustom(this,'tab:close');
        });
    })
    .on('tab:change', function(event,index) {
        const target = triggerFunc(this,'tab:getTarget');
        const current = triggerFunc(this,'tab:getCurrent');
        
        if(target.length && Num.is(index))
        {
            if(index !== current)
            {
                const indexTarget = target.eq(index);
                const currentTarget = (Num.is(current))? target.eq(current):null;
                
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
                triggerCustom(this,'tab:notExist');
            }
            
            else
            triggerCustom(this,'tab:noChange');
        }
    })
    .on('tab:changeOrFirst', function(event,target) {
        if(target != null && target.length === 1)
        target.trigger('tab:change');
        else
        triggerCustom(this,'tab:first');
    })
    .on('tab:prepare', function() {
        const tab = $(this);
        const target = triggerFunc(this,'tab:getTarget');
        
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
            const index = triggerFunc(this,'tab:getIndex');
            tab.data('tab-current',index);
        });
    }).trigger('tab:prepare');
    
    return this;
}