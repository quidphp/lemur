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

// homeFeedRelation
// class for the route which manages table relation, used by some inputs in the CMS
class HomeFeedRelation extends Core\RouteAlias
{
    // trait
    use _common;
    use _tableRelation;
    use Lemur\Segment\_orderTableRelation;
    use Lemur\Segment\_page;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'home/feed/relation/[order]/[page]',
            'fr'=>'accueil/flux//relation/[order]/[page]'],
        'segment'=>[
            'order'=>'structureSegmentOrderTableRelation',
            'page'=>'structureSegmentPage'],
        'method'=>'homeFeedRelationOutput',
        'row'=>Lemur\Row\User::class
    ];


    // canTrigger
    // validation pour le lancement de la route
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->table();

        if(parent::canTrigger() && $this->hasPermission('home','homeFeed','homeFeedUser') && $table->hasPermission('view','relation','tableRelation'))
        $return = true;

        return $return;
    }


    // table
    // retourne la table pour la route
    final public function table():Lemur\Table
    {
        return static::session()->user()->table();
    }


    // makeResults
    // génère les résultats d'affichage de la relation
    final protected function makeResults(array $array,$attr=null,?int $loadMore=nul):string
    {
        $r = '';

        if(!empty($array))
        {
            foreach ($array as $key => $value)
            {
                $r .= Html::li($value);
            }

            if(!empty($r) && is_int($loadMore))
            $r .= $this->loadMore($loadMore);

            $r = Html::ulCond($r,$attr);
        }

        return $r;
    }
}

// init
HomeFeedRelation::__init();
?>