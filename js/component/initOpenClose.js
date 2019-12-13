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
            return (getData(this,type+'-init') === true);
        },
        
        isOpen: function() {
            return (Integer.cast(getAttr(this,attr)) === 1);
        }
    });
    
    
    // event
    ael(this,type+':open',function() {
        if(trigHdlr(this,type+':isOpen') !== true)
        {
            if(trigHdlr(this,type+':isInit') !== true)
            {
                trigEvt(this,type+':init');
                setData(this,type+'-init',true);
            }
            
            setAttr(this,attr,1);
            
            trigEvt(this,type+':opened');
        }
    });
    
    ael(this,type+':close',function() {
        if(trigHdlr(this,type+':isOpen') === true)
        {
            setAttr(this,attr,0);
            
            trigEvt(this,type+':closed');
        }
    });
    
    return this;
}