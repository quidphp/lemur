/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// alert
// component to launch an alert notification when an event is triggered
Component.Alert = function(type)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlr(this,'alert:getText',function() {
        return getAttr(this,'data-alert');
    });
    
    
    // event
    ael(this,type,function(event) {
        const alertText = trigHdlr(this,'alert:getText');
        
        if(Str.isNotEmpty(alertText))
        alert(alertText);
    });
    
    return this;
}