/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// nav
// script with helper functions related to navigation and pagination
const Nav = Lemur.Nav = {
    
    // isFirst
    // retourne vrai si la valeur est la première
    isFirst: function(value,max) 
    {
        return (value === this.getFirst(max));
    },
    
    
    // hasPrev
    // retourne vrai s'il y a une valeur précédente
    hasPrev: function(value,max,loop) 
    {
        return (this.getPrev(value,max,loop) != null);
    },
    
    
    // hasNext
    // retourne vrai s'il y a une valeur suivante
    hasNext: function(value,max,loop) 
    {
        return (this.getNext(value,max,loop) != null);
    },
    
    
    // isLast
    // retourne vrai si la valeur est la dernière
    isLast: function(value,max) 
    {
        return (value === this.getLast(max));
    },
    
    
    // isIndex
    // retourne vrai si la valeur est comprise dans le maximum
    isIndex: function(value,max)
    {
        return (this.getIndex(value,max) === value);
    },
    
    
    // getFirst
    // retourne la premier valeur
    getFirst: function(max)
    {
        return (Integer.isPositive(max))? 0:null;
    },
    
    
    // getPrev
    // retourne la valeur précédente
    getPrev: function(value,max,loop)
    {
        let r = null;
        
        if(Integer.isPositive(max))
        {
            const last = (max - 1);
            value = (Integer.is(value))? value:last;
            const newVal = (value - 1);
            
            if(newVal < 0)
            {
                if(loop === true)
                r = last;
            }
            
            else
            r = newVal;
        }
        
        return r;
    },
    
    
    // getNext
    // retourne la valeur suivante
    getNext: function(value,max,loop)
    {
        let r = null;
        
        if(Integer.isPositive(max))
        {
            const last = (max - 1);
            value = (Integer.is(value))? value:-1;
            const newVal = (value + 1);
            
            if(newVal > last)
            {
                if(loop === true)
                r = 0;
            }
            
            else
            r = newVal;
        }
        
        return r;
    },
    
    
    // getLast
    // retourne la dernière valeur
    getLast: function(max)
    {
        return (Integer.isPositive(max))? (max - 1):null;
    },
    
    
    // getIndex
    // retourne la valeur si elle elle comprise dans le maximum
    getIndex: function(value,max)
    {
        return (Integer.is(value) && value >= 0 && Integer.isPositive(max) && value < max)? value:null;
    },
    
    
    // index
    // retourne l'index du nouvel élément
    index: function(value,current,max,loop)
    {
        let r = null;
        
        if(Integer.isPositive(max))
        {
            if(value === 'first')
            r = this.getFirst(max);
            
            else if(value ==='last')
            r = this.getLast(max);
            
            else if(value ==='prev')
            r = this.getPrev(current,max,loop);
            
            else if(value ==='next')
            r = this.getNext(current,max,loop);
            
            else if(Integer.is(value))
            r = this.getIndex(value,max);
        }
        
        return r;
    },
    
    
    // indexNode
    // retourne la node de l'index du nouvel élément
    indexNode: function(value,current,nodes,loop)
    {
        let r = null;
        Ele.checks(nodes,undefined,false);
        
        if(nodes != null)
        {
            const max = Arr.length(nodes);
            
            if(Ele.is(value))
            value = Arr.search(value,nodes);
            
            if(Ele.is(current))
            current = Arr.search(current,nodes);
            
            const index = this.index(value,current,max,loop);
            
            if(Integer.is(index))
            r = Arr.get(index,nodes);
        }
        
        return r;
    }
}