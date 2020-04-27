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
use Quid\Base\Html;
use Quid\Core;

// primary
// extended class for dealing with a column which has an auto increment primary key
class Primary extends Core\Col\Primary
{
    // config
    protected static array $config = [];


    // getDataAttr
    // retourne les attr pour la colonne primaire
    public function getDataAttr(array $return):array
    {
        $table = $this->table();
        $specific = $table->hasPermission('view','specific');
        $return['data-link'] = $specific;

        return $return;
    }


    // onGet
    // logique onGet pour un champ primary
    // affichage d'un lien si le contexte est cms:general
    protected function onGet($return,array $option)
    {
        if($return instanceof Core\Cell && !$return->isNull() && !empty($option['context']) && $option['context'] === 'cms:general' && !empty($option['specific']))
        $return = Html::a($option['specific'],$return);

        else
        $return = parent::onGet($return,$option);

        return $return;
    }
}

// init
Primary::__init();
?>