/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// handler
// script containing handler management (functions stored in nodes)
const Handler = Lemur.Handler = new function()
{    
    // inst
    const $inst = this;
    
    
    // isTriggerEqual
    // retourne vrai si la fonction de chaque node retourne la valeur donné en argument
    this.isTriggerEqual = function(nodes,type,equal)
    {
        let r = false;
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false,type);
        const args = Arr.merge([type],ArrLike.sliceStart(3,arguments));
        
        Arr.each(nodes,function(index) {
            const funcArgs = Arr.merge([this],args);
            const result = $inst.trigger.apply($inst,funcArgs);
            r = (result === equal);
            
            if(r === false)
            return false;
        });
        
        return r;
    }
    
    
    // all
    // retourne de l'objet avec toutes les func lié à la node
    // possible de créer l'objet si non existant
    // envoie une erreur si plusieurs nodes
    this.all = function(node,create)
    {
        return Dom.getOrSetData(node,'lemur-func',(create === true)? {}:undefined);
    }
    
    
    // get
    // méthode qui retourne une fonction emmagasiné dans une node
    // envoie une erreur si plusieurs nodes
    this.get = function(node,type,func) 
    {
        return Pojo.get(type,this.all(node));
    }
    
    
    // set
    // permet d'emmagasiné une fonction dans chaque node fournit en argument
    this.set = function(nodes,type,func) 
    {
        Str.check(type,true);
        Func.check(func);
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false,type);

        if(Arr.isNotEmpty(nodes))
        {
            Arr.each(nodes,function() {
                const all = $inst.all(this,true);
                Pojo.setRef(type,func,all);
            });
        }
        
        return;
    }
    
    
    // sets
    // permet d'ajouter plusieurs handlers à partir d'un objet
    this.sets = function(nodes,typeStart,obj)
    {
        Str.check(typeStart,true);
        Pojo.check(obj,true);
        
        Pojo.each(obj,function(value,key) {
            let type = typeStart+key;
            $inst.set(nodes,type,value);
        });
        
        return;
    }
    
    
    // remove
    // permet de retirer une fonction emmagasiné dans une ou plusiuers node
    this.remove = function(nodes,type) 
    {
        Str.check(type,true);
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false,type);
        
        if(Arr.isNotEmpty(nodes))
        {
            Arr.each(nodes,function() {
                const all = $inst.all(this,true);
                Pojo.unsetRef(type,all);
            });
        }
        
        return;
    }
    
    
    // trigger
    // permet de lancer la fonction sur la première node donnée en argument
    // retourne le résultat de la méthode ou undefined
    this.trigger = function(node,type) 
    {
        let r = undefined;
        Dom.checkNode(node,false,type);
        Str.check(type,true);
        
        if(node != null)
        {
            const func = this.get(node,type);
            
            if(Func.is(func))
            {
                const args = ArrLike.sliceStart(2,arguments);
                
                if(Debug.is('handler'))
                console.log('triggerFunc',type,'found',node);
                
                r = func.apply(node,args);
            }
            
            else if(Debug.is('handler'))
            console.log('triggerFunc',type,'notFound',node);
        }
        
        return r;
    }
    
    
    // triggers
    // permet de lancer une fonction sur plusieurs nodes
    // retorne un tableau avec tous les résultats
    this.triggers = function(nodes,type)
    {
        let r = null;
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false,type);
        
        if(Arr.isNotEmpty(nodes))
        {
            r = [];
            const args = ArrLike.sliceStart(2,arguments);
            
            Arr.each(nodes,function() {
                let result = $inst.trigger.apply($inst,Arr.merge([this,type],args));
                r.push(result);
            });
        }

        return r;
    }
};