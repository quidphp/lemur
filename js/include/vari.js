/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// vari
// script with a set of helper functions related to variables
const Vari = new function() 
{    
    // instance
    const $inst = this;
    
    
    // is
    // vrai si pas non défini
    this.is = function(value)
    {
        return typeof(value) !== 'undefined';
    }

    
    // isEmpty
    // retourne vrai si la variable est vide
    this.isEmpty = function(value)
    {
        let r = true;
        
        if(Scalar.is(value))
        r = (!value)? true:false;
        
        else
        {
            var name;
            
            for (name in value) 
            {
                r = false;
                break;
            }
        }
        
        return r;
    }
    
    
    // isNotEmpty
    // retourne vrai si la variable est non vide
    this.isNotEmpty = function(value)
    {
        return !$inst.isEmpty(value);
    }
    

    // isEqual
    // compare plusieurs variables
    // retourne vrai si les valeurs contenus sont égales
    this.isEqual = function() 
    {
        let r = false;
        const args = Array.from(arguments);
        const length = args.length;
        let json = null;
        var i;
        
        for (i = 0; i < length; i++) 
        {
            json = Json.encode(args[i]);
            
            if(typeof jsonOld === 'undefined')
            var jsonOld = json;
            
            else
            {
                r = (json === jsonOld);
                
                if(r === false)
                break;
            }
        }
        
        return r;
    }
    
    
    // isEqualStrict
    // comme isEqual, mais les objects et array doivent être les mêmes variables
    this.isEqualStrict = function()
    {
        let r = false;
        const args = Array.from(arguments);
        const length = args.length;
        var i;
        
        for (i = 0; i < args.length; i++) 
        {
            if(typeof first === 'undefined')
            var first = args[i];
            
            else
            {
                r = Object.is(first,args[i]);
                
                if(r === false)
                break;
            }
        }
        
        return r;
    }
    
    
    // type
    // retourne le vrai type d'un objet ou d'une variable
    this.type = function(value)
    {
        let r = typeof value;
        const obj = {};
        
        if(value == null)
        r = value + "";
        
        else if(r === 'function')
        {
            const str = obj.toString.call(value);
            r = obj[str] || "object";
        }
        
        return r;
    }
}

// export
Lemur.Vari = Vari;