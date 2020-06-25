<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Core;

// media
// extended class to work with a column containing a value which is a link to a file
class Media extends Core\Col\Media
{
    // config
    protected static array $config = [];


    // formComplexUpdate
    // génère l'élément de formulaire complexe média lors d'une mise à jour
    final protected function formComplexUpdate(Core\Cell $value,array $attr,array $option):string
    {
        $return = $this->commonFormComplexUpdate(null,$value,$attr,$option);

        if(empty($return))
        $return = $this->formComplexEmptyPlaceholder($value);

        return $return;
    }
}

// init
Media::__init();
?>