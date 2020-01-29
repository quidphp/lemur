/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// searchAutoInfo
// script with logic for an auto-complete search component with another info popup when value is empty
Component.SearchAutoInfo = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replaceRecursive({
        targetInfo: ".search-info",
        attrInfo: 'data-search-info',
        background: "searchAutoInfo",
        focusableTarget: "a",
        inputSearch: {
            useCurrent: false
        },
        info: {
            background: "searchAutoInfo",
        }
    },option);
    
    
    // components
    Component.ClickOpenInputAjax.call(this,$option);
    Component.Focusable.call(this);
    Component.KeyboardArrow.call(this,'vertical');
    
    
    // handler
    setHdlr(this,'searchAutoInfo:getInfo',function() {
        return qs(this,$option.targetInfo);
    });
    
    setHdlr(this,'focusable:getTargets',function() {
        const content = trigHdlr(this,'clickOpen:getTargetContent');
        return qsa(content,$option.focusableTarget);
    });
    
    
    // event
    ael(this,'keyboardArrow:down',function() {
        trigHdlr(this,'focusable:next');
    });
    
    ael(this,'keyboardArrow:up',function() {
        trigHdlr(this,'focusable:prev');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindInfo.call(this);
        bindField.call(this);
    });
    
    
    // bindInfo
    const bindInfo = function() 
    {
        const $this = this;
        const info = trigHdlr(this,'searchAutoInfo:getInfo');
        
        Component.ClickOpen.call(info,$option.info)
        
        ael(info,'clickOpen:opened',function() {
            setAttr($this,$option.attrInfo,1);
        });
        
        ael(info,'clickOpen:closed',function() {
            setAttr($this,$option.attrInfo,0);
        });
        
        trigSetup(info);
    }
    
    
    // bindField
    const bindField = function() 
    {
        const info = trigHdlr(this,'searchAutoInfo:getInfo');
        const field = trigHdlr(this,'form:getValidateField');
        
        ael(field,'click',function() {
            if(trigHdlr(this,'validate:isEmpty'))
            trigEvt(info,'clickOpen:open');
        });
        
        ael(field,'validate:empty',function() {
            if(Nod.match(this,":focus"))
            trigEvt(info,'clickOpen:open');
        });
        
        ael(field,'validate:notEmpty',function() {
            trigEvt(info,'clickOpen:close');
        });
        
        ael(field,'keyboardEscape:blocked',function(event) {
            trigEvt(info,'clickOpen:close');
        });
    }
    
    return this;
}