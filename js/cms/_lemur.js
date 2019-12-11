/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// lemur
// script of common behaviours for all pages of the CMS

// ready
ael(document,"DOMContentLoaded", function()
{    
    // initial mount
    // comportements bindés une seule fois au tout début
    ael(this,'doc:mountInitial',function(event,body) {
        const background = qs(body,"> .background");
        const modal = qs(body,"> .modal");
        
        trigSetup(Component.Background.call(background));
        trigSetup(Component.Modal.call(modal));
    });
    
    
    // doc:mountCommon
    // événement appelé pour faire les bindings globaux
    // après le chargement d'une page ou d'un modal
    ael(this,'doc:mountCommon',function(event,node) {
        
        // input
        const input = qsa(node,Selector.input());
        Component.Input.call(input);

        // form
        const form = qsa(node,"form");
        trigEvt(Component.Form.call(form),'component:setup');
        
        // select
        const select = qsa(node,"select");
        trigSetup(Component.FakeSelect.call(select));
        
        // autre
        const anchorCorner = qsa(node,"[data-anchor-corner='1']");
        const absolutePlaceholder = qsa(node,"[data-absolute-placeholder='1']");
        const aConfirm = qsa(node,"a[data-confirm]");
        const popupTrigger = qsa(node,".popup-trigger.with-popup:not(.with-ajax)");
        const popupTriggerAjax = qsa(node,".popup-trigger.with-popup.with-ajax");
        
        // anchorCorner
        trigSetup(Component.AnchorCorner.call(anchorCorner));
        
        // absolutePlaceholder
        trigSetup(Component.AbsolutePlaceholder.call(absolutePlaceholder));
        
        // aConfirm
		Component.Confirm.call(aConfirm,'click');
        
        // popupTrigger
        trigSetup(Component.ClickOpenTrigger.call(popupTrigger,{trigger: ".popup-title", target: ".popup"}));
        
        // popupTriggerAjax
        trigSetup(Component.ClickOpenAjaxAnchor.call(popupTriggerAjax,{trigger: ".popup-title", target: ".popup"}));
	});
    
    
    // doc:unmountCommon
    // événement appelé pour enlever des bindings globaux
    ael(this,'doc:unmountCommon',function(event,node) {
        
        const anchorCorner = qsa(node,"[data-anchor-corner]");
        const absolutePlaceholder = qsa(node,"[data-absolute-placeholder]");
        
        trigTeardown(anchorCorner);
        trigTeardown(absolutePlaceholder);
    });
    
    
	// document mount
    // comportements utilisés pour toutes les pages du CMS
	ael(this,'doc:mount',function(event,routeWrap) {
		const burger = qsa(routeWrap,"header .burger-menu, .nav-fixed .nav-close");
		const com = qs(routeWrap,"main > .inner > .com");
        const subMenu = qsa(routeWrap,".with-submenu");
        const carousel = qsa(routeWrap,".with-carousel");
        const mainSearch = qs(routeWrap,"header .top form");
        
        // burger
        trigSetup(Component.Burger.call(burger));
        
        // com
		trigSetup(Component.Com.call(com));
        
        // carousel
        trigSetup(Component.Carousel.call(carousel,{trigger: ".trigger", target: ".target"}));
        
        // subMenu
        trigSetup(Component.ClickOpenTrigger.call(subMenu,{trigger: ".trigger", target: ".popup"}));
        setHandler(subMenu,'clickOpen:getBackgroundFrom',function(event) {
            return 'submenu';
        });
        
        // mainSearch
        trigSetup(Component.SearchAutoInfo.call(mainSearch,{target: ".popup"}));
	});
    
    
    // document unmount
    ael(this,'doc:unmount',function(event,routeWrap) {
        const burger = qsa(routeWrap,"header .burger-menu, .nav-fixed .nav-close");
        
        // burger
        trigEvt(burger,'component:teardown');
    });
    
    
    // document ajax progress
    ael(this,'doc:ajaxProgress',function(event,percent,progressEvent) {
        /*
        const body = qs(this,"body");
        const progress = qs(body,".loading-progress");
        const html = (percent >= 0 && percent < 100)? "<div class='percent'>"+percent+"%"+"</div>":"";
        progress.html(html);
        */
    });
    
    
    // login
    // comportement pour la page login
	ael(this,'route:login',function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
	// resetPassword
    // comportement pour la page regénérer mon mot de passe
	ael(this,'route:resetPassword',function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
	// register
    // comportement pour la page enregistrement
	ael(this,'route:register',function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
    // changePassword
    // comportement pour le popup changer mon mot de passe
	ael(this,'modal:accountChangePassword',function(event,modal) {
		const form = qs(modal,"form");
        trigHandler(form,'form:focusFirst');
	});
    
    
    // home
    // comportement pour la page d'accueil du CMS une fois connecté
	ael(this,'route:home',function(event,routeWrap) {
        
        const feed = qs(routeWrap,"main .home-feed");
        const feedTogglers = qsa(feed,".block-head .feed-togglers > a");
        const feedBody = qs(feed,".block-body");
        
        // feedBody
        trigSetup(Component.Feed.call(feedBody));
        
        // feedTogglers
        Component.AjaxBlock.call(feedTogglers,{autoUnbind: true});
        
        setHandler(feedTogglers,'ajaxBlock:getStatusNode',function(event) {
            return feedBody;
        });
        
        ael(feedTogglers,'ajaxBlock:before',function() {
            $(feedTogglers).removeClass('selected');
            trigEvt(feedBody,'ajaxBlock:unmountContent');
            $(this).addClass('selected');
        });
        
        ael(feedTogglers,'ajaxBlock:success',function() {
            trigEvt(feedBody,'feed:bind');
        });
	});
    
    
    // general
    // comportement pour la page de navigation
	ael(this,'route:general',function(event,routeWrap) {
		
        const main = qs(routeWrap,"main");
        const scroller = qs(main,".container .scroller");
		const search = qs(main,".left > .search");
		const pageLimit = qsa(main,"input[name='limit'],input[name='page']");
        const table = qs(scroller,"table");
        const filter = qsa(table,"th.filterable .filter-outer");
		const colsSorter = qs(table,"th.action");
		const filesSlider = qsa(table,"td[data-group='media'] .slider");
        const quickEdit = qsa(table,"td[data-quick-edit='1'] a.quick-edit");
        const highlight = qsa(table,"tr.highlight");
        
        // page + limit
        Component.InputNumericHref.call(pageLimit);
        
        // search
		trigSetup(Component.SearchSlide.call(search,{inputTarget: "> .form input[type='text']", infoTarget: "> .in"}));
        
        // rowsChecker
        trigSetup(Component.RowsChecker.call(main));
        
        // colsSorter
        trigSetup(Component.ColsSorter.call(colsSorter));
        
        // filter
        trigSetup(Component.Filter.call(filter,{trigger: ".trigger", target: ".popup"}));
        
        // quickEdit
        trigSetup(Component.QuickEdit.call(quickEdit));
        
        // highlight 
        ael(highlight,'mouseover',function(event) {
            $(this).removeClass('highlight');
        });
        
        // dragScroll
        trigSetup(Component.ScrollDrag.call(scroller,{selector: 'tbody',targetTag: 'div'}));

        /*                
        // filesSlider
        Component.slider.call(filesSlider,null,null,'.slider-element',false);
        */
	});
    
    
    // unmount
    ael(this,'route:general:unmount',function(event,routeWrap) {
        const table = qs(routeWrap,"main .scroller table");
        const quickEdit = qsa(table,"td[data-quick-edit='1'] a.quick-edit");
        
        // quickEdit
        trigHandlers(quickEdit,'quickEdit:revert');
    });
    
    
    // specificForm mount
    // permet de faire tous les bindings des champs (simples et complexes)
    ael(this,'specificForm:mount',function(event,node) {
        trigEvt(this,'specificForm:bindMount',node);
        trigEvt(this,'specificForm:bindView',node);
    });
    
    
    // bindView
    // permet de faire les bindings de champs
    // ces champs seront bindés à l'initialisation du panneau, lorsqu'ils sont visibles
    ael(this,'specificForm:bindView',function(event,node) {
        /*
        const date = qsa(node,"[data-group='date'] .specific-component");
        const enumSet = qsa(node,"[data-tag='search'] .specific-component");
        const checkboxSortable = qsa(node,"[data-group='relation'][data-sortable='1'] .specific-component");
        const files = qsa(node,"[data-group='media'] .specific-component");
        const addRemove = qsa(node,"[data-tag='add-remove'] .specific-component");
        const textarea = qsa(node,"[data-tag='textarea'] .specific-component");
        const anchorCorner = qsa(node,"[data-anchor-corner]");
        
        // date
        trigSetup(Component.calendarInput.call(date));
        
        // enumSet
        Component.enumSet.call(enumSet);
        
        // checkboxSortable
        Component.verticalSorter.call(checkboxSortable,".choice",'.choice-in');
        
        // files
        trigSetup(Component.inputFiles.call(files));
        
        // addRemove
        trigSetup(Component.addRemove.call(addRemove));
        
        // textarea
        trigSetup(Component.textareaExtra.call(textarea));
        
        // anchorCorner
        trigHandler(anchorCorner,'anchorCorner:refresh');
        */
    });
    
    
    // specificForm unmount
    // permet démonter les champs du formulaire
    ael(this,'specificForm:unmount',function(event,node) {
        /*
        const textarea = qsa(node,"[data-tag='textarea'] .specific-component");
        trigEvt(textarea,'component:teardown');
        */
    });
    
    
	// specific
    // comportement communs pour les pages spécifiques
	ael(this,'group:specific',function(event,routeWrap) {
        /*
        const form = qs(routeWrap,"main .inner > form.specific-form");
        const panel = qsa(form,"> .form-inner > .panel");
        const submitConfirm = qsa(form,"button[type='submit'][data-confirm]");
        
		// submitConfirm
        Component.confirm.call(submitConfirm,'click');
		
        // champs simples
        trigEvt(this,'specificForm:bindMount',form);
        
        // avec panel
        if(panel.length > 1)
        Component.specificPanel.call(form);
        
        else
        trigEvt(this,'specificForm:bindView',form);
        */
	});
	
    
    // unmount
    // comportements communs pour démonter la page spécifique
    ael(this,'group:specific:unmount',function(event,routeWrap) {
        /*
        const form = qs(routeWrap,"main .inner > form.specific-form");
        trigEvt(this,'specificForm:unmount',form);
        */
    });
    
    
    // specificMulti
    // comportement pour la page de modification multiple
	ael(this,'route:specificMulti',function(event) {
        /*
        const form = qs(this,"main .inner > form.specific-form");
        const formElement = qsa(form,".form-element");
        
        setHandler(formElement,'specificMulti:isActive',function(event) {
            const checkbox = trigHandler(this,'specificMulti:getCheckbox');
            return $(checkbox).is(':checked');
        });
        
        setHandler(formElement,'specificMulti:getCheckbox',function(event) {
            return qs(this,".disabler input[type='checkbox']");
        });
        
        setHandler(formElement,'specificMulti:getInputs',function(event) {
            const right = qs(this,"> .right");
            return qsa(right,Selector.input());
        });
        
        ael(formElement,'specificMulti:refresh',function(event) {
            const isActive = trigHandler(this,'specificMulti:isActive');
            const inputs = trigHandler(this,'specificMulti:getInputs');
            $(this).attr('data-disabled',(isActive === true)? 0:1);
            trigEvt(inputs,(isActive === true)? 'input:enable':'input:disable');
        });
        
        aelOnce(formElement,'specificMulti:setup',function(event) {
            const $this = this;
            const checkbox = trigHandler(this,'specificMulti:getCheckbox');
            
            ael(checkbox,'change',function(event) {
                trigEvt($this,'specificMulti:refresh');
            });
            
            trigEvt(this,'specificMulti:refresh');
        });
        
        trigEvt(formElement,'specificMulti:setup');
        
        trigEvt(form,'form:prepare');
        */
	});
    
    
    // nobodyCommon
    const nobodyCommon = function() {
        const browscap = qs(this,"main .browscap");
		const form = qs(this,"main form");
        const cookieDisabled = qs(browscap,".cookie-disabled");
        const unsupportedBrowser = qs(browscap,".unsupported-browser");
        
		trigHandler(form,'form:focusFirst');
		
		if(!Browser.allowsCookie())
		$(cookieDisabled).show();
        
        if(Browser.isUnsupported())
		$(unsupportedBrowser).show();
    };
});