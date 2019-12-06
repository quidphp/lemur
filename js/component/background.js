/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// background
// component for a background that can fadein or out
const Background = function()
{
    // nodes
    const $nodes = this;
    
    
    // func
    
    // isActive
    // retourne vrai si le background existe et est présentement actif
    setFunc(this,'background:isActive',function() {
        return ($(this).attr('data-from') != null)? true:false;
    });
    
    // set
    // permet d'ajouter une attribut data au background
    setFunc(this,'background:set',function(value,replace) {
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
    });
    
    // unset
    // enlève les attributs du background
    setFunc(this,'background:unset',function(value) {
        let r = false;
        
        if(triggerFunc(this,'background:isActive'))
        {
            if(value == null || value === $(this).attr('data-from'))
            {
                r = true;
                $(this).removeAttr('data-from');
            }
        }
        
        return r;
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        documentBind.call(this);
    });
    
    
    // documentBind
    const documentBind = function() 
    {
        const background = $(this);
        
        setFunc(document,'doc:getBackground',function() {
            return background;
        });
        
        ael(document,'doc:unmount',function() {
            triggerEvent(background,'background:unset');
        });

        // docClick, ferme le background
        ael(this,'click',function() {
            triggerEvent(this,'background:unset');
        });
    }
    
    return this;
}

// export
Component.Background = Background;