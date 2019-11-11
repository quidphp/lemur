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

// specific
// class for the specific route of the CMS, generates the update form for a row
class Specific extends Core\RouteAlias
{
    // trait
    use _templateAlias;
    use _general;
    use _specific;
    use Lemur\Route\_specific;
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
            'role'=>['>'=>'user']],
        'sitemap'=>true
    ];


    // onBefore
    // validation avant le lancement de la route
    final protected function onBefore()
    {
        $return = false;
        $table = $this->segment('table');

        if($table instanceof Core\Table && $table->hasPermission('view','specific'))
        $return = true;

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
            $account = Account::make()->uri();
            $return[$account] = true;
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
    final public function isUpdateable():bool
    {
        $return = false;
        $table = $this->table();
        $row = $this->row();

        if($table->hasPermission('update','lemurUpdate') && $row->isUpdateable())
        $return = true;

        return $return;
    }


    // isDeleteable
    // retourne vrai si la row peut être effacé
    final public function isDeleteable():bool
    {
        $return = false;
        $table = $this->table();
        $row = $this->row();

        if($table->hasPermission('delete','lemurDelete') && $row->isDeleteable())
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


    // main
    // fait main pour specific
    final public function main():string
    {
        $r = $this->makeTop();
        $r .= $this->makeForm();

        return $r;
    }


    // makeTitleBox
    // génère le titre pour la page specific
    final protected function makeTitleBox():string
    {
        $r = $this->makeH1($this->makeTitle());
        $r .= Html::divCond($this->makeRelationChilds(),['relation-childs','popup-trigger','with-icon','with-popup','anchor-corner']);

        return $r;
    }


    // makeTitle
    // génère le titre pour la route
    final protected function makeTitle(?string $lang=null):string
    {
        return $this->row()->label(null,$lang);
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
                $r .= Html::div($text,['popup-title']);
                $r .= Html::divOp('popup');
                $r .= Html::ul($this->makeRelationChildsInner($relationChilds));
                $r .= Html::divCl();
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
            $attr = ['first'=>'hashFollow','prev'=>'hashFollow','next'=>'hashFollow','last'=>'hashFollow'];
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
                    $attr = ['popup-trigger',(!empty($popup))? ['with-popup','with-text-solo','anchor-corner']:null];

                    $r .= Html::divOp($attr);
                    $r .= Html::div($specific['count'],'popup-title');
                    $r .= Html::div($popup,'popup');
                    $r .= Html::divCl();
                }

                if(!empty($specific['next']))
                $r .= $specific['next'];

                if(!empty($specific['last']))
                $r .= $specific['last'];

                if($table->hasPermission('insert','lemurInsert'))
                $r .= SpecificAdd::make($table)->a(static::langText('specific/add'));

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

        $r .= Html::divOp('container');
        $r .= Html::divOp('form');

        if($dispatch === true)
        {
            $r .= SpecificDispatch::make($this->segments())->formOpen();
            $r .= $this->makeFormPrimary();
            $r .= $this->makeFormSubmit('hidden');
        }

        $r .= $this->makeFormTop();
        $r .= $this->makeFormInner();
        $r .= $this->makeFormBottom();

        if($dispatch === true)
        $r .= Html::formCl();

        $r .= Html::divCl();
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
    final protected function makeFormWrap(Core\Cell $cell,array $replace):string
    {
        return $cell->specificComponent($this->getFormWrap(),'%:',$this->formWrapAttr($cell),$replace);
    }


    // formWrapAttr
    // retourne les attributs par défaut pour le formWrap
    final protected function formWrapAttr(Core\Cell $cell):?array
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

        if(static::classIsCallable($callback) && $table->hasPermission('specificOperation'))
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
            $route = SpecificDuplicate::class;
            $data = ['confirm'=>static::langText('common/confirm')];
            $attr = ['with-icon','copy','operation-element','name'=>'--duplicate--','value'=>1,'data'=>$data];
            $r .= $route::make()->submitLabel(null,$attr);
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

        $r .= Html::divOp('bottom');
        $r .= Html::div(null,'left');
        $r .= Html::div($this->makeFormSubmit('bottom'),'center');
        $r .= Html::div($this->makeFormDelete(),'right');
        $r .= Html::divCl();

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