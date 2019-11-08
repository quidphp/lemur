<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// generalExport
// class for the general export popup route of the CMS
class GeneralExport extends Core\RouteAlias
{
    // trait
    use _common;
    use _export;
    use _modal;
    use Lemur\Route\_generalSegment;
    use Lemur\Segment\_table;
    use Lemur\Segment\_order;
    use Lemur\Segment\_direction;
    use Lemur\Segment\_filter;
    use Lemur\Segment\_primaries;


    // config
    public static $config = [
        'path'=>[
            'en'=>'dialog/export/[table]/[order]/[direction]/[filter]/[in]/[notIn]',
            'fr'=>'dialogue/exportation/[table]/[order]/[direction]/[filter]/[in]/[notIn]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'order'=>'structureSegmentOrder',
            'direction'=>'structureSegmentDirection',
            'filter'=>'structureSegmentFilter',
            'in'=>'structureSegmentPrimaries',
            'notIn'=>'structureSegmentPrimaries'],
        'match'=>[
            'ajax'=>true,
            'role'=>['>'=>'user']],
        'longExport'=>1500,
        'query'=>['s'],
        'parent'=>General::class
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
        $route = GeneralExportDownload::makeOverload($segment);

        foreach (static::getTypes() as $value)
        {
            $route = $route->changeSegment('type',$value);
            $label = static::langText(['export',$value]);
            $r .= $route->a($label,['submit','icon','padLeft','download']);
        }

        return $r;
    }


    // aDialog
    // retourne le lien dialog
    final public function aDialog():string
    {
        return $this->aTitle(null,['operation-element','submit','icon','padLeft','download','data'=>['modal'=>static::name()]]);
    }


    // longExport
    // retourne le nombre de ligne pour considérer que c'est une longue exportation
    final public function longExport():int
    {
        return $this->getAttr('longExport');
    }
}

// init
GeneralExport::__init();
?>