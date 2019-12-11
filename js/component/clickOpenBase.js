/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenBase
// grants base methods and events for a clickOpen component
const ClickOpenBase = Component.ClickOpenBase = function(option)
{
    // option
    const $option = Object.assign({
        target: true,
        background: 'clickOpen',
        attr: 'data-active',
        closeUnsetContent: false,
        multiple: false
    },option);
    
    
    // keyboard escape
    Component.KeyboardEscape.call(this);
    
    
    // handler
    setHandler(this,'clickOpen:isInit',function() {
        return ($(this).data('clickOpen-init') === true)? true:false;
    });
    
    setHandler(this,'clickOpen:isOpen',function() {
        return (Integer.cast($(this).attr($option.attr)) === 1)? true:false;
    });
    
    setHandler(this,'clickOpen:isClose',function() {
        return (!trigHandler(this,'clickOpen:isOpen'))? true:false;
    });
    
    setHandler(this,'clickOpen:isEmpty',function() {
        const target = trigHandler(this,'clickOpen:getTargetContent');
        return $(target).is(":empty");
    });
    
    setHandler(this,'clickOpen:getAttr',function() {
        return $option.attr;
    });
    
    setHandler(this,'clickOpen:allowMultiple',function() {
        return $option.multiple;
    });
    
    setHandler(this,'clickOpen:getBackgroundFrom',function() {
        return $option.background;
    });
    
    setHandler(this,'clickOpen:getTarget',function() {
        let r = $option.target;
        
        if(r === true)
        r = this;
        
        if(Str.isNotEmpty(r))
        r = qs(this,r);
        
        return r;
    });
    
    setHandler(this,'clickOpen:getTargetFocus',function() {
        return trigHandler(this,'clickOpen:getTarget');
    });
    
    setHandler(this,'clickOpen:getTargetContent',function() {
        return trigHandler(this,'clickOpen:getTarget');
    });
    
    setHandler(this,'clickOpen:setTargetContent',function(data) {
        const target = trigHandler(this,'clickOpen:getTargetContent');
        $(target).html(data);
    });
    
    setHandler(this,'clickOpen:unsetTargetContent',function() {
        if(!trigHandler(this,'clickOpen:isEmpty'))
        {
            const target = trigHandler(this,'clickOpen:getTargetContent');
            trigEvt(this,'clickOpen:unmountContent');
            $(target).html('');
        }
    });
    
    setHandler(this,'clickOpen:getParentClickOpen',function() {
        const attr = trigHandler(this,'clickOpen:getAttr');
        
        return $(this).parents("["+attr+"='1']").get(0);
    });
    
    setHandler(this,'clickOpen:getParentContainer',function() {
        return trigHandler(this,'clickOpen:getParentClickOpen') || document;
    });
    
    setHandler(this,'clickOpen:getAll',function() {
        const parent = trigHandler(this,'clickOpen:getParentContainer');
        const attr = trigHandler(this,'clickOpen:getAttr');
        
        return qsa(parent,"["+attr+"='1']");
    });
    
    setHandler(this,'clickOpen:getChilds',function() {
        const target = trigHandler(this,'clickOpen:getTarget');
        const attr = trigHandler(this,'clickOpen:getAttr');
        
        return qsa(target,"["+attr+"='1']");
    });
    
    setHandler(this,'clickOpen:closeAll',function() {
        const all = trigHandler(this,'clickOpen:getAll');
        d(all);
        trigEvt(all,'clickOpen:close');
    });
    
    setHandler(this,'clickOpen:closeOthers',function(newBg) {
        const all = trigHandler(this,'clickOpen:getAll');
        const others = $(all).not(this).get();
        trigEvt(others,'clickOpen:close',newBg);
    });
    
    setHandler(this,'clickOpen:closeChilds',function() {
        const childs = trigHandler(this,'clickOpen:getChilds');
        trigEvt(childs,'clickOpen:close');
    });
    
    setHandler(this,'clickOpen:toggle',function() {
        const isOpen = trigHandler(this,'clickOpen:isOpen');
        trigEvt(this,(isOpen === true)? 'clickOpen:close':'clickOpen:open');
    });
    
    setHandler(this,'keyboardEscape:prevent',function() {
        return (trigHandler(this,'clickOpen:isOpen'))? true:false;
    });
    
    
    // event
    ael(this,'clickOpen:unmountContent',function() {
        const node = trigHandler(this,'clickOpen:getTargetContent');
        trigEvt(document,'doc:unmountCommon',node);
    });
    
    ael(this,'clickOpen:open',function() {
        const bgFrom = trigHandler(this,'clickOpen:getBackgroundFrom');
        
        if(!trigHandler(this,'clickOpen:allowMultiple'))
        trigHandler(this,'clickOpen:closeOthers',bgFrom);
        
        if(trigHandler(this,'clickOpen:isOpen') !== true)
        {
            if(trigHandler(this,'clickOpen:isInit') !== true)
            {
                trigHandler(this,'clickOpen:init');
                $(this).data('clickOpen-init',true);
            }
            
            const attr = trigHandler(this,'clickOpen:getAttr');
            $(this).attr(attr,1);
            trigEvt(this,'clickOpen:focus');
        }
        
        const background = trigHandler(document,'doc:getBackground');
        trigHandler(background,'background:set',bgFrom,false);
    });
    
    ael(this,'clickOpen:close',function(event,newBg) {
        if(trigHandler(this,'clickOpen:isOpen') === true)
        {
            const attr = trigHandler(this,'clickOpen:getAttr');
            $(this).removeAttr(attr);
            
            if($option.closeUnsetContent === true)
            trigHandler(this,'clickOpen:unsetTargetContent');
            
            const background = trigHandler(document,'doc:getBackground');
            const bgFrom = trigHandler(this,'clickOpen:getBackgroundFrom');
            if(newBg !== bgFrom)
            trigHandler(background,'background:unset',bgFrom);
        }
    });
    
    ael(this,'clickOpen:focus',function() {
        const target = trigHandler(this,'clickOpen:getTargetFocus');
        
        if($(target).is('[tabindex]'))
        $(target).focus();
    });
    
    ael(this,'keyboardEscape:blocked',function() {
        trigEvt(this,'clickOpen:close');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        const $this = this;
        const container = trigHandler(this,'clickOpen:getTarget');
        Component.KeyboardEnter.call(container,true);
        
        // event
        ael(container,'click',function(event) {
            trigHandler($this,'clickOpen:closeChilds');
            event.stopPropagation();
        });
        
        ael(container,'keyboardEnter:blocked',function(event,keyEvent) {
            const target = keyEvent.target;
            const tagName = Dom.tag(target);
            
            if(Arr.in(tagName,['a','button']))
            trigEvt(target,'click');
        });
        
        
        // delegate
        aelDelegate(container,'click','a',function(event) {
            trigHandler(document,'doc:clickEvent',event);
            
            event.stopPropagation();
        });
    });
    
    return this;
}