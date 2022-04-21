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

// files
// abstract class extended by the media and medias cells
abstract class Files extends Core\Cell\Files
{
    // config
    protected static array $config = [];


    // commonDownloadRoute
    // retourne la route pour le téléchargement
    final protected function commonDownloadRoute(?int $index=null):Core\Route
    {
        $return = null;
        $col = $this->col();
        $array = ['table'=>$this,'primary'=>$this,'col'=>$this];

        if($this->hasIndex())
        $array['index'] = $index;

        $return = $col->route('download',$array);

        return $return;
    }


    // commonGeneralOutput
    // génère le output pour général
    final protected function commonGeneralOutput(?int $index=null,?array $option=null):string
    {
        $return = '';
        $boot = static::boot();
        $typePrimary = $boot->typePrimary();
        $hostPriority = $boot->host(true,$typePrimary);
        $col = $this->col();
        $table = $this->table();
        $download = $table->hasPermission('download');
        $withLegend = $col->hasPermission('mediaLegend');
        $file = $original = $this->commonFile($index);

        if(!empty($file))
        {
            $hasVersion = $this->hasVersion();
            $isImage = ($file instanceof Main\File\Image);
            $value = $file->basename();
            $value = Base\Str::excerpt(35,$value);
            $legendLink = null;

            if($download === true)
            {
                $route = $this->downloadRoute($index);
                $return .= $route->aOpen();
            }

            if($isImage === true)
            {
                if($hasVersion === true)
                $file = $this->commonFile($index,$this->getVersionDefault('lemurGeneral'));

                if(!empty($file))
                {
                    if($withLegend === true)
                    $legendLink = $original->pathToUri(true,$hostPriority);

                    $img = Html::img($file);

                    if(!empty($img))
                    $return .= Html::div($img,'thumbnail');
                }
            }

            else
            {
                if($withLegend === true)
                $legendLink = $file->pathToUri(true,$hostPriority);

                $return .= Html::div(null,'media-placeholder');
            }

            if($download === true)
            $return .= Html::aCl();

            if($withLegend === true)
            {
                $legend = Html::spanOr($legendLink,$value);
                $return .= Html::div($legend,'legend');
            }
        }

        return $return;
    }


    // commonTableRelationOutput
    // génère le output table relation pour une image dans la cellule
    final public function commonTableRelationOutput(?int $index=null):?array
    {
        $return = null;
        $file = $this->commonFile($index);

        if(!empty($file))
        {
            $row = $this->row();
            $rowName = $row->cellName()->value();
            $name = $file->basename();
            $isImage = ($file instanceof Main\File\Image);
            $uri = $file->pathToUri();

            if($isImage === false || !empty($uri))
            {
                $return = [];
                $return['thumbnail'] = ($isImage === true)? $uri:null;
                $return['name'] = $name;
                $return['content'] = '';
                $return['isImage'] = $isImage;

                $excerpt = Base\Str::excerpt(50,$rowName);

                if($isImage === true)
                $return['from'] = Html::img($uri,$rowName);
                else
                $return['from'] = Html::div(null,['big-icon','storage']);

                $return['from'] .= Html::span($excerpt,'legend');

                if($isImage === true)
                $return['to'] = Html::img($uri,$rowName);
                else
                $return['to'] = Html::a($uri,$rowName,['target'=>false]);
            }
        }

        return $return;
    }
}

// init
Files::__init();
?>