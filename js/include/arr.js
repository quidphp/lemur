/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// arr
// script with a set of helper functions related to arrays
const Arr = new function() 
{    
    // instance
    const $inst = this;
    
    
    // is
    // retourne vrai si la valeur est un tableau
    this.is = function(value) 
    {
        return Array.isArray(value);
    }
    
    
    // isLike
    // retourne vrai si la variable est comme un tableau mais pas un tableau
    this.isLike = function(value)
    {
        let r = false;
        
        if(!$inst.is(value) && !Scalar.is(value) && !Func.is(value) && !Dom.isWindow(value))
        {
            const type = Vari.type(value);
            const length = !!value && "length" in value && value.length;
            r = type === 'array' || length === 0 || typeof length === "number" && length > 0 && (length - 1) in value;
        }
        
        return r;
    }
    
    
    // isEmpty
    // retourne vrai si la valeur est un array vide
    this.isEmpty = function(value) 
    {
        return ($inst.is(value) && !value.length)? true:false;
    }
    
    
    // isNotEmpty
    // retourne vrai si la valeur est un array non vide
    this.isNotEmpty = function(value) 
    {
        return ($inst.is(value) && value.length)? true:false;
    }
    
    
    // in
    // retourne vrai si la valeur est dans le tableau
    // retourne un boolean
    this.in = function(value,array) 
    {
        return ($inst.search(value,array) !== null)? true:false;
    }
    
    
    // isEqual
    // compare plusieurs array
    // retourne vrai si les valeurs contenus sont égales
    this.isEqual = function() 
    {
        let r = false;
        const args = Array.from(arguments);
        
        if(args.length > 1 && $inst.is(args[0]))
        r = Vari.isEqual.apply(null,args);
        
        return r;
    }
    
    
    // search
    // retourne l'index de la valeur dans le tableau
    this.search = function(value,array) 
    {
        let r = null;
        
        if($inst.is(array))
        {
            r = array.indexOf(value);
            r = (r === -1)? null:r;
        }
        
        return r;
    }
    
    
    // slice
    // fait un slice sur un tableau avec un start et un end
    this.slice = function(start,end,array)
    {
        start = Num.isInt(start)? start:0;
        end = Num.isInt(end)? end:undefined;
        return Array.prototype.slice.call(array,start,end);
    };
    
    
    // sliceStart
    // fait un slice à partir du début d'un tableau
    this.sliceStart = function(start,array)
    {
        return $inst.slice(start,true,array);
    }
    
    
    // spliceValue
    // permet de retourner le même tableau sans la valeur donné en argument
    // retourne la valeur splice
    this.spliceValue = function(value,array,replace)
    {
        let r = null;
        let index = $inst.search(value,array);
        
        if(index !== null)
        {
            if(typeof(replace) !== 'undefined')
            r = array.splice(index,1,replace);
            else
            r = array.splice(index,1);
        }
        
        return r;
    }
    
    
    // valueFirst
    // retourne le première valeur dans le tableau
    this.valueFirst = function(array)
    {
        let r = null;
        
        $inst.each(array,function(value) {
            r = value;
            return false;
        });
        
        return r;
    }
    
    
    // valueStrip
    // permet de retourner un nouveau tableau sans la valeur donné en argument
    this.valueStrip = function(value,array) 
    {
        return array.filter(function(v) {
            return (v === value)? false:true;
        })
    }
    
    
    // copy
    // permet de copier un tableau dans une nouvelle valeur
    this.copy = function(array)
    {
        return ($inst.is(array))? [].concat(array):null;
    }
    
    
    // each
    // méthode utilisé pour faire un for each sur un array
    // permet de faire le break si le callback retourne false
    // retourne true si le loop a complêté
    this.each = function(loop,callback) 
    {   
        let r = null;
        
        if($inst.isLike(loop))
        loop = Array.from(loop);
        
        if($inst.is(loop) && Func.is(callback))
        {
            r = true;
            let key;
            let value;
            let result;
            
            for (var i = 0; i < loop.length; i++) 
            {
                key = i;
                value = loop[i];
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
Lemur.Arr = Arr;