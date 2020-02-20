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

// _slug
// trait that issues methods to work with a standard slug route segment
trait _slug
{
    // structureSegmentSlug
    // gère le segment d'uri pour un slug
    final public static function structureSegmentSlug(string $type,$value,array &$keyValue)
    {
        $return = false;
        $table = static::tableSegment($keyValue);

        if(!empty($table))
        {
            $rowClass = $table->classe()->row();

            if($type === 'make')
            {
                if(is_int($value))
                $value = $table->row($value);

                if(is_a($value,$rowClass,true))
                $return = $value->cellKey();

                elseif(is_string($value) && !empty($value))
                $return = $value;
            }

            elseif($type === 'match')
            {
                if($value === null)
                $return = static::structureSegmentSlugValidateDefault();

                elseif(is_scalar($value) && !is_bool($value) && !empty($value))
                $return = $table->row((string) $value) ?? false;

                elseif(is_a($value,$rowClass,true))
                $return = $value;
            }
        }

        return $return;
    }


    // structureSegmentSlugValidateDefault
    // retourne la valeur par défaut pour le segment
    final public static function structureSegmentSlugValidateDefault()
    {
        return false;
    }
}
?>