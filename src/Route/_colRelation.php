<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/core/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Base;
use Quid\Orm;

// _colRelation
// trait that provides methods related to a column relation route
trait _colRelation
{
    // trait
    use _relation;


    // relation
    // retourne l'objet relation de la colonne
    public function relation():Orm\Relation
    {
        return $this->segment('col')->relation();
    }


    // isSearchValueValid
    // retourne vrai si la valeur de recherche est valide
    protected function isSearchValueValid(string $value):bool
    {
        $return = false;
        $col = $this->segment('col');
        $relation = $col->relation();
        $table = $relation->relationTable() ?? $this->segment('table');

        if($table->isSearchTermValid($value))
        $return = true;

        return $return;
    }


    // relationKeyValue
    // retourne les keyValue à partir de valeur de relation
    protected function relationKeyValue(array $values):?array
    {
        $return = null;
        $col = $this->segment('col');

        if($col->canRelation())
        $return = $col->relation()->keyValue($values,true,false);

        return $return;
    }


    // relationSearch
    // lance la recherche de relation
    protected function relationSearch(?array $option=null):?array
    {
        $return = null;
        $col = $this->segment('col');
        $method = static::$config['method'] ?? null;
        $base = ['limit'=>$this->limit(),'not'=>$this->relationSearchNot(),'method'=>$method,'order'=>$this->currentOrder()];
        $base = Base\Arr::clean($base);
        $option = Base\Arr::plus($base,$option);

        $relation = $col->relation();
        $search = $this->getSearchValue();
        $required = $col->attr('relationSearchRequired') ?? false;

        if($this->hasPage() && is_int($option['limit']))
        {
            $page = $this->segment('page');
            $option['limit'] = [$page=>$option['limit']];
        }

        if($required === false || $search !== null)
        {
            $return = [];

            if(is_string($search))
            $return = $relation->search($search,$option);

            elseif($search === null)
            $return = $relation->all(false,$option);
        }

        return $return;
    }
}
?>