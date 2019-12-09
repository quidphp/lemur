/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// type
// script with common methods for all variable types
const Type = {  
    
    // is
    // retourne vrai si c'est une variable primitive
    is: function(value)
    {
        return Vari.type(value) !== 'object';
    },

    
    // isEmpty
    // retourne vrai si c'est une variable primitive vide
    isEmpty: function(value)
    {
        return (this.is(value))? Vari.isEmpty(value):false;
    },
    
    
    // isNotEmpty
    // retourne vrai si c'est une variable primitive non-vide
    isNotEmpty: function(value)
    {
        return (this.is(value))? Vari.isNotEmpty(value):false;
    },
    
    
    // check
    // envoie une erreur si la valeur n'est pas un primitif
    // si type est true, doit être un primitif non vide
    // si type est false, accepte null + undefined
    check: function(value,type)
    {
        if(((type === true && !this.isNotEmpty(value)) || (type !== true && !this.is(value))) && !(type === false && value == null))
        throw new Error(value,type);
        
        return value;
    }
}