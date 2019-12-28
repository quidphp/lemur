/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// selector
// script with behaviours related to selecting nodes
const Selector = Lemur.Selector = {
    
    // input
    // retourne un selector commun à utiliser pour les inputs
    input: function(all) 
    {
        let r = 'input,select,textarea,button';
        r += (all !== true)? "[type='submit']":'';
        
        return r;
    },
    
    
    // scopedQuery
    // méthode utilisé pour faire une recherche et retourner le premier enfant d'une target qui match le selector
    scopedQuery: function(node,selector)
    {
        let r = null;
        Dom.checkNode(node,false);
        selector = (node === document)? selector:":scope "+selector;
        
        if(node != null)
        r = node.querySelector(selector);
        
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
        Dom.checkNode(node,false);
        selector = (node === document)? selector:":scope "+selector;
        
        if(node != null)
        {
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
            Dom.each(nodes,function() {
                Arr.mergeRef(r,$inst.scopedQueryAll(this,selector));
            });
        }
        
        return r;
    },
    
    
    // match
    // retourne vrai si la node match le pattern
    match: function(node,value)
    {
        Dom.checkNode(node);
        Str.check(value);
        
        return node.matches(value);
    },
    
    
    // matchAll
    // retourne vrai si toutes les nodes retournent vrai au pattern
    matchAll: function(nodes,value)
    {
        let r = false;
        const $inst = this;
        
        Dom.each(nodes,function() {
            return r = $inst.match(this,value);
        });
        
        return r;
    },
    
    
    // filter
    // permet de filtrer les nodes d'un tableau qui match le pattern
    filter: function(nodes,value)
    {
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false);
        Str.check(value);
        const $inst = this;
        
        return Arr.filter(nodes,function() {
            return $inst.match(this,value);
        });
    },
    
    
    // find
    // retourne la première valeur d'un tableau qui match le pattern
    find: function(nodes,value)
    {
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false);
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
        let r = undefined;
        Dom.checkNode(node);
        const parent = node.parentNode;
        
        if(value == null || this.match(parent,value))
        r = parent;
        
        return r;
    },
    
    
    // prev
    // retourne l'élément précédant la node
    prev: function(node,value)
    {
        let r = undefined;
        Dom.checkNode(node);
        const sibling = $(node).prev().get(0);
        
        if(value == null || this.match(sibling,value))
        r = sibling;
        
        return r;
    },
    
    
    // next
    // retourne l'élément suivant la node
    next: function(node,value)
    {
        let r = undefined;
        Dom.checkNode(node);
        const sibling = $(node).next().get(0);
        
        if(value == null || this.match(sibling,value))
        r = sibling;
        
        return r;
    },
    
    
    // prevAll
    // retourne tous les éléments précédant la node
    prevAll: function(node,value)
    {
        let r = [];
        Dom.checkNode(node);
        r = $(node).prevAll(value).get();
        
        return r;
    },
    
    
    // nextAll
    // retourne tous les éléments suivant la node
    nextAll: function(node,value)
    {
        let r = [];
        Dom.checkNode(node);
        r = $(node).nextAll(value).get();
        
        return r;
    },
    
    
    // prevUntil
    // retourne tous les éléments précédents jusqu'à qu'un élément matche le pattern
    prevUntil: function(node,value,filter)
    {
        let r = [];
        Dom.checkNode(node);
        Str.check(value);
        r = $(node).prevUntil(value,filter).get();
        
        return r;
    },
    
    
    // nextUntil
    // retourne tous les éléments suivants jusqu'à qu'un élément matche le pattern
    nextUntil: function(node,value,filter)
    {
        let r = [];
        Dom.checkNode(node);
        Str.check(value);
        r = $(node).nextUntil(value,filter).get();
        
        return r;
    },
    
    
    // children
    // retourne les enfants de la node
    // possible de seulement retourner les enfants valides avec le sélecteur
    children: function(node,value)
    {
        let r = undefined;
        Dom.checkNode(node);
        const childs = $(node).children().get();
        
        if(value == null)
        r = childs;
        
        else
        r = this.filter(childs,value);
        
        return r;
    },
    
    
    // closest
    // retourne le parent le plus proche de la node qui retourne vrai au pattern
    // peut retourner la node courante
    closest: function(node,value)
    {
        Dom.checkNode(node);
        Str.check(value);
        
        return node.closest(value);
    }
}