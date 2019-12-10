/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validate
// script with behaviours related to validation
const Validate = Lemur.Validate = {
    
    // isNumericDash
    // retourne vrai si la valeur contient seulement des caractères numérique ou -
    isNumericDash: function(value)
    {
        return this.regex(value,"^[0-9\-]+$");
    },
    
    
    // isEmail
    // retourne vrai si la valeur est un email
    isEmail: function(value)
    {
        return this.regex(value,/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{1,4})+$/);
    },
    
    
    // regex
    // permet de lancer un test d'expression régulière
    regex: function(value,exp)
    {
        let r = false;
        
        if(Str.is(value) && exp)
        {
            const regex = new RegExp(exp);
            
            if(regex.test(value))
            r = true;
        }
        
        return r;
    },
    
    
    // trigger
    // lance la validation required et ensuite pattern
    trigger: function(value,required,pattern)
    {
        let r = this.required(value,required);
        
        if(r === true)
        r = this.pattern(value,pattern);
        
        return r;
    },
    
    
    // required
    // fait le test required sur la valeur
    required: function(value,required)
    {
        let r = true;
        
        if(Bool.is(required))
        required = Bool.fromInt(required);
        
        if(Num.is(required) && required > 0)
        {
            value = Str.cast(value);
            value = Str.trim(value);
            
            if(!value.length)
            r = false;
        }
        
        return r;
    },
    
    
    // pattern
    // fait le test required sur la valeur
    pattern: function(value,pattern)
    {
        let r = true;
        
        if(Str.isNotEmpty(pattern))
        {
            value = Str.cast(value);
            
            if(value.length && !this.regex(value,pattern))
            r = false;
        }
        
        return r;
    }
}