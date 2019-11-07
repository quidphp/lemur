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

// specificRelation
// class for the route which manages specific relation - enumSet inputs in the specific form
class SpecificRelation extends Core\RouteAlias
{
    // trait
    use _relation;
    use Lemur\Route\_specificRelation;
    use Lemur\Segment\_table;
    use Lemur\Segment\_colRelation;
    use Lemur\Segment\_selected;
    use Lemur\Segment\_orderColRelation;
    use Lemur\Segment\_page;


    // config
    public static $config = [
        'path'=>[
            'fr'=>'specifique/relation/[table]/[col]/[selected]/[order]/[page]',
            'en'=>'specific/relation/[table]/[col]/[selected]/[order]/[page]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'col'=>'structureSegmentColRelation',
            'selected'=>'structureSegmentSelected',
            'order'=>'structureSegmentOrderColRelation',
            'page'=>'structureSegmentPage'],
        'showCount'=>true
    ];


    // onBefore
    // validation avant le lancement de la route
    final protected function onBefore()
    {
        $return = false;
        $table = $this->segment('table');
        $relation = $this->relation();

        if($table instanceof Core\Table && $table->hasPermission('view','relation','specificRelation'))
        {
            if($relation->isRelationTable())
            {
                $relationTable = $relation->relationTable();
                if($relationTable->hasPermission('relation','specificRelation'))
                $return = true;
            }

            else
            $return = true;
        }

        return $return;
    }
}

// init
SpecificRelation::__init();
?>