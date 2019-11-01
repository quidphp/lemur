<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Core;
use Quid\Orm;

// excerpt
// class for a column which contains an excerpt of a longer value
class Excerpt extends Core\ColAlias
{
    // config
    public static $config = [
        'include'=>true,
        'required'=>false,
        'check'=>['kind'=>'text'],
        'makeExcerpt'=>[ // custom
            'method'=>[Base\Html::class,'excerpt'],
            'option'=>['suffix'=>'...'],
            'length'=>500,
            'col'=>'content']
    ];


    // onSet
    // sur onSet génère le résumé à partir de la colonne spécifié dans config
    public function onSet($return,array $row,?Orm\Cell $cell=null,array $option)
    {
        $return = $this->value($return);

        if(empty($return))
        {
            $attr = $this->getAttr('makeExcerpt');

            if(is_array($attr) && Base\Arr::keysExists(['method','length','col'],$attr))
            {
                $lang = $this->patternType();
                $method = $attr['method'];
                $length = $attr['length'];
                $col = $attr['col'];
                $opt = $attr['option'] ?? null;

                if(static::classIsCallable($method) && is_int($length) && is_string($col))
                {
                    if(is_string($lang))
                    $col = Base\Lang::field($col,$lang);

                    if(array_key_exists($col,$row) && is_string($row[$col]) && strlen($row[$col]))
                    $return = $method($length,$row[$col],$opt);
                }
            }
        }

        return $return;
    }


    // excerptLength
    // retourne la longueur du résumé désiré
    public function excerptLength():?int
    {
        return $this->getAttr('excerpt/length');
    }
}

// init
Excerpt::__init();
?>