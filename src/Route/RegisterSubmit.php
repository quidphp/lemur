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
use Quid\Base;
use Quid\Core;
use Quid\Lemur;

// registerSubmit
// abstract class for a register submit route
abstract class RegisterSubmit extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_formSubmit;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'register/submit',
            'fr'=>'enregistrement/soumettre'],
        'match'=>[
            'method'=>'post',
            'role'=>'nobody',
            'session'=>'canAccess',
            'post'=>['username','email','password','passwordConfirm'],
            'timeout'=>true,
            'csrf'=>true,
            'genuine'=>true],
        'timeout'=>[
            'failure'=>['max'=>12,'timeout'=>600],
            'success'=>['max'=>3,'timeout'=>600]],
        'parent'=>Register::class,
        'dataDefault'=>['active'=>null],
        'baseFields'=>['username','email'],
        'passwordFields'=>[
            'password'=>'password',
            'passwordConfirm'=>'passwordConfirm'],
        'otherFields'=>null,
        'group'=>'submit',
        'flashPost'=>true,
        'log'=>null,
        'form'=>[
            'attr'=>[
                'data-unload'=>true]]
    ];


    // canTrigger
    // retourne vrai si la route peut être lancé
    public function canTrigger():bool
    {
        return parent::canTrigger() && static::session()->roles(false)->isNobody() && static::session()->user()->allowRegister();
    }


    // onSuccess
    // traite le succès
    final protected function onSuccess():void
    {
        static::sessionCom()->stripFloor();
        static::timeoutIncrement('success');
    }


    // onFailure
    // increment le timeout et appele onFailure
    final protected function onFailure():void
    {
        static::sessionCom()->stripFloor();
        static::timeoutIncrement('failure');
    }


    // routeSuccess
    // méthode abstraite, retourne l'objet route en cas de succès
    final protected function routeSuccess():Lemur\Route
    {
        return Login::make();
    }


    // routeFailure
    // retourne l'objet route pour la redirection en cas d'erreur
    final protected function routeFailure():Lemur\Route
    {
        return static::makeParent();
    }


    // post
    // retourne le tableau post pour l'enregistrement
    public function post():array
    {
        $return = [];
        $request = $this->request();
        $post = $request->post(true,true);
        $password = $this->getPasswordFields();
        $default = $this->getDataDefault($post);
        $passwordConfirm = $password['passwordConfirm'];
        $keep = $this->getBaseFields();
        $keep = Base\Arr::merge($keep,$this->getOtherFields());
        $keep[] = $password['password'];

        $return['data'] = Base\Arr::gets($keep,$post);
        $return['data'] = Base\Arr::replace($return['data'],$default);
        $return['passwordConfirm'] = $post[$passwordConfirm];

        return $return;
    }


    // proceed
    // lance le processus pour register
    // retourne null ou un objet user
    final protected function proceed():?Lemur\Row\User
    {
        $return = null;
        $session = static::session();
        $class = $session->getUserClass();
        $option = $this->getOption();
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        $return = $class::registerProcess($post['data'],$post['passwordConfirm'],$option);

        if(empty($return))
        $this->failureComplete();

        else
        $this->successComplete();

        return $return;
    }


    // getOption
    // option pour le reset password
    final protected function getOption():?array
    {
        return ['com'=>true];
    }


    // getDataDefault
    // retourne les valeurs data par défaut, écrase ce qu'il y a dans post
    // possible de lier une callable à une clé
    final public function getDataDefault(array $data):array
    {
        $return = $this->getAttr('dataDefault') ?? [];

        foreach ($return as $key => $value)
        {
            if(is_array($value) && static::isCallable($value))
            $return[$key] = $value($data);
        }

        return $return;
    }


    // getBaseFields
    // retourne les champs de base
    final public function getBaseFields():array
    {
        return $this->getAttr('baseFields') ?? [];
    }


    // getPasswordFields
    // retourne les champs de mot de passe
    final public function getPasswordFields():array
    {
        return $this->getAttr('passwordFields') ?? [];
    }


    // getOtherFields
    // retourne les champs autres
    final public function getOtherFields():array
    {
        return $this->getAttr('otherFields') ?? [];
    }


    // getBaseAndOtherFields
    // retourne les champs de base et autres
    final public function getBaseAndOtherFields():array
    {
        return Base\Arr::merge($this->getBaseFields(),$this->getOtherFields());
    }
}

// init
RegisterSubmit::__init();
?>