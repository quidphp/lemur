<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;

// _searchPost
// trait that grants methods for search route via POST
trait _searchPost
{
    // config
    protected static array $configSearch = [
        'searchName'=>'search'
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
        $searchKey = $this->getSearchName();
        $search = $this->request()->get($searchKey);

        if(is_scalar($search))
        {
            $search = (string) $search;

            if(strlen($search) && $this->isSearchValueValid($search))
            $return = $search;
        }

        return $return;
    }


    // hasSearchValue
    // retourne vrai s'il y a une valeur de recherche
    final protected function hasSearchValue():bool
    {
        return $this->getSearchValue() !== null;
    }


    // getSearchName
    // retourne la nom du champ search, envoie une exception si non existant
    final public function getSearchName():string
    {
        return $this->getAttr('searchName');
    }
}
?>