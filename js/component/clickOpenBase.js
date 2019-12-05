/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenBase
// grants base methods and events for a clickOpen component
const ClickOpenBase = function(option)
{
    // nodes
    const $nodes = this;
    
    
    // option
    const $option = Object.assign({
        target: true,
        background: 'clickOpen',
        attr: 'data-click-open',
        multiple: false
    },option);
    
    
    // keyboard escape
    Component.KeyboardEscape.call(this);
    
    
    // func
    setFunc(this,'clickOpen:isInit',function() {
        return ($(this).data('clickOpen-init') === true)? true:false;
    });
    
    setFunc(this,'clickOpen:isOpen',function() {
        return $(this).hasClass("active");
    });
    
    setFunc(this,'clickOpen:isClose',function() {
        return (!triggerFunc(this,'clickOpen:isOpen'))? true:false;
    });
    
    setFunc(this,'clickOpen:isEmpty',function() {
        const target = triggerFunc(this,'clickOpen:getTarget');
        return $(target).is(":empty");
    });
    
    setFunc(this,'clickOpen:getAttr',function() {
        return $option.attr;
    });
    
    setFunc(this,'clickOpen:allowMultiple',function() {
        return $option.multiple;
    });
    
    setFunc(this,'clickOpen:getBackgroundFrom',function() {
        return $option.background;
    });
    
    setFunc(this,'clickOpen:getTarget',function() {
        let r = $option.target;
        
        if(r === true)
        r = this;
        
        if(Str.isNotEmpty(r))
        r = qs(this,r);
        
        return r;
    });
    
    setFunc(this,'clickOpen:setTargetContent',function(data) {
        const target = triggerFunc(this,'clickOpen:getTarget');
        $(target).html(data);
    });
    
    setFunc(this,'clickOpen:unsetTargetContent',function() {
        const target = triggerFunc(this,'clickOpen:getTarget');
        $(target).html('');
    });
    
    setFunc(this,'clickOpen:getParentClickOpen',function() {
        const attr = triggerFunc(this,'clickOpen:getAttr');
        
        return $(this).parents("["+attr+"='1']").get(0);
    });
    
    setFunc(this,'clickOpen:getParentContainer',function() {
        return triggerFunc(this,'clickOpen:getParentClickOpen') || document;
    });
    
    setFunc(this,'clickOpen:getAll',function() {
        const parent = triggerFunc(this,'clickOpen:getParentContainer');
        const attr = triggerFunc(this,'clickOpen:getAttr');
        
        return qsa(parent,"["+attr+"='1']");
    });
    
    setFunc(this,'clickOpen:getChilds',function() {
        const target = triggerFunc(this,'clickOpen:getTarget');
        const attr = triggerFunc(this,'clickOpen:getAttr');
        
        return qsa(target,"["+attr+"='1']");
    });
    
    setFunc(this,'clickOpen:closeAll',function() {
        const all = triggerFunc(this,'clickOpen:getAll');
        d(all);
        triggerCustom(all,'clickOpen:close');
    });
    
    setFunc(this,'clickOpen:closeOthers',function() {
        const all = triggerFunc(this,'clickOpen:getAll');
        const others = $(all).not(this);
        triggerCustom(others,'clickOpen:close');
    });
    
    setFunc(this,'clickOpen:closeChilds',function() {
        const childs = triggerFunc(this,'clickOpen:getChilds');
        triggerCustom(childs,'clickOpen:close');
    });
    
    setFunc(this,'clickOpen:toggle',function() {
        const isOpen = triggerFunc(this,'clickOpen:isOpen');
        triggerCustom(this,(isOpen === true)? 'clickOpen:close':'clickOpen:open');
    });
    
    setFunc(this,'keyboard:escape:prevent',function() {
        return (triggerFunc(this,'clickOpen:isOpen'))? true:false;
    });
    
    
    // event
    ael(this,'clickOpen:open',function() {
        if(!triggerFunc(this,'clickOpen:allowMultiple'))
        triggerFunc(this,'clickOpen:closeOthers');
        
        if(triggerFunc(this,'clickOpen:isOpen') !== true)
        {
            if(triggerFunc(this,'clickOpen:isInit') !== true)
            {
                triggerFunc(this,'clickOpen:init');
                $(this).data('clickOpen-init',true);
            }
            
            const attr = triggerFunc(this,'clickOpen:getAttr');
            $(this).addClass('active');
            $(this).attr(attr,1);
            triggerCustom(this,'clickOpen:focus');
        }
        
        const background = triggerFunc(document,'doc:getBackground');
        const bgFrom = triggerFunc(this,'clickOpen:getBackgroundFrom');
        triggerFunc(background,'background:set',bgFrom,false);
    });
    
    ael(this,'clickOpen:close',function() {
        if(triggerFunc(this,'clickOpen:isOpen') === true)
        {
            const attr = triggerFunc(this,'clickOpen:getAttr');
            $(this).removeClass('active');
            $(this).removeAttr(attr);
            
            const background = triggerFunc(document,'doc:getBackground');
            const bgFrom = triggerFunc(this,'clickOpen:getBackgroundFrom');
            triggerFunc(background,'background:unset',bgFrom);
        }
    });
    
    ael(this,'clickOpen:focus',function() {
        const container = triggerFunc(this,'clickOpen:getTarget');
        
        if($(container).is('[tabindex]'))
        $(container).focus();
    });
    
    ael(this,'keyboard:escape:blocked',function() {
        triggerCustom(this,'clickOpen:close');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        const $this = $(this);
        const container = triggerFunc(this,'clickOpen:getTarget');
        Component.KeyboardEnter.call(container,true);
        
        // event
        ael(container,'click',function(event) {
            triggerFunc($this,'clickOpen:closeChilds');
            event.stopPropagation();
        });
        
        ael(container,'keyboard:enter:blocked',function(event,keyEvent) {
            const target = keyEvent.target;
            const tagName = Dom.tag(target);
            
            if(Arr.in(tagName,['a','button']))
            triggerEvent(target,'click');
        });
        
        
        // delegate
        aelDelegate(container,'click','a',function(event) {
            triggerFunc(document,'doc:clickEvent',event);
            
            event.stopPropagation();
        });
    });
    
    return this;
}

// export
Component.ClickOpenBase = ClickOpenBase;