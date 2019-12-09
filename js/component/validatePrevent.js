/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validatePrevent
// component that blocks an event if the validation is not successfull
const ValidatePrevent = Component.ValidatePrevent = function(type) 
{
    // func
    setFunc(this,'validatePrevent:getTargets',function(event) {
        return this;
    });
    
    setFunc(this,'validatePrevent:trigger',function(event) {
        let r = true;
        const targets = triggerFunc(this,'validatePrevent:getTargets');
        
        if(Vari.isNotEmpty(targets))
        {
            $(targets).each(function(index, el) {
                const val = triggerFunc(this,"validate:trigger");
                
                if(val === false)
                r = val;
            });
        }
        
        return r;
    });
    
    
    // event
    ael(this,type,function(event) {
        let r = triggerFunc(this,'validatePrevent:trigger')
        
        if(r !== true)
        {
            Evt.preventStop(event,true);
            triggerEvent(this,'validatePrevent:deny',event);
        }
        
        else
        triggerEvent(this,'validatePrevent:allow',event);
        
        return r;
    });
    
    
    // setup
    aelOnce(this,'component:setup', function(event) {
        const targets = triggerFunc(this,'validatePrevent:getTargets');
        
        $(targets).each(function() {
            if(!triggerFunc(this,'validate:isBinded'))
            Component.Validate.call(this);
        });
        
        triggerSetup(targets);
    });
    
    return this;
}