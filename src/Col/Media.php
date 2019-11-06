<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Core;

// media
class Media extends Core\Col\Media
{
    // config
    public static $config = [];


    // formComplexUpdate
    // génère l'élément de formulaire complexe média lors d'une mise à jour
    protected function formComplexUpdate(Core\Cell $value,array $attr,array $option):string
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