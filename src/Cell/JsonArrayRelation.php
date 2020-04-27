<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cell;
use Quid\Core;

// jsonArrayRelation
// class to manage a cell containing a relation value to another cell containing a json array
class JsonArrayRelation extends Core\CellAlias
{
    // config
    protected static array $config = [];


    // relationRow
    // retourne la row de relation pour la cellule
    // peut envoyer une exception
    final public function relationRow():?Core\Row
    {
        $return = null;
        $fromCell = $this->fromCell();
        $row = $this->row();

        if(!empty($fromCell))
        {
            $cell = $row->cell($fromCell);
            $return = $cell->relationRow();
        }

        else
        static::throw();

        return $return;
    }


    // relationIndex
    // retourne la valeur index du input jsonArray
    // relationCols doit contenir deux noms de colonnes
    // peut envoyer une exception
    final public function relationIndex(int $value)
    {
        $return = null;
        $toCell = $this->toCell();

        if(!empty($toCell))
        {
            $relation = $this->relationRow();

            if(!empty($relation))
            {
                $cell = $relation->cell($toCell);
                $return = $cell->index($value);
            }
        }

        else
        static::throw();

        return $return;
    }


    // fromCell
    // retourne la cellule from de la ligne courante
    final public function fromCell():?string
    {
        $return = null;
        $relationCols = $this->getAttr('relationCols');

        if(is_array($relationCols) && count($relationCols) === 2)
        $return = $relationCols[0];

        return $return;
    }


    // toCell
    // retourne la cellule to de la ligne de relation
    final public function toCell():?string
    {
        $return = null;
        $relationCols = $this->getAttr('relationCols');

        if(is_array($relationCols) && count($relationCols) === 2)
        $return = $relationCols[1];

        return $return;
    }
}

// init
JsonArrayRelation::__init();
?>