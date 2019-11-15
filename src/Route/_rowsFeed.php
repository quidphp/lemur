<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/site/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Base;
use Quid\Base\Html;
use Quid\Orm;

// _rowsFeed
// trait that grants methods related a rows feed with a load-more
trait _rowsFeed
{
    // rows
    protected $ids = null;

    
    // makeIds
    // méthode pour créer le tableau des ids à charger dans le feed
    abstract protected function makeIds():array;
    
    
    // pageSlice
    // permet de slice les entrées dans une page
    final protected function pageSlice():array
    {
        return Base\Nav::pageSlice($this->segment('page'),$this->getAttr('limit'),$this->ids());
    }


    // pageNext
    // retourne le numéro de la prochaine page si existant
    final protected function pageNext():?int
    {
        return Base\Nav::pageNext($this->segment('page'),$this->ids(),$this->getAttr('limit'));
    }


    // general
    // retourne le tableau sur les informations de pagination genral si existant
    final protected function general(int $amount=3):?array
    {
        return Base\Nav::general($this->segment('page'),$this->ids(),$this->getAttr('limit'),$amount);
    }


    // ids
    // retourne le tableau de tout les ids
    final protected function ids():array
    {
        $return = $this->ids;
        
        if($this->ids === null)
        $return = $this->makeIds();
        
        return $return;
    }


    // rows
    // retourne l'objet rows pour la page courante
    final public function rows():Orm\RowsIndex
    {
        return $this->cache(__METHOD__,function() {
            $return = Orm\RowsIndex::newOverload();
            $db = $this->db();
            $slice = $this->pageSlice();
            $loads = [];

            if(!empty($slice))
            {
                foreach ($slice as $value)
                {
                    $loads[$value['-table-']][] = $value['id'];
                }

                if(!empty($loads))
                {
                    foreach ($loads as $table => $ids)
                    {
                        $rows = $db->table($table)->rows(...$ids);
                        $loads[$table] = $rows;
                    }

                    foreach ($slice as $value)
                    {
                        $row = $loads[$value['-table-']][$value['id']] ?? null;

                        if(!empty($row))
                        $return->add($row);
                    }
                }
            }

            return $return;
        });
    }


    // rowsVisible
    // retourne l'objet rows pour la page courante (mais seulement les visibles)
    final public function rowsVisible():Orm\RowsIndex
    {
        return $this->cache(__METHOD__,function() {
            return $this->rows()->filter(['isVisible'=>true]);
        });
    }


    // makePager
    // construit le pager
    final protected function makePager(int $amount=3):string
    {
        $r = '';
        $general = $this->general($amount);

        if(!empty($general))
        $r .= $this->makeGeneralPager($general,true,true,true);

        return $r;
    }


    // loadMore
    // génère le bouton pour charger la prochaine page
    final protected function loadMore(?array $replace=null):string
    {
        $r = '';
        $pageNext = $this->pageNext();

        if(is_int($pageNext))
        {
            $route = $this->changeSegment('page',$pageNext);
            $text = Html::span(static::langText('common/loadMore',$replace),'text');
            $r .= $route->a($text,'load-more');
        }

        return $r;
    }
}
?>