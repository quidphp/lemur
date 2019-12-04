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
    
    
    // isKey
    // retourne vrai si la valeur est une clé de propriété valide
    this.isKey = function(prop)
    {
        return Scalar.is(prop);
    }
    
    
    // keyExists
    // retourne vrai si l'objet a la propriété
    this.keyExists = function(prop,obj)
    {
        return ($inst.isKey(prop) && $inst.is(obj))? obj.hasOwnProperty(prop):false
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
    
    
    // get
    // permet de retourner la valeur d'une propriété d'un objet
    this.get = function(prop,obj)
    {
        return ($inst.keyExists(prop,obj))? obj[prop]:null;
    }
    
    
    // set
    // permet d'ajouter une nouvelle propriété à un objet
    // l'objet retourner est une copie
    this.set = function(prop,value,obj)
    {
        let r = null;
        
        if($inst.is(obj))
        r = $inst.setRef(prop,value,$inst.replace(obj));
        
        return r;
    }
    
    
    // setRef
    // permet d'ajouter une nouvelle propriété à un objet
    // l'objet retourner est le même (pas une copie)
    this.setRef = function(prop,value,obj)
    {
        let r = null;
        
        if($inst.is(obj))
        {
            obj[prop] = value;
            r = obj;
        }
        
        return r;
    }
    
    
    // unset
    // permet de retirer une propriété d'un objet
    // l'objet retourner est une copie
    this.unset = function(prop,obj)
    {
        let r = null;
        
        if($inst.is(obj))
        r = $inst.unsetRef(prop,$inst.replace(obj));
        
        return r;
    }
    
    
    // unsetRef
    // permet de retirer une propriété d'un objet
    // l'objet retourner est le même (pas une copie)
    this.unsetRef = function(prop,obj)
    {
        let r = null;
        
        if($inst.keyExists(prop,obj))
        {
            delete obj[prop];
            r = obj;
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
        
        $inst.each(obj,function(value,key) {
            if(Str.isNotEmpty(key))
            {
                if($inst.is(value))
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
        });

        return r;
    }
    
    
    // copy
    // retourne une copie de l'objet
    this.copy = function(obj)
    {
        return $inst.replace(obj);
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
            
            Arr.each(array,function(value) {
                if($inst.keyExists(value,r))
                r = r[value];
                
                else
                {
                    r = null;
                    return false;
                }
            });
        }
        
        return r;
    }
    
    
    // each
    // permet de faire un foreach sur un objet, utilise obj.keys
    // ne loop pas sur les propriétés du prototype
    this.each = function(loop,callback)
    {
        let r = null;
        
        if($inst.is(loop) && Func.is(callback))
        {
            const keys = Object.keys(loop);
            r = true;
            let key;
            let value;
            let result;
            
            for (var i = 0; i < keys.length; i++) 
            {
                key = keys[i];
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
Lemur.Obj = Obj;