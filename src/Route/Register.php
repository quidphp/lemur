<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
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
    // trait
    use Lemur\Route\_nobody;


    // config
    public static $config = [
        'path'=>[
            'fr'=>'enregistrement',
            'en'=>'register'],
        'match'=>[
            'role'=>'nobody',
            'session'=>'allowRegister'],
        'parent'=>Login::class,
        'row'=>Lemur\Row\User::class,
        'group'=>'nobody',
    ];


    // submitClass
    // classe de la route pour soumettre le formulaire
    abstract public static function submitClass():string;


    // canTrigger
    // retourne vrai si la route peut être lancé
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && static::session()->roles(false)->isNobody() && static::session()->allowRegister())? true:false;
    }


    // submitRoute
    // route pour soumettre le formulaire
    final public function submitRoute():RegisterSubmit
    {
        return static::submitClass()::make();
    }


    // submitAttr
    // attribut pour le bouton submit
    public function submitAttr()
    {
        return;
    }


    // flash
    // retourne les données flash pour le formulaire
    final protected function flash():?array
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

        foreach ($fields as $value)
        {
            $v = $flash[$value] ?? null;
            $col = $table->col($value);
            $class = ($col->isRequired())? 'required':null;
            $r .= $col->formWrap('divtableClass','%:',$v,null,['class'=>$class]);
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
        $replace = ['class'=>'required'];

        $r .= $col->formWrap('divtableClass','%:',null,['data-required'=>true],$replace);
        $r .= $col->formWrap('divtableClass',$label.':',null,['data-required'=>true,'name'=>$fields['passwordConfirm']],$replace);

        return $r;
    }


    // makeFormOther
    // génère la troisième partie du formulaire d'enregistrement
    final protected function makeFormOther():string
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