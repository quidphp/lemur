/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// event
// script containing event management functions
const Evt = Lemur.Evt = new function()
{    
    // inst
    const $inst = this;
    
    
    // debug
    // active ou désactive le débogagge
    // il faut spécifier un chiffre pour le niveau de débogagge
    this.debug = (function()
    {
        let debug = 0;
        
        return function(value) {
            if(Bool.is(value))
            value = Bool.fromInt(value);
            
            if(Integer.is(value))
            debug = value;
            
            return debug;
        }
    })();
    
    
    // isTriggerFuncEqual
    // retourne vrai si la fonction de chaque node retourne la valeur donné en argument
    this.isTriggerFuncEqual = function(equal,type,node)
    {
        let r = false;
        const args = Arr.merge([type],ArrLike.sliceStart(3,arguments));
        
        $(node).each(function(index) {
            const funcArgs = Arr.merge([this],args);
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
    this.addEventListener = function(nodes,type,func,register,delegate,option) 
    {
        let r = null;
        Str.check(type,true);
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false,type);
        
        if(Arr.isNotEmpty(nodes))
        {
            option = Object.assign({capture: false, once: false},option);
            
            const handler = addEventListenerHandler(type,func,delegate);
            
            Arr.each(nodes,function() {
                this.addEventListener(type,handler,option);
                
                if(Str.isNotEmpty(register))
                $inst.registerEventListener(this,register,type,handler,option);
            });
            
            r = [type,handler,option];
        }
        
        return r;
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
                args = Arr.merge(args,detail);
                
                if($inst.debug() > 0)
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
    this.removeEventListener = function(nodes,args)
    {
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false,'removeEventListener');
        
        if(Arr.isNotEmpty(nodes))
        {
            if(this.debug > 0)
            {
                let consoleArgs = ['removeListener',node,Arr.copy(args).shift()];
                console.log.apply(this,consoleArgs);
            }
            
            Arr.each(nodes,function() {
                if(Str.isNotEmpty(args))
                {
                    const key = args;
                    const data = Dom.getData(this,'rel');
                    args = Pojo.get(key,data);
                    Pojo.unsetRef(key,data);
                }
                
                if(Arr.is(args))
                this.removeEventListener.apply(this,args);
            });
        }
        
        return;
    }
    

    // trigger
    // function utilisé par triggerEvent et triggerBubble pour envoyer des événements
    this.trigger = function(nodes,type,option)
    {
        Str.check(type,true);
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false,type);
        
        if(Arr.isNotEmpty(nodes))
        {
            const event = this.createFromType(type,option);
            
            if(this.debug() > 1)
            console.log('trigger',type,nodes);
            
            Arr.each(nodes,function() {
                this.dispatchEvent(event);
            });
        }
        
        return;
    }
    
    
    // triggerEvent
    // permet de lancer des événements sur chaque node
    // ces événements ne bubble pas
    this.triggerEvent = function(nodes,type) 
    {
        const data = ArrLike.sliceStart(2,arguments);
        const option = {bubbles: false, cancelable: true, detail: data};
        
        return this.trigger(nodes,type,option);
    }
    
    
    // triggerBubble
    // permet de lancer des événements sur chaque node
    // ces événements bubble
    this.triggerBubble = function(nodes,type) 
    {
        const data = ArrLike.sliceStart(2,arguments);
        const option = {bubbles: true, cancelable: true, detail: data};
        
        return this.trigger(nodes,type,option);
    }
    
    
    // triggerSetup
    // fonction utilisé pour lancer le setup sur un component
    // cette appel se lance à travers tous les components à setup
    // ces événements ne bubble pas
    this.triggerSetup = function(nodes) 
    {
        const args = Arr.merge([nodes,'component:setup'],ArrLike.sliceStart(1,arguments));
        return this.triggerEvent.apply(this,args);
    }
    
    
    // allFunc
    // retourne de l'objet avec toutes les func lié à la node
    // possible de créer l'objet si non existant
    // envoie une erreur si plusieurs nodes
    this.allFunc = function(node,create)
    {
        return Dom.getOrSetData(node,'lemur-func',(create === true)? {}:undefined);
    }
    
    
    // getFunc
    // méthode qui retourne une fonction emmagasiné dans une node
    // envoie une erreur si plusieurs nodes
    this.getFunc = function(node,type,func) 
    {
        return Pojo.get(type,this.allFunc(node));
    }
    
    
    // setFunc
    // permet d'emmagasiné une fonction dans chaque node fournit en argument
    this.setFunc = function(nodes,type,func) 
    {
        Str.check(type,true);
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false,type);

        if(Arr.isNotEmpty(nodes))
        {
            Arr.each(nodes,function() {
                const all = $inst.allFunc(this,true);
                Pojo.setRef(type,func,all);
            });
        }
        
        return;
    }
    
    
    // removeFunc
    // permet de retirer une fonction emmagasiné dans une ou plusiuers node
    this.removeFunc = function(nodes,type) 
    {
        Str.check(type,true);
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false,type);
        
        if(Arr.isNotEmpty(nodes))
        {
            Arr.each(nodes,function() {
                const all = $inst.allFunc(this,true);
                Pojo.unsetRef(type,all);
            });
        }
        
        return;
    }
    
    
    // triggerFunc
    // permet de lancer la fonction sur la première node donnée en argument
    // retourne le résultat de la méthode ou undefined
    this.triggerFunc = function(node,type) 
    {
        let r = undefined;
        Dom.checkNode(node,false,type);
        Str.check(type,true);
        
        if(node != null)
        {
            const func = this.getFunc(node,type);
            
            if(Func.is(func))
            {
                const args = ArrLike.sliceStart(2,arguments);
                
                if(this.debug() > 2)
                console.log('triggerFunc',type,'found',node);
                
                r = func.apply(node,args);
            }
            
            else if(this.debug() > 0)
            console.log('triggerFunc',type,'notFound',node);
        }
        
        return r;
    }
    
    
    // triggerFuncs
    // permet de lancer une fonction sur plusieurs nodes
    // retorne un tableau avec tous les résultats
    this.triggerFuncs = function(nodes,type)
    {
        let r = null;
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false,type);
        
        if(Arr.isNotEmpty(nodes))
        {
            r = [];
            const args = ArrLike.sliceStart(2,arguments);
            
            Arr.each(nodes,function() {
                let result = $inst.triggerFunc.apply($inst,Arr.merge([this,type],args));
                r.push(result);
            });
        }

        return r;
    }
};