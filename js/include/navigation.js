"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// navigation
// script containing the logic related to site navigation by using the HistoryAPI
(function ($, document, window) {
	
	// navigation
	// classe qui gère la navigation via history api
	$.fn.navigation = function(option) 
	{
		var $settings = {
			link: "a:internal:not([target='_blank']):not(.http):not([data-modal]):not([href^='mailto:'])",
			timeout: 10000
		};
		
		if(option && typeof(option) == 'object')
		$settings = $.extend($settings, option);
		
		var $target = $(this);
		var $location = window.location;
		var $history = ($.hasHistoryApi())? window.history:null;
		var $initial = null;
		var $previous = null;

		
		// applyBindings
		// applique les bindings sur les clicks et popstate
		function applyBindings()
		{
			// click
			$target.on('click', $settings.link, function(event) { 
				var r = true;
				$target.triggerHandler('navigation:clickEvent',[event]);
				r = (event.isDefaultPrevented())? false:true;
				
				return r;
			});
			
			// popstate
			$(window).on('popstate',function(event) {
				var state = event.originalEvent.state || $target.triggerHandler('navigation:getCurrentState');
				var previous = $target.triggerHandler('navigation:getPreviousState');
				var isValid = isStateChangeValid.call(this,state,previous,true);
				
				if(isValid === true)
				{
					if(isUnloadValid.call(this) === true)
					makeAjax.call(this,'pop',state);
					
					else
					$history.pushState($previous,$previous.title,$previous.url);
				}
				
				// hash change
				else if($.isSamePathQuery(state.url,previous.url) && ($.isUriHash(state.url) || $.isUriHash(previous.url)))
				{
					$previous = state;
					$(this).trigger('hashchange',[event]);
				}
			});
		}
		
		
		// isStateChangeValid
		// retourne vrai si le changement de state est valide
		function isStateChangeValid(state,previous,pathQuery)
		{
			var r = false;
			
			if($.isHistoryState(state) && $.isHistoryState(previous))
			{
				var isInternal = $.isUriInternal(state.url,previous.url);
				var hasExtension = $.isUriExtension(state.url);
				var isHashChange = $.isHashChange(state.url,previous.url);
				var isHashSame = $.isHashSame(state.url,previous.url);
				
				if(isInternal === true && hasExtension === false && isHashChange === false && isHashSame === false)
				{
					if(!pathQuery || $.isSamePathQuery(state.url,previous.url) === false)
					r = true;
				}
			}
			
			return r;
		}
		
		
		// isUnloadValid
		// retourne vrai si unload est vide ou confirmé
		function isUnloadValid()
		{
			var r = false;
			var unload = $(window).triggerHandler('beforeunload');
			
			if(!$.isStringNotEmpty(unload) || confirm(unload))
			r = true;
			
			return r;
		}
		
		
		// makeAjax
		// crée et retourne l'objet ajax
		function makeAjax(type,state)
		{
			var r = null;
			
			if($.isStringNotEmpty(type) && $.isHistoryState(state))
			{
				$target.triggerHandler('navigation:cancelAjax');
				beforeAjax.call(this);
				
				r = $.ajax({
					url: state.url,
					timeout: $settings.timeout,
					method: 'GET'
				})
				.done(function(data,textStatus,jqXHR) {
					afterAjax.call(this,type,state,jqXHR);
				})
				.fail(function(jqXHR,textStatus,errorThrown) {
					if($.isStringNotEmpty(jqXHR.responseText))
					afterAjax.call(this,type,state,jqXHR);
					else
					$target.triggerHandler('navigation:hardRedirect',state.url);
				});
								
				$target.data('navigation:ajax',r);
			}
			
			return r;
		}
		

		// beforeAjax
		// callback avant le ajax
		function beforeAjax()
		{
			$target.data('navigation:active',true);
			
			// loading
			$("html").attr('data-status','loading');
			
			// beforeUnload
			$(window).off('beforeunload');
		}
		
		
		// afterAjax
		// callback après le ajax
		function afterAjax(type,state,jqXHR)
		{
			if($.isPlainObject(jqXHR) && $.isHistoryState(state) && $.isStringNotEmpty(type))
			{
				var data = jqXHR.responseText;
				var currentUri = jqXHR.getResponseHeader('QUID-URI');
				var current = $target.triggerHandler('navigation:getCurrentState');
				
				if($.isString(data))
				{
					var doc = $.parseDocument(data);
					$target.removeData('navigation:active');
					
					if(type === 'push')
					{
						state = $.makeHistoryState(state.url,doc.title);
						
						if(state.url !== current.url && current.url !== currentUri)
						$history.pushState(state,state.title,state.url);
					}
						
					if(state.url !== currentUri)
					{
						if($.isUriInternal(state.url,currentUri) === false || $.isSamePathQuery(state.url,currentUri) === false)
						{
							state = $.makeHistoryState(currentUri,state.title);
							$history.replaceState(state,state.title,state.url);
						}
					}	
						
					makeDocument.call(this,doc);
					doc.doc.remove();
					$previous = state;
				}
			}
		}
		
		
		// makeDocument
		// crée le document à partir d'un objet doc, passé dans parseDocument
		function makeDocument(doc)
		{
			var r = false;

			if($.isPlainObject(doc) && doc.body && doc.body.length)
			{
				r = true;
                
                // html
                var html = $("html");
                doc.html.removeAttr('data-tag');
                var htmlAttributes = doc.html.getAttributes();
                html.replaceAttributes(htmlAttributes);
                
                // head
                var head = html.find("head");
                
				// title
                var title = head.find("meta");
				if($.isStringNotEmpty(doc.title))
				{
					document.title = doc.title;
					title.html(document.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; '));
				}
				
                // meta
                var meta = head.find("meta");
                meta.remove();
				if(doc.meta instanceof jQuery)
				{
                    doc.meta.removeAttr('data-tag');
					doc.meta.each(function(index, el) {
                        var after = (head.find("meta").length)? head.find("meta").last():head.find("title");
                        
                        var attributes = $(this).getAttributes();
                        $("<meta>").insertAfter(after);
                        
						var element = head.find("meta").last();
                        element.replaceAttributes(attributes);
					});
				}
				
                // body
                var body = html.find("body");
                doc.body.removeAttr('data-tag');
                var bodyAttributes = doc.body.getAttributes();
                body.replaceAttributes(bodyAttributes);
				body.html(doc.body.html());
				
                // after
				afterMakeDocument.call(this);
			}
			
			return r;
		}
		
		
		// afterMakeDocument
		// callback après le chargement du nouveau document
		function afterMakeDocument()
		{
			var state = $target.triggerHandler('navigation:getCurrentState');
			var relativeUri = $.relativeUri(state.url);
			
            // unbink click sur document
            $target.off('.outside');
            
			// scrollTop
			$("html,body").stop(true,true).scrollTop(0);
			
			// trigger
			$target.trigger('navigation:route');
			
			// complete
			$target.trigger('navigation:complete',[relativeUri]);
		}
		
		
		// isActive
		// retourne vrai si la navigation est présentement active
		$(this).on('navigation:isActive', function(event) {
			return ($(this).data('navigation:active') === true)? true:false;
		})
		
		
		// hasAjax
		// retourne vrai s'il y a présentement un objet ajax en train de s'effectuer
		$(this).on('navigation:hasAjax', function(event) {
			var r = false;
			var ajax = $target.data('navigation:ajax');
			
			if(ajax != null && ajax.readyState < 4)
			r = true;
			
			return r;
		})
		
		
		// getInitialState
		// retourne l'état initial
		.on('navigation:getInitialState', function(event) {
			return $initial;
		})
		
		
		// getPreviousState
		// retourne l'état précédent
		$(this).on('navigation:getPreviousState', function(event) {
			return $previous || $initial;
		})
		
		
		// getCurrentState
		// retourne l'état courant
		$(this).on('navigation:getCurrentState', function(event) {
			return $.makeHistoryState($location.href,document.title);
		})
		
		
		// hardRedirect
		// fait une redirection dure vers une nouvelle uri
		.on('navigation:hardRedirect', function(event,uri) {
			$location.href = uri;
		})
		
		
		// cancelAjax
		// annule et détruit l'objet ajax si existant
		.on('navigation:cancelAjax', function(event) {
			var r = false;
			
			if($(this).triggerHandler('navigation:hasAjax') === true)
			{
				var ajax = $target.data('navigation:ajax');
				ajax.onreadystatechange = $.noop;
				ajax.abort();
			}
			
			$target.removeData('navigation:ajax');
			
			return r;
		})
		
		
		// clickEvent
		// gère un nouvel historique déclenché par un clic
		.on('navigation:clickEvent', function(event,click) {
			var r = false;
			
			if(!(click.which > 1 || click.metaKey || click.ctrlKey || click.shiftKey || click.altKey))
			{
				var target = $(click.target);
				
				if(target.tagName !== 'a')
				target = target.closest("a");
				
				if(target.is($settings.link))
				{
					var uri = target.prop('href');
					r = $(this).triggerHandler('navigation:push',[uri,click]);
				}
			}
			
			return r;
		})
		
		
		// navigation:push
		// pousse une nouvelle entrée dans l'historique
		.on('navigation:push', function(event,uri,sourceEvent) {
			var r = false;
			
			if($(this).triggerHandler('navigation:hasAjax'))
			r = true;
			
			else
			{
				if(uri instanceof jQuery && uri.is($settings.link))
				uri = uri.prop("href");
				
				if($.isString(uri))
				{
					var current = $(this).triggerHandler('navigation:getCurrentState');
					var state = $.makeHistoryState(uri);
					var isValid = isStateChangeValid.call(this,state,current);
					
					if(isValid === true)
					{
						if(isUnloadValid.call(this))
						r = (makeAjax.call(this,'push',state))? true:false;
						else
						r = true;
					}
					
					// hash change
					else if($.isHashChange(state.url,current.url))
					{
						r = true;
						$history.pushState(state,state.title,state.url);
						$previous = state;
						$(window).trigger('hashchange',[sourceEvent]);
					}
				}
			}
			
			if(r === true && sourceEvent != null)
			sourceEvent.preventDefault();
			
			return r;
		})
		
		
		// route
		// appel la route courante sur le document
		.on('navigation:route', function(event) {
			var route = $(this).find("html").attr("data-route");
			
			$("html").attr('data-status','ready');
			
			if($.isStringNotEmpty(route))
			{
				$(this).trigger('route:'+route);
				$(this).trigger('route:common');
			}
		})
		
		
		if($history)
		{
			$history.scrollRestoration = 'manual';
			$initial = $.makeHistoryState($location.href,document.title);
			$(this).triggerHandler('navigation:cancelAjax');
			$history.replaceState($initial,$initial.title,$initial.url);
			applyBindings.call(this);
		}
		

		$(this).trigger('navigation:route');
		
		return this;
	}
	
    
    // hasHistoryApi
	// retourne vrai si le navigateur courant supporte history API
	$.hasHistoryApi = function() 
	{
		var r = false;
		
		if(window.history && window.history.pushState && window.history.replaceState)
		{
			if(!navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/))
			r = true;
		}
		
		return r;
	}
	
	
	// makeHistoryState
	// retourne un objet état d'historique (avec url, title et timestamp)
	$.makeHistoryState = function(uri,title) 
	{
		var r = null;
		
		if($.isString(uri))
		{
			r = {
				url: uri,
				title: title || null,
				timestamp: $.timestamp()
			};
		}
		
		return r;
	}
	
	
	// isHistoryState
	// retourne vrai si la valeur est un objet compatible pour un état d'historique
	$.isHistoryState = function(state)
	{
		var r = false;
		
		if($.isPlainObject(state) && $.isString(state.url) && $.isNumeric(state.timestamp))
		r = true;
		
		return r;
	}
    
}(jQuery, document, window));