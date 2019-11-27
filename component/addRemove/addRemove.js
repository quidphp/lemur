"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// addRemove
// script of behaviours for an add-remove input component
quid.component.addRemove = function()
{
    // trigger handler
    $(this).on('addRemove:getInsert', function() {
        return $(this).find(".insert");
    })
    .on('addRemove:getPlayground', function() {
        return $(this).find(".playground").first();
    })
    .on('addRemove:getCount', function() {
        return $(this).triggerHandler('addRemove:getAll').length;
    })
    .on('addRemove:getAll', function() {
        return $(this).triggerHandler('addRemove:getPlayground').find(".ele");
    })
    .on('addRemove:getIndex', function(event,index) {
        return $(this).triggerHandler('addRemove:getAll').eq(index);
    })
    .on('addRemove:getLast', function() {
        return $(this).triggerHandler('addRemove:getAll').last()
    })
    .on('addRemove:findIndex', function(event,element) {
        var all = $(this).triggerHandler('addRemove:getAll');
        return all.index(element);
    })
    
    // trigger
    .on('addRemove:insert', function() {
        var insert = $(this).triggerHandler('addRemove:getInsert');
        var container = $(this).triggerHandler('addRemove:getPlayground');
        var html = insert.data('html');
        
        if(quid.base.str.isNotEmpty(html))
        {
            container.append(html);
            var inserted = $(this).triggerHandler('addRemove:getLast');
            bindElement.call(this,inserted);
            $(this).trigger('addRemove:inserted',[inserted]);
        }
    })
    .on('addRemove:remove', function(event,index) {
        if(quid.base.number.is(index))
        {
            var ele = $(this).triggerHandler('addRemove:getIndex',[index]);
            ele.remove();
            
            if(!$(this).triggerHandler('addRemove:getCount'))
            $(this).trigger('addRemove:insert');
        }
    })
    
    // component setup
    .one('component:setup', function() {
        var $this = $(this);
        bindInsert.call(this);
        bindSorter.call(this);
        
        $(this).triggerHandler('addRemove:getAll').each(function() {
            bindElement.call($this,$(this));
        });
    });
    
    // bindInsert
    var bindInsert = function() {
        var $this = $(this);
        var insert = $(this).triggerHandler('addRemove:getInsert');
        
        insert.on('click', function() {
            $this.trigger('addRemove:insert');
        });
    };
    
    // bindSorter
    var bindSorter = function() {
        var move = $(this).find(".move");
        var playground = $(this).triggerHandler('addRemove:getPlayground');
        
        if(move.length)
        quid.core.verticalSorter.call(playground,'.ele','.move');
    };
    
    // bindElement
    var bindElement = function(element) {
        var $this = $(this);
        var remove = element.find(".remove");
        quid.main.window.confirm.call(remove,'click');
        
        remove.on('confirmed', function() {
            var index = $this.triggerHandler('addRemove:findIndex',[element]);
            $this.trigger('addRemove:remove',[index]);
        });
    };
    
    return this;
}