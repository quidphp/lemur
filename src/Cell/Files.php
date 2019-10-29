<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cell;
use Quid\Core;
use Quid\Base;
use Quid\Main;
use Quid\Base\Html;

// files
// abstract class extended by the media and medias cells
abstract class Files extends Core\Cell\Files
{
    // config
    public static $config = [];
    
    
    // commonGeneralOutput
    // génère le output pour général
    // retourne seulement la première image de la cellule
    protected function commonGeneralOutput(?int $index=null,?array $option=null):string
    {
        $return = '';
        $col = $this->col();
        $table = $this->table();
        $download = $table->hasPermission('mediaDownload');
        $file = $original = $this->commonFile($index);
        
        if(!empty($file))
        {
            $hasVersion = $this->hasVersion();
            $isImage = ($file instanceof Main\File\Image)? true:false;
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
                $file = $this->commonFile($index,-1);

                if(!empty($file))
                {
                    $legendLink = $original->pathToUri();
                    $img = Html::img($file);
                    if(!empty($img))
                    $return .= Html::div($img,'thumbnail');
                }
            }

            else
            {
                $legendLink = $file->pathToUri();
                $return .= Html::div(null,'media-placeholder');
            }

            if($download === true)
            $return .= Html::aCl();

            $return .= Html::divOp('legend');
            $return .= Html::spanOr($legendLink,$value);
            $return .= Html::divCl();
        }

        return $return;
    }
}

// init
Files::__init();
?>