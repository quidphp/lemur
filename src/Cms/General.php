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


    // onBefore
    // validation avant le lancement de la route
    protected function onBefore()
    {
        $return = false;

        if($this->hasTablePermission('view'))
        {
            $table = $this->table();
            $sql = $this->sql();
            $nav = $this->session()->nav();
            $nav->set([static::class,$table],$this->uriRelative());
            $return = true;
        }

        return $return;
    }


    // onFallback
    // sur fallback, efface la version de la route dans nav/session
    protected function onFallback($context=null)
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
    protected function onReplace(array $return):array
    {
        $return['title'] = $this->title();
        $return['metaDescription'] = $this->table()->description();
        
        return $return;
    }


    // selectedUri
    // génère une les uri sélectionnés pour une route en lien avec une table
    public function selectedUri():array
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
    public function hasTable():bool
    {
        return ($this->segment('table') instanceof Core\Table)? true:false;
    }


    // table
    // retourne l'objet table
    public function table():Core\Table
    {
        $return = $this->segment('table');

        if(is_string($return))
        $return = static::db()->table($return);

        return $return;
    }


    // generalSegments
    // retourne les segments à utiliser pour la création de l'objet sql
    protected function generalSegments():array
    {
        return $this->segment(['page','limit','order','direction','filter','in','notIn']);
    }


    // getCurrentCols
    // retourne les colonnes courantes
    protected function getCurrentCols():Core\Cols
    {
        $return = null;

        if($this->hasSegment('cols'))
        $return = $this->segment('cols');

        else
        {
            $table = $this->table();
            $return = $table->cols()->general()->filter(['isVisibleGeneral'=>true]);
        }

        return $return;
    }


    // hasSpecificCols
    // retourne vrai si des colonnes spécifiques ont été sélectionnés
    protected function hasSpecificCols():bool
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
    protected function hasInNotIn():bool
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
    protected function getHighlight():?array
    {
        $return = null;

        if($this->hasSegment('highlight'))
        $return = $this->segment('highlight');

        return $return;
    }


    // makeViewTitle
    // génère le titre spécifique de general pour la table, si existant
    protected function makeViewTitle(?string $lang=null):?string
    {
        $r = null;
        $table = $this->table();
        $r = $this->lang()->safe(['table','view',$table],null,$lang);

        return $r;
    }


    // makeTitle
    // retourne le titre de la route
    protected function makeTitle(?string $lang=null):string
    {
        $r = $this->makeViewTitle($lang);

        if(empty($r))
        $r = $this->table()->label(null,$lang);

        return $r;
    }


    // allSegment
    // retourne tous les segments de la route, un par table
    public static function allSegment():array
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
    public function main():string
    {
        $r = $this->makeTop();
        $r .= $this->makeTable();

        return $r;
    }


    // makeTop
    // génère la partie supérieur de la page
    protected function makeTop():string
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
        $r .= $this->makeSearch($placeholder,['close'=>['icon','solo'],'search'=>['icon','solo']]);
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
    protected function makeSearchNote():string
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
    protected function makeOperation():string
    {
        $r = '';
        $table = $this->table();
        $callback = $table->getAttr('generalOperation');

        if(static::classIsCallable($callback) && $table->hasPermission('generalOperation'))
        $r .= $callback($table);

        $r .= $this->makeReset();
        $r .= $this->makeTruncate();
        $r .= $this->makeExport();
        $r .= $this->makeAdd();

        return $r;
    }


    // makeReset
    // génération le lien de réinitialisation
    protected function makeReset():string
    {
        $r = '';

        if($this->hasTablePermission('reset') && $this->canReset($this->getSearchValue(),'table'))
        {
            $option = ['query'=>false];
            $route = $this->keepSegments('table');
            $r .= $route->a(static::langText('general/reset'),['submit','reset','icon','padLeft','operation-element'],null,$option);
        }

        return $r;
    }


    // makeInfo
    // génère le block d'informations
    protected function makeInfo():string
    {
        $r = '';

        if($this->hasTablePermission('generalCount'))
        {
            $popup = $this->generalInfoPopup();
            $attr = ['popup-trigger',(!empty($popup))? ['with-popup','with-icon','anchor-corner']:null];

            $r .= Html::divOp($attr);
            $r .= Html::div($this->makeCount(),['popup-title']);
            $r .= Html::div($popup,'popup');
            $r .= Html::divCl();
        }

        return $r;
    }


    // generalInfoPopup
    // génère le popup de la page général
    // méthode publiquer car utilisé dans specific
    public function generalInfoPopup(bool $icon=true):?string
    {
        $return = null;

        if($this->hasPermission('popup') && $this->hasTablePermission('generalInfoPopup'))
        {
            $values = $this->infoPopupValues();
            $closure = $this->infoPopupClosure();
            $return = static::makeInfoPopup($values,$closure,false);
        }

        return $return;
    }


    // infoPopupValues
    // retourne un tableau avec les valeurs pour le popup d'informations
    protected function infoPopupValues():array
    {
        $return = array_keys($this->segments());
        $return = Base\Arr::append($return,$this->getAttr('popup'));

        return $return;
    }


    // infoPopupClosure
    // callback pour le popup d'informations de la page générale
    protected function infoPopupClosure():\Closure
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
    protected function infoPopupFilterEmptyNotEmpty(array $value,Core\Col $col,array $array):array
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
    protected function makeAdd():string
    {
        $r = '';
        $table = $this->table();

        if($this->hasTablePermission('insert','lemurInsert'))
        $r .= SpecificAdd::makeOverload($table)->a(static::langText('general/add'),['submit','icon','padLeft','add','operation-element']);

        return $r;
    }


    // makeExport
    // génère le lien pour exporter la table
    protected function makeExport():string
    {
        $r = '';
        $sql = $this->sql();

        if($this->hasTablePermission('export') && !$sql->isTriggerCountEmpty())
        {
            $segment = $this->segments();
            $route = GeneralExportDialog::makeOverload($segment);
            $r .= $route->aDialog();
        }

        return $r;
    }


    // makeTruncate
    // génère le formulaire pour effacer toute la table
    protected function makeTruncate():string
    {
        $r = '';
        $table = $this->table();

        if($this->hasTablePermission('truncate','lemurTruncate') && !empty($table->rowsCount(true,true)))
        {
            $data = ['confirm'=>static::langText('common/confirm')];
            $route = GeneralTruncate::makeOverload($table);

            $r .= Html::divOp(array('truncate','operation-element'));
            $r .= $route->formOpen(['data'=>$data]);
            $r .= $this->tableHiddenInput();
            $r .= Html::submit($route->label(),['icon','truncate','padLeft']);
            $r .= Html::formClose();
            $r .= Html::divCl();
        }

        return $r;
    }


    // makeTool
    // génère le block outil
    protected function makeTool():string
    {
        $r = '';

        if($this->hasTablePermission('rows'))
        {
            $r .= Html::divOp('tool');
            $char = static::getReplaceSegment();
            $defaultSegment = static::getDefaultSegment();

            if($this->hasTablePermission('in'))
            {
                $route = $this->changeSegments(['page'=>1,'in'=>true]);
                $data = ['href'=>$route,'char'=>$char,'separator'=>$defaultSegment];
                $r .= Html::div(null,['icon','solo','plus','data'=>$data]);
            }

            if($this->hasTablePermission('notIn'))
            {
                $notIn = $this->segment('notIn');
                $notIn[] = $char;
                $route = $this->changeSegments(['page'=>1,'notIn'=>$notIn]);
                $data = ['href'=>$route,'char'=>$char,'separator'=>$defaultSegment];
                $r .= Html::div(null,['icon','solo','minus','data'=>$data]);
            }

            $r .= $this->makeGeneralDelete();
            $r .= Html::divCl();
        }

        return $r;
    }


    // makeGeneralDelete
    // génère le formulaire pour effacer de multiples lignes
    protected function makeGeneralDelete():string
    {
        $r = '';

        if($this->hasTablePermission('delete','lemurDelete','multiDelete'))
        {
            $table = $this->table();
            $route = GeneralDelete::makeOverload(['table'=>$table,'primaries'=>true]);
            $defaultSegment = static::getDefaultSegment();
            $data = ['confirm'=>static::langText('common/confirm'),'separator'=>$defaultSegment];

            $r .= Html::divOp('multi-delete');
            $r .= $route->formOpen(['data'=>$data]);
            $r .= $this->tableHiddenInput();
            $r .= Html::inputHidden(null,'primaries');
            $r .= Html::submit(' ',['icon','solo','multi-delete']);
            $r .= Html::formCl();
            $r .= Html::divCl();
        }

        return $r;
    }


    // makeRows
    // génère l'outil pour sélectionner une ou plusieurs lignes dans la table
    protected function makeRows():string
    {
        $r = '';
        $hasInNotIn = $this->hasInNotIn();

        $r .= Html::div(null,['icon','solo','check','center']);
        $r .= Html::div(null,['icon','solo','uncheck','center']);
        $r = Html::div($r,['in','toggleAll',($hasInNotIn === true)? 'selected':null]);
        if($hasInNotIn === true)
        {
            $route = $this->changeSegments(['in'=>null,'notIn'=>null]);
            $r .= $route->a(null,['icon','solo','close']);
        }

        return $r;
    }


    // makeCols
    // génère l'outil pour choisir les colonnes à afficher dans la table
    protected function makeCols():string
    {
        $r = '';
        $table = $this->table();
        $cols = $table->cols();
        $currentCols = $this->getCurrentCols();
        $hasSpecificCols = $this->hasSpecificCols();
        $inAttr = ['in','toggler',($hasSpecificCols === true)? 'selected':null];

        if($this->hasTablePermission('view','cols') && $cols->isNotEmpty() && $currentCols->isNotEmpty())
        {
            $loopCols = $currentCols->clone();
            $notIn = $cols->not($currentCols);
            $loopCols->add($notIn);

            $defaultSegment = static::getDefaultSegment();
            $route = $this->changeSegment('cols',true);
            $current = implode($defaultSegment,$currentCols->names());
            $data = ['href'=>$route,'char'=>static::getReplaceSegment(),'current'=>$current,'separator'=>$defaultSegment];
            $inAttr[] = 'anchor-corner';
            $session = static::session();

            $checkbox = [];
            $htmlWrap = Html::divOp('choice');
            $htmlWrap .= Html::divOp('choice-in');
            $htmlWrap .= Html::div(null,['icon','solo','move']);
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

            $r .= Html::div(null,['icon','solo','cols','center']);

            if($hasSpecificCols === true)
            {
                $reset = $this->changeSegment('cols',null);
                $r .= $reset->a(null,['icon','solo','close']);
            }

            $r .= Html::divOp('popup');
            $r .= Html::divOp('inside');
            $r .= Html::checkbox($checkbox,$attr,$option);
            $r .= Html::divCl();
            $r .= Html::button(null,['name'=>'cols','icon','check','solo','top-right','data'=>$data]);
            $r .= Html::divCl();
        }

        $r = Html::div($r,$inAttr);

        return $r;
    }


    // makeTable
    // génère la table
    protected function makeTable():string
    {
        $r = '';

        if($this->hasTablePermission('view'))
        {
            $table = $this->table();
            $cols = $this->getCurrentCols();
            $sql = $this->sql();

            $tableIsEmpty = $table->isRowsEmpty(true);
            $isEmpty = $sql->isTriggerCountEmpty();
            $class = ($isEmpty === true)? 'empty':'notEmpty';

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
    protected function makeTableHeader():string
    {
        $r = '';
        $table = $this->table();
        $cols = $this->getCurrentCols();

        if($cols->isNotEmpty())
        {
            $ths = [];
            $permission['filter'] = $this->hasTablePermission('filter');
            $permission['order'] = $this->hasTablePermission('order','direction');
            $count = $cols->count();

            if($this->hasTablePermission('rows'))
            {
                $html = $this->makeRows();
                $ths[] = [$html,'rows'];
            }

            foreach ($cols as $col)
            {
                $data = ['name'=>$col->name(),'col'=>$col::className(true),'group'=>$col->group()];
                $data = $col->getDataAttr($data);
                $thAttr = ['data'=>$data];

                $label = Html::span($col->label(),'label');
                $in = Html::divtable($label);

                if($permission['order'] === true && $col->isOrderable())
                {
                    $icon = ['triangle'];
                    $array = $this->makeTableHeaderOrder($col,[$in,$thAttr],'in',$icon);
                }

                else
                {
                    $in = Html::div($in,'in');
                    $array = [$in,$thAttr];
                }

                if($permission['filter'] === true && $col->isFilterable() && $col->relation()->size() > 0)
                $array = $this->makeTableHeaderFilter($col,$array);

                $ths[] = $array;
            }

            if($this->hasTablePermission('action'))
            {
                $html = $this->makeCols();
                $ths[] = [$html,'action'];
            }

            $r = Html::thead($ths);
        }

        return $r;
    }


    // makeTableHeaderFilter
    // génère un filtre dans un header de table
    protected function makeTableHeaderFilter(Core\Col $col,array $array):array
    {
        $html = $array[0];
        $thAttr = $array[1];
        $thAttr[] = ['filterable'];
        $filter = $this->segment('filter');

        $html .= Html::divOp('left');
        $class = ['filter-outer','click-open','anchor-corner'];
        $close = ['icon','solo','close'];
        $label = Html::div(null,['filter','icon','solo']);

        $route = GeneralRelation::getOverloadClass();
        $html .= $route::makeFilter($col,$this,$filter,$class,$close,$label);

        $html .= Html::divCl();

        return [$html,$thAttr];
    }


    // makeTableBody
    // génère le body de la table
    protected function makeTableBody():string
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

            foreach ($rows as $row)
            {
                $array = [];
                $specific = Specific::makeOverload($row)->uri();
                $cells = $row->cells($cols);

                $rowAttr = ['data'=>['id'=>$row->primary(),'row'=>$row::className(true)]];
                if(!empty($highlight) && in_array($row->primary(),$highlight,true))
                $rowAttr[] = 'highlight';

                if($rowsPermission === true)
                {
                    $checkbox = Html::inputCheckbox($row,'row');
                    $label = Html::label($checkbox,['in']);
                    $array[] = [$label,'rows'];
                }

                foreach ($cells as $cell)
                {
                    $option = ['specific'=>$specific];
                    $array[] = $this->makeTableBodyCell($cell,$option);
                }

                if($actionPermission === true)
                {
                    $html = '';

                    if($specificPermission === true)
                    {
                        $action = ($modify === true && $row->isUpdateable())? 'modify':'view';
                        $html = Html::a($specific,Html::div(null,['icon','solo',$action,'center']),'in');
                    }

                    $array[] = [$html,'action'];
                }

                $trs[] = [$array,$rowAttr];
            }

            $r .= Html::tbody(...$trs);
        }

        return $r;
    }


    // makeTableBodyCell
    // génère le contenu à afficher dans une cellule de table
    // le placeholder - ou NULL peut être utilisé si la valeur est vide
    protected function makeTableBodyCell(Core\Cell $cell,?array $option=null):array
    {
        $r = [];
        $option = Base\Arr::plus(['specific'=>null,'modify'=>false,'excerptMin'=>$cell->generalExcerptMin()],$option);
        $context = $this->context();
        $data = ['name'=>$cell->name(),'cell'=>$cell::className(true),'group'=>$cell->group()];
        $data = $cell->getDataAttr($data);
        $attr = ['data'=>$data];
        $v = $cell->get($context);

        if($cell->isPrimary() && is_string($option['specific']))
        {
            $specific = $option['specific'];
            $v = Html::a($specific,$v,'in');
            $attr[] = 'primary';
        }

        else
        {
            $placeholder = $cell->col()->emptyPlaceholder($v);
            if(is_string($placeholder))
            $v = Html::span($placeholder,'empty-placeholder');

            $v = Html::div($v,'in',$option);
        }

        $r = [$v,$attr];

        return $r;
    }
}

// init
General::__init();
?>