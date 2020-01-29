/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// calendar
// script for the calendar component
Component.Calendar = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        ajaxEvent: 'ajax:init'
    },option);
    
    
    // components
    Component.AjaxBlock.call(this,$option);
    Component.HrefReplaceChar.call(this);
    Component.Focusable.call(this);
    
    
    // handler
    setHdlrs(this,'calendar:',{
        
        isEmpty: function() {
            return Ele.isEmpty(this);
        },
        
        getHead: function() {
            return qs(this,'.head');
        },
                
        getCells: function() {
            return qsa(this,".body td");
        },
        
        getButtons: function() {
            return qsa(this,".body td button");
        },
        
        getSelecteds: function() {
            return Arr.filter(trigHdlr(this,'calendar:getCells'),function() {
                return Nod.match(this,".selected");
            });
        },
        
        getSelected: function() {
            const selecteds = trigHdlr(this,'calendar:getSelecteds');
            return Arr.valueFirst(selecteds);
        },
        
        getSelectedButton: function() {
            const selected = trigHdlr(this,'calendar:getSelected');
            
            if(selected != null)
            return qs(selected,'button');
        },
        
        getCurrent: function() {
            return getAttr(this,'data-current');
        },
        
        getFormat: function() {
            return getAttr(this,'data-format');
        },
        
        removeSelected: function() {
            const selected = trigHdlr(this,'calendar:getSelecteds');
            toggleClass(selected,'selected',false);
        },
        
        findCell: function(value,onlyIn) {
            let r = undefined;
            const tds = trigHdlr(this,'calendar:getCells');
            const format = trigHdlr(this,'calendar:getFormat');
            value = prepareValue.call(this,value);
            
            if(Num.is(value))
            {
                r = Arr.find(tds,function() {
                    return Ele.match(this,"[data-timestamp='"+value+"']");
                });
            }
            
            else if(Str.isNotEmpty(value) && value.length == Str.length(format))
            {
                r = Arr.find(tds,function() {
                    return Ele.match(this,"[data-format^='"+value+"']");
                });
            }
            
            if(r != null && onlyIn === true && Ele.match(r,".out"))
            r = null;
            
            return r;
        },
        
        select: function(value,reload,onlyIn) {
            trigHdlr(this,'calendar:removeSelected');
            const td = trigHdlr(this,'calendar:findCell',value,onlyIn);

            if(td != null)
            toggleClass(td,'selected',true);
            
            else if(reload === true)
            {
                value = prepareValue.call(this,value);
                setAttr(this,'data-current',value);
                trigHdlr(this,'calendar:load');
            }
        },
        
        load: function() {
            trigEvt(this,$option.ajaxEvent);
        }
    });

    setHdlr(this,'ajax:config',function() {
        const current = trigHdlr(this,'calendar:getCurrent');
        return trigHdlr(this,'hrefReplaceChar:make',current);
    });
    
    setHdlr(this,'focusable:getCurrentFallback',function() {
        return trigHdlr(this,'calendar:getSelectedButton');
    });
    
    setHdlr(this,'focusable:getTargets',function() {
        return trigHdlr(this,'calendar:getButtons');
    });
    
    
    // event
    aelOnce(this,'component:setup',function() {
        bindNav.call(this);
    });
    
    
    // prepareValue
    const prepareValue = function(value) 
    {
        let r = null;
        
        if(Str.isNotEmpty(value))
        {
            value = Str.trim(value);
            value = Str.explodeIndex(0," ",value);
            const split = Str.explode('-',value);
            
            Arr.each(split,function(value,key) {
                if(value.length === 1)
                split[key] = "0"+value;
            });
            
            r = split.join('-');
        }
        
        return r;
    }
    
    
    // bindNav
    const bindNav = function() 
    {
        const $this = this;
        
        aelDelegate(this,'click',".head .prev,.head .next",function(event) {
            const href = getAttr(this,'href');
            trigEvt($this,$option.ajaxEvent,href);
            
            Evt.preventStop(event,true);
            return false;
        })
    }
    
    return this;
}