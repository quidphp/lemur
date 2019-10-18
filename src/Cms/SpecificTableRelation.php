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

// SpecificTableRelation
// class for the route which manages table relation, used by some inputs in the CMS
class SpecificTableRelation extends Core\RouteAlias
{
    // trait
    use _common;
    use Lemur\Route\_tableRelation;
    use Lemur\Segment\_table;
    use Lemur\Segment\_orderTableRelation;
    use Lemur\Segment\_page;


    // config
    public static $config = [
        'path'=>[
            'fr'=>'table/relation/[table]/[order]/[page]',
            'en'=>'table/relation/[table]/[order]/[page]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'order'=>'structureSegmentOrderTableRelation',
            'page'=>'structureSegmentPage'],
        'method'=>'tableRelationOutput',
        'order'=>true,
        'match'=>[
            'ajax'=>true,
            'role'=>['>='=>20]],
    ];


    // onBefore
    // validation avant le lancement de la route
    protected function onBefore()
    {
        $return = false;
        $table = $this->segment('table');

        if($table instanceof Core\Table && $table->hasPermission('view','relation','tableRelation'))
        $return = true;

        return $return;
    }
}

// init
SpecificTableRelation::__init();
?>