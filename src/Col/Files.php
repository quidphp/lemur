<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Core;
use Quid\Lemur;

// files
// extended abstract class extended by the media and medias cols
abstract class Files extends Core\Col\Files
{
    // config
    public static $config = [
        '@cms'=>[
            'route'=>['download'=>Lemur\Cms\SpecificDownload::class]]
    ];


    // onGet
    // logique onGet pour un champ files
    // affichage spéciale si le contexte est cms:general
    public function onGet($return,array $option)
    {
        if($return instanceof Core\Cell\Files && !empty($option['context']) && is_string($option['context']) && strpos($option['context'],':general') !== false)
        $return = $return->generalOutput($option);

        else
        $return = parent::onGet($return,$option);

        return $return;
    }
}

// config
Files::__config();
?>