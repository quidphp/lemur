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

// _boolean
// trait that issues a method to deal with boolean route segment (1 or 0)
trait _boolean
{
    // structureSegmentBoolean
    // gère le segment d'uri booléen
    final public static function structureSegmentBoolean(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($type === 'make')
        $return = (in_array($value,[0,1],true))? $value:false;

        elseif($type === 'match')
        {
            $default = static::structureSegmentBoolDefault();

            if($value === null)
            $return = $default;

            else
            $return = (in_array($value,[0,1],true))? $value:false;
        }

        return $return;
    }


    // structureSegmentBoolDefault
    // retourne le int par défaut pour le segment
    final public static function structureSegmentBoolDefault()
    {
        return false;
    }
}
?>