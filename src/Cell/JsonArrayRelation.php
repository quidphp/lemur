<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cell;
use Quid\Core;

// jsonArrayRelation
// class to manage a cell containing a relation value to another cell containing a json array
class JsonArrayRelation extends Core\CellAlias
{
    // config
    protected static array $config = [];


    // pair
    // si value est true, renvoie la valeur de la jsonArray
    // sinon renvoie à parent
    final public function pair($value=null,...$args)
    {
        $return = $this;

        if($value === true)
        $return = $this->get();

        elseif($value !== null)
        $return = parent::pair($value,...$args);

        return $return;
    }


    // relationRow
    // retourne la row de relation pour la cellule
    // peut envoyer une exception
    final public function relationRow():?Core\Row
    {
        $return = null;
        $fromCell = $this->fromCell();
        $row = $this->row();
        $cell = $row->cell($fromCell);
        $return = $cell->relationRow();

        return $return;
    }


    // relationCell
    // retourne la cellule de la row de relation
    final public function relationCell():?Core\cell
    {
        $return = null;
        $toCell = $this->toCell();
        $row = $this->relationRow();

        if(!empty($row))
        $return = $row->cell($toCell);

        return $return;
    }


    // relationIndex
    // retourne la valeur index du input jsonArray
    final public function relationIndex(int $value)
    {
        $return = null;
        $cell = $this->relationCell();

        if(!empty($cell))
        $return = $cell->index($value);

        return $return;
    }


    // fromCell
    // retourne la cellule from de la ligne courante
    final public function fromCell():string
    {
        return $this->col()->fromCell();
    }


    // toCell
    // retourne la cellule to de la ligne de relation
    final public function toCell():string
    {
        return $this->col()->toCell();
    }
}

// init
JsonArrayRelation::__init();
?>