/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// selector
// script with behaviours related to selecting nodes
const SelectorTarget = {
    
    // scopedQuery
    // méthode utilisé pour faire une recherche et retourner le premier enfant d'une target qui match le selector
    scopedQuery: function(node,selector)
    {
        let r = null;
        node = this.realNode(node);
        Nod.check(node,false);
        
        if(node != null)
        {
            selector = (Doc.is(node))? selector:":scope "+selector;
            r = node.querySelector(selector);
        }
        
        if(Debug.is('selector'))
        console.log(node,selector,'scopedQuerySelector',r);

        return r;
    },
    
    
    // scopedQueryAll
    // méthode utilisé pour faire une recherche et retourner les enfants d'une target qui match le selector
    // doit retourner un array, pas une node list
    scopedQueryAll: function(node,selector)
    {
        let r = null;
        node = this.realNode(node);
        Nod.check(node,false);
        
        if(node != null)
        {
            selector = (Doc.is(node))? selector:":scope "+selector;
            r = node.querySelectorAll(selector);
            
            if(r instanceof NodeList)
            r = ArrLike.arr(r);
        }
        
        if(Debug.is('selector'))
        console.log(node,selector,'scopedQuerySelectorAll',r);

        return r;
    },
    
    
    // mergedQsa
    // permet de faire un querySelectorAll sur plusieurs nodes
    // retourne un array avec les résultats merged
    mergedQsa: function(nodes,selector)
    {
        let r = null;
        const $inst = this;
        
        if(Debug.is('selector'))
        console.log(nodes,selector,'mergedQuerySelectorAll');
        
        if(nodes != null)
        {
            r = [];
            this.each(nodes,function() {
                Arr.mergeRef(r,$inst.scopedQueryAll(this,selector));
            });
        }
        
        return r;
    },
    
    
    // closest
    // retourne la node ou le parent le plus proche de la node qui retourne vrai au pattern
    closest: function(node,value)
    {
        node = this.realNode(node);
        Nod.check(node);
        Str.check(value);
        
        return node.closest(value);
    },
    
    
    // closestParent
    // retourne le parent le plus proche de la node qui retourne vrai au pattern
    closestParent: function(node,value)
    {
        const parent = this.parent(node);
        return (parent != null)? this.closest(parent,value):null;
    },
    
    
    // match
    // retourne vrai si la node match le pattern
    match: function(node,value)
    {
        node = this.realNode(node);
        Nod.check(node);
        Str.check(value);
        
        return (Doc.is(node))? false:node.matches(value);
    },
    
    
    // matchAll
    // retourne vrai si toutes les nodes retournent vrai au pattern
    matchAll: function(nodes,value)
    {
        let r = false;
        const $inst = this;
        
        this.each(nodes,function() {
            return r = $inst.match(this,value);
        });
        
        return r;
    },
    
    
    // filter
    // permet de filtrer les nodes d'un tableau qui match le pattern
    // possible aussi de donner une fonction pour que ce soit le même comportement que arr filter
    filter: function(nodes,value)
    {
        nodes = this.wrap(nodes,false);
        const $inst = this;
        const func = (Func.is(value))? value:function() {
            return $inst.match(this,value);
        };
        
        return Arr.filter(nodes,func);
    },
    
    
    // find
    // retourne la première valeur d'un tableau qui match le pattern
    find: function(nodes,value)
    {
        nodes = this.wrap(nodes,false);
        Str.check(value);
        const $inst = this;
        
        return Arr.find(nodes,function() {
            return $inst.match(this,value);
        });
    },
    
    
    // parent
    // retourne le parent de la node, le parent peut être valider contre un sélecteur
    parent: function(node,value)
    {
        let r = null;
        node = this.realNode(node);
        Nod.check(node);
        const parent = node.parentNode;
        
        if(Nod.is(parent))
        {
            if(value == null || Nod.match(parent,value))
            r = parent;
        }
        
        return r;
    },
    
    
    // parents
    // permet de retourner tous les parents d'une node
    // possible d'arrêter à un point
    parents: function(node,value,until)
    {
        let r = [];
        node = this.realNode(node);
        Nod.check(node);
        
        while (node = Nod.parent(node)) 
        {
            if(until != null && Nod.match(node,until))
            break;
            
            if(value == null || Nod.match(node,value))
            r.push(node);
        }
        
        return r;
    },
    
    
    // prev
    // retourne l'élément précédant la node
    prev: function(node,value)
    {
        let r = null;
        node = this.realNode(node);
        Nod.check(node);
        const sibling = node.previousElementSibling;
        
        if(Nod.is(sibling))
        {
            if(value == null || Nod.match(sibling,value))
            r = sibling;
        }
        
        return r;
    },
    
    
    // prevs
    // retourne tous les éléments précédant la node
    // possible d'arrêter à un point
    prevs: function(node,value,until)
    {
        let r = [];
        node = this.realNode(node);
        Nod.check(node);
        
        while (node = Nod.prev(node)) 
        {
            if(until != null && Nod.match(node,until))
            break;
            
            if(value == null || Nod.match(node,value))
            r.push(node);
        }
        
        return r;
    },
    
    
    // next
    // retourne l'élément suivant la node
    next: function(node,value)
    {
        let r = null;
        node = this.realNode(node);
        Nod.check(node);
        const sibling = node.nextElementSibling;
        
        if(Nod.is(sibling,true))
        {
            if(value == null || Nod.match(sibling,value))
            r = sibling;
        }
        
        return r;
    },
    
    
    // nexts
    // retourne tous les éléments suivant la node
    // possible d'arrêter à un point
    nexts: function(node,value,until)
    {
        let r = [];
        node = this.realNode(node);
        Nod.check(node);
        
        while (node = Nod.next(node)) 
        {
            if(until != null && Nod.match(node,until))
            break;
            
            if(value == null || Nod.match(node,value))
            r.push(node);
        }
        
        return r;
    },
    
    
    // children
    // retourne les enfants de la node
    // possible de seulement retourner les enfants valides avec le sélecteur
    // méthode plus complexe pour gérer le fait que document n'a pas de propriété children sur ie11
    children: function(node,value,withTextNodes)
    {
        let r = null;
        node = this.realNode(node);
        Nod.check(node);
        const hasChildren = (node.children != null);
        let childs;
        
        if(withTextNodes === true)
        childs = ArrLike.arr(node.childNodes);
        
        else
        {
            if(hasChildren === true)
            childs = ArrLike.arr(node.children);
            
            else
            {
                childs = [];
                ArrLike.each(node.childNodes,function(value) {
                    if(Ele.is(value))
                    childs.push(value);
                });
            }
        }
        
        if(value == null)
        r = childs;
        
        else
        r = Nod.filter(childs,value);
        
        return r;
    },
    
    
    // realNode
    // permet de remplacer la node pour les méthodes du sélector
    // à étendre
    realNode: function(node)
    {
        return node;
    }
}