<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
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
    public static $config = [
        'complex'=>'inputFile',
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


    // formComplex
    // génère un élément de formulaire complexe pour les medias
    public function formComplex($value=true,?array $attr=null,?array $option=null):string
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
    protected function formComplexInsert(array $attr,array $option):string
    {
        $return = '';

        if($this->allowFileUpload())
        {
            $hasMultiple = $this->hasIndex();
            $attr['tag'] = $this->getAttr('complex');
            $option['multi'] = $hasMultiple;

            foreach($this->indexRange() as $i)
            {
                $int = $i + 1;
                $return .= Html::divOp(['block','empty']);

                if($hasMultiple === true)
                $return .= Html::div(Html::divtable($int),'count');

                $return .= Html::divOp('form');
                $return .= $this->form(null,$attr,$option);
                $return .= Html::divCl();
                $return .= Html::divCl();
            }
        }

        else
        $return = $this->formComplexNothing();

        return $return;
    }


    // commonFormComplexUpdate
    // génère l'élément de formulaire complexe média lors d'une mise à jour
    protected function commonFormComplexUpdate(?int $index=null,Core\Cell $value,array $attr,array $option):string
    {
        $return = '';
        $hasIndex = $this->hasIndex();
        $table = $this->table();
        $tag = $this->complexTag($attr);
        $allowFileUpload = ($this->allowFileUpload() && Html::isFormTag($tag,true))? true:false;
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
            $return .= Html::divOp(['block',$class]);

            if(is_int($i))
            $return .= Html::div(Html::divtable($i),'count');

            if($isEmpty === false)
            {
                if($allowFileUpload === true)
                {
                    $action = '';
                    $isDeleteable = $value->canBeDeleted($index);
                    $isRegenerateable = $value->canBeRegenerated($index);

                    if($isRegenerateable === true)
                    {
                        $data = ['action'=>'regenerate','confirm'=>$lang->text('common/confirm'),'text'=>$lang->text('specific/mediaRegenerate')];
                        $action .= Html::div(null,['icon','solo','action','regenerate','data'=>$data]);
                    }

                    if($isDeleteable === true)
                    {
                        $data = ['action'=>'delete','confirm'=>$lang->text('common/confirm'),'text'=>$lang->text('specific/mediaDelete')];
                        $action .= Html::div(null,['icon','solo','action','remove','data'=>$data]);
                    }

                    $return .= Html::divCond($action,'actions');
                }

                $return .= Html::divCond($this->commonFormComplexUpdateInfo($index,$value,$attr,$option),'info');
                $return .= Html::divCond($this->commonFormComplexUpdateVersion($index,$value,$attr,$option),'versions');
            }

            if($allowFileUpload === true)
            {
                $return .= Html::divOp('form');
                $return .= $this->form(null,$attr,$option);
                $path = ($hasIndex === true)? $value->cellPathBasename($index):$value->cellPathBasename($index);

                $hidden = Base\Json::encode(['action'=>null,'path'=>$path]);
                $return .= $this->formHidden($hidden,Base\Arr::plus($attr,['disabled'=>true]),$option);

                $return .= Html::divOp('message');
                $return .= Html::div(null,'actionText');
                $return .= Html::div(null,['icon','solo','close']);
                $return .= Html::divCl();

                $return .= Html::divCl();
            }

            $return .= Html::divCl();
        }

        return $return;
    }


    // commonFormComplexUpdateInfo
    // génère la partie info du formulaire complexe media
    protected function commonFormComplexUpdateInfo(?int $index=null,Core\Cell $value,array $attr,array $option):string
    {
        $return = '';
        $hasIndex = $this->hasIndex();
        $hasVersion = $this->hasVersion();
        $table = $this->table();
        $file = ($hasIndex === true)? $value->file($index):$value->file();
        $exists = (!empty($file))? $file->isReadable():false;
        $isImage = ($exists === true && $file instanceof Main\File\Image)? true:false;
        $basename = ($exists === true)? $file->basename():false;
        $download = $table->hasPermission('mediaDownload');

        if(is_string($basename))
        $basename = Base\Str::excerpt(50,$basename);
        $html = '';

        if($exists === true)
        {
            $html .= Html::span($basename,'filename');

            if($file->isFilePathToUri())
            $html = Base\Html::a($file,$basename,'filename');

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

                $return .= Base\Html::img($thumbnail);
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
    protected function commonFormComplexUpdateVersion(?int $index=null,Core\Cell $value,array $attr,array $option):string
    {
        $return = '';

        if($this->hasVersion())
        {
            $versions = $this->versions();
            $cellVersions = $value->version($index);
            $lang = $this->db()->lang();

            if(!empty($versions))
            {
                $return .= Html::ulOp();

                foreach ($versions as $key => $array)
                {
                    $file = $cellVersions->get($key);
                    $key = ucfirst($key);

                    $return .= Html::liOp();
                    $return .= Html::span($key.':');

                    if(!empty($file))
                    {
                        if($file->isFilePathToUri())
                        {
                            $uri = Base\Str::excerpt(50,$file->pathToUri());
                            $return .= Base\Html::a($file,$uri);
                        }

                        $return .= Html::span($file->size(true),'filesize');
                    }

                    else
                    $return .= Html::span($lang->text('common/notFound'),'notFound');

                    $return .= Html::liCl();
                }

                $return .= Html::ulCl();
            }
        }

        return $return;
    }
}

// init
Files::__init();
?>