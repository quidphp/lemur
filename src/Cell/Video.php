<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cell;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Main;

// video
// class to manage a cell containing a video from a third-party service
class Video extends Core\CellAlias
{
    // config
    protected static array $config = [];


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


    // isMediaOrLike
    // retourne vrai comme la colonne contient un similaire à média
    public function isMediaOrLike():bool
    {
        return true;
    }


    // getFirstImage
    // retourne la première image de la vidéo, pour le moment null
    final public function getFirstImage():?Main\File
    {
        return null;
    }


    // video
    // retourne l'objet video ou null
    final public function video():?Main\Video
    {
        return $this->get() ?: null;
    }


    // html
    // output le html de la vidéo
    final public function html(bool $withMeta=true):?string
    {
        $return = null;
        $video = $this->video();

        if(!empty($video))
        $return = $this->col()->html($video,$withMeta);

        return $return;
    }


    // generalOutput
    // génère le output général pour une cellule video
    final public function generalOutput(array $option):?string
    {
        return $this->html(false);
    }


    // outputTableRelation
    // génère le tableau de output pour une vidéo
    final public function outputTableRelation():array
    {
        $return = [];
        $video = $this->video();

        if(!empty($video))
        {
            $html = $video->html();
            $name = $video->name();

            if(!empty($html) && !empty($name))
            {
                $r = [];
                $r['thumbnail'] = null;
                $r['name'] = $name;
                $date = $video->date(0);
                $content = $video->description(200);

                $r['content'] = '';
                if(!empty($date))
                {
                    $r['content'] .= $date;
                    if(!empty($content))
                    $r['content'] .= ' - ';
                }
                $r['content'] .= $content;

                $excerpt = Base\Str::excerpt(50,$name);
                $r['from'] = Html::span(null,['big-icon','video']);
                $r['from'] .= Html::span($excerpt,'legend');

                $r['to'] = $html;

                $return[] = $r;
            }
        }

        return $return;
    }
}

// init
Video::__init();
?>