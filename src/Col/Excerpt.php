<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Orm;

// excerpt
// class for a column which contains an excerpt of a longer value
class Excerpt extends Core\ColAlias
{
    // config
    protected static array $config = [
        'include'=>true,
        'required'=>false,
        'check'=>['kind'=>'text'],
        'makeExcerpt'=>[ // custom
            'method'=>[Html::class,'excerpt'],
            'option'=>['suffix'=>'...'],
            'length'=>500,
            'col'=>'content']
    ];


    // onSet
    // sur onSet génère le résumé à partir de la colonne spécifié dans config
    final protected function onSet($return,?Orm\Cell $cell,array $row,array $option)
    {
        $attr = $this->getAttr('makeExcerpt');

        if(empty($return) && is_array($attr) && Base\Arr::keysExists(['method','length','col'],$attr))
        {
            $lang = $this->schema()->patternType();
            $method = $attr['method'];
            $length = $attr['length'];
            $col = $attr['col'];
            $opt = $attr['option'] ?? null;

            if(static::isCallable($method) && is_int($length) && is_string($col))
            {
                if(is_string($lang))
                $col = Base\Lang::field($col,$lang);

                if(array_key_exists($col,$row) && is_string($row[$col]) && strlen($row[$col]))
                $return = $method($length,$row[$col],$opt);
            }
        }

        return $return;
    }


    // excerptLength
    // retourne la longueur du résumé désiré
    final public function excerptLength():?int
    {
        return $this->getAttr('excerpt/length');
    }
}

// init
Excerpt::__init();
?>