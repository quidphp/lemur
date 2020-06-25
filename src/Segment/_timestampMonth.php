<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
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
                if(Base\Datetime::isFormat('ym',$value))
                $return = $value;

                elseif(Base\Datetime::isFormat('dateToDay',$value))
                $value = Base\Datetime::format('ym',$value,'dateToDay');
            }

            elseif(is_int($value))
            $return = Base\Datetime::format('ym',$value);
        }

        elseif($type === 'match')
        {
            if($value === null)
            $return = Base\Datetime::floorMonth();

            elseif(is_scalar($value))
            $return = $value;
        }

        return $return;
    }
}
?>