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
quid.component.calendarInput = function()
{
    // clickOpen
    quid.component.clickOpenWithTrigger.call(this,"input[type='text']",'click',null,true);
    
    // triggerHandler
    $(this).on('calendarInput:getInput', function(event) {
        return $(this).find("input[type='text']");
    })
    .on('calendarInput:getCalendar', function(event) {
        return $(this).triggerHandler('clickOpen:getTarget').find(".calendar");
    })
    .on('clickOpen:getBackgroundFrom', function(event) {
        return 'calendar';
    })
    
    // trigger
    .on('clickOpen:open', function(event) {
        var input = $(this).triggerHandler('calendarInput:getInput');
        var calendar = $(this).triggerHandler('calendarInput:getCalendar');
        input.addClass('active');
        calendar.trigger((calendar.triggerHandler('calendar:isEmpty'))? 'calendar:load':'calendar:refresh');
    })
    .on('clickOpen:close', function(event) {
        $(this).triggerHandler('calendarInput:getInput').removeClass('active');
    })
    
    // setup
    .one('component:setup', function(event) {
        bindInput.call(this);
        bindCalendar.call(this);
    });
    
    // bindInput
    var bindInput = function() {
        var $this = $(this);
        var input = $(this).triggerHandler('calendarInput:getInput');
        var calendar = $(this).triggerHandler('calendarInput:getCalendar');
        var target = $(this).triggerHandler('clickOpen:getTarget');
        
        quid.component.timeout.call(input,'keyup',600);
        quid.component.keyboardEnter.call(input,true);
        
        input.on('keyup:onTimeout', function(event) {
            calendarChange.call(this,true);
        })
        .on('enter:blocked', function(event) {
            target.trigger('clickOpen:toggle');
        })
        .on('click', function(event) {
            event.stopImmediatePropagation();
        })
        .on('change', function(event) {
            calendarChange.call(this,false);
        });
        
        // calendarChange
        var calendarChange = function(reload) {
            var val = $(this).triggerHandler('input:getValue');
            calendar.trigger('calendar:select',[val,reload]);
        };
    };
    
    // bindCalendar
    var bindCalendar = function() {
        var $this = $(this);
        var input = $(this).triggerHandler('calendarInput:getInput');
        var calendar = $(this).triggerHandler('calendarInput:getCalendar');
        var target = $(this).triggerHandler('clickOpen:getTarget');
        
        quid.component.calendar.call(calendar);
        
        calendar.on('calendar:ready', function(event) {
            var val = input.triggerHandler('input:getValue');
            $(this).trigger('calendar:select',[val]);
        })
        .on('calendar:loading', function(event) {
            target.attr('data-status','loading');
        })
        .on('calendar:loaded', function(event) {
            target.removeAttr('data-status');
        })
        .on('click', 'td', function(event) {
            var format = $(this).data('format');
            var timestamp = $(this).data("timestamp");
            calendar.trigger('calendar:select',timestamp);
            input.val(format);
            $this.trigger("clickOpen:close");
        })
    };
        
    return this;
}