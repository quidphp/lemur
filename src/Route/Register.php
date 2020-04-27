<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
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
            'role'=>'nobody',
            'session'=>'allowRegister'],
        'parent'=>Login::class,
        'row'=>Lemur\Row\User::class,
        'group'=>'nobody',
        'formWrap'=>"<div class='table %class%'><div class='table-row'><div class='table-cell label-cell'>%label%</div><div class='table-cell form-cell'>%form%</div></div></div>"
    ];


    // canTrigger
    // retourne vrai si la route peut être lancé
    public function canTrigger():bool
    {
        return parent::canTrigger() && static::session()->roles(false)->isNobody() && static::session()->allowRegister();
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

        $r .= Html::divOp('top');

        $r .= Html::divCond($this->makeFormBase(),['base','part']);
        $r .= Html::divCond($this->makeFormPassword(),['passwords','part']);
        $r .= Html::divCond($this->makeFormOther(),['other','part']);

        $r .= Html::divClose();

        $r .= Html::divOp('bottom');
        $r .= Html::submit(static::label(),$this->submitAttr());
        $r .= Html::divClose();

        $r .= Html::formClose();

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

        foreach ($fields as $value)
        {
            $col = $table->col($value);
            $v = $flash[$value] ?? $col->default();
            $class = ($col->isRequired())? 'required':'not-required';
            $description = Html::divCond($col->description(),'description');
            $method = ($col->isRelation())? 'formComplexWrap':'formWrap';
            $r .= $col->$method($formWrap,'%:',$v,null,['class'=>$class,'description'=>$description]);
        }

        return $r;
    }


    // makeFormPassword
    // génère la deuxième partie du formulaire d'enregistrement pour les mots de passes
    final protected function makeFormPassword():string
    {
        $r = '';
        $fields = $this->getPasswordFields();
        $table = static::tableFromRowClass();
        $col = $table->col($fields['password']);
        $label = static::langText('register/confirmPassword');
        $replace = ['class'=>'required','description'=>null];
        $formWrap = $this->getFormWrap();

        $r .= $col->formWrap($formWrap,'%:',null,['data-required'=>true],$replace);
        $r .= $col->formWrap($formWrap,$label.':',null,['data-required'=>true,'name'=>$fields['passwordConfirm']],$replace);

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