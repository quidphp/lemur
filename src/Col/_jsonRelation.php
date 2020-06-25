<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Core;
use Quid\Orm;

// _jsonRelation
// trait with common methods for jsonArrayRelation columns
trait _jsonRelation
{
    // config
    protected static array $configJsonRelation = [
        'relationCols'=>null // custom
    ];


    // relationCell
    // retourne la cellule de la row de relation
    final public function relationCell(int $id):?Core\cell
    {
        $return = null;
        $fromCell = $this->fromCell();
        $tableName = Orm\ColSchema::table($fromCell);

        if(!empty($tableName))
        {
            $toCell = $this->toCell();
            $db = $this->db();
            $row = $db->table($tableName)->row($id);

            if(!empty($row))
            $return = $row->cell($toCell);
        }

        return $return;
    }


    // fromCell
    // retourne la cellule from de la ligne courante
    final public function fromCell():string
    {
        $return = null;
        $relationCols = $this->getAttr('relationCols');

        if(is_array($relationCols) && count($relationCols) === 2)
        $return = $relationCols[0];

        return $return;
    }


    // toCell
    // retourne la cellule to de la ligne de relation
    final public function toCell():string
    {
        $return = null;
        $relationCols = $this->getAttr('relationCols');

        if(is_array($relationCols) && count($relationCols) === 2)
        $return = $relationCols[1];

        return $return;
    }
}
?>