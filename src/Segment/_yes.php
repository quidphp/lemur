<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Segment;

// _yes
// trait that issues a method to deal with yes route segment
trait _yes
{
    // structureSegmentYes
    // gère le segment d'uri yes
    final public static function structureSegmentYes(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($type === 'make' && $value === 1)
        $return = $value;

        elseif($type === 'match')
        {
            if($value === null)
            $return = null;

            elseif($value === 1)
            $return = $value;
        }

        return $return;
    }
}
?>