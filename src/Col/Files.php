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

// files
// extended abstract class extended by the media and medias cols
abstract class Files extends Core\Col\Files
{
    // config
    protected static array $config = [
        'complex'=>'inputFile',
        'generalExcerpt'=>null,
        'permission'=>[
            '*'=>[
                'mediaLegend'=>true]],
        '@cms'=>[
            'versionDefault'=>['lemurHome'=>-1,'lemurGeneral'=>-1],
            'route'=>['download'=>Lemur\Cms\Download::class]]
    ];


    // formComplex
    // génère un élément de formulaire complexe pour les medias
    final public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $name = $this->name();
        $attr = (array) $attr;
        $option = (array) $option;
        $hasMultiple = $this->hasIndex();
        $this->checkWritable();

        if($value instanceof Core\Cell)
        $return .= $this->formComplexUpdate($value,$attr,$option);

        else
        $return .= $this->formComplexInsert($attr,$option);

        return $return;
    }


    // formComplexInsert
    // génère l'élément de formulaire complexe média lors d'une insertion
    final protected function formComplexInsert(array $attr,array $option):string
    {
        $return = '';

        if($this->allowFileUpload())
        {
            $hasMultiple = $this->hasIndex();
            $attr['tag'] = $this->getAttr('complex');
            $option['multi'] = $hasMultiple;

            foreach ($this->indexRange() as $i)
            {
                $html = '';
                $int = $i + 1;

                if($hasMultiple === true)
                {
                    $count = Html::div($int,'count');
                    $html .= Html::div($count,'count-circle');
                }

                $formHtml = $this->form(null,$attr,$option);
                $html .= Html::div($formHtml,'form');

                $return .= Html::div($html,['file-block','empty']);
            }
        }

        else
        $return = $this->formComplexNothing();

        return $return;
    }


    // commonFormComplexUpdate
    // génère l'élément de formulaire complexe média lors d'une mise à jour
    final protected function commonFormComplexUpdate(?int $index,Core\Cell $value,array $attr,array $option):string
    {
        $return = '';
        $hasIndex = $this->hasIndex();
        $table = $this->table();
        $tag = $this->complexTag($attr);
        $allowFileUpload = ($this->allowFileUpload() && Html::isFormTag($tag,true));
        $attr['tag'] = $this->getAttr('complex');
        $lang = $this->db()->lang();
        $i = null;

        if($hasIndex === true)
        {
            $i = ($index + 1);
            $attr['name'] = $this->name()."[$index]";
            $get = $value->get();
            $isEmpty = (is_array($get) && array_key_exists($index,$get))? false:true;
        }

        else
        $isEmpty = $value->isEmpty();

        if($allowFileUpload === true || $isEmpty === false)
        {
            $class = ($isEmpty === true)? 'empty':'not-empty';

            if(is_int($i))
            {
                $count = Html::div($i,'count');
                $return .= Html::div($count,'count-circle');
            }

            if($isEmpty === false)
            {
                if($allowFileUpload === true)
                {
                    $action = '';
                    $isDeleteable = $value->canBeDeleted($index);
                    $isRegenerateable = $value->canBeRegenerated($index);

                    if($isRegenerateable === true)
                    {
                        $tooltip = $lang->text('tooltip/mediaRegenerate');
                        $data = ['action'=>'regenerate','confirm'=>$lang->text('common/confirm'),'tooltip'=>$tooltip,'text'=>$lang->text('specific/mediaRegenerate')];
                        $action .= Html::div(null,['icon-solo','action','regenerate','data'=>$data]);
                    }

                    if($isDeleteable === true)
                    {
                        $tooltip = $lang->text('tooltip/mediaDelete');
                        $data = ['action'=>'delete','confirm'=>$lang->text('common/confirm'),'tooltip'=>$tooltip,'text'=>$lang->text('specific/mediaDelete')];
                        $action .= Html::div(null,['icon-solo','action','remove','data'=>$data]);
                    }

                    $return .= Html::divCond($action,'actions');
                }

                $return .= Html::divCond($this->commonFormComplexUpdateInfo($index,$value,$attr,$option),'info');
                $return .= Html::divCond($this->commonFormComplexUpdateVersion($index,$value,$attr,$option),'versions');
            }

            if($allowFileUpload === true)
            {
                $formHtml = $this->form(null,$attr,$option);
                $path = ($hasIndex === true)? $value->cellPathBasename($index):$value->cellPathBasename($index);

                $hidden = Base\Json::encode(['action'=>null,'path'=>$path]);
                $formHtml .= $this->formHidden($hidden,Base\Arr::plus($attr,['disabled'=>true]),$option);

                $messageHtml = Html::div(null,'action-text');
                $messageHtml .= Html::div(null,['icon-solo','close']);
                $formHtml .= Html::div($messageHtml,'message');

                $return .= Html::div($formHtml,'form');
            }

            $return = Html::div($return,['file-block',$class]);
        }

        return $return;
    }


    // commonFormComplexUpdateInfo
    // génère la partie info du formulaire complexe media
    final protected function commonFormComplexUpdateInfo(?int $index,Core\Cell $value,array $attr,array $option):string
    {
        $return = '';
        $hasIndex = $this->hasIndex();
        $hasVersion = $this->hasVersion();
        $table = $this->table();
        $file = ($hasIndex === true)? $value->file($index):$value->file();
        $exists = (!empty($file))? $file->isReadable():false;
        $isImage = ($exists === true && $file instanceof Main\File\Image);
        $basename = ($exists === true)? $file->basename():false;
        $download = $table->hasPermission('download');
        $hostPriority = $this->getHostPriority();

        if(is_string($basename))
        $basename = Base\Str::excerpt(50,$basename);
        $html = '';

        if($exists === true)
        {
            $html .= Html::spanOr($file->pathToUri(true,$hostPriority),$basename,'filename');

            if($download === true)
            {
                $route = $value->downloadRoute($index);
                $return .= $route->aOpen();
            }

            if($isImage === true)
            {
                if($hasVersion === true && $hasIndex === true)
                $thumbnail = $value->file($index,1);

                elseif($hasVersion === true && $hasIndex === false)
                $thumbnail = $value->file(1);

                else
                $thumbnail = $file;

                $return .= Html::img($thumbnail);
            }
            else
            $return .= Html::div(null,'media-placeholder');

            if($download === true)
            $return .= Html::aCl();

            $html .= Html::span($file->size(true),'filesize');
        }

        else
        {
            $lang = $this->db()->lang();
            $html .= Html::span($lang->text('common/notFound'),'notFound');
            $html .= Html::spanCond($basename,'filename');
        }

        $return .= Html::div($html,'line');

        return $return;
    }


    // commonFormComplexUpdateVersion
    // génère la partie versions du formulaire complexe media
    final protected function commonFormComplexUpdateVersion(?int $index,Core\Cell $value,array $attr,array $option):string
    {
        $return = '';

        if($this->hasVersion())
        {
            $versions = $this->versions();
            $cellVersions = $value->version($index);
            $lang = $this->db()->lang();
            $hostPriority = $this->getHostPriority();

            if(!empty($versions))
            {
                foreach ($versions as $key => $array)
                {
                    $file = $cellVersions->get($key);
                    $key = ucfirst($key);

                    $liHtml = Html::span($key.':');

                    if(!empty($file))
                    {
                        $pathToUri = $file->pathToUri(true,$hostPriority);
                        if(!empty($pathToUri))
                        {
                            $uri = Base\Str::excerpt(50,$file->pathToUri());
                            $liHtml .= Html::a($pathToUri,$uri);
                        }

                        $liHtml .= Html::span($file->size(true),'filesize');
                    }

                    else
                    $liHtml .= Html::span($lang->text('common/notFound'),'notFound');

                    $return .= Html::li($liHtml);
                }

                $return = Html::ulCond($return);
            }
        }

        return $return;
    }


    // getHostPriority
    // retourne le host priority a utilisé (boot typePrimary)
    // si c'est cms, renvoie vers app par défaut
    final public function getHostPriority():string
    {
        $boot = static::boot();
        $typePrimary = $boot->typePrimary();

        return $boot->host(true,$typePrimary);
    }
}

// init
Files::__init();
?>