<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Segment;

// _slug
// trait that issues methods to work with a standard slug route segment
trait _slug
{
    // structureSegmentSlug
    // gère le segment d'uri pour un slug
    // cette méthode utilise le quatrième argument (lang) utilisé seulement pour make
    final public static function structureSegmentSlug(string $type,$value,array &$keyValue,?string $lang=null)
    {
        $return = false;
        $table = static::tableSegment($keyValue,'slug');

        if(!empty($table))
        {
            $rowClass = $table->classe()->row();

            if($type === 'make')
            {
                if(is_int($value))
                $value = $table->row($value);

                if(is_a($value,$rowClass,true))
                $return = $value->cellKey($lang);

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