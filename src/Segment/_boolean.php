<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Segment;

// _boolean
// trait that issues a method to deal with boolean route segment (1 or 0)
trait _boolean
{
    // structureSegmentBoolean
    // gère le segment d'uri booléen
    public static function structureSegmentBoolean(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($type === 'make')
        $return = (in_array($value,[0,1],true))? $value:false;

        elseif($type === 'match')
        $return = (in_array($value,[0,1],true))? $value:false;

        return $return;
    }
}
?>