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

// specific
// class for the specific route of the CMS, generates the update form for a row
class Specific extends Core\RouteAlias
{
    // trait
    use _templateAlias;
    use _general;
    use _specific;
    use _specificNav;
    use Lemur\Route\_specificPrimary;
    use Lemur\Segment\_table;
    use Lemur\Segment\_primary;


    // config
    public static $config = [
        'path'=>[
            'en'=>'table/[table]/[primary]',
            'fr'=>'table/[table]/[primary]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primary'=>'structureSegmentPrimary'],
        'group'=>'specific',
        'match'=>[
            'session'=>'canAccess'],
        'sitemap'=>true
    ];


    // canTrigger
    // validation avant le lancement de la route
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->segment('table');

        if(parent::canTrigger() && $table instanceof Core\Table && $table->hasPermission('view','specific'))
        $return = true;

        return $return;
    }


    // onReplace
    // tableau onReplace pour la route
    final protected function onReplace(array $return):array
    {
        $return['title'] = $this->title();

        return $return;
    }


    // selectedUri
    // retourne les uris sélectionnés pour la route
    // la route account peut être sélectionner
    final public function selectedUri():array
    {
        $return = [];
        $table = $this->table();
        $user = static::sessionUser();
        $root = static::session()->routeTableGeneral($table);
        $uri = $root->uri();
        $return[$uri] = true;

        if($user->route()->uri() === $this->uri())
        {
            $route = Account::make();
            if($route->canTrigger())
            {
                $account = $route->uri();
                $return[$account] = true;
            }
        }

        return $return;
    }


    // allSegment
    // retourne tous les segments pour la route specific, un par table et id
    final public static function allSegment():array
    {
        $return = [];
        $db = static::db();

        foreach ($db->tables() as $table)
        {
            if($table->hasPermission('view'))
            {
                $name = $table->name();
                $primary = $table->primary();
                foreach ($db->selectColumns($primary,$table,null,[$primary=>'desc'],100) as $id)
                {
                    $return[] = ['table'=>$name,'primary'=>$id];
                }
            }
        }

        return $return;
    }


    // isUpdateable
    // retourne vrai si la row peut être modifié
    final public function isUpdateable(?array $option=null):bool
    {
        $return = false;
        $table = $this->table();
        $row = $this->row();

        if($table->hasPermission('update','lemurUpdate') && $row->isUpdateable($option))
        $return = true;

        return $return;
    }


    // isDeleteable
    // retourne vrai si la row peut être effacé
    final public function isDeleteable(?array $option=null):bool
    {
        $return = false;
        $table = $this->table();
        $row = $this->row();

        if($table->hasPermission('delete','lemurDelete') && $row->isDeleteable($option))
        $return = true;

        return $return;
    }


    // isUpdateableOrDeleteable
    // retourne vrai si la row peut être modifié ou effacé
    final public function isUpdateableOrDeleteable():bool
    {
        $return = $this->isUpdateable();

        if($return === false)
        $return = $this->isDeleteable();

        return $return;
    }


    // isPanelVisible
    // retourne vrai si le panneau est visible
    final protected function isPanelVisible(Core\Cols $cols):bool
    {
        $return = true;
        $row = $this->row();
        $cells = $row->cells()->gets($cols);
        $session = static::session();

        if($cells->isHidden($session))
        $return = false;

        return $return;
    }


    // makeTitleBox
    // génère le titre pour la page specific
    final protected function makeTitleBox():string
    {
        $r = $this->makeH1($this->makeTitle());
        $r .= Html::divCond($this->makeRelationChilds(),['relation-childs','popup-trigger','with-icon','with-popup','data'=>['anchor-corner'=>true,'absolute-placeholder'=>true]]);

        return $r;
    }


    // makeTitle
    // génère le titre pour la route
    final protected function makeTitle(?string $lang=null):string
    {
        return $this->row()->label(null,100,$lang);
    }


    // makeRelationChilds
    // génère le block pour les enfants direct
    final protected function makeRelationChilds():string
    {
        $r = '';
        $table = $this->table();

        if($table->hasPermission('relationChilds'))
        {
            $row = $this->row();
            $relationChilds = $row->relationChilds();

            if(is_array($relationChilds) && !empty($relationChilds))
            {
                $count = Base\Arrs::countLevel(2,$relationChilds);
                $text = static::langPlural($count,'specific/relationChilds',['count'=>$count]);
                $r .= Html::button($text,'popup-title');

                $html = Html::ul($this->makeRelationChildsInner($relationChilds));
                $r .= static::makeDivPopup($html);
            }
        }

        return $r;
    }


    // makeRelationChildsInner
    // génère les li dans le block enfants directs
    final protected function makeRelationChildsInner(array $value):string
    {
        $r = '';
        $db = $this->db();
        $row = $this->row();
        $primary = $row->primary();
        $no = 0;

        foreach ($value as $table => $array)
        {
            if(is_string($table) && $db->hasTable($table) && is_array($array) && !empty($array))
            {
                $table = $db->table($table);
                $routeClass = $table->routeClass('general');

                foreach ($array as $colName => $primaries)
                {
                    if(is_string($colName) && $table->hasCol($colName) && is_array($primaries) && !empty($primaries))
                    {
                        $col = $table->col($colName);
                        $c = count($primaries);

                        if($table->hasPermission('view'))
                        {
                            $segment = ['table'=>$table,'filter'=>[$colName=>$primary]];
                            $route = $routeClass::make($segment);
                            $text = $table->label().' / '.$col->label()." ($c)";
                            $html = $route->a($text);
                            $r .= Html::liCond($html);
                        }

                        else
                        $no += $c;
                    }
                }
            }
        }

        if($no > 0)
        {
            $text = Html::span(static::langText('specific/relationChildsNoAccess'),'not-accessible');
            $text .= "($no)";
            $r .= Html::li($text);
        }

        return $r;
    }


    // makeNav
    // génère la nav en haut à droite
    final protected function makeNav():string
    {
        $r = '';
        $table = $this->table();

        if($table->hasPermission('nav'))
        {
            $row = $this->row();
            $general = $this->general();
            $attr = ['first'=>'hash-follow','prev'=>'hash-follow','next'=>'hash-follow','last'=>'hash-follow'];
            $specific = $this->makeSpecificNav($general,$row,'primary','highlight',$attr);
            $r .= Html::divOp('nav');

            if(!empty($specific))
            {
                if(!empty($specific['first']))
                $r .= $specific['first'];

                if(!empty($specific['prev']))
                $r .= $specific['prev'];

                if(!empty($specific['count']))
                {
                    $popup = $general->generalInfoPopup(true);
                    $attr = ['popup-trigger'];
                    $html = '';

                    if(!empty($popup))
                    {
                        $attr = Base\Arr::append($attr,['with-popup','with-text-solo','data'=>['anchor-corner'=>true,'absolute-placeholder'=>true]]);
                        $html .= Html::button($specific['count'],'popup-title');
                        $html .= static::makeDivPopup($popup);
                    }

                    else
                    $html .= Html::div($specific['count'],'popup-title');

                    $r .= Html::div($html,$attr);
                }

                if(!empty($specific['next']))
                $r .= $specific['next'];

                if(!empty($specific['last']))
                $r .= $specific['last'];

                $route = SpecificAdd::make($table);
                if($route->canTrigger())
                $r .= $route->a(static::langText('specific/add'));

                if($table->hasPermission('navBack') && !empty($specific['back']))
                $r .= $specific['back'];
            }

            $r .= Html::divCl();
        }

        return $r;
    }


    // makeForm
    // génère le formulaire
    final protected function makeForm():string
    {
        $r = '';
        $dispatch = $this->isUpdateableOrDeleteable();
        $hasPanel = $this->hasPanel();
        $attr = ['specific-form',($hasPanel === true)? 'with-panel':null];

        if($dispatch === true)
        {
            $r .= SpecificDispatch::make($this->segments())->formOpen($attr);
            $r .= $this->makeFormHidden();
            $r .= $this->makeFormPrimary();
            $r .= $this->makeFormSubmit('hidden');
        }

        else
        $r .= Html::divOp($attr);

        $r .= Html::div($this->makeFormTop(),'form-top');
        $r .= Html::div($this->makeFormInner(),'form-inner');
        $r .= Html::div($this->makeFormBottom(),'form-bottom');

        if($dispatch === true)
        $r .= Html::formCl();
        else
        $r .= Html::divCl();

        return $r;
    }


    // makeFormPrimary
    // génère le input hidden pour la colonne primaire
    final protected function makeFormPrimary():string
    {
        $r = '';
        $primary = $this->table()->primary();
        $cell = $this->row()->cell($primary);
        $r .= $cell->formHidden(['name'=>'-primary-']);

        return $r;
    }


    // colCell
    // retourne la cellule à partir d'une colonne
    final protected function colCell(Core\Col $col):Core\Cell
    {
        return $this->row()->cell($col);
    }


    // colCellVisible
    // retourne la cellule si elle est visible
    final protected function colCellVisible(Core\Col $col):?Core\Cell
    {
        $return = null;

        $cell = $this->colCell($col);
        $session = static::session();
        if($cell->isVisible(null,$session))
        $return = $cell;

        return $return;
    }


    // makeFormWrap
    // génère un wrap label -> field pour le formulaire
    protected function makeFormWrap(Core\Cell $cell,array $replace):string
    {
        return $cell->specificComponentWrap($this->getFormWrap(),'%:',$this->formTagAttr($cell),$replace);
    }


    // formTagAttr
    // retourne les attributs de tag par défaut pour le component
    final protected function formTagAttr(Core\Cell $cell):?array
    {
        return (!$this->isUpdateable() || !$cell->isEditable())? ['tag'=>'div']:null;
    }


    // makeOperation
    // génère le bloc opération en haut à droite
    // possible que la table ait une opération spécifique dans ses attributs, doit être une callable
    final protected function makeOperation():string
    {
        $r = '';
        $row = $this->row();
        $table = $row->table();
        $callback = $row->table()->getAttr('specificOperation');

        if(static::isCallable($callback) && $table->hasPermission('specificOperation'))
        $r .= $callback($row);

        $r .= $this->makeViewRoute();
        $r .= $this->makeDuplicate();
        $r .= $this->makeFormSubmit('top');

        return $r;
    }


    // makeViewRoute
    // génère le lien view vers une route
    final protected function makeViewRoute(?string $key=null):string
    {
        $r = '';
        $row = $this->row();
        $table = $this->table();
        $session = $this->session();

        if($key === null)
        $key = static::boot()->typePrimary();

        if($table->hasPermission('viewApp') && $session->canViewRow($row))
        {
            $row = $this->row();
            $route = $row->routeSafe($key);

            if(!empty($route) && $route::hasPath() && $route::allowed())
            $r .= $route->a(static::langText('specific/view'),['with-icon','view','operation-element','target'=>false]);
        }

        return $r;
    }


    // makeDuplicate
    // génère le lien pour dupliquer la ligne si permis
    final protected function makeDuplicate():string
    {
        $r = '';
        $table = $this->table();

        if($table->hasPermission('duplicate'))
        {
            $route = SpecificDuplicate::make($this->segments());

            if($route->canTrigger())
            {
                $data = ['confirm'=>static::langText('common/confirm')];
                $attr = ['with-icon','copy','operation-element','name'=>'--duplicate--','value'=>1,'data'=>$data];
                $r .= $route->submitLabel(null,$attr);
            }
        }

        return $r;
    }


    // makeFormSubmit
    // génère le submit pour le formulaire
    final protected function makeFormSubmit(string $type):string
    {
        $r = '';

        if($this->isUpdateable())
        {
            if($type === 'hidden')
            $r .= Html::submit(null,['name'=>'--modify--','value'=>1,'hidden']);

            else
            {
                $text = 'specific/modify'.ucfirst($type);
                $r .= Html::submit(static::langText($text),['name'=>'--modify--','operation-element','value'=>1,'with-icon','modify']);
            }
        }

        return $r;
    }


    // makeFormBottom
    // génère la partie inférieure du formulaire
    final protected function makeFormBottom():string
    {
        $r = '';

        $r .= Html::div(null,'left');
        $r .= Html::div($this->makeFormSubmit('bottom'),'center');
        $r .= Html::div($this->makeFormDelete(),'right');

        return $r;
    }


    // makeFormDelete
    // génère le bouton submit pour la suppression
    final protected function makeFormDelete():string
    {
        $r = '';

        if($this->isDeleteable())
        {
            $data = ['confirm'=>static::langText('common/confirm')];
            $attr = ['name'=>'--delete--','value'=>1,'with-icon','remove','data'=>$data];
            $r .= Html::submit(static::langText('specific/remove'),$attr);
        }

        return $r;
    }
}

// init
Specific::__init();
?>