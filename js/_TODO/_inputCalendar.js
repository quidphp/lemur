/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// calendar
// script with behaviours for a calendar component and a date input

// calendarInput
// gère les comportement pour un input de date qui ouvre un calendrier
// utilise clickOpen
Component.calendarInput = function()
{
    // clickOpen
    Component.clickOpenWithTrigger.call(this,"input[type='text']",'click',null,true);
    
    // triggerHandler
    $(this).on('calendarInput:getInput',function(event) {
        return $(this).find("input[type='text']");
    })
    .on('calendarInput:getCalendar',function(event) {
        return trigHandler(this,'clickOpen:getTarget').find(".calendar");
    })
    .on('clickOpen:getBackgroundFrom',function(event) {
        return 'calendar';
    })
    
    // trigger
    .on('clickOpen:open',function(event) {
        const input = trigHandler(this,'calendarInput:getInput');
        const calendar = trigHandler(this,'calendarInput:getCalendar');
        input.addClass('active');
        calendar.trigger((calendar.trigHandler('calendar:isEmpty'))? 'calendar:load':'calendar:refresh');
    })
    .on('clickOpen:close',function(event) {
        trigHandler(this,'calendarInput:getInput').removeClass('active');
    })
    
    // setup
    .one('component:setup',function(event) {
        bindInput.call(this);
        bindCalendar.call(this);
    });
    
    // bindInput
    const bindInput = function() {
        const $this = $(this);
        const input = trigHandler(this,'calendarInput:getInput');
        const calendar = trigHandler(this,'calendarInput:getCalendar');
        const target = trigHandler(this,'clickOpen:getTarget');
        
        Component.Timeout.call(input,'keyup',600);
        Component.keyboardEnter.call(input,true);
        
        input.on('keyup:onTimeout',function(event) {
            calendarChange.call(this,true);
        })
        .on('enter:blocked',function(event) {
            target.trigger('clickOpen:toggle');
        })
        .on('click',function(event) {
            event.stopImmediatePropagation();
        })
        .on('change',function(event) {
            calendarChange.call(this,false);
        });
        
        // calendarChange
        const calendarChange = function(reload) {
            const val = trigHandler(this,'input:getValue');
            calendar.trigger('calendar:select',[val,reload]);
        };
    };
    
    // bindCalendar
    const bindCalendar = function() {
        const $this = $(this);
        const input = trigHandler(this,'calendarInput:getInput');
        const calendar = trigHandler(this,'calendarInput:getCalendar');
        const target = trigHandler(this,'clickOpen:getTarget');
        
        Component.calendar.call(calendar);
        
        calendar.on('calendar:ready',function(event) {
            const val = input.trigHandler('input:getValue');
            trigEvt(this,'calendar:select',val);
        })
        .on('calendar:loading',function(event) {
            target.attr('data-status','loading');
        })
        .on('calendar:loaded',function(event) {
            target.removeAttr('data-status');
        })
        .on('click', 'td',function(event) {
            const format = $(this).data('format');
            const timestamp = $(this).data("timestamp");
            calendar.trigger('calendar:select',timestamp);
            input.val(format);
            trigEvt($this,"clickOpen:close");
        })
    };
        
    return this;
}