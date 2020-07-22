<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
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
abstract class Video extends Core\Col\JsonAlias
{
    // config
    protected static array $config = [
        'tag'=>'inputText',
        'search'=>false,
        'cell'=>Lemur\Cell\Video::class,
        'detailPreValidate'=>true,
        'preValidate'=>['uriAbsolute'],
        'check'=>['kind'=>'text'],
        'detailMaxLength'=>false,
        'descriptionExcerpt'=>500, // custom, longueur maximale de la description
        'services'=>null, // classe des services, à spécifier
        '@cms'=>[
            'generalExcerpt'=>null]
    ];


    // getService
    // retourne le service à utiliser
    // envoie une exception si non valide
    final public function getService(string $uri):Main\Service
    {
        $return = null;
        $services = $this->getAttr('services');

        if(is_array($services))
        {
            $service = Base\Arr::find($services,fn($service) => $service::isValidInput($uri));

            if(!empty($service))
            $return = new $service();
        }

        if(empty($return))
        static::throw('couldNotFindVideoService',$uri);

        return $return;
    }


    // onGet
    // sur onGet retourne l'objet video s'il y a une valeur
    final protected function onGet($return,?Orm\Cell $cell=null,array $option)
    {
        $return = parent::onGet($return,$cell,$option);

        if(is_array($return))
        {
            $input = $return['input'] ?? null;

            if(is_string($input))
            {
                $service = $this->getService($input);
                $return = $service::makeVideo($return);
            }
        }

        return $return;
    }


    // onSet
    // gère la logique onSet pour la vidéo
    final protected function onSet($return,?Orm\Cell $cell=null,array $row,array $option)
    {
        $return = parent::onSet($return,$cell,$row,$option);
        $hasChanged = true;
        $input = null;

        if(!empty($cell))
        {
            $video = $cell->get();

            if($video instanceof Main\Video && $video->absolute() === $return)
            {
                $return = $video;
                $hasChanged = false;
            }
        }

        if(!empty($return) && is_string($return) && $hasChanged === true)
        {
            $input = $return;

            if(Base\Json::is($return))
            $input = Base\Json::decode($return)['input'] ?? null;

            if(is_string($input))
            {
                $service = $this->getService($input);
                $return = $service->query($input);
            }
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
        $value = $this->get($value,$option);

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
    final public function html(Main\Video $value,bool $withMeta=true):?string
    {
        $return = '';
        $html = $value->html();
        $return .= Html::divCond($html,'video-player');

        if($withMeta === true)
        {
            $excerpt = $this->getAttr('descriptionExcerpt');
            $date = $value->date(0);
            $excerpt = $value->description($excerpt);
            $content = '';

            if(!empty($date))
            $content = Html::span($date);

            if(!empty($excerpt))
            {
                if(strlen($content))
                $content .= ' - ';

                $content .= Html::span($excerpt);
            }

            $return .= Html::divCond($content,'video-meta');
        }

        return $return;
    }
}

// init
Video::__init();
?>