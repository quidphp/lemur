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
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;
use Quid\Main;
use Quid\Orm;

// video
// extended abstract class for a column containing a video from a third-party service
abstract class Video extends Core\ColAlias
{
    // config
    public static array $config = [
        'tag'=>'inputText',
        'search'=>false,
        'cell'=>Lemur\Cell\Video::class,
        'onGet'=>[Base\Json::class,'onGet'],
        'preValidate'=>['uriAbsolute'],
        'check'=>['kind'=>'text'],
        'descriptionExcerpt'=>500, // custom, longueur maximale de la description
        'service'=>null // classe du service utilisé, à spécifier
    ];


    // getService
    // retourne le service à utiliser
    final public function getService():Main\Service
    {
        $return = null;
        $service = $this->getAttr('service');

        if(!empty($service))
        $return = new $service();

        return $return;
    }


    // showDetailsMaxLength
    // n'affiche pas le détail sur le maxLength de la colonne
    final public function showDetailsMaxLength():bool
    {
        return false;
    }


    // onGet
    // sur onGet retourne l'objet video s'il y a une valeur
    final protected function onGet($return,array $option)
    {
        if(!$return instanceof Main\Video)
        {
            $return = $this->value($return);

            if(is_string($return) && Base\Json::is($return))
            {
                $service = $this->getService();
                $return = $service::makeVideo($return);
            }
        }

        if(!empty($return) && !empty($option['context']) && $option['context'] === 'cms:general' && $return instanceof Main\Video)
        $return = Html::a($return->absolute(),true);

        return $return;
    }


    // onSet
    // gère la logique onSet pour la vidéo
    final protected function onSet($return,array $row,?Orm\Cell $cell=null,array $option)
    {
        $hasChanged = true;

        if(!empty($cell))
        {
            $video = $cell->get();

            if($video instanceof Main\Video && $video->absolute() === $return)
            {
                $return = $video;
                $hasChanged = false;
            }
        }

        if(!empty($return) && $hasChanged === true)
        {
            $service = $this->getService();
            $return = $service->query($return);
        }

        return $return;
    }


    // formComplex
    // génère le formComplex pour la vidéo
    // le html du video sera ajouté au-dessus du champ
    final public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $value = $this->value($value);
        $value = $this->onGet($value,(array) $option);

        if($value instanceof Main\Video)
        {
            $return .= $this->html($value);
            $value = $value->absolute();
            $return .= parent::formComplex($value,$attr,$option);
        }

        else
        $return .= parent::formComplex($value,$attr,$option);

        return $return;
    }


    // html
    // fait le html video à d'un objet video
    final public function html(Main\Video $value):?string
    {
        $return = '';
        $excerpt = $this->getAttr('descriptionExcerpt');
        $date = $value->date(0);
        $excerpt = $value->description($excerpt);
        $html = $value->html();
        $content = '';

        if(!empty($date))
        $content = Html::span($date);

        if(!empty($excerpt))
        {
            if(strlen($content))
            $content .= ' - ';

            $content .= Html::span($excerpt);
        }

        $return .= Html::div($html,'video-player');
        $return .= Html::divCond($content,'video-meta');

        return $return;
    }
}

// init
Video::__init();
?>