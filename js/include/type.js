/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// type
// script with common methods for all variable types
const Type = {  
    
    // is
    // retourne vrai si c'est une variable du type
    is: function(value)
    {
        return Vari.type(value) !== 'object';
    },

    
    // are
    // retourne vrai si la valeur est un tableau contenant des variables du type
    are: function(value)
    {
        const $inst = this;
        
        return Arr.each(value,function(v) {
            return $inst.is(v);
        });
    },
    
    
    // isEmpty
    // retourne vrai si c'est une variable du type vide
    isEmpty: function(value)
    {
        return (this.is(value))? Vari.isEmpty(value):false;
    },
    
    
    // isNotEmpty
    // retourne vrai si c'est une variable du type non-vide
    isNotEmpty: function(value)
    {
        return (this.is(value))? Vari.isNotEmpty(value):false;
    },
    
    
    // check
    // envoie une erreur si la valeur n'est pas du type
    // si type est true, doit être du type et non vide
    // si type est false, accepte null + undefined
    check: function(value,type)
    {
        if(((type === true && !this.isNotEmpty(value)) || (type !== true && !this.is(value))) && !(type === false && value == null))
        throw new Error(value);
        
        return value;
    },
    
    
    // checks
    // envoie une exception si la valeur n'est pas un tableau contenant des valeurs du type
    checks: function(value,type)
    {
        if(Arr.is(value))
        {
            const $inst = this;
            
            Arr.each(value,function() {
                $inst.check(this,type);
            });
        }
        
        else
        throw new Error(value);
        
        return value;
    }
}

// arr
const Arr = Lemur.Arr = Factory(Type,ObjBase,ObjKeyValue,ObjEach,ObjCopyFilterMap,ObjWrite,ObjWriteSelf,ArrBase,ArrWriteSelf,ArrLoop);

// arrLike
const ArrLike = Lemur.ArrLike = Factory(Type,ObjBase,ObjKeyValue,ObjEach,ObjCopyFilterMap,ArrBase,ArrLikeRead,ArrLoop);

// bool
const Bool = Lemur.Bool = Factory(Type,BoolPrimitive);

// handler
const Func = Lemur.Func = Factory(Type,ObjBase,FuncObj);

// integer
const Integer = Lemur.Integer = Factory(Type,NumPrimitive,IntegerPrimitive);

// num
const Num = Lemur.Num = Factory(Type,NumPrimitive);

// obj
const Obj = Lemur.Obj = Factory(Type,ObjBase,ObjKeyValue,ObjEach,ObjCopyFilterMap,ObjWrite,ObjWriteSelf,ObjProto);

// pojo
const Pojo = Lemur.Pojo = Factory(Type,ObjBase,ObjKeyValue,ObjEach,ObjCopyFilterMap,ObjWrite,ObjWriteSelf,PojoObj);

// scalar
const Scalar = Lemur.Scalar = Factory(Type,ScalarPrimitive);

// str
const Str = Lemur.Str = Factory(Type,ObjBase,ObjKeyValue,ObjEach,StrPrimitive);