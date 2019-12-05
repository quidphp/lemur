/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// event
// script containing event management functions
const Evt = new function() 
{    
    // instance
    const $inst = this;
    
    
    // debug
    // si true affiche les événements dans la console
    let debug = 0;
    
    
    // debug
    // active ou désactive le débogagge
    // il faut spécifier un chiffre pour le niveau d'éléments à afficher
    this.debug = function(value)
    {
        if(Bool.is(value))
        value = Bool.num(value);
        
        if(Num.isInt(value))
        debug = value;
        
        return debug;
    }
    
    
    // isTriggerFuncEqual
    // retourne vrai si la fonction de chaque node retourne la valeur donné en argument
    this.isTriggerFuncEqual = function(equal,type,node)
    {
        let r = false;
        const args = [type].concat(Arr.sliceStart(3,arguments));
        
        $(node).each(function(index) {
            const funcArgs = [this].concat(args);
            const result = $inst.triggerFunc.apply(null,funcArgs);
            r = (result === equal);
            
            if(r === false)
            return false;
        });
        
        return r;
    }
    
    
    // getTriggerTarget
    // retourne la trigger target
    // les bindings delegate, créés la propirété triggerTarget sur l'objet event
    this.getTriggerTarget = function(event)
    {
        let r = null;
        
        if(Obj.is(event) && event.target)
        {
            if(event.triggerTarget != null)
            r = event.triggerTarget;
            
            else
            r = event.target;
        }
        
        return r;
    }
    
    
    // addEventListener
    // méthode qui permet d'ajouter un nouveau listener d'événement custom
    // retourne un tableau avec les paramètres pour retirer le listener
    this.addEventListener = function(node,type,func,register,delegate,option) 
    {
        option = Object.assign({capture: false, once: false},option);
        
        if(!Str.isNotEmpty(type))
        logError('invalidType');
        
        const handler = $inst.addEventListenerHandler(type,func,delegate);
        
        $(node).each(function() {
            this.addEventListener(type,handler,option);
            
            if(Str.isNotEmpty(register))
            $inst.registerEventListener(this,register,type,handler,option);
        });
        
        return [type,handler,option];
    }
    
    
    // addEventListenerHandler
    // retourne le handler utilisé par addEventListener
    this.addEventListenerHandler = function(type,func,delegate) 
    {
        return function(event) {
            
            let go = (delegate == null)? true:false;
            let context = this;
            
            if(Str.isNotEmpty(delegate) && event.target != null)
            {
                context = event.target;
                const nodes = Selector.scopedQuerySelectorAll(this,delegate);
                const delegateTarget = this;
                let triggerTarget = context;
                
                if($(nodes).filter(context).length)
                go = true;
                
                else if(Arr.isNotEmpty(Selector.scopedQuerySelectorAll(nodes,context)))
                {
                    triggerTarget = $(context).parents(delegate).get(0);
                    go = true;
                }
                
                event.delegateTarget = delegateTarget;
                event.triggerTarget = triggerTarget;
            }
            
            if(go === true)
            {
                let args = [event];
                const detail = event.detail;
                args = args.concat(detail);
                
                if(debug > 0)
                console.log('listener',this,type,delegate,detail,event);
                
                func.apply(context,args);
            }
        };
    }
    
    
    // registerEventListener
    // permet d'enregistrer un event listener dans la node
    // ceci permet de le retirer par la suite
    this.registerEventListener = function(node,register,type,handler,option) 
    {
        const data = Dom.getData(node,'rel',{});
        const entry = [type,handler,option];
        Obj.setRef(register,entry,data);
        
        return;
    }
    
    
    // addEventListenerOnce
    // comme ael, mais le listener ne peut être déclenché qu'une seule fois
    this.addEventListenerOnce = function(node,type,func,register,delegate,option) 
    {
        return $inst.addEventListener(node,type,func,register,delegate,Object.assign({},option,{once: true}));
    }
    
    
    // addDelegatedEventListener
    // permet d'ajouter un event listener qui se trigge seulement selon le delegate
    this.addDelegatedEventListener = function(node,type,delegate,func,register,option)
    {
        return $inst.addEventListener(node,type,func,register,delegate,option);
    }
    
    
    // removeEventListener
    // permet de retirer un event listener
    // args est le tableau retournée par addEventListener (contient type, handler et option)
    this.removeEventListener = function(node,args)
    {
        if(debug > 0)
        {
            let consoleArgs = ['removeListener',node,Arr.copy(args).shift()];
            console.log.apply(this,consoleArgs);
        }
        
        $(node).each(function() {
            
            if(Str.isNotEmpty(args))
            {
                const key = args;
                const data = Dom.getData(node,'rel');
                args = Obj.get(key,data);
                Obj.unsetRef(key,data);
            }
            
            if(Arr.is(args))
            this.removeEventListener.apply(this,args);
        });
    }
    
    
    // trigger
    // function utilisé par triggerEvent et triggerCustom pour envoyer des événements
    this.trigger = function(node,type,custom,option)
    {
        if(!Str.isNotEmpty(type))
        logError('invalidType');
        
        const event = (custom === true)? new CustomEvent(type,option):new Event(type,option);
        
        if(debug > 1)
        console.log('trigger',type,node);
        
        $(node).each(function(index, el) {
            this.dispatchEvent(event);
        });
        
        return;
    }
    
    
    // triggerEvent
    // permet de lancer des événements standards sur chaque node
    // ces événements buble
    this.triggerEvent = function(node,type) 
    {
        const data = Arr.sliceStart(2,arguments);
        const option = {bubbles: true, cancelable: true, detail: data};
        
        return $inst.trigger(node,type,false,option);
    }
    
    
    // triggerCustom
    // permet de lancer les événements customs sur chaque node
    // ces événements ne bubble pas
    this.triggerCustom = function(node,type) 
    {
        const data = Arr.sliceStart(2,arguments);
        const option = {bubbles: false, cancelable: true, detail: data};
        
        return $inst.trigger(node,type,true,option);
    }
    
    
    // triggerSetup
    // fonction utilisé pour lancer le setup sur un component
    // ces événements ne bubble pas
    this.triggerSetup = function(node) 
    {
        const args = [node,'component:setup'].concat(Arr.sliceStart(1,arguments));
        return $inst.triggerCustom.apply(null,args);
    }
    
    
    // allFunc
    // retourne de l'objet avec toutes les func lié à la node
    // si plusieurs nodes, retourne seulement pour la première node
    // possible de retourner une copie, plus facile pour le débogagge
    this.allFunc = function(node,copy)
    {
        let r = Dom.getData(node,'lemur-func',{});
        
        if(copy === true)
        r = Obj.copy(r);
        
        return r;
    }
    
    
    // getFunc
    // méthode qui retourne une fonction emmagasiné dans une node
    // si plusieurs nodes, retourne la fonction de la première node
    this.getFunc = function(node,type,func) 
    {
        const all = $inst.allFunc(node);
        
        return Obj.get(type,all);
    }
    
    
    // setFunc
    // permet d'emmagasiné une fonction dans chaque node fournit en argument
    this.setFunc = function(node,type,func) 
    {
        $(node).each(function() {
            const all = $inst.allFunc(this);
            Obj.setRef(type,func,all);
        });
        
        return;
    }
    
    
    // removeFunc
    // permet de retirer une fonction emmagasiné dans une ou plusiuers node
    this.removeFunc = function(node,type) 
    {
        $(node).each(function() {
            const all = $inst.allFunc(this);
            Obj.unsetRef(type,all);
        });
        
        return;
    }
    
    
    // triggerFunc
    // permet de lancer la fonction sur la première node donnée en argumetn
    this.triggerFunc = function(node,type) 
    {
        let r = null;
        const func = $inst.getFunc(node,type);
        
        if(Func.is(func))
        {
            const args = Arr.sliceStart(2,arguments);
            
            if(debug > 2)
            console.log('triggerFunc',type,'found',node);
            
            r = func.apply(node,args);
        }
        
        else if(debug > 0)
        console.log('triggerFunc',type,'notFound',node);
        
        return r;
    }
}

// export
Lemur.Evt = Evt;