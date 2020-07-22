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


    // config
    protected static array $configColRelation = [
        'appendPrimary'=>true
    ];


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


    // shouldAppendPrimary
    // retourne vrai s'il faut append le primary
    final public function shouldAppendPrimary($key):bool
    {
        $col = $this->segment('col');
        return $this->getAttr('appendPrimary') === true && is_int($key) && $col->isRelation() && $col->shouldAppendPrimary();
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


    // relationExcerptOutput
    // permet de faire le output d'une ligne de relation
    // ajoute le primary à la fin de la valeur de la relation s'il faut le faire
    final protected function relationExcerptOutput($return,$key):string
    {
        $col = $this->segment('col');
        $return = $col->valueExcerpt($return);

        if($this->shouldAppendPrimary($key))
        $return = Orm\Relation::appendPrimary($return,$key);

        return $return;
    }
}
?>