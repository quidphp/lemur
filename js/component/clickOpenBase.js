/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenBase
// grants base methods and events for a clickOpen component
const ClickOpenBase = Component.ClickOpenBase = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        target: true,
        background: 'clickOpen',
        attr: 'data-active',
        closeUnsetContent: false,
        multiple: false
    },option);
    
    
    // keyboard escape
    Component.InitOpenClose.call(this,'clickOpen',$option.attr);
    Component.KeyboardEscape.call(this);
    
    
    // handler
    setHdlrs(this,'clickOpen:',{
        
        isEmpty: function() {
            const target = trigHdlr(this,'clickOpen:getTargetContent');
            return $(target).is(":empty");
        },
        
        getTarget: function() {
            let r = $option.target;
            
            if(r === true)
            r = this;
            
            if(Str.isNotEmpty(r))
            r = qs(this,r);
            
            return r;
        },
        
        getTargetFocus: function() {
            return trigHdlr(this,'clickOpen:getTarget');
        },
        
        getTargetContent: function() {
            return trigHdlr(this,'clickOpen:getTarget');
        },
        
        setTargetContent: function(data) {
            const target = trigHdlr(this,'clickOpen:getTargetContent');
            $(target).html(data);
        },
        
        unsetTargetContent: function() {
            if(!trigHdlr(this,'clickOpen:isEmpty'))
            {
                const target = trigHdlr(this,'clickOpen:getTargetContent');
                trigEvt(this,'clickOpen:unmountContent');
                $(target).html('');
            }
        },
        
        getParent: function() {
            const attr = $option.attr;
            
            return $(this).parents("["+attr+"='1']").get(0);
        },
        
        getParentOrRoot: function() {
            return trigHdlr(this,'clickOpen:getParent') || document;
        },
        
        getAll: function() {
            const parent = trigHdlr(this,'clickOpen:getParentOrRoot');
            const attr = $option.attr;
            
            return qsa(parent,"["+attr+"='1']");
        },
        
        getChilds: function() {
            const target = trigHdlr(this,'clickOpen:getTarget');
            const attr = $option.attr;
            
            return qsa(target,"["+attr+"='1']");
        },
        
        closeAll: function() {
            const all = trigHdlr(this,'clickOpen:getAll');
            trigEvt(all,'clickOpen:close');
        },
        
        closeOthers: function(newBg) {
            const all = trigHdlr(this,'clickOpen:getAll');
            const others = $(all).not(this).get();
            trigEvt(others,'clickOpen:close',newBg);
        },
        
        closeChilds: function() {
            const childs = trigHdlr(this,'clickOpen:getChilds');
            trigEvt(childs,'clickOpen:close');
        },
        
        toggle: function() {
            const isOpen = trigHdlr(this,'clickOpen:isOpen');
            trigEvt(this,(isOpen === true)? 'clickOpen:close':'clickOpen:open');
        }
    });
    
    setHdlr(this,'keyboardEscape:prevent',function() {
        return (trigHdlr(this,'clickOpen:isOpen'))? true:false;
    });
    
    
    // event
    ael(this,'clickOpen:unmountContent',function() {
        const node = trigHdlr(this,'clickOpen:getTargetContent');
        trigEvt(document,'doc:unmountCommon',node);
    });
    
    ael(this,'clickOpen:opened',function() {
        const bgFrom = $option.background;
        
        if($option.multiple !== true)
        trigHdlr(this,'clickOpen:closeOthers',bgFrom);
        
        trigEvt(this,'clickOpen:focus');
        
        const background = trigHdlr(document,'doc:getBackground');
        trigHdlr(background,'background:set',bgFrom,false);
    });
    
    ael(this,'clickOpen:closed',function(event,newBg) {
        if($option.closeUnsetContent === true)
        trigHdlr(this,'clickOpen:unsetTargetContent');
        
        const background = trigHdlr(document,'doc:getBackground');
        const bgFrom = $option.background;
        if(newBg !== bgFrom)
        trigHdlr(background,'background:unset',bgFrom);
    });
        
    ael(this,'clickOpen:focus',function() {
        const target = trigHdlr(this,'clickOpen:getTargetFocus');
        
        if($(target).is('[tabindex]'))
        $(target).focus();
    });
    
    ael(this,'keyboardEscape:blocked',function() {
        trigEvt(this,'clickOpen:close');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        const $this = this;
        const container = trigHdlr(this,'clickOpen:getTarget');
        const targetContainer = trigHdlr(this,'clickOpen:getTargetContent');
        Component.KeyboardEnter.call(container,true);
        
        // event
        ael(container,'click',function(event) {
            trigHdlr($this,'clickOpen:closeChilds');
            event.stopPropagation();
        });
        
        ael(container,'keyboardEnter:blocked',function(event,keyEvent) {
            const target = keyEvent.target;
            const tagName = Dom.tag(target);

            if(tagName === 'a')
            trigHdlr(document,'history:event',keyEvent);
            else
            trigEvt(target,'click');
        });
        
        // delegate
        aelDelegate(targetContainer,'click','a',function(event) {
            trigHdlr(document,'history:event',event);
            
            event.stopPropagation();
        });
    });
    
    return this;
}