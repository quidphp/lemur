/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// str
// script with a set of helper functions related to strings
const StrPrimitive = {
    
    // is
    // retourne vrai si la valeur est une string
    is: function(value) 
    {
        return typeof(value) === 'string';
    },

    
    // isStart
    // retourne vrai si la string commence par needle
    isStart: function(needle,value)
    {
        return (this.is(needle) && this.is(value))? value.startsWith(needle):null;
    },


    // isEnd
    // retourne vrai si la string finit par needle
    isEnd: function(needle,value)
    {
        return (this.is(needle) && this.is(value))? value.endsWith(needle):null;
    },

    
    // isEqual
    // retourne vrai si les deux valeurs sont égales si comparés comme string
    isEqual: function(value,value2)
    {
        return Str.cast(value) === Str.cast(value2);
    },
    
    
    // in
    // retourne vrai si la valeur est dans la string
    // retourne un boolean
    in: function(value,string) 
    {
        return (this.is(string) && this.is(value))? string.includes(value):null;
    },
    
    
    // cast
    // retourne une valeur string
    // si la valeur est null retourne ''
    cast: function(value)
    {
        return (value == null)? '':String(value);
    },
    
    
    // pos
    // retourne l'index de la valeur dans la string
    pos: function(value,string) 
    {
        let r = null;
        
        if(this.is(string))
        {
            r = string.indexOf(value);
            r = (r === -1)? null:r;
        }
        
        return r;
    },
    
    
    // lowerFirst
    // met la première lettre de la string lowercase
    lowerFirst: function(value)
    {
        return (this.isNotEmpty(value))? value.charAt(0).toLowerCase() + value.slice(1):null;
    },
    
    
    // upperFirst
    // met la première lettre de la string uppercase
    upperFirst: function(value)
    {
        return (this.isNotEmpty(value))? value.charAt(0).toUpperCase() + value.slice(1):null;
    },

    
    // trim
    // trim une string
    trim: function(value)
    {
        return (this.is(value))? value.trim():null;
    },
    
    
    // quote
    // permet d'enrobber une string dans des quotes
    // possible de spécifier double ou non
    quote: function(value,double)
    {
        let r = null;
        const quote = (double === true)? '"':"'";
        
        if(this.is(value))
        r = quote+value+quote;
        
        return r;
    },
    
    
    // explode
    // explode une chaîne
    // retourne un tableau dans tous les cas
    explode: function(delimiter,value)
    {
        return (this.is(delimiter) && this.is(value))? value.split(delimiter):[];
    },
    
    
    // explodeIndex
    // split une string et retourne l'index demandé en premier argument
    explodeIndex: function(index,delimiter,value)
    {
        let r = undefined;
        const x = this.explode(delimiter,value);
        
        if(Integer.is(index) && this.isNotEmpty(x[index]))
        r = x[index];
        
        return r;
    }
}