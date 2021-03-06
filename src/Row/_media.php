<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Main;

// _media
// trait to work with a row of containing media, storage or video
trait _media
{
    // configMedia
    protected static array $configMedia = [
        'relationExcerptOutput'=>50,
        'relation'=>[
            'method'=>'relationOutput','separator'=>'<br/>','order'=>['id'=>'desc']],
    ];


    // getFirstImage
    // retourne la première image de la ligne
    final public function getFirstImage($version=null,?string $type=null):?Main\File
    {
        $return = null;
        $cells = $this->getMediaCells();

        foreach ($cells as $cell)
        {
            $file = $cell->getFirstImage($version,$type);

            if($file instanceof Main\File\Image)
            {
                $return = $file;
                break;
            }
        }

        return $return;
    }


    // getMediaCells
    // retourne toutes les cellules contenant des médias
    final public function getMediaCells():Core\Cells
    {
        return $this->cells()->filter(fn($cell) => $cell->isMediaOrLike());
    }


    // regenerateVersion
    // méthode pour regénérer les versions des colonnes medias
    final public function regenerateVersion(?array $option=null):array
    {
        $return = [];

        foreach ($this->getMediaCells() as $name => $cell)
        {
            if($cell->hasVersion())
            $return[$name] = $cell->makeVersion(true,$option);
        }

        return $return;
    }


    // relationOutput
    // génère le output de relation pour la table media
    final public function relationOutput():string
    {
        $return = '';
        $excerpt = $this->getAttr('relationExcerptOutput');
        $namePrimary = $this->namePrimary(null,$excerpt);
        $image = $this->getFirstImage(null,'lemurRelation');

        if(!empty($image))
        $return .= Html::spanCond($image->img(),'thumbnail');

        $return .= Html::span($namePrimary,'legend');

        return $return;
    }


    // tableRelationArray
    // génère le tableau de output pour les médias dans la ligne
    // utiliser par l'outil de relation dans le cms
    final protected function tableRelationArray():array
    {
        $return = [];

        foreach ($this->getMediaCells() as $name => $cell)
        {
            $return = Base\Arr::merge($return,$cell->outputTableRelation());
        }

        return $return;
    }


    // tableRelationOutput
    // gère le output de relation pour tableRelation dans le cms
    // permet insertion au curseur
    final public function tableRelationOutput():string
    {
        $return = '';
        $namePrimary = $this->namePrimary();

        $html = '';
        foreach ($this->tableRelationArray() as $value)
        {
            if(!empty($value['from']) && !empty($value['to']))
            {
                $data = ['html'=>$value['to']];
                $html .= Html::button($value['from'],['insert','data'=>$data]);
            }
        }

        if(!empty($html))
        {
            $html = Html::divCond($html,'triggers');
            $html = Html::div($namePrimary,'legend').$html;
            $return .= Html::div($html,'medias');
        }

        return $return;
    }


    // makeTableRelationSlides
    // retourne un tableau avec toutes les slides à partir de la row
    final protected function makeTableRelationSlides(?array $option=null):array
    {
        $return = [];
        $option = Base\Arr::plus(['name'=>false,'content'=>false],$option);

        foreach ($this->tableRelationArray() as $value)
        {
            $html = '';

            if(is_array($value) && !empty($value))
            {
                $type = (!empty($value['isImage']))? 'photo':'video';

                if(!empty($value['isImage']))
                $ratio = Html::div(null,['media','bgimg'=>$value['thumbnail']]);
                else
                $ratio = Html::div($value['to'],'media');

                $ratioHtml = Html::div($ratio,'ratio');
                $html .= Html::div($ratioHtml,['wrap',$type]);
                $info = '';

                if($option['name'] === true)
                $info .= Html::divCond($value['name'],'name');

                if($option['content'] === true)
                $info .= Html::divCond($value['content'],'content');

                $html .= Html::divCond($info,'info');
            }

            if(strlen($html))
            $return[] = $html;
        }

        return $return;
    }


    // tableRelationSlides
    // génère toutes les slides à partir de la row
    final public function tableRelationSlides(?array $option=null):string
    {
        $r = '';
        $slides = $this->makeTableRelationSlides($option);

        if(!empty($slides))
        {
            foreach ($slides as $value)
            {
                if(is_string($value) && !empty($value))
                $r .= Html::div($value,'slide');
            }
        }

        return $r;
    }


    // isMediaSource
    // retourne vrai comme la row est source de médias
    final public static function isMediaSource():bool
    {
        return true;
    }
}
?>