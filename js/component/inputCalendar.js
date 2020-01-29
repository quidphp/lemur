/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// calendar
// script with behaviours for a calendar component and a date input
Component.InputCalendar = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replaceRecursive({
        trigger: "input[type='text']",
        triggerEvent: 'click',
        triggerToggle: false,
        background: "calendar",
        keyEvent: 'keydown',
        calendar: {},
        timeout: 600
    },option);
    
    
    // components
    Component.ClickOpenTrigger.call(this,$option);
    Component.KeyboardArrow.call(this,'vertical');
    
    
    // handler
    setHdlrs(this,'inputCalendar:',{
        
        getCalendar: function() {
            const target = trigHdlr(this,'clickOpen:getTarget');
            return qs(target,".calendar");
        },
        
        getInput: function() {
            return trigHdlr(this,'clickOpen:getTrigger');
        }
    });
    
    
    // event
    ael(this,'clickOpen:opened',function() {
        const calendar = trigHdlr(this,'inputCalendar:getCalendar');
        const isEmpty = trigHdlr(calendar,'calendar:isEmpty');
        
        trigHdlr(calendar,(isEmpty === true)? 'calendar:load':'calendar:refresh');
    });
    
    ael(this,'keyboardArrow:up',function() {
        const calendar = trigHdlr(this,'inputCalendar:getCalendar');
        trigHdlr(calendar,'focusable:prev');
    });
    
    ael(this,'keyboardArrow:down',function() {
        const calendar = trigHdlr(this,'inputCalendar:getCalendar');
        trigHdlr(calendar,'focusable:next');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindInput.call(this);
        bindCalendar.call(this);
    });
    
    
    // bindInput
    const bindInput = function() 
    {
        const $this = this;
        const input = trigHdlr(this,'inputCalendar:getInput');
        const target = trigHdlr(this,'clickOpen:getTarget');
        
        // components
        Component.KeyboardEnter.call(input,true,$option.keyEvent);
        Component.Timeout.call(input,$option.keyEvent,$option.timeout);
        
        
        // handler
        setHdlr(input,'inputCalendar:setValue',function(value) {
            const currentValue = trigHdlr(this,'input:getValue',true);
            
            if(Str.isNotEmpty(currentValue))
            value = dateTimeFormat.call($this,value,currentValue);
            
            trigHdlr(this,'input:setValue',value);
        });
        
        
        // event
        ael(input,'timeout:'+$option.keyEvent,function() {
            calendarChange.call(this,true,true);
        });
        
        ael(input,'keyboardEnter:blocked',function(event,keyEvent) {
            trigHdlr(target,'clickOpen:toggle');
            Evt.preventStop(keyEvent,true);
        });
        
        ael(input,'click',function(event) {
            Evt.preventStop(event);
        });
        
        ael(input,'change',function() {
            calendarChange.call(this,false,true);
        });
        
        
        // calendarChange
        const calendarChange = function(reload,onlyIn) 
        {
            const calendar = trigHdlr($this,'inputCalendar:getCalendar');
            const val = trigHdlr(this,'input:getValue');
            trigHdlr(calendar,'calendar:select',val,reload,onlyIn);
        }
    }
    
    
    // bindCalendar
    const bindCalendar = function() 
    {
        const $this = this;
        const calendar = trigHdlr(this,'inputCalendar:getCalendar');
        const target = trigHdlr(this,'clickOpen:getTarget');
        const input = trigHdlr($this,'inputCalendar:getInput');
        
        // components
        Component.Calendar.call(calendar,$option.calendar);
        
        // handler
        setHdlr(calendar,'ajaxBlock:getStatusNode',function() {
            return target;
        });
        
        // event
        setHdlr(calendar,'ajaxBlock:getContentNode',function() {
            return calendar;
        });
        
        ael(calendar,'ajaxBlock:complete',function() {
            const val = trigHdlr(input,'input:getValue');
            trigHdlr(calendar,'calendar:select',val);
        });
        
        aelDelegate(calendar,'click','td',function() {
            const format = getAttr(this,'data-format');
            const timestamp = getAttr(this,"data-timestamp");
            trigHdlr(calendar,'calendar:select',timestamp);
            trigHdlr(input,'inputCalendar:setValue',format);
            trigEvt($this,"clickOpen:close");
        });
        
        // setup
        trigSetup(calendar);
    }
    
    
    // dateTimeFormat
    const dateTimeFormat = function(value,currentValue)
    {
        let r = value;
        
        if(Str.in(" ",currentValue) && Str.in(" ",value))
        {
            const x = Str.explode(" ",value);
            const x2 = Str.explode(" ",currentValue);
            
            if(Arr.length(x) === 2 && Arr.length(x2) === 2)
            {
                const arr = [x[0],x2[1]];
                r = arr.join(" ");
            }
        }
        
        return r; 
    }
    
    return this;
}