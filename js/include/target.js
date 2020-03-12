/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// target
// script with basic functions related to event targets elements

// targetRoot
// object for elements, documents and window
const TargetRoot = {
    
    // is
    // retourne vrai si la valeur est une node, un document, un fragment de document ou window
    is: function(value)
    {
        return (Nod.is(value) || Win.is(value));
    },
    
    
    // are
    // retourne vrai si la valeur est une collection de node non vide
    are: function(value)
    {
        const $inst = this;
        
        return Arr.each(value,function(v) {
            return $inst.is(v);
        });
    },
    
    
    // check
    // envoie une exception si la valeur n'est pas une node ou node like
    check: function(value,type)
    {
        let error = false;
        const is = this.is(value);
        
        if(!(is || (type === false && value == null)))
        error = true; 
        
        if(error === true)
        throw new Error(value);
        
        return value;
    },
    
    
    // checks
    // envoie une exception si la valeur n'est pas un tableau de nodes ou nodelike
    checks: function(value,type)
    {
        if(!(this.are(value) || (type === false && (value == null || Arr.isEmpty(value)))))
        throw new Error(value);
        
        return value;
    },
    
    
    // wrap
    // wrap une node ou un node-like dans un array, si ce n'est pas un array
    // transforme une arr like en array
    // possible d'envoyer automatiquement dans dom checks
    wrap: function(value,args)
    {
        if(this.is(value))
        value = [value];
        
        else if(ArrLike.is(value))
        value = ArrLike.arr(value);
        
        if(Bool.is(args))
        args = (args === false)? [false]:[];
        
        if(Arr.is(args))
        {
            args = Arr.merge([value],args);
            value = this.checks.apply(this,args);
        }
        
        return value;
    },
    
    
    // each
    // permet de faire un loop sur une ou plusieurs nodes
    each: function(loop,callback)
    {
        loop = this.wrap(loop,false);
        
        return Arr.each(loop,callback);
    }
}

// doc
const Doc = Lemur.Doc = Factory(TargetRoot,DataTarget,HandlerTarget,ListenerTarget,SelectorTarget,NodTarget,EleDocTarget,DocTarget);

// ele
const Ele = Lemur.Ele = Factory(TargetRoot,DataTarget,HandlerTarget,ListenerTarget,SelectorTarget,NodTarget,EleDocTarget,EleTarget,ArrLoop);

// nod
const Nod = Lemur.Nod = Factory(TargetRoot,DataTarget,HandlerTarget,ListenerTarget,SelectorTarget,NodTarget);

// target
const Target = Lemur.Target = Factory(TargetRoot,DataTarget,HandlerTarget,ListenerTarget);