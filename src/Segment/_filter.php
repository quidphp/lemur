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
use Quid\Core;

// _filter
// trait to manage a complex route segment which contains filtering directive
trait _filter
{
    // structureSegmentFilter
    // gère le segment d'uri pour un filtre, peut en contenir plusieurs
    final public static function structureSegmentFilter(string $type,$value,array &$keyValue)
    {
        $return = false;
        $table = static::tableSegment($keyValue);

        if(!empty($table))
        {
            if($type === 'make')
            $return = static::makeSegmentFilter($value,$table);

            elseif($type === 'match')
            {
                if($value === null)
                $return = [];

                else
                $return = static::matchSegmentFilter($value,$table);
            }
        }

        return $return;
    }


    // makeSegmentFilter
    // gère le segment filter lors de la création d'une uri
    final protected static function makeSegmentFilter($value,Core\Table $table)
    {
        $return = false;

        if(!empty($value))
        {
            if(is_array($value))
            {
                $array = [];
                $delimiters = static::getFilterDelimiters();

                foreach ($value as $k => $v)
                {
                    $str = null;

                    if($v instanceof Core\Row)
                    $v = $v->primary();

                    if(is_scalar($v))
                    $v = [$v];

                    if(is_array($v) && !empty($v))
                    {
                        $str = $k.$delimiters[1];
                        foreach (array_values($v) as $i => $vv)
                        {
                            if($i > 0)
                            $str .= $delimiters[2];

                            $str .= $vv;
                        }
                    }

                    if(!empty($str))
                    $array[] = $str;
                }

                if(!empty($array))
                $return = implode($delimiters[0],$array);
            }

            elseif(is_string($value))
            $return = $value;
        }

        return $return;
    }


    // matchSegmentFilter
    // gère le segment filter lors de la validation d'une uri
    final protected static function matchSegmentFilter($value,Core\Table $table)
    {
        $return = false;

        if(!empty($value))
        {
            if(is_string($value))
            {
                $return = [];
                $delimiters = static::getFilterDelimiters();
                $array = Base\Str::explodes([$delimiters[0],$delimiters[1]],$value,null,true,true);

                if(!empty($array))
                {
                    $value = [];

                    foreach ($array as $val)
                    {
                        if(is_array($val) && count($val) === 2)
                        {
                            $k = $val[0];
                            $v = Base\Str::explode($delimiters[2],$val[1],null,true,true);
                            $v = Base\Arr::cast($v);
                            $value[$k] = $v;
                        }
                    }
                }
            }

            if(is_array($value))
            $return = static::matchSegmentFilterArray($value,$table);
        }

        return $return;
    }


    // matchSegmentFilterArray
    // gère le segment filter lors d'une validation et que la valeur est un array
    final protected static function matchSegmentFilterArray(array $value,Core\Table $table)
    {
        $return = [];

        foreach ($value as $k => $v)
        {
            $val = false;

            if(is_string($k) && $table->hasCol($k) && $v !== null)
            {
                $col = $table->col($k);

                if($col->isFilterable())
                $val = static::prepareSegmentFilter($v,$col);
            }

            if($val === false)
            {
                $return = false;
                break;
            }

            else
            $return = Base\Arr::merge($return,$val);
        }

        return $return;
    }


    // prepareSegmentFilter
    // permet de préparer les valeurs pour une relation
    final protected static function prepareSegmentFilter(array $value,Core\Col $col)
    {
        $return = [];
        $name = $col->name();
        $rel = $col->relation();

        foreach ($value as $v)
        {
            if($col->isFilterEmptyNotEmpty() && $col::isFilterEmptyNotEmptyValue($v))
            $return[$name][] = $v;

            elseif($rel->exists($v))
            $return[$name][] = $v;

            else
            {
                $return = false;
                break;
            }
        }

        return $return;
    }


    // getFilterDelimiters
    // retourne les délimiteurs à utiliser pour les filtres
    final public static function getFilterDelimiters():array
    {
        $return = [];
        $default = static::getDefaultSegment();
        $return[] = $default.$default.$default;
        $return[] = $default.$default;
        $return[] = $default;

        return $return;
    }
}
?>