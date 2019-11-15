<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
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
    use Lemur\Segment\_page;
    use Lemur\Segment\_boolean;
    use Lemur\Route\_rowsFeed;
    use _common;


    // config
    public static $config = [
        'path'=>[
            'en'=>'home/feed/[page]/[type]',
            'fr'=>'accueil/flux/[page]/[type]'],
        'segment'=>[
            'page'=>'structureSegmentPage',
            'type'=>'structureSegmentBoolean'],
        'match'=>[
            'role'=>['>'=>'user']],
        'group'=>'home',
        'parent'=>Home::class,
        'history'=>false,
        'limit'=>25,
        'feed'=>['all','me']
    ];


    // canTrigger
    // retourne vrai si la route peut être triggé
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->hasPermission('homeFeed'))? true:false;
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
                $r .= Html::divCond($row->homeFeedOutput($dateCol),'row-element');
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
        $type = $this->segment('type');
        $session = $this->session();
        $currentUser = $session->user();
        $db = $this->db();
        $tables = $db->tables()->filter(['hasPermission'=>true],'view','homeFeed');

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

                    $ids = $this->makeIdsTable($date,$user,$currentUser,$table,$ids);
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
    final protected function makeIdsTable(Lemur\Col $date,Lemur\Col $user,Lemur\Row\User $currentUser,Core\Table $table,array $return):array
    {
        $type = $this->segment('type');
        $name = $table->name();
        $primary = $table->primary();
        $where = $table->where();
        $dateCommit = $table->colsDateCommit();

        // me
        if($type === 1)
        $where[] = [$user,'=',$currentUser];

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
            $return = Base\Arr::append($return,$ids);
        }

        return $return;
    }


    // getFeedTypes
    // retourn les types possibles pour le feed
    public static function getFeedTypes():array
    {
        return static::$config['feed'];
    }


    // getFeedTypesRelation
    // retoune un tableau les types possibles et leur noms
    public static function getFeedTypesRelation():array
    {
        $return = [];
        $lang = static::lang();

        foreach (static::getFeedTypes() as $key => $value)
        {
            $return[$key] = $lang->relation(['homeFeed',$value]);
        }

        return $return;
    }
}

// init
HomeFeed::__init();
?>