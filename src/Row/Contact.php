<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Row;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Main;

// contact
// class to work with a row of the contact table, stores contact messages
class Contact extends Core\RowAlias
{
    // trait
    use Core\Row\_emailModel;


    // config
    protected static array $config = [
        'parent'=>'system',
        'priority'=>953,
        'cols'=>[
            'context'=>['class'=>Core\Col\Context::class],
            'name'=>['required'=>true],
            'phone'=>['required'=>true,'general'=>true],
            'email'=>['required'=>true],
            'message'=>['required'=>true,'validate'=>['strLatin']]],
        'colsForm'=>['name','phone','email','message'],
        'emailModel'=>[ // custom modèle de courriel
            'contactAdmin'=>'contactAdmin',
            'contactConfirm'=>'contactConfirm'],
        'fields'=>['name','phone','email','message'], // colonnes à afficher pour le formulaire
        'permission'=>[
            '*'=>['insert'=>true]],
        '@cms'=>[
            'permission'=>[
                '*'=>['lemurInsert'=>false],
                'contributor'=>['view'=>false],
                'editor'=>['view'=>false],
                'admin'=>['truncate'=>true,'lemurTruncate'=>true]]]
    ];


    // email
    // retourne la cellule du email
    final public function email(...$args)
    {
        return $this->cell('email')->pair(...$args);
    }


    // toEmail
    // retourne email=>name lors de l'envoie dans un email
    final public function toEmail():array
    {
        $email = $this->email()->value();
        $name = $this->cellName()->value();

        if(empty($email) || empty($name))
        static::throw();

        return [$email=>$name];
    }


    // onInserted
    // lors de l'insertion d'un nouveau contact, envoie le email
    final protected function onInserted(array $option)
    {
        $this->sendEmails(true,$option);

        return;
    }


    // getEmailReplace
    // retourne le tableau de remplacement pour les courriels
    protected function getEmailReplace():array
    {
        $return = [];
        $boot = static::boot();
        $option = ['context'=>'noHtml'];
        $cells = $this->cells()->gets(...static::getColsForm());
        $model = '%label%: %get%';

        $return['contactUserName'] = $this->email()->value();
        $return['link'] = $this->route('cms')->uriAbsolute();
        $return['data'] = implode(PHP_EOL,$cells->htmlStr($model,false,$option));

        return $return;
    }


    // contactConfirmEmail
    // retourne un tableau avec tout ce qu'il faut pour envoyer le courriel pour confirmer le formulaire de contact
    final protected function contactConfirmEmail($type=true,?array $replace=null):array
    {
        return $this->getEmailArray('contactConfirm',$type,$this->prepareEmailReplace($this->contactConfirmEmailReplace(),$replace));
    }


    // contactConfirmEmailReplace
    // retourne les valeurs de remplacement pour le courriel de confirmation du formulaire de contact
    protected function contactConfirmEmailReplace():array
    {
        return [];
    }


    // contactAdminEmail
    // retourne un tableau avec tout ce qu'il faut pour envoyer le courriel pour notifier le contact à l'administrateur
    final protected function contactAdminEmail($type=true,?array $replace=null):array
    {
        return $this->getEmailArray('contactAdmin',$type,$this->prepareEmailReplace($this->contactAdminEmailReplace(),$replace));
    }


    // contactAdminEmailReplace
    // retourne les valeurs de remplacement pour le courriel pour notifier le contact à l'administrateur
    protected function contactAdminEmailReplace():array
    {
        return [];
    }


    // sendContactConfirmEmail
    // envoie le courriel de confirmation du contact
    final public function sendContactConfirmEmail($type=true,?array $replace=null,?array $option=null):bool
    {
        return $this->sendEmail($this->contactConfirmEmail($type,$replace),$this,$option);
    }


    // sendContactAdminEmail
    // envoie le courriel de confirmation de contact à l'administrateur
    final public function sendContactAdminEmail($type=true,?array $replace=null,?array $option=null):bool
    {
        return $this->sendEmail($this->contactAdminEmail($type,$replace),static::getAdminEmail(),$option);
    }


    // sendEmail
    // envoie les courriels de confirmation au visiteur et à l'administrateur
    final protected function sendEmails($type=true,?array $option=null):array
    {
        $return = [];

        if($this->hasEmailModel('contactConfirm',$type))
        $return[] = $this->sendContactConfirmEmail();

        if($this->hasEmailModel('contactAdmin',$type))
        $return[] = $this->sendContactAdminEmail();

        return $return;
    }


    // makeForm
    // génère le formulaire de contact
    final public static function makeForm(string $formWrap,$pattern=null,?array $flash=null,?array $attr=null,?array $cols=null):string
    {
        $r = '';
        $table = static::tableFromFqcn();
        $cols = (empty($cols))? static::getColsForm():$cols;

        foreach ($table->cols(...$cols) as $col)
        {
            $name = $col->name();
            $value = (is_array($flash) && array_key_exists($name,$flash))? $flash[$name]:null;

            $r .= Html::divOp(['field','data-field'=>$col]);
            $r .= $col->formWrap($formWrap,$pattern,$value,$attr);
            $r .= Html::divCl();
        }

        return $r;
    }


    // getCols
    // retourne les colonnes à mettre dans le formulaire
    final protected static function getColsForm():array
    {
        return static::$config['colsForm'];
    }
}

// init
Contact::__init();
?>