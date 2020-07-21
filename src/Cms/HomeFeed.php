<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// homeFeed
// class for the route feed of the home page for the CMS
class HomeFeed extends Core\RouteAlias
{
    // trait
    use _common;
    use Lemur\Route\_rowsFeed;
    use Lemur\Segment\_page;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'home/feed/[page]/[type]',
            'fr'=>'accueil/flux/[page]/[type]'],
        'segment'=>[
            'page'=>'structureSegmentPage',
            'type'=>'structureSegmentType'],
        'match'=>[
            'ajax'=>true,
            'session'=>'canAccess'],
        'group'=>'home',
        'parent'=>Home::class,
        'history'=>false,
        'limit'=>25
    ];


    // canTrigger
    // retourne vrai si la route peut être triggé
    final public function canTrigger():bool
    {
        return parent::canTrigger() && $this->hasPermission('home','homeFeed');
    }


    // trigger
    // lance la route homeFeed
    final public function trigger()
    {
        return $this->makeFeed();
    }


    // makeFeed
    // génère le html pour le feed
    final protected function makeFeed():string
    {
        $r = '';
        $ids = $this->pageSlice();
        $tables = $this->db()->tables();

        if(!empty($ids))
        {
            foreach ($ids as $array)
            {
                ['id'=>$id,'-table-'=>$table,'-dateCol'=>$dateCol] = $array;
                $table = $tables->get($table);
                $row = $table->row($id);

                if(!empty($row))
                {
                    $attr = ['row-element','data-row'=>$row,'data-table'=>$table];
                    $r .= Html::divCond($row->lemurHomeFeedOutput($dateCol),$attr);
                }
            }

            if(!empty($r))
            $r .= $this->loadMore();
        }

        else
        $r .= Html::div(static::langText('common/nothing'),'nothing');

        return $r;
    }


    // makeIds
    // génère les ids pour le feed
    protected function makeIds():array
    {
        $return = [];
        $session = $this->session();
        $db = $this->db();
        $tables = $db->tables()->filter(fn($table) => $table->hasPermission('view','homeFeed'));

        if($tables->isNotEmpty())
        {
            $ids = [];
            foreach ($tables as $table)
            {
                foreach ($table->colsDateCommit() as $array)
                {
                    ['date'=>$date,'user'=>$user] = $array;

                    if(empty($user))
                    continue;

                    $ids = $this->makeIdsTable($date,$user,$table,$ids);
                }
            }

            if(!empty($ids))
            $return = Base\Column::sort('date',false,$ids);
        }

        $this->ids = $return;

        return $return;
    }


    // makeIdsTable
    // méthode utilisé pour faire la requête et aller chercher les ids pour une table
    final protected function makeIdsTable(Lemur\Col $date,Lemur\Col $user,Core\Table $table,array $return):array
    {
        $type = $this->segment('type');
        $name = $table->name();
        $primary = $table->primary();
        $where = $table->where();
        $dateCommit = $table->colsDateCommit();

        // me
        if($type instanceof Lemur\Row\User)
        $where[] = [$user,'=',$type];

        // date pas vide
        $where[] = [$date,true];

        $array = [];
        $array['what'] = [$primary,[$date,'date']];
        $array['where'] = $where;
        $array['order'] = $date;
        $array['direction'] = 'desc';
        $array['limit'] = 40;

        $sql = $table->sql($array);
        $ids = $sql->trigger('assocs');

        if(!empty($ids))
        {
            $ids = Base\Column::replace($ids,['-table-'=>$name,'-dateCol'=>$date->name()]);
            $return = Base\Arr::merge($return,$ids);
        }

        return $return;
    }


    // structureSegmentType
    // gère le segment d'uri pour le type, qui peut être 0 (all) ou un id de user
    final public static function structureSegmentType(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($value instanceof Lemur\Row\User)
        $value = $value->primary();

        if($type === 'make')
        $return = (is_int($value) && $value >= 0)? $value:0;

        elseif($type === 'match')
        {
            if($value === 0)
            $return = $value;

            else
            $return = Lemur\Row\User::row($value);
        }

        return $return;
    }
}

// init
HomeFeed::__init();
?>