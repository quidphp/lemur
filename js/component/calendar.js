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
    
    
    // handler
    setHdlrs(this,'calendar:',{
        
        isEmpty: function() {
            return Ele.isEmpty(this);
        },
        
        getHead: function() {
            return qs(this,'.head');
        },
        
        getPrevNext: function() {
            const head = trigHdlr(this,'calendar:getHead');
            return qsa(head,".prev,.next");
        },
        
        getCells: function() {
            return qsa(this,".body td");
        },
        
        getSelected: function() {
            return Arr.filter(trigHdlr(this,'calendar:getCells'),function() {
                return Nod.match(this,".selected");
            });
        },
        
        getCurrent: function() {
            return getAttr(this,'data-current');
        },
        
        getFormat: function() {
            return getAttr(this,'data-format');
        },
        
        removeSelected: function() {
            const selected = trigHdlr(this,'calendar:getSelected');
            toggleClass(selected,'selected',false);
        },
        
        findCell: function(value) {
            let r = undefined;
            const tds = trigHdlr(this,'calendar:getCells');
            const format = trigHdlr(this,'calendar:getFormat');
            value = prepareValue.call(this,value);
            
            if(Num.is(value))
            {
                r = Arr.find(tds,function() {
                    return Nod.match(this,"[data-timestamp='"+value+"']") && !Nod.match(this,".out");
                });
            }
            
            else if(Str.isNotEmpty(value) && value.length == Str.length(format))
            {
                r = Arr.find(tds,function() {
                    return Nod.match(this,"[data-format^='"+value+"']") && !Nod.match(this,".out");
                });
            }
            
            return r;
        },
        
        select: function(value,reload) {
            trigHdlr(this,'calendar:removeSelected');
            const td = trigHdlr(this,'calendar:findCell',value);
            
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
        return EleHelper.dataHrefReplaceChar(this,trigHdlr(this,'calendar:getCurrent'));
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
        const prevNext = trigHdlr(this,'calendar:getPrevNext');
        
        aelDelegate(this,'click',".head .prev,.head .next",function(event) {
            const href = getAttr(this,'href');
            trigEvt($this,$option.ajaxEvent,href);
            
            Evt.preventStop(event,true);
            return false;
        })
    }
    
    return this;
}