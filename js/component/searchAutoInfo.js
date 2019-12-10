/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// searchAutoInfo
// script with logic for an auto-complete search component with another info popup when value is empty
const SearchAutoInfo = Component.SearchAutoInfo = function(option)
{
    // option
    const $option = Pojo.replaceRecursive({
        targetInfo: ".search-info",
        attrInfo: 'data-search-info',
        background: "searchAutoInfo",
        info: {
            background: "searchAutoInfo",
        }
    },option);
    
    
    // components
    Component.ClickOpenInputAjax.call(this,$option);
    
    
    // func
    setFunc(this,'searchAutoInfo:getInfo',function() {
        return qs(this,$option.targetInfo);
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
        const info = triggerFunc(this,'searchAutoInfo:getInfo');
        
        Component.ClickOpen.call(info,$option.info)
        
        ael(info,'clickOpen:open',function() {
            $($this).attr($option.attrInfo,1);
        });
        
        ael(info,'clickOpen:close',function() {
            $($this).removeAttr($option.attrInfo);
        });
        
        triggerSetup(info);
    }
    
    
    // bindField
    const bindField = function() 
    {
        const info = triggerFunc(this,'searchAutoInfo:getInfo');
        const field = triggerFunc(this,'form:getValidateField');
        
        ael(field,'click',function() {
            if(triggerFunc(this,'validate:isEmpty'))
            triggerEvent(info,'clickOpen:open');
        });
        
        ael(field,'validate:empty',function() {
            if($(this).is(":focus"))
            triggerEvent(info,'clickOpen:open');
        });
        
        ael(field,'validate:notEmpty',function() {
            triggerEvent(info,'clickOpen:close');
        });
        
        ael(field,'keyboardEscape:blocked',function(event) {
            triggerEvent(info,'clickOpen:close');
        });
    }
    
    return this;
}