<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Core;
use Quid\Main;

// _download
// trait that provides most methods necessary to make a download route
trait _download
{
    // config
    public static $configDownload = [
        'navigation'=>false,
        'sitemap'=>false,
        'toScreen'=>false
    ];


    // cell
    // retourne la cell qui store le fichier à downloader
    abstract protected function cell():Core\Cell;


    // trigger
    // lance la route download
    public function trigger()
    {
        return $this->download();
    }


    // getMethod
    // retourne la méthode à utiliser pour le download
    public function getMethod():string
    {
        return ($this->getAttr('toScreen') === true)? 'toScreen':'download';
    }


    // getFile
    // retourne l'objet fichier à downloader ou null
    public function getFile():?Main\File
    {
        $return = null;
        $cell = $this->cell();

        if(static::isSegmentClass())
        {
            $index = ($this->hasSegment('index'))? $this->segment('index'):null;

            if($cell->hasIndex() && is_int($index))
            $return = $cell->file($index);
        }

        if(empty($return))
        $return = $cell->file();

        return $return;
    }


    // download
    // download le fichier dans la cellule
    public function download():bool
    {
        $return = false;
        $file = $this->getFile();
        $method = $this->getMethod();

        if(!empty($file))
        $return = $file->$method();

        return $return;
    }
}
?>