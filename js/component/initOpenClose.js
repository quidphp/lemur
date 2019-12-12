/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// initOpenClose
// base component used for opening, closing and initializing a container
const InitOpenClose = Component.InitOpenClose = function(type,attr)
{
    // check
    Str.check(type);
    Str.check(attr);
    
    
    // handler
    setHdlrs(this,type+':',{
        
        isInit: function() {
            return ($(this).data(type+'-init') === true);
        },
        
        isOpen: function() {
            return (Integer.cast($(this).attr(attr)) === 1);
        }
    });
    
    
    // event
    ael(this,type+':open',function() {
        if(trigHdlr(this,type+':isOpen') !== true)
        {
            if(trigHdlr(this,type+':isInit') !== true)
            {
                trigEvt(this,type+':init');
                $(this).data(type+'-init',true);
            }
            
            $(this).attr(attr,1);
            
            trigEvt(this,type+':opened');
        }
    });
    
    ael(this,type+':close',function() {
        if(trigHdlr(this,type+':isOpen') === true)
        {
            $(this).attr(attr,0);
            
            trigEvt(this,type+':closed');
        }
    });
    
    return this;
}