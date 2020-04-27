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
use Quid\Base\Html;
use Quid\Core;
use Quid\Main;

// _specific
// trait that provides commonly used methods for the specific routes of the CMS
trait _specific
{
    //  configSpecific
    protected static array $configCmsSpecific = [
        'formWrap'=>"<div class='left'><div class='label'>%label%</div>%description%%details%</div><div class='right'>%form%</div>%popup%",
        'popup'=>[
            'name','isRequired','shouldBeUnique','isEditable','priority','pattern','preValidate','validate','compare','type','length','unsigned',
            'default','acceptsNull','collation','isRelation','isOrderable','isFilterable','isSearchable','isExportable','classFqcn','classCell']
    ];


    // main
    // fait main pour specificAdd
    final public function main():string
    {
        $r = $this->makeTop();
        $r .= $this->makeForm();

        return $r;
    }


    // panel
    // retourne le tableau des panneaux
    final protected function panel():array
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
    final protected function hasPanel():bool
    {
        $return = false;
        $panel = $this->panel();

        if(count($panel) > 1)
        $return = true;

        return $return;
    }


    // makeTop
    // génère la partie supérieure de la page specifique
    final protected function makeTop():string
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
    final protected function makeFormTop():string
    {
        $r = '';

        $r .= Html::divOp('left');
        $r .= $this->makeFormPanel();
        $r .= Html::divCl();

        $r .= Html::divCond($this->makeOperation('top'),'right');

        return $r;
    }


    // makeFormHiddenTablePanel
    // génère les inputs table et panel du formulaire
    final protected function makeFormHiddenTablePanel():string
    {
        $r = $this->tableHiddenInput();

        if($this->hasPanel())
        $r .= Html::inputHidden(null,static::panelInputName());

        return $r;
    }


    // makeFormHidden
    // génère les input hiddens du formulaire
    final protected function makeFormHidden():string
    {
        return $this->makeFormHiddenTablePanel();
    }


    // makeFormPanel
    // crée le conteneur des panneaux
    final protected function makeFormPanel():string
    {
        $r = '';

        if($this->hasPanel())
        {
            $table = $this->table();
            $lang = $this->lang();
            $panel = $this->panel();

            foreach ($panel as $key => $cols)
            {
                if($cols->isNotEmpty())
                {
                    $r .= Html::liOp();
                    $r .= Html::aOpen("#$key",null);
                    $r .= Html::h3($lang->panelLabel($key));
                    $r .= Html::aCl();
                    $r .= Html::liCl();
                }
            }

            $r = Html::ulCond($r);
        }

        return $r;
    }


    // makeColPopup
    // génère le popup d'informations pour une colonne
    final protected function makeColPopup(Core\Col $col):?string
    {
        $return = null;
        $table = $this->table();

        if($this->hasPermission('popup') && $table->hasPermission('colInfoPopup'))
        {
            $values = $this->getAttr('popup');
            $closure = $this->colInfoPopupClosure($col);
            $return = static::makeInfoPopup($values,$closure);
        }

        return $return;
    }


    // colInfoPopupClosure
    // callback pour le popup d'informations de la page d'accueil
    final protected function colInfoPopupClosure(Core\Col $col):\Closure
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
    final protected function makeFormInner():string
    {
        $r = '';
        $table = $this->table();
        $hasPanel = $this->hasPanel();
        $panel = $this->panel();
        $lang = $this->lang();
        $currentPanel = static::session()->flash()->get('currentPanel');

        if(!empty($panel))
        {
            $showDescription = ($table->hasPermission('panelDescription') && count($panel) > 1);
            $firstKey = key($panel);

            foreach ($panel as $key => $cols)
            {
                if($cols->isNotEmpty())
                {
                    $data = [];

                    if($hasPanel === true)
                    {
                        if($key === $currentPanel)
                        $data['current-panel'] = true;

                        $data['hash'] = $key;
                    }
                    $attr = ['panel','data'=>$data];

                    $description = '';
                    if($showDescription === true && is_string($key))
                    {
                        $description = Html::divCond($lang->panelDescription($key),'panel-description');
                        if(!empty($description))
                        $attr[] = 'with-description';
                    }

                    $r .= Html::divOp($attr);
                    $r .= $description;

                    $fields = '';
                    foreach ($cols as $col)
                    {
                        $fields .= $this->makeFormOne($col);
                    }
                    $r .= Html::divCond($fields,'form-fields');

                    $r .= Html::divCl();
                }
            }
        }

        return $r;
    }


    // makeFormOneReplace
    // permet de changer le tableau de remplacement pour un élément du formulaire
    protected function makeFormOneReplace(Core\Col $col,array $return):array
    {
        return $return;
    }


    // makeFormOneAttr
    // retourne les attributs pour la balise parent form-element
    protected function makeFormOneAttr(Core\Col $col):array
    {
        return $col->getFormElementAttr();
    }


    // makeFormOne
    // génère un champ du formulaire
    final protected function makeFormOne(Core\Col $col):string
    {
        $r = '';
        $colCell = $this->colCellVisible($col);

        if(!empty($colCell))
        {
            $formWrap = '';
            $attr = $this->makeFormOneAttr($col);
            $colPopup = $this->makeColPopup($col);

            $description = $col->description();
            $replace['description'] = (!empty($description))? Html::div($description,'description'):'';

            $details = $col->details();
            $detailsHtml = Html::liMany(...$details);
            $detailsHtml = Html::ulCond($detailsHtml);
            $replace['details'] = (!empty($details))? Html::divCond($detailsHtml,'details'):'';
            $replace['popup'] = null;

            if(!empty($colPopup))
            {
                $popup = Html::divOp(['popup-trigger','with-popup','with-icon-solo','data'=>['anchor-corner'=>true,'absolute-placeholder'=>true]]);
                $popup .= Html::button(null,'popup-title');
                $popup .= static::makeDivPopup($colPopup);
                $popup .= Html::divCl();
                $attr['data']['col-popup'] = true;
                $replace['popup'] = $popup;
            }

            $replace = $this->makeFormOneReplace($col,$replace);

            try
            {
                $formWrap = $this->makeFormWrap($colCell,$replace);
            }

            catch (Main\CatchableException $e)
            {
                $attr[] = 'exception';
                $formWrap = Html::div($colCell->label(),'label');
                $e->catched();
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
    final protected function getFormWrap():string
    {
        return $this->getAttr('formWrap');
    }
}
?>