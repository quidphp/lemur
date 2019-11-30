/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// vari
// script with a set of helper functions related to variables
Quid.Vari = new function() 
{    
    // instance
    var $inst = this;
    
    
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
        var r = true;
        
        if(Quid.Scalar.is(value))
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
        var r = false;
        var args = Array.from(arguments);
        var length = args.length;
        var json = null;
        
        if(length > 1)
        {
            for (var i = 0; i < length; i++) 
            {
                json = Quid.Json.encode(args[i]);
                
                if(typeof jsonOld === 'undefined')
                var jsonOld = json;
                
                else
                {
                    r = (json === jsonOld);
                    
                    if(r === false)
                    break;
                }
            }
        }
        
        return r;
    }
    
    
    // isEqualStrict
    // comme isEqual, mais les objects et array doivent être les mêmes variables
    this.isEqualStrict = function()
    {
        var r = false;
        var args = Array.from(arguments);
        var length = args.length;
        
        if(length > 1)
        {
            for (var i = 0; i < args.length; i++) 
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
        }
        
        return r;
    }
    
    
    // type
    // retourne le vrai type d'un objet ou d'une variable
    this.type = function(value)
    {
        var r = typeof value;
        var obj = {};
        
        if(value == null)
        r = value + "";
        
        else if(r === 'function')
        {
            var str = obj.toString.call(value);
            r = obj[str] || "object";
        }
        
        return r;
    }
};