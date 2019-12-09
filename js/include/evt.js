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
    // si true affiche les informations de débogagge événements dans la console
    let debug = 0;
    
    
    // debug
    // active ou désactive le débogagge
    // il faut spécifier un chiffre pour le niveau de débogagge
    this.debug = function(value)
    {
        if(Bool.is(value))
        value = Bool.fromInt(value);
        
        if(Integer.is(value))
        debug = value;
        
        return debug;
    }
    
    
    // isTriggerFuncEqual
    // retourne vrai si la fonction de chaque node retourne la valeur donné en argument
    this.isTriggerFuncEqual = function(equal,type,node)
    {
        let r = false;
        const args = [type].concat(ArrLike.sliceStart(3,arguments));
        
        $(node).each(function(index) {
            const funcArgs = [this].concat(args);
            const result = $inst.triggerFunc.apply($inst,funcArgs);
            r = (result === equal);
            
            if(r === false)
            return false;
        });
        
        return r;
    }
    
    
    // preventStop
    // permet de faire un prevent default et stop propagation à un événement
    this.preventStop = function(event,immediate)
    {
        event.preventDefault();
        
        if(immediate === true)
        event.stopImmediatePropagation();
        
        else
        event.stopPropagation();
        
        return false;
    }
    
    
    // nameFromType
    // retourne event ou custom event selon le type
    // un nom de type avec un . ou : est custom
    this.nameFromType = function(type)
    {
        let r = null;
        
        if(Str.isNotEmpty(type) && type.length)
        {
            r = 'event';
            
            if(Str.in('.',type) || Str.in(':',type))
            r = 'customEvent';
        }
        
        return r;
    }
    
    
    // createFromType
    // crée l'objet event à partir d'un type
    this.createFromType = function(type,option)
    {
        let r = null;
        const name = this.nameFromType(type);
        
        if(name != null)
        {
            if(name === 'customEvent')
            r = new CustomEvent(type,option);
            
            else if(name === 'event')
            r = new Event(type,option);
        }
        
        return r;
    }
    
    
    // getTriggerTarget
    // retourne la trigger target, en lien avec les bindings delegate
    // créés la propirété triggerTarget sur l'objet event
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
    // méthode qui permet d'ajouter un nouveau listener d'événement
    // retourne un tableau avec les paramètres pour retirer le listener
    this.addEventListener = function(node,type,func,register,delegate,option) 
    {
        Str.check(type,true);
        option = Object.assign({capture: false, once: false},option);
        
        const handler = addEventListenerHandler(type,func,delegate);
        
        $(node).each(function() {
            this.addEventListener(type,handler,option);
            
            if(Str.isNotEmpty(register))
            $inst.registerEventListener(this,register,type,handler,option);
        });
        
        return [type,handler,option];
    }
    
    
    // addEventListenerHandler
    // retourne le handler utilisé par addEventListener
    const addEventListenerHandler = function(type,func,delegate) 
    {
        return function(event) {
            let go = (delegate == null)? true:false;
            let context = this;
            
            if(Str.isNotEmpty(delegate) && event.target != null)
            {
                go = prepareEventDelegate.call(this,event,delegate);
                context = event.triggerTarget;
            }
            
            if(go === true)
            {
                let args = [event];
                const detail = event.detail;
                args = args.concat(detail);
                
                if(debug > 0)
                console.log('listener',this,type,event,delegate,detail);
                
                func.apply(context,args);
            }
        };
    }
    
    
    // prepareEventDelegate
    // function protégé
    // gère la délégation et le changement à l'objet event
    const prepareEventDelegate = function(event,delegate)
    {
        let r = false;
        const context = event.target;
        const nodes = Selector.scopedQuerySelectorAll(this,delegate);
        const delegateTarget = this;
        let triggerTarget = context;
        
        if($(nodes).filter(context).length)
        r = true;
        
        else
        {
            let query;
            
            Arr.each(nodes,function(node) {
                query = Selector.scopedQuerySelectorAll(node,context);
                
                if(Arr.isNotEmpty(query))
                {
                    triggerTarget = $(context).parents(delegate).get(0);
                    r = true;
                    return false;
                }
            });
        }
        
        event.delegateTarget = delegateTarget;
        event.triggerTarget = triggerTarget;
        
        return r;
    }
    
    
    // registerEventListener
    // permet d'enregistrer un event listener dans la node
    // ceci permet de le retirer par la suite
    this.registerEventListener = function(node,register,type,handler,option) 
    {
        const data = Dom.getOrSetData(node,'rel',{});
        const entry = [type,handler,option];
        Pojo.setRef(register,entry,data);
        
        return;
    }
    
    
    // addEventListenerOnce
    // comme ael, mais le listener ne peut être déclenché qu'une seule fois
    this.addEventListenerOnce = function(node,type,func,register,delegate,option) 
    {
        return this.addEventListener(node,type,func,register,delegate,Object.assign({},option,{once: true}));
    }
    
    
    // addDelegatedEventListener
    // permet d'ajouter un event listener qui se trigge seulement selon le delegate
    this.addDelegatedEventListener = function(node,type,delegate,func,register,option)
    {
        return this.addEventListener(node,type,func,register,delegate,option);
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
                args = Pojo.get(key,data);
                Pojo.unsetRef(key,data);
            }
            
            if(Arr.is(args))
            this.removeEventListener.apply(this,args);
        });
    }
    

    // trigger
    // function utilisé par triggerEvent et triggerBubble pour envoyer des événements
    this.trigger = function(node,type,option)
    {
        Str.check(type,true);
        const event = this.createFromType(type,option);
        
        if(debug > 1)
        console.log('trigger',type,node);
        
        $(node).each(function(index, el) {
            this.dispatchEvent(event);
        });
        
        return;
    }
    
    
    // triggerEvent
    // permet de lancer des événements sur chaque node
    // ces événements ne bubble pas
    this.triggerEvent = function(node,type) 
    {
        const data = ArrLike.sliceStart(2,arguments);
        const option = {bubbles: false, cancelable: true, detail: data};
        
        return this.trigger(node,type,option);
    }
    
    
    // triggerBubble
    // permet de lancer des événements sur chaque node
    // ces événements bubble
    this.triggerBubble = function(node,type) 
    {
        const data = ArrLike.sliceStart(2,arguments);
        const option = {bubbles: true, cancelable: true, detail: data};
        
        return this.trigger(node,type,option);
    }
    
    
    // triggerSetup
    // fonction utilisé pour lancer le setup sur un component
    // ces événements ne bubble pas
    this.triggerSetup = function(node) 
    {
        const args = [node,'component:setup'].concat(ArrLike.sliceStart(1,arguments));
        return this.triggerEvent.apply(this,args);
    }
    
    
    // allFunc
    // retourne de l'objet avec toutes les func lié à la node
    // si plusieurs nodes, retourne seulement pour la première node
    this.allFunc = function(node)
    {
        return Dom.getOrSetData(node,'lemur-func',{});
    }
    
    
    // getFunc
    // méthode qui retourne une fonction emmagasiné dans une node
    // si plusieurs nodes, retourne la fonction de la première node
    this.getFunc = function(node,type,func) 
    {
        const all = this.allFunc(node);
        
        return Pojo.get(type,all);
    }
    
    
    // setFunc
    // permet d'emmagasiné une fonction dans chaque node fournit en argument
    this.setFunc = function(node,type,func) 
    {
        Str.check(type,true);
        
        $(node).each(function() {
            const all = $inst.allFunc(this);
            Pojo.setRef(type,func,all);
        });
        
        return;
    }
    
    
    // removeFunc
    // permet de retirer une fonction emmagasiné dans une ou plusiuers node
    this.removeFunc = function(node,type) 
    {
        $(node).each(function() {
            const all = $inst.allFunc(this);
            Pojo.unsetRef(type,all);
        });
        
        return;
    }
    
    
    // triggerFunc
    // permet de lancer la fonction sur la première node donnée en argumetn
    this.triggerFunc = function(node,type) 
    {
        let r = null;
        Str.check(type,true);
        const func = this.getFunc(node,type);
        
        if(Func.is(func))
        {
            const args = ArrLike.sliceStart(2,arguments);
            
            if(debug > 2)
            console.log('triggerFunc',type,'found',node);
            
            r = func.apply(node,args);
        }
        
        else if(debug > 0 && Dom.isNode(node))
        console.log('triggerFunc',type,'notFound',node);
        
        return r;
    }
}

// export
Lemur.Evt = Evt;