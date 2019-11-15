"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// hashScroll
// script containing logic for a window component which scrolls according to the hash

// windowHashScroll
// gère le scroll sur window dans un contexte ou la page est composé de blocs liés à des hash
quid.core.windowHashScroll = function(type)
{
    type = type || 'scroll';
    
    $(window).hashchange().on(type,function(event) {
        $(this).trigger('windowHashScroll:change',[true]);
    })
    .on('mousewheel DOMMouseScroll wheel MozMousePixelScroll', function(event) {
        if($(this).triggerHandler('windowHashScroll:isScrolling'))
        {
            event.stopImmediatePropagation();
            event.preventDefault();
            return false;
        }
    })
    .on('hash:change', function(event,fragment,sourceEvent) {
        if(sourceEvent)
        quid.core.windowScrollToHash(fragment);
    })
    .on('windowHashScroll:getTargetAttr', function(event) {
        return 'data-id';
    })
    .on('windowHashScroll:canScroll', function(event) {
        return ($(this).triggerHandler('windowHashScroll:isScrolling') === false && $(document).triggerHandler('document:isLoading') === false)? true:false;
    })
    .on('windowHashScroll:isScrolling', function(event) {
        return ($(this).data('hashScroll:animate') === true)? true:false;
    })
    .on('windowHashScroll:setTarget', function(event,target) {
        $(this).data('windowHashScroll:target',target);
    })
    .on('windowHashScroll:getTarget', function(event,target) {
        return $(this).data('windowHashScroll:target');
    })
    .on('windowHashScroll:getCurrentTarget', function(event,target) {
        var r = null;
        var current = $(this).triggerHandler('windowHashScroll:getTarget').filter(function() {
            return ($(this).data('hashScrollTarget:current') === true)? true:false;
        });
        
        if(current.length === 1)
        r = current;
        
        return r;
    })
    .on('windowHashScroll:findTarget', function(event,hash) {
        var r = null;
        var target = $(this).triggerHandler('windowHashScroll:getTarget');
        var attr = $(this).triggerHandler('windowHashScroll:getTargetAttr');
        if(target instanceof jQuery && quid.base.str.isNotEmpty(hash) && quid.base.str.isNotEmpty(attr))
        {
            var find = target.filter("["+attr+"='"+hash+"']");
            if(find.length === 1)
            r = find;
        }
        
        return r;
    })
    .on('windowHashScroll:getScrollTarget', function(event) {
        var r = null;
        var scrollTop = $(this).scrollTop();
        var windowHeight = $(this).height();
        var documentHeight = $(document).height();
        var windowHeightRatio = (windowHeight / 2);
        var target = $(this).triggerHandler('windowHashScroll:getTarget');
        
        if(target instanceof jQuery && target.length)
        {
            if(scrollTop <= windowHeightRatio)
            r = target.first();
            
            else
            {
                target.each(function(index) {
                    var offset = $(this).offset().top;
                    var height = $(this).heightWithPadding();
                    var commit = false;
                    
                    if(scrollTop >= (offset - windowHeightRatio))
                    {
                        if(scrollTop < ((offset + height) - windowHeightRatio))
                        commit = true;
                    }
                    
                    if(commit === true)
                    {
                        r = $(this);
                        return false;
                    }
                });
            }
            
            if(r === null && target.length > 1)
            {
                if(scrollTop >= (documentHeight - windowHeight))
                r = target.last();
            }
        }
        
        return r;
    })
    .on('windowHashScroll:change', function(event,fromScroll) {

        if($(this).triggerHandler('windowHashScroll:canScroll'))
        {
            var currentTarget = $(this).triggerHandler('windowHashScroll:getScrollTarget');
            
            if(currentTarget instanceof jQuery)
            {
                var isFirst = currentTarget.triggerHandler('hashScrollTarget:isFirst');
                var hash = currentTarget.triggerHandler('hashScrollTarget:getHash');
                hash = (quid.base.str.isNotEmpty(hash))? hash:'';
                
                if(hash !== location.hash)
                {
                    $(this).removeData('windowHashScroll:noScroll');
                    var oldHash = quid.base.uri.makeHash(location.hash,false);
                    var old = $(this).triggerHandler('windowHashScroll:findTarget',[oldHash]);
                    
                    if(old !== null && old.triggerHandler('hashScrollTarget:isCurrent'))
                    old.trigger('hashScrollTarget:leave');
                    
                    if(fromScroll === true && (quid.base.browser.isTouch() || quid.base.browser.isResponsive()))
                    $(this).data('windowHashScroll:noScroll',true);
                    
                    if(isFirst === false || location.hash !== '')
                    location.hash = hash;
                    
                    if(!currentTarget.triggerHandler('hashScrollTarget:isCurrent'))
                    currentTarget.trigger('hashScrollTarget:enter');
                    
                    return false;
                }
            }
        }
    });
            
    $(document).on('click', "a[href*='#']", function(event) {
        if(!$(window).triggerHandler('windowHashScroll:canScroll'))
        {
            event.preventDefault();
            event.stopImmediatePropagation();
            return false;
        }
    });
    
    return this;
}


// windowScrollToHash
// permet de scroller la window jusqu'au bloc du hash donné en argument
quid.core.windowScrollToHash = function(hash,event)
{
    var r = false;
    var win = $(window);
    
    if(hash instanceof jQuery)
    hash = hash.attr(win.triggerHandler('windowHashScroll:getTargetAttr'));
    
    if(win.triggerHandler('windowHashScroll:canScroll'))
    {
        hash = quid.base.uri.makeHash(hash,false);
        var scrollTop = win.scrollTop();
        var top = null;
        var target = null;
        var newHash = null;
        var source = $("html,body");
        var current = win.triggerHandler('windowHashScroll:getCurrentTarget');
        win.removeData('hashScroll:animate');
        var noScroll = win.data('windowHashScroll:noScroll');
        win.removeData('windowHashScroll:noScroll');
        
        var callback = function() 
        {
            if(current && current.length === 1 && current.triggerHandler('hashScrollTarget:isCurrent'))
            current.trigger('hashScrollTarget:leave');
            
            if(location.hash !== newHash)
            location.hash = newHash;
            
            if(!target.triggerHandler('hashScrollTarget:isCurrent'))
            target.trigger('hashScrollTarget:enter');
        }
        
        if(quid.base.str.isNotEmpty(hash))
        {
            target = win.triggerHandler('windowHashScroll:findTarget',[hash]);
            if(target !== null)
            {
                top = target.offset().top;
                newHash = hash;
            }
        }
        
        else
        {
            target = source.first();
            top = 0;
            newHash = "";
        }
        
        if(quid.base.number.is(top) && top !== scrollTop && quid.base.str.is(newHash) && target)
        {
            r = true;
            var isFirst = target.triggerHandler('hashScrollTarget:isFirst');
            
            if(event != null)
            event.preventDefault();
            
            if(noScroll === true || (isFirst === true && scrollTop === 0))
            callback.call(this);
            else
            {
                win.data('hashScroll:animate',true);
                source.stop(true,true).animate({scrollTop: top}, 1000).promise().done(callback).done(function() {
                    win.removeData('hashScroll:animate');
                });
            }
        }
    }
    
    return r;
}

// anchorScroll
// gère les liens avec ancrage (changement de hash)
quid.core.anchorScroll = function()
{
    $(this).on('click', function(event) {
        if(quid.base.uri.isSamePathQuery($(this).prop('href')))
        {
            var hash = this.hash;
            quid.core.windowScrollToHash(hash,event);
            
            event.preventDefault();
            return false;
        }
    })
    .on('anchorScroll:setSelected', function(event,hash) {
        if(this.hash === hash)
        $(this).addClass('selected');
        else
        $(this).removeClass('selected');
    });
    
    return this;
}


// hashScrollTarget
// gère un block comme target pour un hash scroll, chaque bloc est lié à un hash
quid.core.hashScrollTarget = function()
{
    var $this = $(this);
    
    $(this).arrowCatch().on('hashScrollTarget:getHash', function(event) {
        return quid.base.uri.makeHash($(this).data("id"),true);
    })
    .on('hashScrollTarget:getFragment', function(event) {
        return quid.base.uri.makeHash($(this).data("id"),false);
    })
    .on('hashScrollTarget:getIndex', function(event) {
        return $this.index($(this));
    })
    .on('hashScrollTarget:isFirst', function(event) {
        return ($(this).triggerHandler("hashScrollTarget:getIndex") === 0)? true:false;
    })
    .on('hashScrollTarget:isCurrent', function(event) {
        return ($(this).hasClass('current'))? true:false;
    })
    .on('hashScrollTarget:getPrev', function(event) {
        var index = quid.base.nav.index('prev',$(this),$this,false);
        if(quid.base.number.is(index))
        return $this.eq(index);
    })
    .on('hashScrollTarget:getNext', function(event) {
        var index = quid.base.nav.index('next',$(this),$this,false);
        if(quid.base.number.is(index))
        return $this.eq(index);
    })
    .on('hashScrollTarget:enter',function(event) {
        $this.removeClass('current').removeData('hashScrollTarget:current');
        $(this).addClass('current').data('hashScrollTarget:current',true);
    })
    .on('arrowUp:catched', function(event) {
        if($(this).triggerHandler('hashScrollTarget:isCurrent'))
        {
            var prev = $(this).triggerHandler('hashScrollTarget:getPrev');
            if(prev != null)
            quid.core.windowScrollToHash(prev);
        }
    })
    .on('arrowDown:catched', function(event) {
        if($(this).triggerHandler('hashScrollTarget:isCurrent'))
        {
            var next = $(this).triggerHandler('hashScrollTarget:getNext');
            if(next != null)
            quid.core.windowScrollToHash(next);
        }
    });
    
    return this;
}