/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// obj
// script with a set of helper functions related to objects
const Obj = new function() 
{    
    // instance
    const $inst = this;
    
    
    // is
    // retourne vrai si c'est un objet
    this.is = function(value)
    {
        return Vari.type(value) === 'object';
    }

    
    // isPlain
    // retourne vrai si c'est un objet plain
    this.isPlain = function(value)
    {
        return $.isPlainObject(value);
    }
    
    
    // isEmpty
    // retourne vrai si c'est un objet vide
    this.isEmpty = function(value)
    {
        return $inst.is(value) && Vari.isEmpty(value);
    }
    
    
    // isNotEmpty
    // retourne vrai si c'est un objet non-vide
    this.isNotEmpty = function(value)
    {
        return $inst.is(value) && Vari.isNotEmpty(value);
    }
    
    
    // hasProperty
    // retourne vrai si l'objet a la propriété
    this.hasProperty = function(prop,value)
    {
        return (Str.is(prop) && $inst.is(value))? value.hasOwnProperty(prop):false
    }
    

    // isEqual
    // compare plusieurs objets (ou array)
    // retourne vrai si les valeurs contenus sont égales
    this.isEqual = function() 
    {
        let r = false;
        const args = Array.from(arguments);
        
        if(args.length > 1 && $inst.is(args[0]))
        r = Vari.isEqual.apply(null,args);
        
        return r;
    }
    
    
    // length
    // retourne la longueur de l'objet
    this.length = function(value) 
    {
        let r = null;
        
        if($inst.is(value))
        {
            const keys = Object.keys(value);
            r = keys.length;
        }
        
        return r;
    }
    
    
    // str
    // permet de convertir un objet en string
    // possible de spécifier un séparateur et s'il faut quote les valeurs
    this.str = function(obj,separator,quote) 
    {
        let r = '';
        separator = (Str.isNotEmpty(separator))? separator:'=';
        const keys = Object.keys(obj);
        let key;
        let value;
        var i;
        
        for (i = 0; i < keys.length; i++) 
        {
            key = keys[i];
            value = obj[key];
            
            if(Str.isNotEmpty(key))
            {
                if(Obj.is(value))
                value = Json.encode(value);                
                
                else
                value = Str.cast(value);
                
                if(quote === true)
                value = Str.quote(value,false);
                
                if(r.length)
                r += ' ';
                
                r += key;
                r += separator;
                r += value;
            }
        }

        return r;
    }
    
    
    // replace
    // retourne un nouvel objet contenant le résultat d'un merge unidimensionnel de tous les objets données en argument
    this.replace = function() 
    {
        let r = {};
        let args = Array.from(arguments);
        
        if(args.length > 0 && $inst.is(args[0]))
        {
            args = [r].concat(args);
            r = Object.assign.apply(null,args);
        }
        
        return r;
    }
    
    
    // replaceRecursive
    // retourne un nouvel objet contenant le résultat d'un merge multidimensionnel de tous les objets données en argument
    this.replaceRecursive = function() 
    {
        let r = {};
        let args = Array.from(arguments);
        
        if(args.length > 0 && $inst.is(args[0]))
        {
            args = [true,r].concat(args);
            r = $.extend.apply(null,args);
        }
        
        return r;
    }
    
    
    // climb
    // permet de grimper dans un objet à partir d'un tableau
    this.climb = function(array,r) 
    {
        if(Arr.is(array) && $inst.is(r))
        {
            var i;
            
            for (i = 0; i < array.length; i++) {
                const value = array[i];
                
                if($inst.hasProperty(value,r))
                r = r[value];
                
                else
                {
                    r = null;
                    break;
                }
            }
        }
        
        return r;
    }
}

// export
Lemur.Obj = Obj;