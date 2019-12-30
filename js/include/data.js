/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// dataTarget
// script for storing datas within targets
const DataTarget = {    
    
    // hasData
    // retourne vrai si la node a les données
    hasData: function(node,value)
    {
        return this.getData(node,value) !== undefined;
    },
    
    
    // getDataKey
    // retourne la clé de date
    getDataKey: function()
    {
        return '_lemur_';
    },
    
    
    // allData
    // retourne toutes les données liés à la node
    // peut créer l'objet si inexistant
    allData: function(node,create)
    {
        let r = undefined;
        this.check(node);
        const dataKey = this.getDataKey();
        let isPojo = Pojo.is(node[dataKey]);
        
        if(!isPojo && create === true)
        {
            isPojo = true;
            node[dataKey] = {};
        }
        
        if(isPojo === true)
        r = node[dataKey];
        
        return r;
    },
    
    
    // getData
    // permet de retourner une data d'une node
    // envoie une exception si plus d'une node
    getData: function(node,key)
    {
        Str.check(key);
        const data = this.allData(node);
        
        return Pojo.get(key,data);
    },
    
    
    // flashData
    // retourne la data et efface l'entrée de la node
    flashData: function(node,key)
    {
        const r = this.getData(node,key);
        this.removeData(node,key);
        
        return r;
    },
    
    
    // setData
    // change de la data sur une ou plusieurs nodes
    // ceci n'affecte pas le dom, seulement stocké dans l'objet
    // si undefined efface la data
    setData: function(nodes,key,value)
    {
        nodes = this.wrap(nodes,false);
        Str.check(key,true);
        const $inst = this;
        
        this.each(nodes,function() {
            const data = $inst.allData(this,true);
            
            if(value === undefined)
            Pojo.unsetRef(key,data);
            
            else
            Pojo.setRef(key,value,data);
        });
        
        return;
    },
    
    
    // removeData
    // enlève une donnée de la ou les nodes
    removeData: function(nodes,key)
    {
        return this.setData(nodes,key,undefined);
    },
    
    
    // getOrSetData
    // crée une data dans une node si la valeur est présenement inexistante
    // sinon retourne la data de la node
    getOrSetData: function(node,key,value)
    {
        let r = undefined;
        const current = this.getData(node,key);
        
        if(current == null && value != null)
        {
            this.setData(node,key,value);
            r = value;
        }
        
        else
        r = current;
        
        return r;
    }
}