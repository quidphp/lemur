<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Core;
use Quid\Main;
use Quid\Orm;

// exportDownload
// class for the route to generate and download the CSV export for the CMS
class ExportDownload extends Core\RouteAlias
{
    // trait
    use _export;


    // config
    public static $config = [
        'path'=>[
            'en'=>'export/[type]/[table]/[order]/[direction]/[filter]/[in]/[notIn]',
            'fr'=>'exportation/[type]/[table]/[order]/[direction]/[filter]/[in]/[notIn]'],
        'segment'=>[
            'type'=>'structureSegmentType',
            'table'=>'structureSegmentTable',
            'order'=>'structureSegmentOrder',
            'direction'=>'structureSegmentDirection',
            'filter'=>'structureSegmentFilter',
            'in'=>'structureSegmentPrimaries',
            'notIn'=>'structureSegmentPrimaries'],
        'match'=>[
            'session'=>'canAccess'],
        'response'=>[
            'timeLimit'=>300],
        'query'=>['s'],
        'parent'=>Export::class,
        'group'=>'submit',
        'navigation'=>false,
        'latin1'=>false
    ];


    // isLatin1
    // retourne vrai si l'encodage doit se fait en latin1
    final protected function isLatin1():bool
    {
        return ($this->getAttr('latin1') === true)? true:false;
    }


    // structureSegmentType
    // gère le segment type de la route
    final public static function structureSegmentType(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($type === 'make')
        $return = (static::isType($value))? $value:static::defaultType();

        elseif($type === 'match')
        $return = (static::isType($value))? $value:false;

        return $return;
    }


    // file
    // retourne l'objet fichier
    final protected function file():Main\File
    {
        $return = null;
        $table = $this->table();
        $type = $this->segment('type');
        $basename = $table->name().'_'.Base\Date::format(0).'_'.$type;
        $return = Main\File\Csv::new(true,['basename'=>$basename]);

        return $return;
    }


    // insertRows
    // insère les lignes dans l'objet
    // fait le par chunk car c'est trop long s'il y a plusieurs lignes
    final protected function insertRows(Main\File $file,Orm\Sql $sql,int $limit=100):void
    {
        $offset = 0;
        $total = $sql->triggerRowCount();
        $type = $this->segment('type');
        $option = ['header'=>true,'latin1'=>$this->isLatin1(),'type'=>$type,'bom'=>true];
        $storage = $this->session()->storage();

        if(!$storage instanceof Core\Row)
        static::throw('sessionStorageNeedsToBeRow');

        $not = Orm\RowsIndex::newOverload($storage,static::sessionUser());

        if(is_int($total) && $total > 0)
        {
            while ($offset < $total)
            {
                $sql->limit($limit,$offset);
                $rows = $sql->triggerRows();

                if(!empty($rows) && $rows->isNotEmpty())
                {
                    $rows->writeFile($file,$option);
                    $option['bom'] = false;
                    $option['header'] = false;
                    $rows->unlink($not);
                }

                $offset += $limit;
            }
        }

        return;
    }


    // trigger
    // lance la route export
    final public function trigger()
    {
        $sql = $this->sql();
        $file = $this->file();
        $this->insertRows($file,$sql);
        return $file->download();
    }
}

// init
ExportDownload::__init();
?>