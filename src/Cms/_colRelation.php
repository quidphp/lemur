<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Orm;

// _colRelation
// trait that provides methods related to a column relation
trait _colRelation
{
    // trait
    use _relation;


    // relation
    // retourne l'objet relation de la colonne
    final public function relation():Orm\Relation
    {
        return $this->segment('col')->relation();
    }


    // relationSearchRequired
    // retourne vrai si la recherche est requise
    final public function relationSearchRequired():bool
    {
        return $this->segment('col')->isRelationSearchRequired();
    }


    // isSearchValueValid
    // retourne vrai si la valeur de recherche est valide
    final protected function isSearchValueValid(string $value):bool
    {
        return $this->segment('col')->isSearchTermValid($value);
    }


    // relationKeyValue
    // retourne les keyValue à partir de valeur de relation
    final protected function relationKeyValue(array $values):?array
    {
        $return = null;
        $col = $this->segment('col');

        if($col->canRelation())
        $return = $col->relation()->keyValue($values,true,false);

        return $return;
    }
}
?>