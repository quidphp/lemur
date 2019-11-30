/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// obj
// script with a set of helper functions related to objects
Quid.Obj = new function() 
{    
    // instance
    var $inst = this;
    
    
    // is
    // retourne vrai si c'est un objet
    this.is = function(value)
    {
        return Quid.Vari.type(value) === 'object';
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
        return $inst.is(value) && Quid.Vari.isEmpty(value);
    }
    
    
    // isNotEmpty
    // retourne vrai si c'est un objet non-vide
    this.isNotEmpty = function(value)
    {
        return $inst.is(value) && Quid.Vari.isNotEmpty(value);
    }
    
    
    // hasProperty
    // retourne vrai si l'objet a la propriété
    this.hasProperty = function(prop,value)
    {
        return (Quid.Str.is(prop) && $inst.is(value))? value.hasOwnProperty(prop):false
    }
    

    // isEqual
    // compare plusieurs objets (ou array)
    // retourne vrai si les valeurs contenus sont égales
    this.isEqual = function() 
    {
        var r = false;
        var args = Array.from(arguments);
        
        if(args.length > 1 && $inst.is(args[0]))
        r = Quid.Vari.isEqual.apply(null,args);
        
        return r;
    }
    
    
    // length
    // retourne la longueur de l'objet
    this.length = function(value) 
    {
        var r = null;
        
        if($inst.is(value))
        {
            var keys = Object.keys(value);
            r = keys.length;
        }
        
        return r;
    }
    
    
    // str
    // permet de convertir un objet en string
    // possible de spécifier un séparateur et s'il faut quote les valeurs
    this.str = function(obj,separator,quote) 
    {
        var r = '';
        separator = (Quid.Str.isNotEmpty(separator))? separator:'=';
        var keys = Object.keys(obj);
        var key;
        var value;
        
        for (var i = 0; i < keys.length; i++) 
        {
            key = keys[i];
            value = obj[key];
            
            if(Quid.Str.isNotEmpty(key))
            {
                if(Quid.Obj.is(value))
                value = Quid.Json.encode(value);                
                
                else
                value = Quid.Str.cast(value);
                
                if(quote === true)
                value = Quid.Str.quote(value,false);
                
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
        var r = {};
        var args = Array.from(arguments);
        
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
        var r = {};
        var args = Array.from(arguments);
        
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
        if(Quid.Arr.is(array) && $inst.is(r))
        {
            for (var i = 0; i < array.length; i++) {
                var value = array[i];
                
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
};