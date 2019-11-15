<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;
use Quid\Lemur;

// specificDownload
// class for the file download route of the CMS
class SpecificDownload extends Core\RouteAlias
{
    // trait
    use _common;
    use Lemur\Route\_download;
    use Lemur\Segment\_table;
    use Lemur\Segment\_primary;
    use Lemur\Segment\_col;
    use Lemur\Segment\_int;


    // config
    public static $config = [
        'path'=>[
            'en'=>'specific/download/[table]/[primary]/[col]/[index]',
            'fr'=>'specifique/telechargement/[table]/[primary]/[col]/[index]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primary'=>'structureSegmentPrimary',
            'col'=>'structureSegmentCol',
            'index'=>'structureSegmentInt'],
        'match'=>[
            'role'=>['>'=>'user']],
        'parent'=>Specific::class,
        'group'=>'specific'
    ];


    // canTrigger
    // vérifie qu'il y a une colonne et que c'est un média
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->segment('table');

        if(parent::canTrigger() && $table instanceof Core\Table && $table->hasPermission('mediaDownload'))
        {
            $col = $this->segment('col');

            if(!empty($col) && $col->isMedia())
            $return = true;
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
}

// init
SpecificDownload::__init();
?>