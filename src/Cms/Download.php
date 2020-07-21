<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;
use Quid\Lemur;

// download
// class for the file download route of the CMS
class Download extends Core\RouteAlias
{
    // trait
    use _common;
    use Lemur\Route\_download;
    use Lemur\Segment\_table;
    use Lemur\Segment\_primary;
    use Lemur\Segment\_col;
    use Lemur\Segment\_int;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'download/[table]/[primary]/[col]/[index]',
            'fr'=>'telechargement/[table]/[primary]/[col]/[index]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primary'=>'structureSegmentPrimary',
            'col'=>'structureSegmentCol',
            'index'=>'structureSegmentInt'],
        'match'=>[
            'session'=>'canAccess'],
        'group'=>'download'
    ];


    // canTrigger
    // vérifie qu'il y a une colonne et que c'est un média
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->segment('table');

        if(parent::canTrigger() && $table instanceof Core\Table && $table->hasPermission('download'))
        {
            $col = $this->segment('col');
            $return = (!empty($col) && $col->isMedia());
        }

        return $return;
    }


    // cell
    // retourne la cellule défini par les segments
    final public function cell():Core\Cell
    {
        $row = $this->segment('primary');
        $col = $this->segment('col');
        $return = $row->cell($col);

        return $return;
    }


    // structureSegmentIntDefault
    // retourne le int par défaut pour le segment
    final public static function structureSegmentIntDefault()
    {
        return;
    }
}

// init
Download::__init();
?>