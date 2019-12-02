/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validate
// script with behaviours related to validation
const Validate = new function() 
{
    // instance
    const $inst = this;
    
    
    // isNumericDash
    // retourne vrai si la valeur contient seulement des caractères numérique ou -
    this.isNumericDash = function(value)
    {
        return $inst.regex(value,"^[0-9\-]+$");
    }
    
    
    // isEmail
    // retourne vrai si la valeur est un email
    this.isEmail = function(value)
    {
        return $inst.regex(value,/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{1,4})+$/);
    }
    
    
    // regex
    // permet de lancer un test d'expression régulière
    this.regex = function(value,exp)
    {
        let r = false;
        
        if(Str.is(value) && exp)
        {
            const regex = new RegExp(exp);
            
            if(regex.test(value))
            r = true;
        }
        
        return r;
    }
}

// export
Lemur.Validate = Validate;