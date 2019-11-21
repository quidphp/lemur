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
use Quid\Core;
use Quid\Lemur;

// general
// class for the general navigation route of the CMS
class General extends Core\RouteAlias
{
    // trait
    use _templateAlias;
    use Lemur\Route\_general;
    use Lemur\Segment\_table;
    use Lemur\Segment\_page;
    use Lemur\Segment\_limit;
    use Lemur\Segment\_order;
    use Lemur\Segment\_direction;
    use Lemur\Segment\_cols;
    use Lemur\Segment\_filter;
    use Lemur\Segment\_primaries;


    // config
    public static $config = [
        'path'=>[
            'en'=>'table/[table]/[page]/[limit]/[order]/[direction]/[cols]/[filter]/[in]/[notIn]/[highlight]',
            'fr'=>'table/[table]/[page]/[limit]/[order]/[direction]/[cols]/[filter]/[in]/[notIn]/[highlight]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'page'=>'structureSegmentPage',
            'limit'=>'structureSegmentLimit',
            'order'=>'structureSegmentOrder',
            'direction'=>'structureSegmentDirection',
            'cols'=>'structureSegmentCols',
            'filter'=>'structureSegmentFilter',
            'in'=>'structureSegmentPrimaries',
            'notIn'=>'structureSegmentPrimaries',
            'highlight'=>'structureSegmentPrimaries'],
        'match'=>[
            'role'=>['>'=>'user']],
        'sitemap'=>true,
        'popup'=>[
            'search','primary','priority','engine','collation','autoIncrement','updateTime',
            'classFqcn','classRow','classRows','classCols','classCells','sql']
    ];


    // canTrigger
    // si la route peut être lancé
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->hasTable() && $this->hasTablePermission('view'))? true:false;
    }


    // onBefore
    // au début de la route, store dans nav
    final protected function onBefore()
    {
        $table = $this->table();
        $nav = $this->session()->nav();
        $highlight = $this->getHighlight();
        $route = (!empty($highlight))? $this->changeSegment('highlight',null):$this;
        $nav->set([static::class,$table],$route->uri());

        return true;
    }


    // onFallback
    // sur fallback, efface la version de la route dans nav/session
    final protected function onFallback($context=null)
    {
        if($this->hasTable())
        {
            $table = $this->table();
            $nav = $this->session()->nav();
            $nav->unset([static::class,$table]);
        }

        return;
    }


    // onReplace
    // change le titre et la metaDescription pour la table
    final protected function onReplace(array $return):array
    {
        $return['title'] = $this->title();
        $return['metaDescription'] = $this->table()->description();

        return $return;
    }


    // selectedUri
    // génère une les uri sélectionnés pour une route en lien avec une table
    final public function selectedUri():array
    {
        $return = [];
        $tables = $this->db()->tables();
        $table = $this->table();
        $session = $this->session();

        $root = static::session()->routeTableGeneral($table);
        $uri = $root->uri();
        $return[$uri] = true;

        return $return;
    }


    // hasTable
    // retouren vrai si la route est lié à une table
    final public function hasTable():bool
    {
        return ($this->segment('table') instanceof Core\Table)? true:false;
    }


    // table
    // retourne l'objet table
    final public function table():Core\Table
    {
        $return = $this->segment('table');

        if(is_string($return))
        $return = static::db()->table($return);

        return $return;
    }


    // generalSegments
    // retourne les segments à utiliser pour la création de l'objet sql
    final protected function generalSegments():array
    {
        return $this->segment(['page','limit','order','direction','filter','in','notIn']);
    }


    // getCurrentCols
    // retourne les colonnes courantes
    final protected function getCurrentCols():Core\Cols
    {
        $return = null;
        $table = $this->table();

        if($this->hasSegment('cols'))
        $return = $this->segment('cols');

        else
        $return = $table->cols()->general()->filter(['isVisibleGeneral'=>true]);

        if(!empty($return) && $this->hasSegment('filter'))
        {
            $filter = $this->segment('filter');
            if(is_array($filter) && !empty($filter))
            {
                $return = $return->clone();
                foreach ($table->cols(...array_keys($filter)) as $col)
                {
                    if(!$return->in($col))
                    $return->add($col);
                }
            }
        }

        return $return;
    }


    // hasSpecificCols
    // retourne vrai si des colonnes spécifiques ont été sélectionnés
    final protected function hasSpecificCols():bool
    {
        $return = false;

        if($this->hasSegment('cols'))
        {
            $cols = $this->table()->cols()->general()->filter(['isVisibleGeneral'=>true]);

            if($this->segment('cols')->names() !== $cols->names())
            $return = true;
        }

        return $return;
    }


    // hasInNotIn
    // retourne vrai s'il y a des lignes in ou not in
    final protected function hasInNotIn():bool
    {
        $return = false;

        if($this->hasSegment('in') && !empty($this->segment('in')))
        $return = true;

        elseif($this->hasSegment('notIn') && !empty($this->segment('notIn')))
        $return = true;

        return $return;
    }


    // getHighlight
    // retourne les lignes highlight
    final protected function getHighlight():?array
    {
        $return = null;

        if($this->hasSegment('highlight'))
        $return = $this->segment('highlight');

        return $return;
    }


    // makeViewTitle
    // génère le titre spécifique de general pour la table, si existant
    final protected function makeViewTitle(?string $lang=null):?string
    {
        $r = null;
        $table = $this->table();
        $r = $this->lang()->safe(['table','view',$table],null,$lang);

        return $r;
    }


    // makeTitle
    // retourne le titre de la route
    final protected function makeTitle(?string $lang=null):string
    {
        $r = $this->makeViewTitle($lang);

        if(empty($r))
        $r = $this->table()->label(null,$lang);

        return $r;
    }


    // allSegment
    // retourne tous les segments de la route, un par table
    final public static function allSegment():array
    {
        $return = [];
        $db = static::db();

        foreach ($db->tables() as $table)
        {
            if($table->hasPermission('view'))
            $return[] = ['table'=>$table];
        }

        return $return;
    }


    // main
    // génère le html de main pour general
    final public function main():string
    {
        $r = $this->makeTop();
        $r .= $this->makeTable();

        return $r;
    }


    // makeTop
    // génère la partie supérieur de la page
    final protected function makeTop():string
    {
        $r = '';
        $table = $this->table();

        $r .= Html::divOp('top');

        $r .= Html::divOp('left');

        $r .= Html::divOp('title');
        $r .= $this->makeH1($this->table()->label());
        $r .= $this->makeInfo();
        $r .= Html::divCl();

        if($this->hasTablePermission('description'))
        $r .= Html::divCond($table->description(),['description','sub-title']);

        $placeholder = static::langText('general/search');
        $r .= Html::divOp('search');
        $r .= $this->makeSearch($placeholder,['close'=>['icon-solo'],'search'=>['icon-solo']]);
        $r .= $this->makeSearchNote();
        $r .= Html::divCl();

        $r .= Html::divCl();

        $r .= Html::divOp('right');
        $r .= Html::divCond($this->makeOperation(),'operation');
        $r .= $this->makeInputLimit();
        $r .= Html::divCl();

        $r .= Html::divCl();

        return $r;
    }


    // makeSearchNote
    // génère les notes pour le champ recherche
    final protected function makeSearchNote():string
    {
        $r = '';
        $table = $this->table();

        if($table->isSearchable() && $this->hasTablePermission('searchNote'))
        {
            $cols = $table->cols()->searchable();

            if($cols->isNotEmpty())
            {
                $minLength = $table->searchMinLength();
                $lang = static::lang();
                $replace = ['count'=>$minLength];
                $note = $lang->plural($minLength,'general/searchNote',$replace);

                $r .= Html::divOp('in');
                $r .= Html::divOp('first');
                $r .= Html::span($lang->text('general/note').':');
                $r .= Html::span($note,'note');
                $r .= Html::divCl();
                $r .= Html::divOp('second');
                $r .= Html::span($lang->text('general/searchIn').':');
                $r .= Html::span(implode(', ',$cols->pair('label')),'labels');
                $r .= Html::divCl();
                $r .= Html::divCl();
            }
        }

        return $r;
    }


    // makeOperation
    // génère le bloc des opérations
    final protected function makeOperation():string
    {
        $r = '';
        $table = $this->table();
        $callback = $table->getAttr('generalOperation');

        if(static::isCallable($callback) && $table->hasPermission('generalOperation'))
        $r .= $callback($table);

        $r .= $this->makeReset();
        $r .= $this->makeTruncate();
        $r .= $this->makeExport();
        $r .= $this->makeAdd();

        return $r;
    }


    // makeReset
    // génération le lien de réinitialisation
    final protected function makeReset():string
    {
        $r = '';

        if($this->hasTablePermission('reset') && $this->canReset($this->getSearchValue(),['table','highlight']))
        {
            $option = ['query'=>false];
            $route = $this->keepSegments('table');
            $r .= $route->a(static::langText('general/reset'),['with-icon','reset','operation-element'],null,$option);
        }

        return $r;
    }


    // makeInfo
    // génère le block d'informations
    final protected function makeInfo():string
    {
        $r = '';

        if($this->hasTablePermission('generalCount'))
        {
            $popup = $this->generalInfoPopup();
            $attr = ['popup-trigger'];
            $title = $this->makeCount();

            if(!empty($popup))
            {
                $attr = Base\Arr::append($attr,['with-popup','with-icon','data'=>['anchor-corner'=>true,'absolute-placeholder'=>true]]);
                $r .= Html::button($title,'popup-title');
                $r .= static::makeDivPopup($popup);
            }

            else
            $r .= Html::div($title,'popup-title');

            $r = Html::div($r,$attr);
        }

        return $r;
    }


    // generalInfoPopup
    // génère le popup de la page général
    // méthode publiquer car utilisé dans specific
    final public function generalInfoPopup(bool $icon=true):?string
    {
        $return = null;

        if($this->hasPermission('popup') && $this->hasTablePermission('generalInfoPopup'))
        {
            $values = $this->infoPopupValues();
            $closure = $this->infoPopupClosure();
            $return = static::makeInfoPopup($values,$closure);
        }

        return $return;
    }


    // infoPopupValues
    // retourne un tableau avec les valeurs pour le popup d'informations
    final protected function infoPopupValues():array
    {
        $return = array_keys($this->segments());
        $return = Base\Arr::append($return,$this->getAttr('popup'));

        return $return;
    }


    // infoPopupClosure
    // callback pour le popup d'informations de la page générale
    final protected function infoPopupClosure():\Closure
    {
        return function(string $key) {
            $return = [static::langText(['popup','general',$key])];
            $value = null;
            $table = $this->table();

            if($this->hasSegment($key))
            {
                $value = $this->segment($key);

                if($key === 'direction')
                $value = (is_string($value))? static::langText('direction/'.strtolower($value)):null;

                elseif($key === 'filter')
                {
                    if(is_array($value) && !empty($value))
                    {
                        $filter = $value;
                        $value = [];

                        foreach ($filter as $k => $v)
                        {
                            $rel = [];
                            $col = $table->col($k);

                            if(!is_array($v))
                            $v = [$v];

                            if($col->isFilterEmptyNotEmpty())['array'=>$rel,'value'=>$v] = $this->infoPopupFilterEmptyNotEmpty($v,$col,$rel);

                            $rel = Base\Arr::append($rel,$col->relation()->get($v));
                            $label = $col->label();
                            $value[$label] = $rel;
                        }
                    }
                }

                elseif(in_array($key,['in','notIn','highlight'],true) && is_array($value) && !empty($value))
                $value = implode(', ',$value);
            }

            elseif($key === 'priority')
            $value = $table->priority();

            elseif($key === 'search')
            $value = $this->getSearchValue();

            elseif($key === 'sql')
            $value = $this->sql()->emulate();

            elseif($key === 'autoIncrement')
            $value = $table->autoIncrement(true);

            elseif($key === 'updateTime')
            $value = $table->updateTime(1);

            elseif($key === 'classRow')
            $value = $table->classe()->row();

            elseif($key === 'classRows')
            $value = $table->classe()->rows();

            elseif($key === 'classCols')
            $value = $table->classe()->cols();

            elseif($key === 'classCells')
            $value = $table->classe()->cells();

            else
            $value = $table->$key();

            $return[] = $value;

            return $return;
        };
    }


    // infoPopupFilterEmptyNotEmpty
    // gère les valeurs filtres empty/not empty pour le popup
    final protected function infoPopupFilterEmptyNotEmpty(array $value,Core\Col $col,array $array):array
    {
        $return = ['array'=>$array,'value'=>$value];

        foreach ($value as $k => $v)
        {
            if($col::isFilterEmptyNotEmptyValue($v))
            {
                unset($return['value'][$k]);
                $key = ((int) $v === 0)? 'isEmpty':'isNotEmpty';
                $label = static::langText(['common',$key]);
                $return['array'][] = $label;
            }
        }

        return $return;
    }


    // makeAdd
    // génère le lien pour ajouter une nouvelle ligne
    final protected function makeAdd():string
    {
        $r = '';
        $table = $this->table();
        $route = SpecificAdd::make($table);

        if($route->canTrigger())
        $r .= $route->a(static::langText('general/add'),['with-icon','add','operation-element']);

        return $r;
    }


    // makeExport
    // génère le lien pour exporter la table
    final protected function makeExport():string
    {
        $r = '';
        $route = GeneralExport::make($this->segments());
        if($route->canTrigger())
        $r .= $route->aDialog(null,['operation-element','with-icon','download']);

        return $r;
    }


    // makeTruncate
    // génère le formulaire pour effacer toute la table
    final protected function makeTruncate():string
    {
        $r = '';
        $table = $this->table();
        $route = GeneralTruncate::make($table);

        if($route->canTrigger() && !empty($table->rowsCount(true,true)))
        {
            $data = ['confirm'=>static::langText('common/confirm')];
            $r .= Html::divOp(['truncate','operation-element']);
            $r .= $route->formOpen(['data'=>$data]);
            $r .= $this->tableHiddenInput();
            $r .= Html::submit($route->label(),['with-icon','truncate']);
            $r .= Html::formClose();
            $r .= Html::divCl();
        }

        return $r;
    }


    // makeTool
    // génère le block outil
    final protected function makeTool():string
    {
        $r = '';

        if($this->hasTablePermission('rows'))
        {
            $table = $this->table();
            $char = static::getReplaceSegment();
            $defaultSegment = static::getDefaultSegment();

            if($this->hasTablePermission('in'))
            {
                $route = $this->changeSegments(['page'=>1,'in'=>true]);
                $data = ['href'=>$route,'char'=>$char,'separator'=>$defaultSegment];
                $r .= Html::button(null,['tool-element','icon-solo','plus','data'=>$data]);
            }

            if($this->hasTablePermission('notIn'))
            {
                $notIn = $this->segment('notIn');
                $notIn[] = $char;
                $route = $this->changeSegments(['page'=>1,'notIn'=>$notIn]);
                $data = ['href'=>$route,'char'=>$char,'separator'=>$defaultSegment];
                $r .= Html::button(null,['tool-element','icon-solo','minus','data'=>$data]);
            }

            $route = SpecificMulti::make(['table'=>$table,'primaries'=>true]);
            if($route->canTrigger())
            {
                $data = ['href'=>$route,'char'=>$char,'separator'=>$defaultSegment];
                $r .= Html::button(null,['tool-element','icon-solo','multi-modify','data'=>$data]);
            }

            $r .= $this->makeGeneralDelete();

            $r = Html::divCond($r,'tools-container');
        }

        return $r;
    }


    // makeGeneralDelete
    // génère le formulaire pour effacer de multiples lignes
    final protected function makeGeneralDelete():string
    {
        $r = '';
        $table = $this->table();
        $route = GeneralDelete::make(['table'=>$table,'primaries'=>true]);

        if($route->canTrigger())
        {
            $defaultSegment = static::getDefaultSegment();
            $data = ['confirm'=>static::langText('common/confirm'),'separator'=>$defaultSegment];

            $r .= $route->formOpen(['tool-element','data'=>$data]);
            $r .= $this->tableHiddenInput();
            $r .= Html::inputHidden(null,'primaries');
            $r .= Html::submit(null,['icon-solo','multi-delete']);
            $r .= Html::formCl();
        }

        return $r;
    }


    // makeRows
    // génère l'outil pour sélectionner une ou plusieurs lignes dans la table
    final protected function makeRows():string
    {
        $r = '';
        $hasInNotIn = $this->hasInNotIn();

        $r .= Html::span(null,['icon-solo','check','center']);
        $r .= Html::span(null,['icon-solo','uncheck','center']);
        $r = Html::button($r,['toggle-all',($hasInNotIn === true)? 'selected':null]);
        $r = Html::div($r,'cell-inner');

        if($hasInNotIn === true)
        {
            $route = $this->changeSegments(['in'=>null,'notIn'=>null]);
            $r .= $route->a(null,['icon-solo','close']);
        }

        return $r;
    }


    // makeCols
    // génère l'outil pour choisir les colonnes à afficher dans la table
    final protected function makeCols():string
    {
        $r = '';
        $table = $this->table();
        $cols = $table->cols();
        $currentCols = $this->getCurrentCols();
        $hasSpecificCols = $this->hasSpecificCols();
        $inAttr = ['cell-inner'];

        if($this->hasTablePermission('view','cols') && $cols->isNotEmpty() && $currentCols->isNotEmpty())
        {
            $loopCols = $currentCols->clone();
            $notIn = $cols->not($currentCols);
            $loopCols->add($notIn);

            $defaultSegment = static::getDefaultSegment();
            $route = $this->changeSegment('cols',true);
            $current = implode($defaultSegment,$currentCols->names());
            $data = ['href'=>$route,'char'=>static::getReplaceSegment(),'current'=>$current,'separator'=>$defaultSegment];
            $inAttr = Base\Attr::append($inAttr,['data'=>['anchor-corner'=>true,'absolute-placeholder'=>true]]);
            $session = static::session();

            $checkbox = [];
            $htmlWrap = Html::divOp('choice');
            $htmlWrap .= Html::divOp('choice-in');
            $htmlWrap .= Html::button(null,['icon-solo','move']);
            $htmlWrap .= '%';
            $htmlWrap .= Html::divCl();
            $htmlWrap .= Html::divCl();
            $attr = ['name'=>'col','data-required'=>true];
            $option = ['value'=>[],'html'=>$htmlWrap];
            foreach ($loopCols as $key => $value)
            {
                if($value->isVisibleGeneral(null,null,$session))
                {
                    $checkbox[$key] = Base\Str::excerpt(40,$value->label());

                    if($currentCols->exists($key))
                    $option['value'][] = $key;
                }
            }

            $r .= Html::buttonOp(['trigger',($hasSpecificCols === true)? 'selected':null]);
            $r .= Html::span(null,['icon-solo','cols','center']);
            $r .= Html::buttonCl();

            $html = Html::checkbox($checkbox,$attr,$option);
            $html = Html::div($html,'scroller');
            $html .= Html::button(null,['name'=>'cols','icon-solo','check','data'=>$data]);
            $r .= static::makeDivPopup($html,['popup','no-scroll']);
        }

        $r = Html::div($r,$inAttr);

        if($hasSpecificCols === true)
        {
            $reset = $this->changeSegment('cols',null);
            $r .= $reset->a(null,['icon-solo','close']);
        }

        return $r;
    }


    // makeTable
    // génère la table
    final protected function makeTable():string
    {
        $r = '';

        if($this->hasTablePermission('view'))
        {
            $table = $this->table();
            $cols = $this->getCurrentCols();
            $sql = $this->sql();

            $tableIsEmpty = $table->isRowsEmpty(true);
            $isEmpty = $sql->isTriggerCountEmpty();
            $class = ($isEmpty === true)? 'empty':'not-empty';

            $r .= Html::divOp(['container',$class]);

            if($isEmpty === true || $cols->isEmpty())
            {
                $r .= Html::divOp('notFound');
                $r .= Html::h3(static::langText('general/notFound'));
                $r .= Html::divCl();
            }

            if($cols->isNotEmpty() && $tableIsEmpty === false)
            {
                if($isEmpty === false)
                {
                    $page = Html::divCond($this->makePageInput(['triangle']),'page-input');

                    $r .= Html::divOp('above');
                    $r .= Html::div($this->makeTool(),'left');
                    $r .= Html::divCond($page,'right');
                    $r .= Html::divCl();
                }

                $r .= Html::divOp('scroller');
                $attr = ['data'=>['name'=>$table->name(),'table'=>$table::className(true)]];
                $r .= Html::tableOpen(null,null,null,$attr);
                $r .= $this->makeTableHeader();
                $r .= $this->makeTableBody();
                $r .= Html::tableCl();
                $r .= Html::divCl();

                if($isEmpty === false)
                {
                    $r .= Html::divOp('bellow');
                    $r .= Html::divCond($page,'right');
                    $r .= Html::divCl();
                }
            }

            $r .= Html::divCl();
        }

        return $r;
    }


    // makeTableHeader
    // génère le header de la table
    final protected function makeTableHeader():string
    {
        $r = '';
        $table = $this->table();
        $cols = $this->getCurrentCols();

        if($cols->isNotEmpty())
        {
            $ths = [];
            $permission['order'] = $this->hasTablePermission('order','direction');
            $count = $cols->count();

            if($this->hasTablePermission('rows'))
            {
                $html = $this->makeRows();
                $ths[] = [$html,'rows'];
            }

            if($this->hasTablePermission('action'))
            {
                $html = $this->makeCols();
                $ths[] = [$html,'action'];
            }

            foreach ($cols as $col)
            {
                $data = ['name'=>$col->name(),'col'=>$col::className(true),'group'=>$col->group()];
                $data = $col->getDataAttr($data);
                $thAttr = ['data'=>$data];
                $filter = '';
                [$filter,$thAttr] = $this->makeTableHeaderFilter($col,[$filter,$thAttr]);

                $label = Html::div($col->label(),'label');
                $in = $label;

                if($permission['order'] === true && $col->isOrderable())
                {
                    $icon = ['triangle'];
                    [$in,$thAttr] = $this->makeTableHeaderOrder($col,[$in,$thAttr],$icon);
                }

                $in = $filter.Html::div($in,'cell-inner');
                $ths[] = [$in,$thAttr];
            }

            $r = Html::thead($ths);
        }

        return $r;
    }


    // makeTableHeaderOrder
    // génère un lien pour ordonner dans un header de table
    final protected function makeTableHeaderOrder(Core\Col $col,array $array,$icon=null):array
    {
        [$html,$thAttr] = $array;

        if($this->hasTablePermission('order'))
        {
            $thAttr[] = 'orderable';
            $active = ($col === $this->segment('order'));

            if($active === true)
            {
                $dataDirection = $this->segment('direction');
                $direction = $col->db()->syntaxCall('invertOrderDirection',$dataDirection);
                $thAttr[] = 'ordering';
            }

            else
            $direction = $dataDirection = $col->direction(true);

            $thAttr['data']['direction'] = $dataDirection;

            $route = $this->changeSegments(['order'=>$col,'direction'=>$direction]);
            $uri = $route->uri();
            $span = Html::span(null,$icon);
            $html .= Html::a($uri,$span,'right');
        }

        return [$html,$thAttr];
    }


    // makeTableHeaderFilter
    // génère un filtre dans un header de table
    final protected function makeTableHeaderFilter(Core\Col $col,array $array):array
    {
        $html = $array[0];
        $thAttr = $array[1];

        if($this->hasTablePermission('filter') && $col->isFilterable() && $col->relation()->size() > 0)
        {
            $filter = $this->segment('filter');

            $class = ['filter-outer','data'=>['anchor-corner'=>true]];
            $close = ['icon-solo','close'];
            $label = Html::span(null,['filter','icon-solo']);

            $route = GeneralRelation::getOverloadClass();
            $relHtml = $route::makeGeneralRelation($col,$this,$filter,$class,$close,$label);

            if(!empty($relHtml))
            {
                $html .= $relHtml;
                $thAttr[] = ['filterable'];
            }
        }

        return [$html,$thAttr];
    }


    // makeTableBody
    // génère le body de la table
    final protected function makeTableBody():string
    {
        $r = '';
        $cols = $this->getCurrentCols();
        $rows = $this->rows();
        $highlight = $this->getHighlight();

        if($cols->isNotEmpty() && $rows->isNotEmpty())
        {
            $table = $this->table();
            $trs = [];
            $rowsPermission = $this->hasTablePermission('rows');
            $actionPermission = $this->hasTablePermission('action');
            $specificPermission = $this->hasTablePermission('specific');
            $modify = $this->hasTablePermission('update','lemurUpdate');
            $option = [];

            foreach ($rows as $row)
            {
                $array = [];
                $cells = $row->cells($cols);

                $rowAttr = ['data'=>['id'=>$row->primary(),'row'=>$row::className(true)]];
                if(!empty($highlight) && in_array($row->primary(),$highlight,true))
                $rowAttr[] = 'highlight';

                if($rowsPermission === true)
                {
                    $id = Base\Attr::randomId('name');
                    $checkbox = Html::inputCheckbox($row,['row','id'=>$id]);
                    $checkbox .= Html::label(null,['for'=>$id]);
                    $html = Html::div($checkbox,'cell-inner');
                    $array[] = [$html,'rows'];
                }

                if($actionPermission === true)
                {
                    $html = '';

                    if($specificPermission === true)
                    {
                        $specific = Specific::make($row)->uri();
                        $option = ['specific'=>$specific];
                        $action = ($modify === true && $row->isUpdateable())? 'modify':'view';
                        $html = Html::a($specific,Html::div(null,['icon-solo',$action,'center']),'cell-inner');
                    }

                    $array[] = [$html,'action'];
                }

                foreach ($cells as $cell)
                {
                    $array[] = $this->makeTableBodyCell($cell,$option);
                }

                $trs[] = [$array,$rowAttr];
            }

            $r .= Html::tbody(...$trs);
        }

        return $r;
    }


    // makeTableBodyCell
    // génère le contenu à afficher dans une cellule de table
    final protected function makeTableBodyCell(Core\Cell $cell,?array $option=null):array
    {
        $r = [];
        $option = Base\Arr::plus(['specific'=>null,'modify'=>false,'excerptMin'=>$cell->generalExcerptMin()],$option);
        $col = $cell->col();

        $data = ['name'=>$cell->name(),'cell'=>$cell::className(true),'group'=>$cell->group()];
        $table = $this->table();
        $generalEdit = GeneralEdit::make($cell);
        if($generalEdit->canTrigger())
        {
            $data['quick-edit'] = true;
            $quickEdit = $generalEdit->a(null,['icon-solo','modify','quick-edit','tool']);
        }
        $data = $cell->getDataAttr($data);
        $attr = ['data'=>$data];
        $html = $cell->generalComponent(null,$option);

        if(!empty($quickEdit))
        {
            $html .= $quickEdit;
            $html .= Html::div(null,'quick-edit-container');
        }

        $html = Html::div($html,'cell-inner');
        $r = [$html,$attr];

        return $r;
    }
}

// init
General::__init();
?>