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
use Quid\Lemur;

// specificMulti
// class for the specific multi route of the CMS, generates the update form for multiple rows
class SpecificMulti extends Core\RouteAlias
{
    // trait
    use _common;
    use _general;
    use _specificAddMulti;
    use _templateAlias;
    use Lemur\Segment\_table;
    use Lemur\Segment\_primaries;


    // config
    public static $config = [
        'path'=>[
            'en'=>'table/[table]/multiple/[primaries]',
            'fr'=>'table/[table]/multiple/[primaries]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primaries'=>'structureSegmentPrimaries'],
        'group'=>'specific',
        'match'=>[
            'session'=>'canAccess'],
        'parent'=>Specific::class,
        'sitemap'=>false,
        'formWrap'=>"<div class='disabler'>%disabler%</div><div class='left'><div class='label'>%label%</div>%description%%details%</div><div class='right'>%form%</div>%popup%"
    ];


    // onBefore
    // validation que les rows sont updateables, il doit y en avoir au moins 2
    final protected function onBefore()
    {
        $return = false;

        if(parent::onBefore())
        {
            $rows = $this->rows();

            if($rows->isMinCount(2) && $rows->pairEqual(true,'isUpdateable'))
            $return = true;
        }

        return $return;
    }


    // canTrigger
    // si la route peut être lancé
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->hasTable() && $this->table()->hasPermission('view','specific','update','rows','lemurUpdate','multiModify'))? true:false;
    }


    // rows
    // retourne l'objet rows
    final protected function rows():Core\Rows
    {
        return $this->cache(__METHOD__,function() {
            return $this->table()->rows(...$this->segment('primaries'));
        });
    }


    // routeSubmit
    // retourne la route pour submit
    final protected function routeSubmit():SpecificMultiSubmit
    {
        return SpecificMultiSubmit::make($this->segments());
    }


    // selectedUri
    // retourne les uri sélectionnés pour la route
    final public function selectedUri():array
    {
        $return = [];
        $table = $this->table();
        $root = static::session()->routeTableGeneral($table);
        $uri = $root->uri();
        $return[$uri] = true;

        return $return;
    }


    // makeTitle
    // génère le titre pour la route
    final protected function makeTitle(?string $lang=null):string
    {
        $return = '';
        $table = $this->table();
        $ids = $this->rows()->pair('primary');

        $return = $table->label(null,$lang);
        $return .= ' #';
        $return .= implode(', ',$ids);

        return $return;
    }


    // makeNav
    // génère la nav pour la page, en haut à droite
    final protected function makeNav():string
    {
        $r = '';
        $table = $this->table();

        if($table->hasPermission('nav','navBack'))
        {
            $general = $this->general()->changeSegment('highlight',$this->rows());
            $r .= Html::div($general->a(static::langText('specific/back')),'nav');
        }

        return $r;
    }


    // makeFormHidden
    // génère les input hiddens du formulaire
    final protected function makeFormHidden():string
    {
        $return = $this->makeFormHiddenTablePanel();
        $return .= Html::hidden($this->rows(),'-primaries-',['multi'=>true]);

        return $return;
    }


    // makeFormSubmit
    // génère le submit pour le formulaire d'ajout
    final protected function makeFormSubmit(string $type):string
    {
        $return = null;
        $text = 'specific/modify'.ucfirst($type);
        $return = Html::submit(static::langText($text),['with-icon','modify']);

        return $return;
    }


    // makeFormOneReplace
    // permet de changer le tableau de remplacement pour un élément du formulaire
    protected function makeFormOneReplace(Core\Col $col,array $return):array
    {
        $label = static::langText('specific/activateField');
        $disabler = Html::checkbox([0=>$label]);
        $return['disabler'] = $disabler;

        return $return;
    }


    // makeFormOneAttr
    // retourne les attributs pour la balise parent form-element
    protected function makeFormOneAttr(Core\Col $col):array
    {
        $return = $col->getFormElementAttr();
        $return['data-disabled'] = true;

        return $return;
    }


    // makeFormWrap
    // génère un wrap label -> field pour le formulaire
    final protected function makeFormWrap(Core\Col $col,array $replace):string
    {
    return $col->formComplexWrap($this->getFormWrap(),'%:',true,null,$replace);
    }
}

// init
SpecificMulti::__init();
?>