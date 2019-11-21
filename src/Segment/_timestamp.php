<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Segment;

// _timestamp
// trait to deal with a route segment which contains a timestamp
trait _timestamp
{
    // structureSegmentTimestamp
    // gère le segment d'uri pour un timestamp, doit être plus grand que 0
    final public static function structureSegmentTimestamp(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($type === 'make')
        $return = (is_int($value) && $value > 0)? $value:false;

        elseif($type === 'match')
        {
            if($value === null)
            $return = null;

            else
            $return = (is_int($value) && $value > 0)? $value:false;
        }

        return $return;
    }
}
?>