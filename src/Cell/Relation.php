<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cell;
use Quid\Base\Html;
use Quid\Core;
use Quid\Main;

// relation
// abstract class extended by the enum and set cells
class Relation extends Core\Cell\Relation
{
    // config
    protected static array $config = [];


    // generalOutput
    // génère le output pour général dans un ul li
    final public function generalOutput(array $option):?string
    {
        $return = null;
        $relation = $this->relationKeyValue();

        if(!empty($relation))
        {
            $col = $this->col();
            $max = $col->getAttr('generalMax');
            $total = count($relation);
            $array = $col->relationExcerptOutput($relation);
            $array = $col->prepareRelationPlainGeneral($array);

            if(!empty($array))
            {
                $return = Html::liMany(...array_values($array));

                if($total > $max)
                {
                    $diff = ($total - $max);
                    $return .= Html::li("(+$diff)",'relation-more');
                }

                $return = Html::ulCond($return);
            }
        }

        return $return;
    }


    // hasImage
    // une relation peut contenir une image si la table est source de media
    final public function hasImage():bool
    {
        $return = false;
        $table = $this->relationTable();

        if(!empty($table))
        {
            $class = $table->rowClass();
            $return = $class::isMediaSource();
        }

        return $return;
    }


    // getFirstImage
    // retourne la première image de la relation
    final public function getFirstImage($version=null,?string $type=null):?Main\File
    {
        $return = null;

        if($this->isRelationTable())
        {
            $values = $this->pair(true);

            if($values instanceof Core\Row)
            $values = $values->toRows();

            if(is_iterable($values))
            {
                foreach ($values as $row)
                {
                    $return = $row->getFirstImage($version,$type);

                    if(!empty($return))
                    break;
                }
            }
        }

        return $return;
    }
}

// init
Relation::__init();
?>