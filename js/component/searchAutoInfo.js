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
    
    
    // handler
    setHandler(this,'searchAutoInfo:getInfo',function() {
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
        const info = trigHandler(this,'searchAutoInfo:getInfo');
        
        Component.ClickOpen.call(info,$option.info)
        
        ael(info,'clickOpen:open',function() {
            $($this).attr($option.attrInfo,1);
        });
        
        ael(info,'clickOpen:close',function() {
            $($this).removeAttr($option.attrInfo);
        });
        
        trigSetup(info);
    }
    
    
    // bindField
    const bindField = function() 
    {
        const info = trigHandler(this,'searchAutoInfo:getInfo');
        const field = trigHandler(this,'form:getValidateField');
        
        ael(field,'click',function() {
            if(trigHandler(this,'validate:isEmpty'))
            trigEvt(info,'clickOpen:open');
        });
        
        ael(field,'validate:empty',function() {
            if($(this).is(":focus"))
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