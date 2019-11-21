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
use Quid\Core;

// _pointer
// trait to work with a pointer route segment (value which contains a table and row)
trait _pointer
{
    // structureSegmentPointer
    // gère le segment d'uri pour un pointeur, c'est à dire table-id en un seul segment
    final public static function structureSegmentPointer(string $type,$value,array &$keyValue)
    {
        $return = false;
        $valid = static::getPointerValidTables();

        if($type === 'make')
        {
            if($value instanceof Core\Row)
            {
                $tableName = $value->tableName();

                if(empty($valid) || in_array($tableName,$valid,true))
                $value = $value->pointer();

                else
                $return = false;
            }

            if(is_string($value) && !empty($value))
            $return = $value;
        }

        elseif($type === 'match')
        {
            if($value === null)
            $return = static::structureSegmentPointerValidateDefault();

            elseif(is_string($value) && !empty($value))
            {
                $db = static::db();
                $return = $db->fromPointer($value,$valid) ?? false;
            }
        }

        return $return;
    }


    // getPointerValidTables
    // retourne les tables valables pour le pointeur, si vide tout est valable
    final public static function getPointerValidTables():?array
    {
        return null;
    }


    // structureSegmentPointerValidateDefault
    // retourne la valeur par défaut pour le segment
    final public static function structureSegmentPointerValidateDefault()
    {
        return false;
    }
}
?>