<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/core/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Core;
use Quid\Base\Html;

// primary
// extended class for dealing with a column which has an auto increment primary key
class Primary extends Core\Col\Primary
{
    // config
    public static $config = [];
    
    
    // onGet
    // logique onGet pour un champ primary
    // affichage d'un lien si le contexte est cms:general
    protected function onGet($return,array $option)
    {
        if($return instanceof Core\Cell && !$return->isNull() && !empty($option['context']) && $option['context'] === 'cms:general' && is_string($option['specific']))
        $return = Html::a($option['specific'],$return);

        else
        $return = parent::onGet($return,$option);

        return $return;
    }
}

// init
Primary::__init();
?>