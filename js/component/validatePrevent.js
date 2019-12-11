/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validatePrevent
// component that blocks an event if the validation is not successfull
const ValidatePrevent = Component.ValidatePrevent = function(type) 
{
    // handler
    setHandler(this,'validatePrevent:getTargets',function(event) {
        return this;
    });
    
    setHandler(this,'validatePrevent:trigger',function(event) {
        let r = true;
        const targets = trigHandler(this,'validatePrevent:getTargets');
        
        if(Vari.isNotEmpty(targets))
        {
            $(targets).each(function(index, el) {
                const val = trigHandler(this,"validate:trigger");
                
                if(val === false)
                r = val;
            });
        }
        
        return r;
    });
    
    
    // event
    ael(this,type,function(event) {
        let r = trigHandler(this,'validatePrevent:trigger')
        
        if(r !== true)
        {
            Evt.preventStop(event,true);
            trigEvt(this,'validatePrevent:deny',event);
        }
        
        else
        trigEvt(this,'validatePrevent:allow',event);
        
        return r;
    });
    
    
    // setup
    aelOnce(this,'component:setup', function(event) {
        const targets = trigHandler(this,'validatePrevent:getTargets');
        
        $(targets).each(function() {
            if(!trigHandler(this,'validate:isBinded'))
            Component.Validate.call(this);
        });
        
        trigSetup(targets);
    });
    
    return this;
}