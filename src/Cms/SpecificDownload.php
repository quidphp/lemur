<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;

// specificDownload
// class for the file download route of the CMS
class SpecificDownload extends Core\RouteAlias
{
    // trait
    use _common;
    use Core\Route\_download;
    use Core\Segment\_table;
    use Core\Segment\_primary;
    use Core\Segment\_col;
    use Core\Segment\_int;


    // config
    public static $config = [
        'path'=>[
            'fr'=>'specifique/telechargement/[table]/[primary]/[col]/[index]',
            'en'=>'specific/download/[table]/[primary]/[col]/[index]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primary'=>'structureSegmentPrimary',
            'col'=>'structureSegmentCol',
            'index'=>'structureSegmentInt'],
        'match'=>[
            'role'=>['>='=>20]]
    ];


    // onBefore
    // vérifie qu'il y a une colonne et que c'est un média
    protected function onBefore()
    {
        $return = false;
        $table = $this->segment('table');

        if($table instanceof Core\Table && $table->hasPermission('download'))
        {
            $col = $this->segment('col');
            if(!empty($col) && $col->isMedia())
            $return = true;
        }

        return $return;
    }


    // cell
    // retourne la cellule défini par les segments
    public function cell():Core\Cell
    {
        $row = $this->segment('primary');
        $col = $this->segment('col');
        $return = $row->cell($col);

        return $return;
    }
}

// config
SpecificDownload::__config();
?>