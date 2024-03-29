<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Segment;
use Quid\Base;
use Quid\Core;

// _cols
// trait to manage a route segment which must contain many columns
trait _cols
{
    // structureSegmentCols
    // gère le segment d'uri pour plusieurs colonnes
    final public static function structureSegmentCols(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($type === 'make')
        {
            if(!empty($value))
            {
                $default = static::getDefaultSegment();

                if($value instanceof Core\Cols)
                $value = $value->keys();

                if(is_array($value))
                $value = implode($default,$value);

                if(is_string($value))
                $return = $value;
            }
        }

        elseif($type === 'match')
        {
            $table = static::tableSegment($keyValue,'cols');

            if(!empty($table))
            {
                if($value === null)
                {
                    $closure = fn($col) => $col->isGeneral() && $col->isVisibleGeneral();
                    $return = $table->cols()->filter($closure);
                }

                elseif(is_string($value) && !empty($value))
                {
                    $closure = fn($col) => $col->isVisibleGeneral();
                    $default = static::getDefaultSegment();

                    $array = Base\Str::explodeTrimClean($default,$value);
                    $count = count($array);
                    $value = $table->cols(...$array)->filter($closure);

                    if($value->isCount($count))
                    $return = $value;
                }

                elseif($value instanceof Core\Cols)
                $return = $value;
            }
        }

        return $return;
    }
}
?>