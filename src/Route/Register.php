<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// register
// abstract class for a register route
abstract class Register extends Core\RouteAlias
{
    // config
    protected static array $config = [
        'path'=>[
            'en'=>'register',
            'fr'=>'enregistrement'],
        'match'=>[
            'role'=>'nobody'],
        'parent'=>Login::class,
        'row'=>Lemur\Row\User::class,
        'group'=>'nobody',
        'passwordDescription'=>false,
        'formWrap'=>"<div class='table %class%'><div class='table-row'><div class='table-cell label-cell'>%label%</div><div class='table-cell form-cell'>%form%</div></div></div>",
        'formPattern'=>'%:'
    ];


    // canTrigger
    // retourne vrai si la route peut être lancé
    public function canTrigger():bool
    {
        return parent::canTrigger() && static::session()->roles(false)->isNobody() && static::session()->user()->allowRegister();
    }


    // submitRoute
    // route pour soumettre le formulaire
    public function submitRoute():RegisterSubmit
    {
        return RegisterSubmit::make();
    }


    // submitAttr
    // attribut pour le bouton submit
    public function submitAttr()
    {
        return;
    }


    // getFormWrap
    // retourne la string formWrap
    final public function getFormWrap():string
    {
        return $this->getAttr('formWrap');
    }


    // getFormPattern
    // retourne la string formPattern
    final public function getFormPattern():string
    {
        return $this->getAttr('formPattern');
    }


    // withPasswordDescription
    // retourne vrai s'il faut afficher la description du mot de passe
    final public function withPasswordDescription():bool
    {
        return $this->getAttr('passwordDescription');
    }


    // flash
    // retourne les données flash pour le formulaire
    protected function flash():?array
    {
        return $this->cache(__METHOD__,function() {
            $return = null;
            $session = static::session();
            $flash = $session->flash();
            $route = $this->submitRoute();
            $class = $route->classFqcn();
            $return = $flash->get($class);

            return $return;
        });
    }


    // makeForm
    // génère le form de resetPassword
    final protected function makeForm():string
    {
        $r = '';
        $route = $this->submitRoute();
        $r .= $route->formOpen();
        $submit = Html::submit(static::label(),$this->submitAttr());

        $html = Html::divCond($this->makeFormBase(),['base','part']);
        $html .= Html::divCond($this->makeFormPassword(),['passwords','part']);
        $html .= Html::divCond($this->makeFormOther(),['other','part']);

        $r .= Html::div($html,'top');
        $r .= Html::div($submit,'bottom');
        $r .= Html::formCl();

        return $r;
    }


    // makeFormBase
    // génère la première partie du formulaire d'enregistrement
    final protected function makeFormBase():string
    {
        $r = '';
        $table = static::tableFromRowClass();
        $fields = $this->getBaseFields();
        $flash = $this->flash();
        $formWrap = $this->getFormWrap();
        $pattern = $this->getFormPattern();

        foreach ($fields as $value)
        {
            $col = $table->col($value);
            $name = $col->name();
            $v = $flash[$value] ?? $col->default();
            $class = ($col->isRequired())? 'required':'not-required';
            $description = Html::divCond($col->description(),'description');
            $method = ($col->isRelation())? 'formComplexWrap':'formWrap';
            $r .= $col->$method($formWrap,$pattern,$v,null,['class'=>$class,'name'=>$name,'description'=>$description]);
        }

        return $r;
    }


    // makeFormPassword
    // génère la deuxième partie du formulaire d'enregistrement pour les mots de passes
    // possibilité de mettre la description pour le mot de passe via l'attribut passwordDescription
    protected function makeFormPassword():string
    {
        $r = '';
        $fields = $this->getPasswordFields();
        $table = static::tableFromRowClass();
        $lang = static::lang();
        $col = $table->col($fields['password']);
        $label = $lang->text('register/confirmPassword');

        $description = Html::divCond($col->description(),'description');
        $replaceConfirm = ['class'=>'required','description'=>null];
        $replace = $replaceConfirm;
        if($this->withPasswordDescription())
        $replace['description'] = $description;

        $formWrap = $this->getFormWrap();
        $pattern = $this->getFormPattern();

        $r .= $col->formWrap($formWrap,$pattern,null,['data-required'=>true],$replace);
        $r .= $col->formWrap($formWrap,$label.':',null,['data-required'=>true,'name'=>$fields['passwordConfirm']],$replaceConfirm);

        return $r;
    }


    // makeFormOther
    // génère la troisième partie du formulaire d'enregistrement
    protected function makeFormOther():string
    {
        return '';
    }


    // getBaseFields
    // retourne les champs de base
    final public function getBaseFields():array
    {
        return $this->submitRoute()->getBaseFields();
    }


    // getPasswordFields
    // retourne les champs de mot de passe
    final public function getPasswordFields():array
    {
        return $this->submitRoute()->getPasswordFields();
    }
}

// init
Register::__init();
?>