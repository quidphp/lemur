<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Segment;

// _orderTableRelation
// trait to manage a route segment which must contain an orderable table relation
trait _orderTableRelation
{
    // structureSegmentOrderTableRelation
    // gère le segment order pour une route relation
    final public static function structureSegmentOrderTableRelation(string $type,$value,array &$keyValue)
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
                $table = static::tableSegment($keyValue);

                if(!empty($table) && static::isValidOrder($value,$table->relation()))
                $return = $value;
            }
        }

        return $return;
    }
}
?>