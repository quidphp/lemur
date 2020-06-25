<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// export
// class for the export popup route of the CMS
class Export extends Core\RouteAlias
{
    // trait
    use _export;
    use Lemur\Route\_modal;

    // config
    protected static array $config = [
        'path'=>[
            'en'=>'popup/export/[table]/[order]/[direction]/[filter]/[in]/[notIn]',
            'fr'=>'popup/exportation/[table]/[order]/[direction]/[filter]/[in]/[notIn]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'order'=>'structureSegmentOrder',
            'direction'=>'structureSegmentDirection',
            'filter'=>'structureSegmentFilter',
            'in'=>'structureSegmentPrimaries',
            'notIn'=>'structureSegmentPrimaries'],
        'match'=>[
            'session'=>'canAccess'],
        'longExport'=>1500,
        'query'=>['s']
    ];


    // trigger
    // html pour la page avant l'exportation, s'ouvre dans une box
    final public function trigger()
    {
        $r = '';
        $table = $this->table();
        $sql = $this->sql();
        $total = $sql->triggerRowCount();
        $longExport = $this->longExport();
        $count = $total.' '.static::langPlural($total,'lc|common/row');

        $r .= Html::h1(static::label());
        $r .= Html::h2($table->label());
        $r .= Html::div($count,'count');
        $r .= Html::h3(static::langText('export/choice').':');
        $r .= Html::divCond($this->makeChoices(),'choices');

        if($total > $longExport)
        $r .= Html::div(static::langText('export/long'),'note');

        $r = Html::div($r,'inner-centered');

        return $r;
    }


    // makeChoices
    // génère les choix de route, en lien avec l'encodage
    final protected function makeChoices():string
    {
        $r = '';
        $segment = $this->segments();
        $route = ExportDownload::make($segment);

        foreach (static::getTypes() as $value)
        {
            $route = $route->changeSegment('type',$value);

            if($route->canTrigger())
            {
                $label = static::langText(['export',$value]);
                $r .= $route->a($label,['with-icon','download']);
            }
        }

        return $r;
    }


    // longExport
    // retourne le nombre de ligne pour considérer que c'est une longue exportation
    final public function longExport():int
    {
        return $this->getAttr('longExport');
    }
}

// init
Export::__init();
?>