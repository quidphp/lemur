"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// calendar
// script with behaviours for a calendar and a date input
(function ($, document, window) {
	
	// calendar
	// gère les comportements javascript pour un calendrier
	$.fn.calendar = function()
	{
		$(this).block('calendar:load').ajax('calendar:load')
		.on('calendar:prepareValue', function(event,value) {
			var r = null;
			
			if($.isStringNotEmpty(value))
			{
				value = $.first(value," ");
				var split = value.split('-');
				for (var i = 0; i < split.length; i++) 
				{
					if(split[i].length === 1)
					split[i] = "0"+split[i];
				}
				r = split.join('-');
			}
			
			return r;
		})
		.on('calendar:isValueValid', function(event,value) {
			var r = false;
			
			if($.isStringNotEmpty(value) && !$.isNumeric(value) && $.isRegexNumericDash(value))
			{
				var format = $(this).data('format');
				if(value.length == format.length)
				r = true;
			}
			
			return r;
		})
		.on('ajax:getHref', function(event) {
			var current = $(this).data('current');
			var href = $(this).dataHrefReplaceChar(current);
			return href;
		})
		.on('ajax:before', function() {
			$(this).find("> *").hide();
			$(this).trigger('block');
			$(this).addClass('loading');
		})
		.on('ajax:success', function(event,data,textStatus,jqXHR) {
			$(this).html(data);
			$(this).removeClass('loading');
			$(this).trigger('unblock');
			$(this).trigger('calendar:bind');
			$(this).trigger('calendar:refresh');
		})
		.on('ajax:error', function(event,jqXHR,textStatus,errorThrown) {
			$(this).html($.parseError(jqXHR,textStatus));
			$(this).trigger('calendar:removeSelected');
			$(this).removeClass('loading');
			$(this).trigger('unblock');
		})
		.on('calendar:getCells',  function(event) {
			return $(this).find("td");
		})
		.on('calendar:getSelected',  function(event) {
			return $(this).triggerHandler('calendar:getCells').filter(".selected");
		})
		.on('calendar:removeSelected',  function(event) {
			return $(this).triggerHandler('calendar:getSelected').removeClass('selected');
		})
		.on('calendar:select', function(event,value,reload) {
			var tds = $(this).triggerHandler('calendar:getCells');
			var td = null;
			var selected = $(this).triggerHandler('calendar:getSelected');
			$(this).trigger('calendar:removeSelected');
			value = $(this).triggerHandler('calendar:prepareValue',[value]);
			
			if($(this).triggerHandler('calendar:isValueValid',[value]))
			{
				if($.isNumeric(value))
				td = tds.filter("[data-timestamp='"+value+"']").not(".out");
				
				else if($.isStringNotEmpty(value))
				td = tds.filter("[data-format^='"+value+"']").not(".out");
				
				if(td != null && td.length)
				td.addClass('selected');
				
				else if(reload === true)
				{
					$(this).data('current',value);
					$(this).trigger('ajax:trigger');
				}
			}
		})
		.on('calendar:bind', function(event) {
			var $calendar = $(this);
			$(this).find(".prev,.next").block('click').ajax('click')
			.on('ajax:before', function() {
				$calendar.trigger('ajax:before');
				$(this).trigger('block');
			})
			.on('ajax:success', function(event,data,textStatus,jqXHR) {
				$calendar.trigger('ajax:success',[data,textStatus,jqXHR]);
				$(this).trigger('unblock');
			})
			.on('ajax:error', function(event,jqXHR,textStatus,errorThrown) {
				$calendar.trigger('ajax:error',[jqXHR,textStatus,errorThrown]);
			});
		});
		
		return this;
	}
	
	
	// dateInput
	// gère les comportement pour un input de date qui ouvre un calendrier
    // utilise clickOpen
	$.fn.dateInput = function()
	{
        $(this).clickOpen("input[type='text']",'focus').on('dateInput:getInput', function(event) {
            return $(this).find("input[type='text']");
        })
        .on('dateInput:getCalendar', function(event) {
            return $(this).triggerHandler('clickOpen:getPopup').find(".calendar");
        })
        .on('clickOpen:open', function(event) {
            var input = $(this).triggerHandler('dateInput:getInput');
            var calendar = $(this).triggerHandler('dateInput:getCalendar');
            
            if(!calendar.html())
            calendar.trigger('calendar:load');
            else
            calendar.trigger('calendar:refresh');
            
            input.addClass('active');
        })
        .on('clickOpen:close', function(event) {
            $(this).triggerHandler('dateInput:getInput').removeClass('active');
        })
        .on('dateInput:bind', function(event) {
            var $this = $(this);
            var input = $(this).triggerHandler('dateInput:getInput');
            var calendar = $(this).triggerHandler('dateInput:getCalendar');
            
            input.timeout('keyup',600).on('click', function(event) {
                event.stopPropagation();
            })
            .on('change', function(event) {
				$(this).trigger('calendar:change');
			})
			.on('keyup:onTimeout', function(event) {
				$(this).trigger('calendar:change',[true]);
			})
            .on('calendar:change', function(event,reload) {
                calendar.trigger('calendar:select',[$(this).inputValue(true),reload]);
            });
            
            calendar.on('click', 'td', function(event) {
				var format = $(this).data('format');
				calendar.trigger('calendar:select',$(this).data("timestamp"));
				input.val(format);
				$this.trigger("clickOpen:close");
			})
            .on('calendar:refresh', function(event) {
    			$(this).trigger('calendar:select',[$.first(input.inputValue(true)," ")]);
    		});
            
        }).trigger('dateInput:bind');
        
		return this;
	}
	
}(jQuery, document, window));