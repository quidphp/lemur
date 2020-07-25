<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Core;
use Quid\Lemur;

// contactSubmit
// abstract class for a contact submit route
abstract class ContactSubmit extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_formSubmit;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'contact-us/submit',
            'fr'=>'nous-joindre/soumettre'],
        'match'=>[
            'method'=>'post',
            'post'=>['name','phone','email','message'],
            'csrf'=>true,
            'genuine'=>true,
            'timeout'=>true],
        'timeout'=>[
            'failure'=>['max'=>8,'timeout'=>600],
            'success'=>['max'=>2,'timeout'=>600]],
        'parent'=>Contact::class,
        'group'=>'submit',
        'row'=>Lemur\Row\Contact::class,
        'flashPost'=>true
    ];


    // canTrigger
    // retourne vrai si la route peut trigger
    public function canTrigger():bool
    {
        $row = static::rowClass();
        return !empty($row) && parent::canTrigger() && static::db()->hasTable($row) && $row::hasEmailModelStatic('contactAdmin');
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
    // retourne la route vers laquelle redirigé, home par défaut
    public function routeSuccess()
    {
        return static::makeParent();
    }


    // post
    // retourne les données post pour le formulaire de contact
    protected function post():array
    {
        $return = [];
        $request = $this->request();

        foreach ($this->getFields() as $value)
        {
            if(is_string($value))
            $return[$value] = (string) $request->get($value);
        }

        return $return;
    }


    // proceed
    // lance le processus pour le contact
    final protected function proceed():?Lemur\Row
    {
        $return = null;
        $session = static::session();
        $table = static::tableFromRowClass();
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        $return = $table->insert($post,['com'=>true]);

        return $this->proceedAfter($return);
    }


    // getFields
    // retourne les champs pour le formulaire
    final public function getFields():array
    {
        return $this->getAttr(['match','post']) ?? [];
    }
}

// init
ContactSubmit::__init();
?>