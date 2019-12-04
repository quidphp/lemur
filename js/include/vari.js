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
            $inst.eachProto(value,function() {
                return r = false;
            });
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
        let json = null;
        let jsonOld = undefined;
        
        r = Arr.each(arguments,function(value) {
            json = Json.encode(value);
            
            if(typeof jsonOld === 'undefined')
            jsonOld = json;
            
            else
            return (json === jsonOld);
        });
        
        return r;
    }
    
    
    // isEqualStrict
    // comme isEqual, mais les objects et array doivent être les mêmes variables
    this.isEqualStrict = function()
    {
        let r = false;
        let first = undefined;
        
        r = Arr.each(arguments,function(value) {
            if(typeof first === 'undefined')
            first = value;
            
            else
            return Object.is(first,value);
        });
        
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
    
    
    // each
    // méthode utilisé pour faire un for each sur un array, un objet ou une string
    // retourne true si le loop a complêté
    this.each = function(loop,callback) 
    {
        let r = null;
        
        if(Arr.is(loop) || Arr.isLike(loop))
        r = Arr.each(loop,callback);
        
        else if(Obj.is(loop))
        r = Obj.each(loop,callback);
        
        else if(Str.is(loop))
        r = Str.each(loop,callback);
        
        return r;
    };
    
    
    // eachProto
    // fait un each en incluant les propriétés du prototype
    // retourne true si le loop a complêté
    this.eachProto = function(loop,callback)
    {
        let r = null;
        
        if(Func.is(callback))
        {
            r = true;
            var key;
            let value;
            let result;
            
            for (key in loop) 
            {
                value = loop[key];
                result = callback.call(value,value,key,loop);
                
                if(result === false)
                {
                    r = false;
                    break;
                }
            }
        }
        
        return r;
    }
}

// export
Lemur.Vari = Vari;