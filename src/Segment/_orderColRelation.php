<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Segment;

// _orderColRelation
// trait to work with a route segment which must contain an orderable column relation
trait _orderColRelation
{
    // structureSegmentOrderColRelation
    // gère le segment order avec colonne pour une route relation
    final public static function structureSegmentOrderColRelation(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($type === 'make')
        $return = (is_scalar($value))? $value:false;

        elseif($type === 'match')
        {
            if($value === null)
            $return = static::$config['order'] ?? false;

            else
            {
                $table = static::tableSegment($keyValue,'orderColRelation');
                $col = $keyValue['col'] ?? null;

                if(!empty($table) && !empty($col) && $table->hasCol($col))
                {
                    $col = $table->col($col);

                    if(static::isValidOrder($value,$col->relation()))
                    $return = $value;
                }
            }
        }

        return $return;
    }
}
?>