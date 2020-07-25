<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Core;

// medias
// class to work with a column containing a value which is a link to many files
class Medias extends Core\Col\Medias
{
    // config
    protected static array $config = [];


    // formComplexUpdate
    // génère l'élément de formulaire complexe média lors d'une mise à jour
    final protected function formComplexUpdate(Core\Cell $value,array $attr,array $option):string
    {
        $return = Base\Arr::accumulate('',$this->indexRange(),fn($index) => $this->commonFormComplexUpdate($index,$value,$attr,$option));
        return $return ?: $this->formComplexEmptyPlaceholder($value);
    }
}

// init
Medias::__init();
?>