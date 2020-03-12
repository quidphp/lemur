/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// obj
// script with a set of helper functions related to objects

// objBase
// base methods for objects
const ObjBase = {
    
    // is
    // retourne vrai si c'est un objet
    is: function(value)
    {
        return Vari.type(value) === 'object';
    },

    
    // isEqual
    // compare plusieurs objets (ou array)
    // retourne vrai si les valeurs contenus sont égales
    isEqual: function() 
    {
        let r = false;
        const args = Array.from(arguments);
        
        if(args.length > 1 && this.is(args[0]))
        r = Vari.isEqual.apply(null,args);
        
        return r;
    },
    
    
    // length
    // retourne la longueur de l'objet
    length: function(value) 
    {
        let r = null;

        if(this.is(value))
        {
            const keys = Object.keys(value);
            r = keys.length;
        }
        
        return r;
    }
}


// objKeyValue
// method related to keys and values within an object
const ObjKeyValue = {
    
    // isKey
    // retourne vrai si la valeur est une clé de propriété valide
    isKey: function(prop)
    {
        return Scalar.isNotBool(prop);
    },
    
    
    // keyExists
    // retourne vrai si l'objet a la propriété, ne cherche pas dans le prototype
    keyExists: function(prop,obj)
    {
        return (this.isKey(prop) && this.is(obj))? obj.hasOwnProperty(prop):false
    },
    
    
    // keys
    // retourne les clés de l'objet
    keys: function(obj)
    {
        return (this.is(obj))? Object.keys(obj):null;
    },
    
    
    // get
    // permet de retourner la valeur d'une propriété d'un objet
    get: function(prop,obj)
    {
        return (this.keyExists(prop,obj))? obj[prop]:undefined;
    },
    
    
    // valueFirst
    // retourne le première valeur dans l'object
    valueFirst: function(obj)
    {
        let r = undefined;
        const keys = this.keys(obj);
        
        if(keys != null)
        {
            const key = keys[0];
            r = obj[key];
        }
        
        return r;
    },
    
    
    // valueLast 
    // retourne la dernière valeur dans l'objet
    valueLast: function(obj)
    {
        let r = undefined;
        const keys = this.keys(obj);
        
        if(keys != null)
        {
            const key = keys[keys.length-1];
            r = obj[key];
        }
        
        return r;
    },
    
    
    // find
    // retourne la première valeur de l'objet dont le callback retourne true
    find: function(loop,callback)
    {
        let r = undefined;
        
        if(this.is(loop) && Func.is(callback))
        {
            this.each(loop,function(value,key) {
                const result = callback.call(this,value,key,loop);
                
                if(result)
                {
                    r = value;
                    return false;
                }
            });
        }
        
        return r;
    },
    
    
    // values
    // retourne les valeurs de l'objet
    values: function(obj)
    {
        return (this.is(obj))? Object.values(obj):null;
    },
    
    
    // str
    // permet de convertir un objet en string
    // possible de spécifier deux séparateurs et s'il faut quote les valeurs
    str: function(obj,separator,separator2,quote) 
    {
        let r = '';
        const $inst = this;
        separator = (Str.is(separator))? separator:'=';
        separator2 = (Str.is(separator2))? separator2:' ';
        
        this.each(obj,function(value,key) {
            if(Str.isNotEmpty(key))
            {
                if(Obj.is(value))
                value = Json.encode(value);                
                
                else
                value = Str.cast(value);
                
                if(quote === true)
                value = Str.quote(value,false);
                
                if(r.length)
                r += separator2;
                
                r += key;
                r += separator;
                r += value;
            }
        });

        return r;
    },
    
    
    // arr
    // retourne un array à partir de la valeur
    arr: function(value)
    {
        return (this.is(value))? Array.from(this.values(value)):null;
    },
    
    
    // climb
    // permet de grimper dans un objet à partir d'un tableau
    climb: function(array,r) 
    {
        if(Arr.is(array) && this.is(r))
        {
            var i;
            const $inst = this;
            
            Arr.each(array,function(value) {
                if($inst.keyExists(value,r))
                r = r[value];
                
                else
                {
                    r = undefined;
                    return false;
                }
            });
        }
        
        return r;
    }
}


// objEach
// methods for looping over an object
const ObjEach = {
    
    // each
    // méthode utilisé pour faire un for each sur un array, array like, un objet ou une string
    // retourne true si le loop a complêté
    each: function(loop,callback) 
    {
        let r = null;
        let keys = this.keys(loop);
        
        if(Arr.is(keys) && Func.is(callback))
        {
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


// objCopyFilterMap
// methods for copying, filtering and map an object
const ObjCopyFilterMap = {
    
    // copy
    // permet de copier un objet
    copy: function(value)
    {
        return (this.is(value))? Object.assign(this.new(),value):null;
    },
    
    
    // new
    // retourne la cible pour créer un nouvel objet du même type
    new: function()
    {
        return {};
    },
    
    
    // filter
    // permet de créer un nouvel objet avec seulement les entrées qui retournent oui
    filter: function(loop,callback)
    {
        let r = null;
        
        if(this.is(loop) && Func.is(callback))
        {
            r = this.new();
            const keepKey = (Array.isArray(r))? false:true;
            
            this.each(loop,function(value,key) {
                const result = callback.call(this,value,key,loop);
                key = (keepKey === false)? r.length:key;
                
                if(result)
                r[key] = value;
            });
        }
        
        return r;
    },
    
    
    // map
    // permet de créer un nouvel objet avec les valeurs changés selon la fonction de rappel
    map: function(loop,callback)
    {
        let r = null;
        
        if(this.is(loop) && Func.is(callback))
        {
            r = this.new();
            
            this.each(loop,function(value,key) {
                const result = callback.call(this,value,key,loop);
                r[key] = result;
            });
        }
        
        return r;
    }
}


// objWrite
// methods for written on a copy of the object
const ObjWrite = {
    
    // set
    // permet d'ajouter une nouvelle propriété à un objet
    // l'objet retourner est une copie
    set: function(prop,value,obj)
    {
        let r = null;
        
        if(this.is(obj))
        {
            r = this.copy(obj);
            r[prop] = value;
        }
        
        return r;
    },
    
    
    // unset
    // permet de retirer une propriété d'un objet
    // l'objet retourner est une copie
    unset: function(prop,obj)
    {
        let r = null;
        
        if(this.keyExists(prop,obj))
        {
            r = this.copy(obj);
            delete r[prop];
        }
        
        return r;
    },


    // replace
    // retourne un nouvel objet contenant le résultat d'un merge unidimensionnel de tous les objets données en argument
    replace: function() 
    {
        let r = this.new();
        let args = Array.from(arguments);
        
        if(args.length > 0)
        {
            const $inst = this;
            
            Arr.each(args,function() {
                if($inst.is(this))
                r = Object.assign(r,this);
            });
        }
        
        return r;
    }
}


// objWriteSelf
// methods for writing within the object without copying it
const ObjWriteSelf = {
    
    // setRef
    // permet d'ajouter une nouvelle propriété à un objet
    // l'objet retourner est le même (pas une copie)
    setRef: function(prop,value,obj)
    {
        let r = null;
        
        if(this.is(obj))
        {
            r = obj;
            r[prop] = value;
        }
        
        return r;
    },
    
    
    // unsetRef
    // permet de retirer une propriété d'un objet
    // l'objet retourner est le même (pas une copie)
    unsetRef: function(prop,obj)
    {
        let r = null;
        
        if(this.keyExists(prop,obj))
        {
            delete obj[prop];
            r = obj;
        }
        
        return r;
    }
}


// objProto
// methods related to object prototype
const ObjProto = {
    
    // keyExists
    // retourne vrai si l'objet a la propriété, cherche dans le protype
    keyExists: function(prop,obj)
    {
        return (this.isKey(prop) && this.is(obj))? (prop in obj):false
    }
}