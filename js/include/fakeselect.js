"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// fakeselect
// script with some logic for a select replacement widget
(function ($, document, window) {
	
	// fakeselect
	// crée les comportements pour un input fakeSelect, pouvant avoir un inputHidden lié
	// fakeselect étend clickOpen
	$.fn.fakeselect = function()
	{
		$(this).clickOpen().on('fakeselect:getChoices', function(event) {
			return $(this).triggerHandler('clickOpen:getPopup').find("li");
		})
		.on('isFakeInput', function(event) {
			return true;
		})
		.on('fakeselect:getInput', function(event) {
			return $(this).find("input[type='hidden']");
		})
		.on('fakeselect:getSelected', function(event) {
			return $(this).find("li.selected");
		})
		.on('fakeselect:getValue', function(event) {
			return $(this).triggerHandler('fakeselect:getSelected').data('value');
		})
        .on('fakeselect:getTitle', function(event) {
            return $(this).triggerHandler('clickOpen:getTrigger').find(".title").first();
        })
        .on('fakeselect:setTitle', function(event,value) {
            event.stopPropagation();
            $(this).triggerHandler('fakeselect:getTitle').text(value);
        })
		.on('getValue', function(event) {
			return $(this).triggerHandler('fakeselect:getValue');
		})
		.on('fakeselect:prepare', function(event) {
			var $this = $(this);
			var choices = $(this).triggerHandler('fakeselect:getChoices');
			var selected = $(this).triggerHandler('fakeselect:getSelected');
			
			choices.on('click', function(event) {
				event.stopPropagation();
				$this.trigger('fakeselect:choose',[$(this)]);
			});
			
			if(selected.length)
			$(this).trigger('fakeselect:choose',[selected]);
		})
		.on('fakeselect:choose', function(event,selected) {
			var input = $(this).triggerHandler('fakeselect:getInput');
			var choices = $(this).triggerHandler('fakeselect:getChoices');
			var value = selected.data("value");
			var current = input.inputValue(true);
			choices.removeClass('selected');
			selected.addClass('selected');
			input.val(value);
			$(this).trigger('fakeselect:setTitle',selected.text());
			$(this).trigger('clickOpen:close');
			
			if(current !== value)
			{
				$(this).trigger('change');
				$(this).trigger('fakeselect:changed',[value,selected]);
			}
		})
		.trigger('fakeselect:prepare');
		
		return this;
	}
	
	
	// selectToFake
	// transforme des tags select en fakeselect
	$.fn.selectToFake = function(anchorCorner)
	{
		$(this).each(function(index, el) {
			if($(this).tagName() === 'select')
			{
				var name = $(this).prop('name');
				var required = $(this).data('required');
				var title = $(this).find("option:selected").text() || "&nbsp;";
				var options = $(this).find("option");
				var value = $(this).inputValue(true);
				var html = '';
				
				html += "<div class='fakeselect";
				if(anchorCorner === true)
				html += " anchor-corner";
				html += "'";
				if(required)
				html += " data-required='1'";
				html += "><div class='trigger'>";
				html += "<div data-title'='"+title+"' class='title'>"+title+"</div>";
				html += "<div class='ico'></div>";
				html += "</div>";
				html += "<div class='popup'>";
				html += "<ul>";
				
				options.each(function(index, el) {
					var val = $(this).prop('value');
					var text = $(this).text() || "&nbsp;";
					html += "<li";
					if(val != null)
					{
						if(val === value)
						html += " class='selected'";
						
						html += " data-value='"+val+"'";
					}
					
					html += ">"+text;
					html += "</li>";
				});
				
				html += "</ul>";
				html += "</div>";
				html += "<input name='"+name+"' type='hidden' value='"+value+"'/>";
				html += "</div>";

				$(this).after(html);
				var fakeselect = $(this).next('.fakeselect');
				fakeselect.fakeselect();
				
				if(anchorCorner === true)
				fakeselect.anchorCorner('mouseover');
				
				$(this).remove();
			}
		});
		
		return this;
	}
	
}(jQuery, document, window));