<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;
use Quid\Lemur;

// uerWelcome
// class for the user welcome route which can send a welcome email to the user
class UserWelcome extends Core\RouteAlias
{
    // trait
    use _common;
    use Lemur\Route\_specificPrimary;
    use Lemur\Route\_formSubmit;
    use Lemur\Segment\_primary;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'user/[primary]/welcome-email',
            'fr'=>'utilisateur/[primary]/courriel-bienvenue'],
        'segment'=>[
            'primary'=>'structureSegmentPrimary'],
        'row'=>Core\Row\User::class,
        'match'=>[
            'method'=>'post',
            'csrf'=>true,
            'post'=>['id'=>['='=>'[primary]'],'-table-'=>['='=>'[table]']],
            'genuine'=>true,
            'session'=>'canAccess'],
        'group'=>'submit'
    ];


    // canTrigger
    // vérifie que le user peut bien recevoir un courriel de bienvenue
    final public function canTrigger():bool
    {
        $return = false;
        $row = $this->row();
        $table = $row->table();

        if(parent::canTrigger() && $this->hasPermission('userWelcome') && $table->hasPermission('view','update'))
        $return = ($row->allowWelcomeEmail() && $row !== static::session()->user());

        return $return;
    }


    // onSuccess
    // communication lors du succès
    final protected function onSuccess()
    {
        static::sessionCom()->pos('user/welcome/success');
    }


    // onFailure
    // communication lors d'un échec
    final protected function onFailure()
    {
        static::sessionCom()->neg('user/welcome/failure');
    }


    // routeSuccess
    // retourne la route à rediriger en cas de succès ou échec de l'opération
    final public function routeSuccess():Core\Route
    {
        return $this->row()->route();
    }


    // proceed
    // procède à envoyer le courriel
    final public function proceed():bool
    {
        $return = false;
        $row = $this->row();
        $replace = $this->emailReplace();
        $option = $this->emailOption();
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        $return = $row->sendWelcomeEmail(true,$replace,$option);

        return $this->proceedAfter($return);
    }


    // emailReplace
    // replace pour l'envoie de courriel
    final protected function emailReplace():?array
    {
        return null;
    }


    // emailOption
    // option pour l'envoie de courriel
    final protected function emailOption():?array
    {
        return ['com'=>true];
    }
}

// init
UserWelcome::__init();
?>