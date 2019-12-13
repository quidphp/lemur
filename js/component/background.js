/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// background
// component for a background that can fadein or out
const Background = Component.Background = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlrs(this,'background:',{
        
        // retourne vrai si le background existe et est présentement actif
        isActive: function() {
            return ($(this).attr('data-from') != null)? true:false;
        },
        
        // permet d'ajouter une attribut data au background
        set: function(value,replace) {
            let r = false;
            
            if(Str.isNotEmpty(value))
            {
                if(replace === true || $(this).attr('data-from') == null)
                {
                    r = true;
                    $(this).attr('data-from',value);
                }
            }
            
            return r;
        },
        
        // enlève les attributs du background
        unset: function(value) {
            let r = false;
            
            if(trigHdlr(this,'background:isActive'))
            {
                if(value == null || value === $(this).attr('data-from'))
                {
                    r = true;
                    $(this).removeAttr('data-from');
                }
            }
            
            return r;
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        documentBind.call(this);
    });
    
    
    // documentBind
    const documentBind = function() 
    {
        const background = this;
        
        setHdlr(document,'doc:getBackground',function() {
            return background;
        });
        
        ael(document,'doc:unmountPage',function() {
            trigHdlr(background,'background:unset');
        });

        ael(this,'click',function() {
            trigHdlr(this,'background:unset');
        });
    }
    
    return this;
}