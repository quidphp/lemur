<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Segment;
use Quid\Core;

// _table
// trait to work with a route segment which must contain a table name or object
trait _table
{
    // structureSegmentTable
    // gère le segment d'uri pour une table
    final public static function structureSegmentTable(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($type === 'make')
        {
            if($value instanceof Core\Row || $value instanceof Core\Col || $value instanceof Core\Cell)
            $value = $value->table();

            if(is_string($value) || $value instanceof Core\Table)
            $return = $value;
        }

        elseif($type === 'match')
        {
            $db = static::db();

            if($db->hasTable($value))
            $return = $db->table($value);
        }

        return $return;
    }
}
?>