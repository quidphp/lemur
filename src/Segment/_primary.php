<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Segment;
use Quid\Core;

// _primary
// trait to work with a route segment which must contain a row id or object
trait _primary
{
    // structureSegmentPrimary
    // gère le segment d'uri pour une clé primaire (row)
    public static function structureSegmentPrimary(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($type === 'make')
        {
            if($value instanceof Core\Cell)
            $value = $value->row();

            if(is_int($value) || $value instanceof Core\Row)
            $return = $value;
        }

        elseif($type === 'match')
        {
            $table = static::tableSegment($keyValue);

            if(!empty($table) && (is_int($value) || $value instanceof Core\Row))
            {
                $row = $table->row($value);

                if(!empty($row) && $row->table() === $table)
                $return = $row;
            }
        }

        return $return;
    }
}
?>