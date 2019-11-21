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
use Quid\Base;

// _timestampMonth
// trait to work with a route segment which contains the timestamp of a month
trait _timestampMonth
{
    // structureSegmentTimestampMonth
    // gère le segment d'uri pour un timestamp de mois, utile pour un calendrier
    final public static function structureSegmentTimestampMonth(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($type === 'make')
        {
            if(is_string($value))
            {
                if(Base\Date::isFormat('ym',$value))
                $return = $value;

                elseif(Base\Date::isFormat('dateToDay',$value))
                $value = Base\Date::format('ym',$value,'dateToDay');
            }

            elseif(is_int($value))
            $return = Base\Date::format('ym',$value);
        }

        elseif($type === 'match')
        {
            if($value === null)
            $return = Base\Date::floorMonth();

            elseif(is_scalar($value))
            $return = $value;
        }

        return $return;
    }
}
?>