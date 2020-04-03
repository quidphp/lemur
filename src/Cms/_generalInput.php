<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Base\Html;

// _generalInput
// trait that provides some methods for generating reusable general inputs
trait _generalInput
{
    // makeCount
    // fait le count pour une page general
    final protected function makeCount():string
    {
        $r = '';
        $sql = $this->sql();

        $table = $this->table();
        $where = $table->where();

        if(!empty($where))
        {
            $newSql = $sql->clone()->unset('where');
            $newSql->wheresOne($where);
            $tableCount = $newSql->triggerWhatCount(false);
        }

        else
        $tableCount = $sql->triggerTableCount(true);

        $whatCount = $sql->triggerWhatCount();

        if($tableCount === $whatCount)
        {
            $r .= $tableCount;
            $r .= ' ';
            $r .= static::langPlural($tableCount,'lcf|common/row');
        }

        else
        {
            $r .= $whatCount;
            $r .= ' ';
            $r .= static::langPlural($whatCount,'lcf|common/row');
            $r .= ' ';
            $r .= static::langPlural($whatCount,'lcf|common/filtered');
            $r .= ', ';
            $r .= $tableCount;
            $r .= ' ';
            $r .= static::langPlural($tableCount,'lcf|common/row');
            $r .= ' ';
            $r .= static::langText('lcf|common/total');
        }

        return $r;
    }


    // makeSearch
    // construit le input search
    final protected function makeSearch(?string $placeholder=null,?array $attr=null):string
    {
        $r = '';
        $table = $this->table();

        if($table->isSearchable() && $this->hasTablePermission('search') && !empty($this->sql()->triggerTableCount()))
        {
            $cols = $table->cols()->searchable();

            if($cols->isNotEmpty())
            {
                $searchQuery = $this->getSearchQuery();
                $search = $this->getSearchValue();
                $searchMinLength = $table->searchMinLength();

                $uri = Base\Uri::removeQuery($this->changeSegments(['page'=>1])->uri());
                $data = ['href'=>$uri,'char'=>$searchQuery,'current'=>$search,'pattern'=>['minLength'=>$searchMinLength]];

                $r .= Html::divOp('form');
                $r .= Html::divOp('input');
                $r .= Html::inputText($search,['name'=>true,'placeholder'=>$placeholder,'data'=>$data,'inputmode'=>'search']);

                if($search !== null)
                $r .= Html::a($uri,null,Base\Arr::append($attr['close'] ?? null,'close'));

                $r .= Html::divCl();
                $r .= Html::button(null,Base\Arr::append($attr['search'] ?? null,'search'));
                $r .= Html::divCl();
            }
        }

        return $r;
    }


    // makeInputLimit
    // construit le input limit
    final protected function makeInputLimit():string
    {
        $r = '';
        $sql = $this->sql();

        if($this->hasTablePermission('limit','perPage') && $sql->isTriggerCountNotEmpty())
        {
            $route = $this->changeSegments(['limit'=>true,'page'=>1]);
            $limit = $sql->getLimit();
            $maxPerPage = $this->getAttr('maxPerPage');

            $data = ['href'=>$route,'char'=>static::getReplaceSegment(),'current'=>$limit,'pattern'=>'intCastNotEmpty','max'=>$maxPerPage];
            $r .= Html::divOp('limit');
            $r .= Html::inputText($limit,['name'=>'limit','data'=>$data,'inputmode'=>'decimal']);
            $r .= Html::span(static::langText('lcf|common/limit'));
            $r .= Html::divCl();
        }

        return $r;
    }


    // makePageInput
    // construit le input page
    final protected function makePageInput(?array $attr=null):string
    {
        $r = '';

        if($this->hasTablePermission('page'))
        {
            $sql = $this->sql();
            $general = $sql->general();

            if(!empty($general) && $general['total'] > 1)
            {
                if(!empty($general['prev']))
                {
                    $route = $this->changeSegment('page',$general['prev']);
                    $r .= $route->a(null,Base\Arr::append($attr,'prev'));
                }

                $route = $this->changeSegment('page',true);
                $total = $general['total'];
                $data = ['href'=>$route,'char'=>static::getReplaceSegment(),'current'=>$general['current'],'pattern'=>'intCastNotEmpty','max'=>$total];

                $r .= Html::divOp('center');
                $r .= Html::span(static::langText('common/page'));
                $r .= Html::inputText($general['current'],['name'=>'page','data'=>$data,'inputmode'=>'decimal']);
                $r .= Html::span(static::langText('lcf|common/on').' '.$total);
                $r .= Html::divCl();

                if(!empty($general['next']))
                {
                    $route = $this->changeSegment('page',$general['next']);
                    $r .= $route->a(null,Base\Arr::append($attr,'next'));
                }
            }
        }

        return $r;
    }


    // makeGeneralNav
    // construit un block de navigation par page
    final protected function makeGeneralNav(bool $firstLast=true,bool $prevNext=true,int $amount=3,bool $str=false)
    {
        $return = null;

        if($this->hasTablePermission('page'))
        {
            $sql = $this->sql();
            $general = $sql->general(null,$amount);

            if(!empty($general))
            $return = $this->makeGeneralPager($general,$firstLast,$prevNext,$str);
        }

        return $return;
    }


    // makeGeneralPager
    // construit un block de navigation à partir d'un tableau general
    final protected function makeGeneralPager(array $general,bool $firstLast=true,bool $prevNext=true,bool $str=false)
    {
        $return = [];

        if(!empty($general) && array_key_exists('total',$general) && $general['total'] > 1)
        {
            $loop = [];
            ($firstLast === true)? ($loop[] = 'first'):null;
            ($prevNext === true)? ($loop[] = 'prev'):null;
            $loop[] = 'closest';
            ($prevNext === true)? ($loop[] = 'next'):null;
            ($firstLast === true)? ($loop[] = 'last'):null;

            if(!empty($loop))
            {
                foreach ($loop as $v)
                {
                    if(array_key_exists($v,$general) && !empty($general[$v]))
                    {
                        if($v === 'closest' && !empty($general['closest']) && is_array($general['closest']))
                        {
                            $currentPage = $this->segment('page');
                            $closest = '';

                            foreach ($general['closest'] as $v)
                            {
                                $current = ($v === $currentPage)? 'current':null;
                                $route = $this->changeSegment('page',$v);
                                $closest .= $route->a($v,$current);
                            }

                            if(strlen($closest))
                            $return['closest'] = Html::div($closest,'closest');
                        }

                        elseif(is_int($general[$v]))
                        {
                            $route = $this->changeSegment('page',$general[$v]);
                            $return[$v] = $route->a(null,$v);
                        }
                    }
                }
            }
        }

        if($str === true)
        $return = implode('',$return);

        return $return;
    }
}
?>