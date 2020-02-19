/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpen
// grants base methods and events for a clickOpen component
Component.ClickOpen = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        target: true,
        targetHeight: false,
        background: 'clickOpen',
        attr: 'data-active',
        closeUnsetContent: false,
        multiple: false,
        clickOutside: true,
        clickOutsidePersistent: false
    },option);
    
    
    // keyboard escape
    Component.InitOpenClose.call(this,Pojo.replace($option,{type: 'clickOpen'}));
    Component.KeyboardEscape.call(this);
    
    
    // clickOutside
    if($option.clickOutside)
    {
        Component.ClickOutside.call(this,'clickOpen:close',$option.clickOutsidePersistent);
        
        // handler
        setHdlr(this,'clickOutside:getParent',function() {
            return trigHdlr(this,'clickOpen:getParentOrRoot');
        });
    }
    
    
    // handler
    setHdlrs(this,'clickOpen:',{
        
        isEmpty: function() {
            const target = trigHdlr(this,'clickOpen:getTargetContent');
            return Nod.match(target,":empty");
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
            setHtml(target,data);
        },
        
        unsetTargetContent: function() {
            if(!trigHdlr(this,'clickOpen:isEmpty'))
            {
                const target = trigHdlr(this,'clickOpen:getTargetContent');
                trigEvt(this,'clickOpen:unmountContent');
                setHtml(target,null);
            }
        },
        
        getParent: function() {
            const attr = $option.attr;
            
            return Nod.closestParent(this,"["+attr+"='1']");
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
            const others = Arr.valueStrip(this,all);
            trigEvt(others,'clickOpen:close',newBg);
        },
        
        closeChilds: function() {
            const childs = trigHdlr(this,'clickOpen:getChilds');
            trigEvt(childs,'clickOpen:close');
        },
        
        toggle: function() {
            const isOpen = trigHdlr(this,'clickOpen:isOpen');
            trigEvt(this,(isOpen === true)? 'clickOpen:close':'clickOpen:open');
        },
        
        refreshTargetHeight: function(setAuto) {
            const target = trigHdlr(this,'clickOpen:getTarget');
            
            if($option.targetHeight && trigHdlr(this,'clickOpen:isOpen') && Ele.isVisible(target))
            {
                if(setAuto === true)
                Ele.setDimension(target,null,'auto');
                
                const dimension = Ele.getDimension(target,$option.targetHeight);
                Func.timeout(20,function() { Ele.setDimension(target,null,dimension.height) }); // timeout à 0 ne marche pas pour firefox
            }
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
    
    ael(this,'clickOpen:opened',function(event,isInit,compSetup) {
        const bgFrom = $option.background;
        
        if($option.multiple !== true)
        trigHdlr(this,'clickOpen:closeOthers',bgFrom);
        
        trigEvt(this,'clickOpen:focus');
        
        const background = trigHdlr(document,'doc:getBackground');
        trigHdlr(background,'background:set',bgFrom,false);
        
        trigHdlr(this,'clickOpen:refreshTargetHeight',compSetup);
    });
    
    ael(this,'clickOpen:closed',function(event,newBg) {
        const $this = this;
        
        if($option.closeUnsetContent === true)
        trigHdlr(this,'clickOpen:unsetTargetContent');
        
        const background = trigHdlr(document,'doc:getBackground');
        const bgFrom = $option.background;
        if(newBg !== bgFrom)
        trigHdlr(background,'background:unset',bgFrom);
        
        if($option.targetHeight)
        {
            const target = trigHdlr(this,'clickOpen:getTarget');
            Ele.setDimension(target,null,false);
        }
    });
        
    ael(this,'clickOpen:focus',function() {
        const target = trigHdlr(this,'clickOpen:getTargetFocus');
        
        if(Ele.isFocusable(target))
        Ele.focus(target);
    });
    
    ael(this,'keyboardEscape:blocked',function() {
        trigEvt(this,'clickOpen:close');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        const $this = this;
        const container = trigHdlr(this,'clickOpen:getTarget');
        const targetContainer = trigHdlr(this,'clickOpen:getTargetContent');
        Component.KeyboardEnter.call(container);
        
        // handler
        setHdlr(this,'keyboardEnter:prevent',function(keyEvent,isInput) {
            return (isInput === true)? false:true;
        });
        
        // event
        ael(container,'click',function(event) {
            trigHdlr($this,'clickOpen:closeChilds');
            event.stopPropagation();
        });
        
        ael(container,'keyboardEnter:blocked',function(event,keyEvent) {
            const target = keyEvent.target;
            const tagName = Ele.tag(target);

            if(tagName === 'a')
            trigHdlr(document,'history:event',keyEvent);
            else
            trigBubble(target,'click');
        });
        
        // delegate
        aelDelegate(targetContainer,'click','a',function(event) {
            trigHdlr(document,'history:event',event);
            
            event.stopPropagation();
        });
        
        // already open
        if(trigHdlr(this,'clickOpen:isOpen'))
        trigEvt(this,'clickOpen:opened',true,true);
    });
    
    return this;
}