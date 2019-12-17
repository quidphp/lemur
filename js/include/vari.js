/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// vari
// script with a set of helper functions related to variables
const Vari = Lemur.Vari = {    
    
    // is
    // vrai si pas non défini
    is: function(value)
    {
        return typeof(value) !== 'undefined';
    },

    
    // isEmpty
    // retourne vrai si la variable est vide
    isEmpty: function(value)
    {
        let r = true;
        
        if(Arr.is(value) || Str.is(value))
        r = (value.length > 0)? false:true;
        
        else if(Scalar.is(value))
        r = (!value)? true:false;
        
        else if(value != null)
        {
            this.eachProto(value,function() {
                return r = false;
            });
        }
        
        return r;
    },
    
    
    // isNotEmpty
    // retourne vrai si la variable est non vide
    isNotEmpty: function(value)
    {
        return !this.isEmpty(value);
    },
    

    // isNull
    // retourne vrai si la valeur est null
    isNull: function(value)
    {
        return value === null;
    },
    
    
    // isUndefined
    // retourne vrai si la valeur est undefined
    isUndefined: function(value)
    {
        return value === undefined;
    },
    
    
    // isEqual
    // compare plusieurs variables
    // retourne vrai si les valeurs contenus sont égales
    isEqual: function() 
    {
        let r = false;
        let json = null;
        let jsonOld = undefined;
        
        r = ArrLike.each(arguments,function(value) {
            json = Json.encode(value);
            
            if(typeof jsonOld === 'undefined')
            jsonOld = json;
            
            else
            return (json === jsonOld);
        });
        
        return r;
    },
    
    
    // isEqualStrict
    // comme isEqual, mais les objects et array doivent être les mêmes variables
    isEqualStrict: function()
    {
        let r = false;
        let first = undefined;
        
        r = ArrLike.each(arguments,function(value) {
            if(typeof first === 'undefined')
            first = value;
            
            else
            return Object.is(first,value);
        });
        
        return r;
    },
    
    
    // type
    // retourne le vrai type d'une variable
    type: function(value)
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
    },
    
    
    // eachProto
    // fait un each en incluant les propriétés du prototype
    // retourne true si le loop a complêté
    eachProto: function(loop,callback)
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