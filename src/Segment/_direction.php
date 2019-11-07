<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Segment;

// _direction
// trait to deal with a route segment which must contain a sorting direction
trait _direction
{
    // structureSegmentDirection
    // gère le segment d'uri pour une direction de tri
    final public static function structureSegmentDirection(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($type === 'make')
        $return = (is_string($value) && !empty($value))? strtolower($value):false;

        elseif($type === 'match')
        {
            $table = static::tableSegment($keyValue);

            if(!empty($table))
            {
                if($value === null)
                $return = $table->order('direction');

                else
                $return = ($table->db()->syntaxCall('isOrderDirection',$value))? strtolower($value):false;
            }
        }

        return $return;
    }
}
?>