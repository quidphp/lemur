/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// arr
// script with some objects related to arr manipulation

// arrBase
// fonctions relatives à la lecture de tableau
const ArrBase = {
    
    // is
    // retourne vrai si la valeur est un tableau
    is: function(value) 
    {
        return Array.isArray(value);
    },
    
    
    // in
    // retourne vrai si la valeur est dans le tableau
    // retourne un boolean
    in: function(value,array) 
    {
        return (this.is(array))? Array.prototype.includes.call(array,value):null;
    },
    
    
    // keys
    // retourne un tableau avec clés du présent tableau
    keys: function(array)
    {
        return (this.is(array))? Array.from(Array.prototype.keys.call(array)):null;
    },
    
    
    // valueFirst
    // retourne le première valeur dans le tableau
    valueFirst: function(array)
    {
        return (this.is(array) && array.length)? array[0]:undefined;
    },
    
    
    // valueLast 
    // retourne la dernière valeur dans le tableau
    valueLast: function(array)
    {
        return (this.is(array) && array.length)? array[array.length-1]:undefined;
    },
    
    
    // keyFirst
    // retourne la première clé d'un tableau
    keyFirst: function(array)
    {
        return (this.is(array) && array.length)? 0:undefined;
    },
    
    
    // keyLast
    // retourne la dernière clé d'un tableau
    keyLast: function(array)
    {
        return (this.is(array) && array.length)? array.length-1:undefined;
    },
    
    
    // search
    // retourne l'index de la valeur dans le tableau
    search: function(value,array) 
    {
        let r = null;
        
        if(this.is(array))
        {
            r = Array.prototype.indexOf.call(array,value);
            r = (r === -1)? null:r;
        }
        
        return r;
    },
    
    
    // slice
    // fait un slice sur un tableau avec un start et un end
    slice: function(start,end,array)
    {
        let r = null;
        
        if(this.is(array))
        {
            start = Integer.is(start)? start:0;
            end = Integer.is(end)? end:undefined;
            r = Array.prototype.slice.call(array,start,end);
        }
        
        return r;
    },
    
    
    // sliceStart
    // fait un slice à partir du début d'un tableau
    sliceStart: function(start,array)
    {
        return this.slice(start,true,array);
    },
    
    
    // merge
    // retourne un nouveau tableau avec le contenu de tous les tableaux merged (concat)
    merge: function(array)
    {
        let r = null;
        
        if(this.is(array))
        {
            const args = ArrLike.sliceStart(1,arguments);
            r = Array.prototype.concat.apply(array,args);
        }
        
        return r;
    },
    
    
    // clean
    // retourne un nouveau tableau avec les valeurs vides retirés
    clean: function(array)
    {
        return this.filter(array,function() {
            return Vari.isNotReallyEmpty(this);
        });
    },
    
    
    // valueStrip
    // permet de retourner un nouveau tableau sans la valeur donné en argument
    valueStrip: function(value,array) 
    {
        return this.filter(array,function(v) {
            return (v === value)? false:true;
        });
    },
    
    
    // new
    // retourne la cible pour la copie
    new: function()
    {
        return [];
    }
}


// arrWriteSelf
// fonctions relatives à l'écriture sur des tableaux (en référence)
const ArrWriteSelf = {
    
    // mergeRef
    // permet de fusionner plusieurs tableaux dans le premier tableau
    // le premier tableau est modifié
    mergeRef: function(array)
    {
        let r = null;
        
        if(this.is(array))
        {
            r = array;
            const inst = this;
            
            this.each(ArrLike.sliceStart(1,arguments),function(value) {
                if(!Arr.is(value))
                value = [value];
                
                Array.prototype.push.apply(r,value);
            });
        }
        
        return r;
    },
    
    
    // reverseRef
    // permet de renverser le tableau courant
    reverseRef: function(array)
    {
        return (this.is(array))? array.reverse():null;
    },
    
    
    // spliceValue
    // permet de retourner le même tableau sans la valeur donné en argument
    // retourne la valeur splice
    spliceValue: function(value,array,replace)
    {
        let r = null;
        let index = this.search(value,array);
        
        if(this.is(array))
        {
            let args = [index,1];
            if(typeof(replace) !== 'undefined')
            args.push(replace);
            
            r = Array.prototype.splice.apply(array,args);
        }
        
        return r;
    }
}

// arrLoop
// fonctions relatives à certains loops spéciaux
const ArrLoop = {
    
    // timeouts
    // permet de lancer un callback sur chaque element du tableau avec timeout différent (selon index)
    timeouts: function(array,timeout,indexTimeout,callback) 
    {
        Integer.check(timeout);
        Integer.check(indexTimeout);
        Func.check(callback);
        
        return this.each(array, function(value, index) {
            const funcTimeout = timeout + (index * indexTimeout);
            Func.timeout(funcTimeout,callback,this);
        });
    },
    
    
    // oddEven
    // permet d'appeler une méthode de callback différents selon si l'élément est odd ou even
    oddEven: function(array,funcOdd,funcEven) 
    {
        Func.checks([funcOdd,funcEven],false);
        
        return this.each(array, function(value,index) {
            const key = index + 1;
            
            if(Num.isOdd(key))
            {
                if(funcOdd != null)
                funcOdd.call(this,index)
            }
            
            else if(funcEven != null)
            funcEven.call(this,index);
        });
    }
}