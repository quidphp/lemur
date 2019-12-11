/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// addRemove
// script of behaviours for an add-remove input component
Component.addRemove = function()
{
    // trigger handler
    $(this).on('addRemove:getInsert',function() {
        return $(this).find(".insert");
    })
    .on('addRemove:getPlayground',function() {
        return $(this).find(".playground").get(0);
    })
    .on('addRemove:getCount',function() {
        return trigHandler(this,'addRemove:getAll').length;
    })
    .on('addRemove:getAll',function() {
        return trigHandler(this,'addRemove:getPlayground').find(".ele");
    })
    .on('addRemove:getIndex',function(event,index) {
        return trigHandler(this,'addRemove:getAll').eq(index);
    })
    .on('addRemove:getLast',function() {
        return trigHandler(this,'addRemove:getAll').last()
    })
    .on('addRemove:findIndex',function(event,element) {
        const all = trigHandler(this,'addRemove:getAll');
        return all.index(element);
    })
    
    // trigger
    .on('addRemove:insert',function() {
        const insert = trigHandler(this,'addRemove:getInsert');
        const container = trigHandler(this,'addRemove:getPlayground');
        const html = insert.data('html');
        
        if(Str.isNotEmpty(html))
        {
            container.append(html);
            const inserted = trigHandler(this,'addRemove:getLast');
            bindElement.call(this,inserted);
            trigEvt(this,'addRemove:inserted',inserted);
        }
    })
    .on('addRemove:remove',function(event,index) {
        if(Num.is(index))
        {
            const ele = trigHandler(this,'addRemove:getIndex',index);
            ele.remove();
            
            if(!trigHandler(this,'addRemove:getCount'))
            trigEvt(this,'addRemove:insert');
        }
    })
    
    // component setup
    .one('component:setup',function() {
        const $this = $(this);
        bindInsert.call(this);
        bindSorter.call(this);
        
        trigHandler(this,'addRemove:getAll').each(function() {
            bindElement.call($this,$(this));
        });
    });
    
    // bindInsert
    const bindInsert = function() {
        const $this = $(this);
        const insert = trigHandler(this,'addRemove:getInsert');
        
        insert.on('click',function() {
            trigEvt($this,'addRemove:insert');
        });
    };
    
    // bindSorter
    const bindSorter = function() {
        const move = $(this).find(".move");
        const playground = trigHandler(this,'addRemove:getPlayground');
        
        if(move.length)
        Component.verticalSorter.call(playground,'.ele','.move');
    };
    
    // bindElement
    const bindElement = function(element) {
        const $this = $(this);
        const remove = element.find(".remove");
        Component.confirm.call(remove,'click');
        
        remove.on('confirmed',function() {
            const index = $this.trigHandler('addRemove:findIndex',[element]);
            trigEvt($this,'addRemove:remove',[index]);
        });
    };
    
    return this;
}