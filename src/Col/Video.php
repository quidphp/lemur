<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base\Html;
use Quid\Core;
use Quid\Main;

// video
// extended abstract class for a column containing a video from a third-party service
abstract class Video extends Core\Col\Video
{
    // config
    public static $config = [];


    // onGet
    // sur onGet retourne l'objet video s'il y a une valeur, pour le cms lien absolut
    public function onGet($return,array $option)
    {
        $return = parent::onGet($return,$option);

        if(!empty($return) && !empty($option['context']) && $option['context'] === 'cms:general' && $return instanceof Main\Video)
        $return = Html::a($return->absolute(),true);

        return $return;
    }
}

// init
Video::__init();
?>