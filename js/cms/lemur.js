/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// lemur
// script of common behaviours for all pages of the CMS

// ready
$(document).ready(function() {
	
    // alias
    var d = console.log;
    var dd = console.dir;
    var debug = Quid.Event.debug;
    var assert = console.assert;
    var setFunc = Quid.Event.setFunc;
    var ael = Quid.Event.addEventListener;
    var aelOnce = Quid.Event.addEventListenerOnce;
    var triggerEvent = Quid.Event.triggerEvent;
    var triggerFunc = Quid.Event.triggerFunc;
    var triggerCustom = Quid.Event.triggerCustom;
    var triggerSetup = Quid.Event.triggerSetup;
    debug(true);
    
    
    // initial mount
    // comportements bindés une seule fois au tout début
    ael(this,'document:mountInitial', function(event,body) {
        var modal = body.find("> .modal").first();
        
        // modal
        triggerSetup(Quid.Component.modal.call(modal));
    });
    
    
    // document:mountCommon
    // événement appelé pour faire les bindings globaux
    // après le chargement d'une page ou d'un modal
    ael(this,'document:mountCommon', function(event,node) {
        
        /*
        // input
        var input = node.find(Quid.Selector.input());
        Quid.Component.input.call(input);
        
        // select
        var select = node.find("select");
        triggerSetup(Quid.Component.fakeSelect.call(select));
        
        // form
        var form = node.find("form");
        Quid.Component.form.call(form);
        triggerCustom(form,'form:setup');
        
        // autre
        var popupTrigger = node.find(".popup-trigger.with-popup:not(.with-ajax)");
        var popupTriggerAjax = node.find(".popup-trigger.with-popup.with-ajax");
        var anchorCorner = node.find("[data-anchor-corner='1']");
        var absolutePlaceholder = node.find("[data-absolute-placeholder='1']");
        var aConfirm = node.find("a[data-confirm]");
        
		// aConfirm
		Quid.Component.confirm.call(aConfirm,'click');
		
        // popupTrigger
        Quid.Component.clickOpenWithTrigger.call(popupTrigger,".popup-title");
        
        // popupTriggerAjax
        Quid.Component.clickOpenAnchorAjax.call(popupTriggerAjax,".popup-title");
        
        // anchorCorner
        Quid.Component.anchorCorner.call(anchorCorner);
        
        // absolutePlaceholder
        Quid.Component.absolutePlaceholder.call(absolutePlaceholder);
        */
	});
    
    
	// document mount
    // comportements utilisés pour toutes les pages du CMS
	ael(this,'document:mount', function(event,routeWrap) {
		var html = triggerFunc(this,'document:getHtml');
		var burger = routeWrap.find("header .burger-menu, .nav-fixed .nav-close");
		var com = routeWrap.find("main > .inner > .com");
        var subMenu = routeWrap.find(".with-submenu");
        var carousel = routeWrap.find(".with-carousel");
        var mainSearch = routeWrap.find("header .top form");
        
        // carousel
        Quid.Component.carousel.call(carousel);
        
        // subMenu
        Quid.Component.clickOpenWithTrigger.call(subMenu,".trigger");
        setFunc(subMenu,'clickOpen:getBackgroundFrom', function(event) {
            return 'submenu';
        });
        
        // com
		triggerSetup(Quid.Component.com.call(com));
        
        // burger
        triggerSetup(Quid.Component.burger.call(burger));

        // mainSearch
        triggerSetup(Quid.Component.mainSearch.call(mainSearch));
	});
    
    
    // document unmount
    ael(this,'document:unmount', function(event,routeWrap) {
        var burger = routeWrap.find("header .burger-menu, .nav-fixed .nav-close");
        
        // burger
        triggerCustom(burger,'component:teardown');
    });
    
    
    // document ajax progress
    ael(this,'document:ajaxProgress', function(event,percent,progressEvent) {
        var body = $(this).find("body");
        var progress = body.find(".loading-progress");
        var html = (percent >= 0 && percent < 100)? "<div class='percent'>"+percent+"%"+"</div>":"";
        progress.html(html);
    });
    
    
    // login
    // comportement pour la page login
	ael(this,'route:login', function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
	// resetPassword
    // comportement pour la page regénérer mon mot de passe
	ael(this,'route:resetPassword', function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
	// register
    // comportement pour la page enregistrement
	ael(this,'route:register', function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
    // changePassword
    // comportement pour le popup changer mon mot de passe
	ael(this,'modal:accountChangePassword', function(event,modal) {
		var form = modal.find("form");
        triggerCustom(form,'form:focusFirst');
	});
    
    
    // home
    // comportement pour la page d'accueil du CMS une fois connecté
	ael(this,'route:home', function(event,routeWrap) {
		var feed = routeWrap.find("main .home-feed");
        var feedTogglers = feed.find(".block-head .feed-togglers > a");
        var feedBody = feed.find(".block-body");
        Quid.Component.appendContainer.call(feedBody);
        triggerCustom(Quid.Component.appendContainer,'feed:bind');
        
        Quid.Component.ajaxBlock.call(feedTogglers);
        
        setFunc(feedTogglers,'ajaxBlock:getStatusNode', function(event) {
            return feedBody;
        });
        
        ael(feedTogglers,'ajax:before', function(event) {
            feedTogglers.removeClass('selected');
            $(this).addClass('selected');
        })
        
        ael(feedTogglers,'ajax:success', function(event,data,textStatus,jqXHR) {
            triggerCustom(feedBody,'feed:overwrite',data);
        })
        
        ael(feedTogglers,'ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
            feedBody.html(parsedError);
        });
	});
    
    
    // general
    // comportement pour la page de navigation
	ael(this,'route:general', function(event,routeWrap) {
		
        var main = routeWrap.find("main");
        var scroller = main.find(".scroller");
		var search = main.find(".left > .search");
        var formTruncate = main.find(".truncate form");
		var pageLimit = main.find("input[name='limit'],input[name='page']");
        var table = scroller.find("table").first();
        var filter = table.find("th.filterable .filter-outer");
		var colsSorter = table.find("th.action");
		var filesSlider = table.find("td[data-group='media'] .slider");
        var quickEdit = table.find("td[data-quick-edit='1'] a.quick-edit");
        var highlight = table.find("tr.highlight");
        
        // dragScroll
        triggerSetup(Quid.Component.scrollDrag.call(scroller,{selector: 'tbody',targetTag: 'div'}));
        
        // page + limit
        Quid.Component.inputNumeric.call(pageLimit.get());
        
        // rowsChecker
        triggerSetup(Quid.Component.rowsChecker.call(main));
        
		// colsSorter
        Quid.Component.colsSorter.call(colsSorter);
		triggerCustom(colsSorter,'component:setup');
        
        // filter
		triggerSetup(Quid.Component.filter.call(filter));
        
		// search
		if(search.length)
		{
			var searchInput = search.find(".form input[type='text']");
			var searchSlide = search.find(".in");
			triggerSetup(Quid.Component.inputSearch.call(searchInput));
            Quid.Component.focusSlide.call(searchInput,searchSlide);
		}
		
		// formTruncate
		if(formTruncate.length)
		{
            Quid.Component.block.call(formTruncate,'submit');
            Quid.Component.confirm.call(formTruncate,'submit');
			
            ael(formTruncate,'confirmed', function() {
				triggerCustom(this,'block');
			});
		}
        
        // filesSlider
        Quid.Component.slider.call(filesSlider,null,null,'.slider-element',false);
        
        // quickEdit
        triggerSetup(Quid.Component.quickEdit.call(quickEdit));
        
        // highlight 
        ael(highlight,'mouseover', function(event) {
            $(this).removeClass('highlight');
        });
	});
    
    
    // unmount
    ael(this,'route:general:unmount', function(event,routeWrap) {
        var table = routeWrap.find("main .scroller table").first();
        var quickEdit = table.find("td[data-quick-edit='1'] a.quick-edit");
        
        // quickEdit
        triggerCustom(quickEdit,'quickEdit:revert');
    });
    
    
    // specificForm mount
    // permet de faire tous les bindings des champs (simples et complexes)
    ael(this,'specificForm:mount', function(event,node) {
        triggerCustom(this,'specificForm:bindMount',node);
        triggerCustom(this,'specificForm:bindView',node);
    });
    
    
    // bindView
    // permet de faire les bindings de champs
    // ces champs seront bindés à l'initialisation du panneau, lorsqu'ils sont visibles
    ael(this,'specificForm:bindView', function(event,node) {
        var date = node.find("[data-group='date'] .specific-component");
        var enumSet = node.find("[data-tag='search'] .specific-component");
        var checkboxSortable = node.find("[data-group='relation'][data-sortable='1'] .specific-component");
        var files = node.find("[data-group='media'] .specific-component");
        var addRemove = node.find("[data-tag='add-remove'] .specific-component");
        var textarea = node.find("[data-tag='textarea'] .specific-component");
        var anchorCorner = node.find("[data-anchor-corner]");
        
        // date
        triggerSetup(Quid.Component.calendarInput.call(date));
        
        // enumSet
        Quid.Component.enumSet.call(enumSet);
        
        // checkboxSortable
        Quid.Component.verticalSorter.call(checkboxSortable,".choice",'.choice-in');
        
        // files
        triggerSetup(Quid.Component.inputFiles.call(files));
        
        // addRemove
        triggerSetup(Quid.Component.addRemove.call(addRemove));
        
        // textarea
        triggerSetup(Quid.Component.textareaExtra.call(textarea));
        
        // anchorCorner
        triggerCustom(anchorCorner,'anchorCorner:refresh');
    });
    
    
    // specificForm unmount
    // permet démonter les champs du formulaire
    ael(this,'specificForm:unmount', function(event,node) {
        var textarea = node.find("[data-tag='textarea'] .specific-component");
        triggerCustom(textarea,'component:teardown');
    });
    
    
	// specific
    // comportement communs pour les pages spécifiques
	ael(this,'group:specific', function(event,routeWrap) {
        var form = routeWrap.find("main .inner > form.specific-form");
        var panel = form.find("> .form-inner > .panel");
        var submitConfirm = form.find("button[type='submit'][data-confirm]");
        
		// submitConfirm
        Quid.Component.confirm.call(submitConfirm,'click');
		
        // champs simples
        triggerCustom(this,'specificForm:bindMount',form);
        
        // avec panel
        if(panel.length > 1)
        Quid.Component.specificPanel.call(form);
        
        else
        triggerCustom(this,'specificForm:bindView',form);
	});
	
    
    // unmount
    // comportements communs pour démonter la page spécifique
    ael(this,'group:specific:unmount', function(event,routeWrap) {
        var form = routeWrap.find("main .inner > form.specific-form");
        triggerCustom(this,'specificForm:unmount',form);
    });
    
    
    // specificMulti
    // comportement pour la page de modification multiple
	ael(this,'route:specificMulti', function(event) {
        var form = $(this).find("main .inner > form.specific-form");
        var formElement = form.find(".form-element");
        
        setFunc(formElement,'specificMulti:isActive', function(event) {
            return triggerFunc(this,'specificMulti:getCheckbox').is(':checked');
        });
        
        setFunc(formElement,'specificMulti:getCheckbox',function(event) {
            return $(this).find(".disabler input[type='checkbox']");
        });
        
        setFunc(formElement,'specificMulti:getInputs', function(event) {
            return $(this).find("> .right").find(Quid.Selector.input());
        });
        
        ael(formElement,'specificMulti:refresh', function(event) {
            var isActive = triggerFunc(this,'specificMulti:isActive');
            var inputs = triggerFunc(this,'specificMulti:getInputs');
            $(this).attr('data-disabled',(isActive === true)? 0:1);
            triggerCustom(inputs,(isActive === true)? 'input:enable':'input:disable');
        });
        
        aelOnce(formElement,'specificMulti:setup', function(event) {
            var $this = $(this);
            var checkbox = triggerFunc(this,'specificMulti:getCheckbox');
            
            ael(checkbox,'change', function(event) {
                triggerCustom($this,'specificMulti:refresh');
            });
            
            triggerCustom(this,'specificMulti:refresh');
        });
        
        triggerCustom(formElement,'specificMulti:setup');
        
        triggerCustom(form,'form:prepare');
	});
    
    
    // nobodyCommon
    var nobodyCommon = function() {
        var browscap = $(this).find("main .browscap");
		var form = $(this).find("main form");
        
		triggerCustom(form,'form:focusFirst');
		
		if(!Quid.Browser.allowsCookie())
		browscap.find(".cookie-disabled").show();
        
        if(Quid.Browser.isUnsupported())
		browscap.find(".unsupported-browser").show();
    };
});