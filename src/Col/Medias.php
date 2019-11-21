<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Col;
use Quid\Core;

// medias
class Medias extends Core\Col\Medias
{
    // config
    public static $config = [];


    // formComplexUpdate
    // génère l'élément de formulaire complexe média lors d'une mise à jour
    final protected function formComplexUpdate(Core\Cell $value,array $attr,array $option):string
    {
        $return = '';

        foreach($this->indexRange() as $index)
        {
            $return .= $this->commonFormComplexUpdate($index,$value,$attr,$option);
        }

        if(empty($return))
        $return = $this->formComplexEmptyPlaceholder($value);

        return $return;
    }
}

// init
Medias::__init();
?>