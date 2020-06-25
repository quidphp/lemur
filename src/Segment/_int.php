<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Segment;
use Quid\Base;

// _int
// trait that issues a method to deal with a simple integer route segment
trait _int
{
    // structureSegmentInt
    // gère le segment d'uri pour un chiffre entier, int, accepte 0
    final public static function structureSegmentInt(string $type,$value,array &$keyValue)
    {
        $return = false;
        $minimum = static::structureSegmentIntMinimum();
        $value = Base\Obj::cast($value);

        if($type === 'make')
        $return = (is_int($value) && $value >= $minimum)? $value:false;

        elseif($type === 'match')
        {
            $default = static::structureSegmentIntDefault();

            if($value === null)
            $return = $default;

            else
            {
                $return = (is_int($value) && $value >= $minimum)? $value:false;

                $possible = static::structureSegmentIntPossible();
                if($return !== false && !empty($possible))
                $return = (in_array($value,$possible,true))? $value:false;
            }
        }

        return $return;
    }


    // structureSegmentIntMinimum
    // retourne la valeur minimum pour le int
    final public static function structureSegmentIntMinimum():int
    {
        return 0;
    }


    // structureSegmentIntDefault
    // retourne la valeur par défaut pour le segment (false)
    final public static function structureSegmentIntDefault()
    {
        return false;
    }


    // structureSegmentIntPossible
    // retourne un tableau avec les int possible pour la route
    final public static function structureSegmentIntPossible():?array
    {
        return null;
    }
}
?>