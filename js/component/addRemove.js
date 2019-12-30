/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// addRemove
// script of behaviours for an add-remove input component
Component.AddRemove = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // components
    Component.Base.call(this);
    
    
    // option
    const $option = Pojo.replace({
        insert: '.insert',
        playground: '.playground',
        draggable: ".ele",
        handle: ".move"
    },option);
    
    
    // handler
    setHdlrs(this,'addRemove:',{
        getInsert: function() {
            return qs(this,$option.insert);
        },
        
        getInsertHtml: function() {
            const insert = trigHdlr(this,'addRemove:getInsert');
            return getAttr(insert,'data-html');
        },
        
        getPlayground: function() {
            return qs(this,$option.playground);
        },
        
        getItems: function() {
            return qsa(trigHdlr(this,'addRemove:getPlayground'),".ele");
        },
        
        length: function() {
            return Arr.length(trigHdlr(this,'addRemove:getItems'));
        },
        
        getIndex: function(index) {
            return Arr.get(index,trigHdlr(this,'addRemove:getItems'));
        },
        
        getLast: function() {
            return Arr.valueLast(trigHdlr(this,'addRemove:getItems'));
        },
        
        insert: function() {
            const html = trigHdlr(this,'addRemove:getInsertHtml');
            
            if(Str.isNotEmpty(html))
            {
                const playground = trigHdlr(this,'addRemove:getPlayground');
                Ele.append(playground,html);
                
                const inserted = trigHdlr(this,'addRemove:getLast');
                bindElement.call(this,inserted);
                trigEvt(this,'addRemove:inserted',inserted);
            }
        },
        
        remove: function(index) {
            let removed = index;
            
            if(Integer.is(removed))
            removed = trigHdlr(this,'addRemove:getIndex',removed);
            
            trigEvt(this,'addRemove:removed',removed);
            Ele.remove(removed);
            
            if(!trigHdlr(this,'addRemove:length'))
            trigHdlr(this,'addRemove:insert');
        }
    });
    
    
    // event
    ael(this,'addRemove:inserted',function(event,element) {
        trigHdlr(document,'doc:mountNodeCommon',element);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        const $this = this;
        const items = trigHdlr(this,'addRemove:getItems');
        bindInsert.call(this);
        bindSorter.call(this);
        
        Arr.each(items,function() {
            bindElement.call($this,this);
        });
    });
    
    
    // bindInsert
    const bindInsert = function() 
    {
        const $this = this;
        const insert = trigHdlr(this,'addRemove:getInsert');
        
        ael(insert,'click',function() {
            trigHdlr($this,'addRemove:insert');
        });
    }
    
    
    // bindSorter
    const bindSorter = function() 
    {
        const playground = trigHdlr(this,'addRemove:getPlayground');
        Component.Sorter.call(playground,{draggable: $option.draggable, handle: $option.handle});
        trigSetup(playground);
    }
    
    
    // bindElement
    const bindElement = function(element) 
    {
        const $this = this;
        
        // handler
        setHdlrs(element,'addRemoveEle:',{
            
            getRemove: function() {
                return qs(this,'.remove');
            },
            
            getIndex: function() {
                const items = trigHdlr(this,'addRemove:getItems');
                return Arr.search(this,items);
            },
            
            getParent: function() {
                return $this;
            }
        });
        
        // setup
        aelOnce(element,'component:setup',function() {
            const remove = trigHdlr(this,'addRemoveEle:getRemove');
            
            Component.Confirm.call(remove,'click');
            
            ael(remove,'confirm:yes',function() {
                trigHdlr($this,'addRemove:remove',element);
            });
        });
        
        trigSetup(element);
    }
    
    return this;
}