<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base\Html;
use Quid\Core;
use Quid\Main;

// _specific
// trait that provides commonly used methods for the specific routes of the CMS
trait _specific
{
    //  configSpecific
    public static $configCmsSpecific = [
        'formWrap'=>"<div class='left'><div class='label'>%label%</div>%description%%details%</div><div class='right'>%form%</div>%popup%",
        'popup'=>[
            'name','isRequired','shouldBeUnique','isEditable','priority','pattern','preValidate','validate','compare','type','length','unsigned',
            'default','acceptsNull','collation','isRelation','isOrderable','isFilterable','isSearchable','isExportable','classFqcn','classCell'
        ]
    ];


    // onReplace
    // tableau onReplace pour la route
    protected function onReplace(array $return):array
    {
        $return['title'] = $this->title();
        $return['metaDescription'] = $this->table()->description();

        return $return;
    }


    // panel
    // retourne le tableau des panneaux
    protected function panel():array
    {
        return $this->cache(__METHOD__,function() {
            $return = [];
            $table = $this->table();
            $cols = $table->cols()->withoutPrimary();

            if($table->hasPanel())
            $group = $cols->group('panel');

            else
            $group = [$cols];

            foreach ($group as $key => $cols)
            {
                if($cols->isNotEmpty())
                {
                    if($this->isPanelVisible($cols))
                    $return[$key] = $cols;
                }
            }

            return $return;
        });
    }


    // hasPanel
    // retourne vrai si la route a des panneaux
    protected function hasPanel():bool
    {
        $return = false;
        $panel = $this->panel();

        if(count($panel) > 1)
        $return = true;

        return $return;
    }


    // makeTop
    // génère la partie supérieure de la page specifique
    protected function makeTop():string
    {
        $r = '';
        $table = $this->table();

        $r .= Html::divOp('top');
        $r .= Html::divOp('left');

        $r .= Html::div($this->makeTitleBox(),'title');

        if($table->hasPermission('description'))
        $r .= Html::divCond($table->description(),['description','sub-title']);

        $r .= Html::divCl();

        $r .= Html::divCond($this->makeNav(),'right');
        $r .= Html::divCl();

        return $r;
    }


    // makeFormTop
    // génère la partie supérieure du formulaire spécifique
    protected function makeFormTop():string
    {
        $r = '';
        $r .= $this->makeFormHidden();

        $r .= Html::divOp('top');
        $r .= Html::divOp('left');
        $r .= $this->makeFormPanel();
        $r .= Html::divCl();

        $r .= Html::divCond($this->makeOperation('top'),'right');
        $r .= Html::divCl();

        return $r;
    }


    // makeFormHidden
    // génère les input hiddens du formulaire
    protected function makeFormHidden():string
    {
        $r = $this->tableHiddenInput();

        if($this->hasPanel())
        $r .= Html::inputHidden(null,static::panelInputName());

        return $r;
    }


    // makeFormPanel
    // crée le conteneur des panneaux
    protected function makeFormPanel():string
    {
        $r = '';

        if($this->hasPanel())
        {
            $table = $this->table();
            $lang = $this->lang();
            $panel = $this->panel();

            $r .= Html::ulOp();

            foreach ($panel as $key => $cols)
            {
                if($cols->isNotEmpty())
                {
                    $data = [];

                    if($table->hasPermission('panelDescription'))
                    $data['description'] = $lang->panelDescription($key);

                    $r .= Html::liOp();
                    $r .= Html::aOpen("#$key",null,['data'=>$data]);
                    $r .= Html::h3($lang->panelLabel($key));
                    $r .= Html::aCl();
                    $r .= Html::liCl();
                }
            }

            $r .= Html::ulCl();

            if($table->hasPermission('panelDescription'))
            $r .= Html::div(true,'description');
        }

        return $r;
    }


    // makeColPopup
    // génère le popup d'informations pour une colonne
    protected function makeColPopup(Core\Col $col):?string
    {
        $return = null;
        $table = $this->table();

        if($this->hasPermission('popup') && $table->hasPermission('colInfoPopup'))
        {
            $values = static::$config['popup'];
            $closure = $this->colInfoPopupClosure($col);
            $return = static::makeInfoPopup($values,$closure,false);
        }

        return $return;
    }


    // colInfoPopupClosure
    // callback pour le popup d'informations de la page d'accueil
    protected function colInfoPopupClosure(Core\Col $col):\Closure
    {
        return function(string $key) use($col) {
            $return = [static::langText(['popup','col',$key])];
            $value = null;

            if($key === 'pattern')
            $value = $col->rulePattern(true);

            elseif($key === 'preValidate')
            $value = $col->rulePreValidate(true);

            elseif($key === 'validate')
            $value = $col->ruleValidate(true);

            elseif($key === 'compare')
            $value = $col->ruleCompare(true);

            elseif($key === 'classCell')
            $value = $col->table()->classe()->cell($col);

            elseif($key === 'default')
            {
                $value = $col->default();

                if($value === null && $col->hasNullDefault())
                $value = 'NULL';
            }

            else
            $value = $col->$key();

            $return[] = $value;

            return $return;
        };
    }


    // makeFormInner
    // génère l'intérieur d'un panneau avec tous les champs inclus
    protected function makeFormInner():string
    {
        $r = '';
        $hasPanel = $this->hasPanel();
        $panel = $this->panel();
        $lang = $this->lang();

        if(!empty($panel))
        {
            $r .= Html::divOp('inside');

            foreach ($panel as $key => $cols)
            {
                if($cols->isNotEmpty())
                {
                    $data = ($hasPanel === true)? ['fragment'=>$key]:null;
                    $r .= Html::divOp(['panel','data'=>$data]);

                    foreach ($cols as $col)
                    {
                        $r .= $this->makeFormOne($col);
                    }

                    $r .= Html::divCl();
                }
            }

            $r .= Html::divCl();
        }

        return $r;
    }


    // makeFormOne
    // génère un champ du formulaire
    protected function makeFormOne(Core\Col $col):string
    {
        $r = '';
        $colCell = $this->colCellVisible($col);

        if(!empty($colCell))
        {
            $description = $colCell->description();
            $details = $colCell->details();
            $formWrap = '';

            $class = [];
            $class[] = ($col->isRequired())? 'required':null;
            $class[] = ($colCell->hasFormLabelId($this->formWrapAttr($colCell),true))? 'cursor-pointer':null;
            $data = ['name'=>$col,'group'=>$col->group(),'col'=>$col::className(true),'tag'=>$col->complexTag()];
            $data = $col->getDataAttr($data);
            $attr = ['element','anchor-corner',$class,'data'=>$data];

            $detailsHtml = Html::liMany(...$details);
            $detailsHtml = Html::ulCond($detailsHtml);

            $colPopup = $this->makeColPopup($col);
            if(!empty($colPopup))
            {
                $popup = Html::divOp(['popup-trigger','with-popup','with-icon-solo','anchor-corner']);
                $popup .= Html::div(null,'popup-title');
                $popup .= Html::div($colPopup,'popup');
                $popup .= Html::divCl();
            }

            $replace = [];
            $replace['description'] = (!empty($description))? Html::div($description,'description'):'';
            $replace['details'] = (!empty($details))? Html::divCond($detailsHtml,'details'):'';
            $replace['popup'] = (!empty($popup))? $popup:'';

            try
            {
                $formWrap = $this->makeFormWrap($colCell,$replace);
            }

            catch (Main\CatchableException $e)
            {
                $attr[] = 'exception';
                $formWrap = Html::div($colCell->label(),'label');
                $e->onCatched();
            }

            finally
            {
                $r .= Html::div($formWrap,$attr);
            }
        }

        return $r;
    }


    // getFormWrap
    // retourne la string formWrap a utilisé pour chaque champ
    public static function getFormWrap():string
    {
        return static::$config['formWrap'];
    }
}
?>