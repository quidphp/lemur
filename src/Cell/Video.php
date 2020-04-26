<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cell;
use Quid\Core;
use Quid\Main;

// video
// class to manage a cell containing a video from a third-party service
class Video extends Core\CellAlias
{
    // config
    public static array $config = [];


    // cast
    // pour cast, retourne le lien absolut de la vidéo
    final public function _cast()
    {
        $return = null;
        $video = $this->video();

        if(!empty($video))
        $return = $video->absolute();

        return $return;
    }


    // video
    // retourne l'objet video ou null
    final public function video():?Main\Video
    {
        $return = $this->get();

        if(empty($return))
        $return = null;

        return $return;
    }


    // html
    // output le html de la vidéo
    final public function html():?string
    {
        $return = null;
        $video = $this->video();

        if(!empty($video))
        $return = $this->col()->html($video);

        return $return;
    }
}

// init
Video::__init();
?>