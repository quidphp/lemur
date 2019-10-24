"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// date
// script with functions related to date and time
(function ($, document, window) {
	
    // timestamp
	// retourne le timestamp courant
	$.timestamp = function() 
	{
	  return (new Date).getTime();
	}
    
    
    // timeout
	// permet d'appliquer un timeout sur un événement
	$.fn.timeout = function(type,timeout)
	{
		if($.isStringNotEmpty(type))
		{
			$(this).each(function(index) 
			{
				var delay = timeout || $(this).data(type+"Delay");
				
				if($.isNumeric(delay))
				{
					$(this).on(type+':setTimeout',function() {
						var $this = $(this);
						var $type = type;
						$(this).trigger(type+':clearTimeout');
						$(this).data(type+"Timeout",setTimeout(function() {
							$this.trigger($type+':onTimeout');
						},delay));
					})
					.on(type+':clearTimeout',function() {
						var oldTimeout = $(this).data(type+"Timeout");
						
						if(oldTimeout != null)
                        clearTimeout(oldTimeout);
					})
					.on(type, function() {
						$(this).trigger(type+':setTimeout');
					});
				}
			});
		}
		
		return this;
	}
    
}(jQuery, document, window));