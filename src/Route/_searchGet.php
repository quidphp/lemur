<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Base;

// _searchGet
// trait that grants methods for search route via GET
trait _searchGet
{
    // config
    public static $configSearch = [
        'search'=>[
            'decode'=>0,
            'query'=>'s']
    ];


    // isSearchValueValid
    // retourne vrai si la valeur de recherche est valide
    final protected function isSearchValueValid(string $value):bool
    {
        return true;
    }


    // getSearchValue
    // retourne la valeur de la recherche,
    // peut retourner null
    final protected function getSearchValue():?string
    {
        $return = null;
        $searchQuery = $this->getSearchQuery();
        $search = $this->request()->getQuery($searchQuery);

        if(is_scalar($search))
        {
            $search = (string) $search;
            $decode = $this->getSearchDecodeType();

            if(strlen($search) && $this->isSearchValueValid($search))
            $return = Base\Uri::decode($search,$decode);
        }

        return $return;
    }


    // hasSearchValue
    // retourne vrai s'il y a une valeur de recherche
    final protected function hasSearchValue():bool
    {
        return ($this->getSearchValue() !== null)? true:false;
    }


    // getSearchDecodeType
    // retourne le type de décodage à utiliser pour la query de recherche
    // par défaut 0, il faut utiliser 1 si la recherche est faite via GET sans javascript
    final public function getSearchDecodeType():int
    {
        return $this->getAttr(['search','decode']);
    }


    // getSearchQuery
    // retourne la query à utiliser, envoie une exception si non existant
    final public function getSearchQuery():string
    {
        return $this->getAttr(['search','query']);
    }
}
?>