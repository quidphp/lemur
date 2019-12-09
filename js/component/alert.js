/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// alert
// component to launch an alert notification when an event is triggered
const Alert = Component.Alert = function(type)
{
    // func
    setFunc(this,'alert:getText',function() {
        return $(this).data('alert');
    });
    
    
    // event
    ael(this,type,function(event) {
        const alertText = triggerFunc(this,'alert:getText');
        
        if(Str.isNotEmpty(alertText))
        alert(alertText);
    });
    
    return this;
}