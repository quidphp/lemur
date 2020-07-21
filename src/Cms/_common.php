<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Base\Html;

// _common
// trait that provides commonly used methods for the CMS
trait _common
{
    // isTableTop
    // retourne vrai si la table courante est dans le tableau
    // la page n'a pas nécessairement une table
    final protected function isTableTop(array $value)
    {
        $return = false;

        if($this->hasMethod('table'))
        {
            $table = $this->table()->name();

            if(!empty($table) && in_array($table,$value,true))
            $return = true;
        }

        return $return;
    }


    // tableHiddenInput
    // génère le input hidden pour table
    final public function tableHiddenInput():string
    {
        return Html::inputHidden($this->table(),static::tableInputName());
    }


    // tableInputName
    // retourne le nom du input pour table
    final public static function tableInputName():string
    {
        return '-table-';
    }


    // panelInputName
    // retourne le nom du input pour panel
    final public static function panelInputName(bool $dash=true):string
    {
        return ($dash === true)? '-panel-':'panel';
    }


    // makeDivPopup
    // génère la balise pour le popup avec le tabindex
    final public static function makeDivPopup($value=null,$attr='popup',?int $tabindex=0):string
    {
        $attr = (array) $attr;

        if(is_int($tabindex))
        $attr['tabindex'] = $tabindex;

        return Html::div($value,$attr);
    }


    // makeInfoPopup
    // génère un popup d'informations
    final public static function makeInfoPopup(array $values,\Closure $closure):string
    {
        $r = '';

        foreach ($values as $key)
        {
            [$label,$value] = $closure($key);

            if($value !== null)
            {
                $html = '';

                if(is_array($value))
                {
                    $html2 = static::infoPopupArray($value);
                    $html .= Html::ulCond($html2);
                }

                else
                {
                    if(is_bool($value))
                    $value = static::lang()->bool($value);

                    if(is_object($value))
                    $value = Base\Obj::cast($value);

                    if($value !== null)
                    $html .= Html::span($value);
                }

                if(strlen($html))
                {
                    $liHtml = Html::span($label.':');
                    $liHtml .= $html;
                    $r .= Html::li($liHtml);
                }
            }
        }

        if(strlen($r))
        $r = Html::ul($r);

        return $r;
    }


    // infoPopopArray
    // méthode utilisé par makeInfoPopup
    final protected static function infoPopupArray(array $value):string
    {
        $return = '';
        foreach ($value as $k => $v)
        {
            $str = '';

            if(is_numeric($v))
            $v = (string) $v;

            elseif(is_bool($v))
            $v = static::lang()->bool($v);

            elseif($v === '' || $v === null)
            $v = Html::span('NULL','value-empty');

            elseif(!Base\Arrs::is($v) && Base\Arr::isIndexed($v))
            $v = implode(', ',Base\Arr::cleanNull($v));

            elseif(is_array($v))
            $v = Html::ulCond(static::infoPopupArray($v));

            if(is_string($v) && strlen($v))
            {
                if(is_string($k))
                {
                    $str .= Html::span($k,'key');
                    $str .= ': ';
                }

                $str .= $v;
                $return .= Html::liCond($str);
            }
        }

        return $return;
    }
}
?>