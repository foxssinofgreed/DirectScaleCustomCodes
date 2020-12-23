/*
 ********************IMPORTANT*******************
Please replace follwing Code Snippet with given code as follows:
 1. At the Beginning of Javascript File
  ##Code To Replace:
  -----------------
  dsCoreViews.config(function config(xxx) {
		<----Config Code--->
	})
------------------
	##Replace With:
------------------
	  module.config('config',['xxx',function config(xxx) {
		  <----Config Code--->
	    }
    ])
------------------

*/

(function () {
    module.config('config',['$stateProvider',function config($stateProvider) {
        $stateProvider.state('Application', {    //Rename 'xyz' to Application
            url: '/:WebAlias/Application',   //Rename 'xyz' to Application
            params: {
                WebAlias: { squash: true, value: null }
            },
            views: {
                'main': {
                    templateProvider: ['customPageService', function (customPageService) {
                        return customPageService.getPageTemplate('Application');
                    }]
                }
            },
            resolve: {
                getCompanyDetails: [
                    'companyDetails',
                    function (companyDetails) {
                        return companyDetails.companyDetailsPromise;
                    }
                ],
                getBranding: [
                    'companyDetails',
                    function (companyDetails) {
                        return companyDetails.brandingPromise;
                    }
                ]
            },
            data: {
                pageTitle: 'Application'
            }
        });
    }])
        .directive('customMemberEnrollment', function () {
            return {
                restrict: 'E',
                templateUrl: 'memberenrollment.tpl.html',
                controller: [
                    '$scope',
                    '$RestService',
                    'notificationService',
                    'userService',
                    'utilityService',
                    function (
                        $scope,
                        $RestService,
                        notificationService,
                        userService,
                        utilityService
                    ) {
                        $scope.userService = userService;
                        $scope.YearMonth = function () {
                            $scope.getYear = [];
                            var currentYear = new Date().getFullYear();
                            for (var iCount = 0; iCount < 15; iCount++) {
                                $scope.getYear.push({
                                    year: currentYear + iCount,
                                    value: currentYear + iCount
                                });
                            }
                        };
                        $scope.YearMonth();

                        $scope.validateMonth = function (year) {
                            var today = new Date();
                            var thisYear = today.getYear() + 1900;
                            if (Number(year) !== Number(thisYear)) {
                                $scope.YearMonth();
                            }
                        };
                        var currentYear = new Date().getFullYear();
                        $scope.validateMonth(currentYear);

                        $scope.birthDays = function () {
                            $scope.birthDaysAll = utilityService.birthDays(
                                userService.personalInfo.birthYear,
                                userService.personalInfo.birthMonth
                            );
                            if (
                                $scope.birthDaysAll.indexOf(userService.personalInfo.birthDay) === -1
                            ) {
                                userService.personalInfo.birthDay = '01';
                            }
                        };
                        $scope.birthDays();
                        $scope.BirthYears = utilityService.birthYears();
                        $scope.months = utilityService.birthMonths();

                        $scope.verifyEmail = function (saveDetails) {
                            var filter = new RegExp(
                                '^([\\w-\\.+]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([\\w-]+\\.)+))([a-zA-Z]{2,10}|[0-9]{1,3})(\\]?)$'
                            );
                            if (
                                userService.personalInfo.Email &&
                                filter.test(userService.personalInfo.Email)
                            ) {
                                $scope.EmailCheck = true;
                                var verifyEmailRequest = {
                                    email: userService.personalInfo.Email
                                };
                                $RestService
                                    .VerifyEmail(verifyEmailRequest)
                                    .then(function (result) {
                                        result = result.data;
                                        try {
                                            if (result.Data) {
                                                $scope.EmailCheck = false;
                                                if (saveDetails) {
                                                    $scope.SaveApplicationDetail();
                                                } else {
                                                    notificationService.success('success', $translate.instant('email_available_'));
                                                }
                                            } else {
                                                notificationService.error('error_',$translate.instant( 'error_email_exists'));
                                                userService.personalInfo.Email = '';
                                                $scope.EmailCheck = false;
                                            }
                                        } catch (ex) {
                                            $scope.EmailCheck = false;
                                            notificationService.error('error_', $translate.instant('error_occured_try_again'));
                                        }
                                    })
                                    .catch(function () {
                                        $scope.EmailCheck = false;
                                    });
                            }
                        };

                        $scope.verifyUserNameAndEmail = function (saveDetails) {
                            var filter = new RegExp('^([\\w-\\.+]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([\\w-]+\\.)+))([a-zA-Z]{2,10}|[0-9]{1,3})(\\]?)$');
                            if (userService.personalInfo.Email && filter.test(userService.personalInfo.Email)) {
                                $RestService.VerifyUserNameAndEmail({ Email: userService.personalInfo.Email }).then(function (result) {
                                    result = result.data;
                                    try {
                                        if (result.Data) {
                                            $scope.EmailCheck = false;
                                            if (saveDetails) {
                                                $scope.SaveApplicationDetail();
                                            } else {
                                                notificationService.success('success', $translate.instant('email_available_'));
                                            }
                                        } else {
                                            notificationService.error('error_', $translate.instant('error_email_exists'));
                                            userService.personalInfo.Email = '';
                                            $scope.EmailCheck = false;
                                        }
                                    } catch (ex) {
                                        $scope.EmailCheck = false;
                                        notificationService.error('error_', $translate.instant('error_occured_try_again'));
                                    }
                                }).catch(function () {
                                    notificationService.error('error_', $translate.instant('something_went_wrong_with_request_try_again'));
                                });

                            }
                        };
                        $scope.CheckValidation = function () {
                            $scope.IsSearchValidated =
                                $scope.Search.FirstName ||
                                $scope.Search.LastName ||
                                $scope.Search.SponsorId;
                        };
                    }
                ]

            };
        }).directive('customMailingAddress', function () {
        return {
            restrict: 'E',
            templateUrl: 'mailingAddress.tpl.html',
            controller: [
                '$scope',
                '$RestService',
                'orderService',
                '$q',
                'shoppingCartService',
                'notificationService',
                'commonSetting',
                'userService',
                'regexService',
                'paymentService',
                '$translate',
                function (
                    $scope,
                    $RestService,
                    orderService,
                    $q,
                    shoppingCartService,
                    notificationService,
                    commonSetting,
                    userService,
                    regexService,
                    paymentService,
                    $translate
                ) {

                    $scope.userService = userService;
                    $scope.orderService = orderService;
                    $scope.paymentService = paymentService;

                    $scope.getDefaultShipMethodId = function () {
                        var getDefaultShipMethodIdRequest =
                            '?cartId=' +
                            (sessionStorage.getItem('IsEnrollment') == 'true' ? shoppingCartService.enrollmentOrderCartId : shoppingCartService.cartId) +
                            '&customerType=' +
                            userService.customerTypeID +
                            '&countryCode=' +
                            commonSetting.commonData.selectedCountry;
                        $RestService
                            .GetDefaultShipMethodID(getDefaultShipMethodIdRequest)
                            .then(function (result) {
                                result = result.data;
                                try {
                                    if (Number(result.Status) === 0) {
                                        //$scope.defaultShipMethodId = result.Data;
                                        userService.defaultShipMethodId = result.Data;
                                        $scope.getShippingTypes(true, true);
                                    } else {
                                        notificationService.error('error_', result.ErrorDescription);
                                    }
                                } catch (ex) {
                                    console.warn(ex);
                                }
                            })
                            .catch(function () {
                                notificationService.error('error_', $translate.instant('error_occured_try_again'));
                            });
                    };

                    $scope.getShippingTypes = function (statecall, isMailingAddress, zipCode) {
                        var filter = new RegExp(
                            regexService.getRegex(
                                commonSetting.commonData.selectedCountry.toUpperCase()
                            )
                        );
                        if (statecall || filter.test(zipCode)) {
                            if (!isMailingAddress && userService.shippingAddress.Check == 2) {
                                orderService.calculateOrderCall = true;
                                $scope.differentShippingAddress(false);
                                orderService.calculateOrder();
                            } else {
                                if (isMailingAddress && userService.shippingAddress.Check == 1) {
                                    orderService.calculateOrderCall = true;
                                    $scope.differentShippingAddress(false);
                                    orderService.calculateOrder();
                                }
                            }
                        }
                    };


                    $scope.getStates = function (countryCode = null) {
                        userService.mailingAddress.ZipCode = ''
                        userService.mailingAddress.State = '';

                        var defered = $q.defer();
                        var code = userService.mailingAddress.Country ? userService.mailingAddress.Country : commonSetting.commonData.selectedCountry;

                        var getStatesRequest =
                            '?CountryCode='+code;

                        if(!code) {
                            console.log('codehere', code);
                            //return false;
                        }
                        $RestService.GetStates(getStatesRequest).then(function (result) {
                            result = result.data;
                            try {
                                if (Number(result.Status) === 0) {
                                    $scope.StatesResponse = result.Data;
                                    //userService.mailingAddress.State = userService.mailingAddress.State || result.Data[0].RegionCode;
                                    userService.defaultState = result.Data[0].RegionCode;
                                    //userService.shippingAddress.State = userService.shippingAddress.State || result.Data[0].RegionCode;
                                    userService.mailingAddress.StateName =
                                        userService.mailingAddress.StateName ||
                                        result.Data[0].RegionDescription;
                                    defered.resolve(result.Data);
                                    if (!$scope.StateNameToggel) {
                                        $scope.GetStateName(false);
                                        $scope.StateNameToggel = true;
                                    }
                                    if (!$scope.ShipMethodNameToggel) {
                                        $scope.getDefaultShipMethodId();
                                        $scope.ShipMethodNameToggel = true;
                                    }
                                } else {
                                    defered.reject();
                                    notificationService.error('error_', result.ErrorDescription);
                                }
                            } catch (ex) {
                                defered.reject();
                                notificationService.error('error_', $translate.instant('error_occured_try_again'));
                            }
                        });
                        return defered.promise;
                    };

                    //$scope.getStates();


                    $scope.GetStateName = function (isMailingAddress) {
                        if (isMailingAddress) {
                            userService.mailingAddress.StateName = _.filter(
                                $scope.StatesResponse,
                                function (state) {
                                    return (
                                        state.RegionCode ===
                                        (userService.mailingAddress.State || userService.defaultState)
                                    );
                                }
                            )[0].RegionDescription;
                            if (userService.paymentMethods.length > 0) {
                                userService.paymentMethods = [];
                                notificationService.warning(
                                    'warn_',
                                    $translate.instant('you_have_to_fill_payment_again_after_change_state')
                                );
                            }
                        } else {
                            userService.shippingAddress.StateName = _.filter(
                                $scope.StatesResponse,
                                function (state) {
                                    return (
                                        state.RegionCode ===
                                        (userService.shippingAddress.State || userService.defaultState)
                                    );
                                }
                            )[0].RegionDescription;
                        }
                        $scope.getShippingTypes(false, isMailingAddress);
                    };

                    $scope.getShippingTypes = function (statecall, isMailingAddress, zipCode) {
                        var filter = new RegExp(
                            regexService.getRegex(
                                commonSetting.commonData.selectedCountry.toUpperCase()
                            )
                        );
                        if (statecall || filter.test(zipCode)) {
                            if (!isMailingAddress && userService.shippingAddress.Check == 2) {
                                orderService.calculateOrderCall = true;
                                $scope.differentShippingAddress(false);
                                orderService.calculateOrder();
                            } else {
                                if (isMailingAddress && userService.shippingAddress.Check == 1) {
                                    orderService.calculateOrderCall = true;
                                    $scope.differentShippingAddress(false);
                                    orderService.calculateOrder();
                                }
                            }
                        }
                    };

                    $scope.differentShippingAddress = function (clearPrevious) {
                        if (Number(userService.shippingAddress.Check) === 2) {
                            if (clearPrevious) {
                                userService.shippingAddress = {};
                            }

                            $scope.ShippingAddressCheck = true;
                            userService.shippingAddress.FirstName = userService.shippingAddress.FirstName || '';
                            userService.shippingAddress.LastName = userService.shippingAddress.LastName || '';
                            userService.shippingAddress.StreetAddress = userService.shippingAddress.StreetAddress || '';
                            userService.shippingAddress.Apartment = userService.shippingAddress.Apartment || '';
                            userService.shippingAddress.City = userService.shippingAddress.City || '';
                            userService.shippingAddress.StateName =  userService.shippingAddress.StateName || userService.mailingAddress.StateName;
                            userService.shippingAddress.ZipCode = userService.shippingAddress.ZipCode || '';
                            userService.shippingAddress.Check = 2;
                        }
                        else {
                            userService.shippingAddress.FirstName = userService.personalInfo.FirstName;
                            userService.shippingAddress.LastName = userService.personalInfo.LastName;
                            userService.shippingAddress.StreetAddress = userService.mailingAddress.StreetAddress;
                            userService.shippingAddress.Apartment = userService.mailingAddress.Apartment;
                            userService.shippingAddress.City = userService.mailingAddress.City;
                            userService.shippingAddress.State = userService.mailingAddress.State;
                            userService.shippingAddress.StateName = userService.mailingAddress.StateName;
                            userService.shippingAddress.ZipCode = userService.mailingAddress.ZipCode;
                            $scope.ShippingAddressCheck = false;
                            userService.shippingAddress.Check = 1;
                        }
                    };

                    $scope.differentShippingAddress(true);


                    $scope.differentBillingAddress = function () {
                        if (Number(userService.billingAddress.Check) === 2) {
                            $scope.BillingAddressCheck = true;
                            userService.billingAddress.StreetAddress = '';
                            userService.billingAddress.Apartment = '';
                            userService.billingAddress.City = '';
                            userService.billingAddress.State = '';
                            userService.billingAddress.ZipCode = '';
                            userService.billingAddress.Check = 2;
                            userService.billingAddress.Country = '';
                            $scope.getStates();
                        } else {
                            userService.billingAddress.StreetAddress =
                                userService.mailingAddress.StreetAddress;
                            userService.billingAddress.Apartment =
                                userService.mailingAddress.Apartment;
                            userService.billingAddress.City = userService.mailingAddress.City;
                            userService.billingAddress.State = userService.mailingAddress.State;
                            userService.billingAddress.ZipCode =
                                userService.mailingAddress.ZipCode;
                            userService.billingAddress.Country =
                                commonSetting.commonData.selectedCountry;
                            $scope.BillingAddressCheck = false;
                            userService.billingAddress.Check = 1;
                        }
                    };
                    $scope.differentBillingAddress();

                    paymentService.selectedPaymentTypeName = paymentService.selectedPaymentTypeName || $translate.instant('Add_Payment_Method');
                    paymentService.oldSelectedPaymentTypeName = paymentService.oldSelectedPaymentTypeName || $translate.instant('Add_Payment_Method');
                    $scope.getStates().then(function () {
                        paymentService.getPaymentType();
                    });
                }
            ]
        };
    }).directive('customAccountInfo', function () {
        return {
            restrict: 'E',
            templateUrl: 'accountInfo.tpl.html',
            controller: [
                '$scope',
                '$RestService',
                'validateKeyword',
                'notificationService',
                'userService',
                'paymentService',
                'VerifyUserNameService',
                '$translate',
                function (
                    $scope,
                    $RestService,
                    validateKeyword,
                    notificationService,
                    userService,
                    paymentService,
                    VerifyUserNameService,
                    $translate
                ) {

                    $scope.userService = userService;
                    $scope.paymentService = paymentService;

                    $scope.removeSpecialSymbol = function () {
                        if(userService.webOffice.UserName) {
                            userService.webOffice.UserName = userService.webOffice.UserName.replace(/[^a-zA-Z0-9]/g, '');
                        }

                    }
                    $scope.verifyUsername = function (saveDetails) {
                        $scope.UserNameCheck = false;
                        if (userService.webOffice.UserName) {
                            // var blockword = restrictedWords.blockedWords.concat(
                            //   restrictedWords.blockedWordsForSetting
                            // );
                            var isValidPost = validateKeyword.CheckValidation(
                                userService.webOffice.UserName
                            );
                            if (!isValidPost.isvalid) {
                                notificationService.error('error_', $translate.instant('username_is_not_available'));
                                $scope.UserNameCheck = false;
                                userService.webOffice.UserName = $scope.OldUserName;
                            } else {

                                VerifyUserNameService
                                    .verifyUsername(userService.webOffice.UserName)
                                    .then(function (result) {
                                        result = result.data;
                                        try {
                                            $scope.VerifyUsernameResponse = result.Data;
                                            if (result.Data) {
                                                $scope.UserNameCheck = true;
                                                if (saveDetails) {
                                                    $scope.SaveApplicationDetail();
                                                } else {
                                                    notificationService.success(
                                                        'success',
                                                        $translate.instant('username_available_')
                                                    );
                                                }
                                            } else {
                                                notificationService.error(
                                                    'error_',
                                                    $translate.instant('username_not_available_')
                                                );
                                                userService.webOffice.UserName = '';
                                            }
                                        } catch (ex) {
                                            notificationService.error(
                                                'error_',
                                                $translate.instant('error_occured_try_again')
                                            );
                                        }
                                    });
                            }
                        }
                    };

                    $scope.verifyDomainName = function () {
                        if (userService.webOffice.DomainName) {
                            var verifyWebAliasRequest =
                                '?value=' +
                                userService.webOffice.DomainName;
                            $RestService
                                .VerifyUserNameAndWebAlias(verifyWebAliasRequest)
                                .then(function (result) {
                                    result = result.data;
                                    try {
                                        $scope.VerifyDomainNameResponse = result.Data;
                                        if (result.Data) {
                                            notificationService.success(
                                                'success',
                                                $translate.instant('domain_name_available')
                                            );
                                        } else {
                                            notificationService.error(
                                                'error_',
                                                $translate.instant('domain_name_not_available')
                                            );
                                            userService.webOffice.DomainName = '';
                                        }
                                    } catch (ex) {
                                        notificationService.error('error_', $translate.instant('error_occured_try_again'));
                                    }
                                });
                        }
                    };

                }
            ]


        };
    }).directive('customPlaceOrder', function () {
        return {
            restrict: 'E',
            templateUrl: 'placeOrder.tpl.html',
            controller: [
                '$scope',
                'enrollmentItemsService',
                'orderService',
                'shoppingCartService',
                function (
                    $scope,
                    enrollmentItemsService,
                    orderService,
                    shoppingCartService
                ) {

                    $scope.enrollmentItemsService = enrollmentItemsService;
                    $scope.orderService = orderService;

                    $scope.getenrollmentOrderItems = function () {
                        enrollmentItemsService.getEnrollmentOrderItems('',shoppingCartService.enrollmentOrderCartId).then(function (result) {
                            $scope.orderItems = result.Data;
                            localStorage.setItem('cart.enrollmentorder', JSON.stringify(enrollmentItemsService.selectedOrderItems)
                            );
                            orderService.calculateOrder();
                        });
                    };

                    $scope.getenrollmentOrderItems();

                }
            ]
        };
    }).directive('customPaymentMethod', function () {
        return {
            restrict: 'E',
            templateUrl: 'paymentMethod.tpl.html',
            controller: [
                '$scope',
                'notificationService',
                'userService',
                'paymentService',
                '$translate',
                function (
                    $scope,
                    notificationService,
                    userService,
                    paymentService,
                    $translate
                ) {
                    $scope.userService = userService;
                    $scope.paymentService = paymentService;
                    paymentService.PaymentDataResponse = paymentService.PaymentDataResponse || {};

                    $scope.AddSavePayment = function (paymentData) {
                        if (userService.mailingAddress.State) {
                            if (paymentService.SelectedPaymentTypes && (paymentService.SelectedPaymentTypes.MerchantID !== paymentData.MerchantID)) {
                                userService.paymentMethods = [];
                            }
                            paymentService.SelectedPaymentTypes = paymentData;
                            paymentService.selectedPaymentTypeName =
                                paymentService.SelectedPaymentTypes.DisplayText;
                            if (paymentService.SelectedPaymentTypes.CanSavePayments) {
                                paymentService.OldSelectedPaymentType =
                                    paymentService.SelectedPaymentTypes;
                                paymentService.getPaymentData(undefined, undefined, true);
                            } else {
                                paymentService.oldSelectedPaymentTypeName =
                                    paymentService.selectedPaymentTypeName;
                                userService.paymentMethods = [];
                                userService.paymentMethods.push(
                                    paymentService.SelectedPaymentTypes
                                );
                            }
                        } else {
                            notificationService.error('error_', $translate.instant('please_enter_your_address'));
                        }
                    };

                    $scope.checkList = function() {
                        //$scope.scrollTo(5);
                        $scope.UpdateSteps(5);

                    };
                }
            ]
        };
    }).directive('customEnrollmentSummary', function() {
        return {
            restrict: 'E',
            templateUrl: 'enrollmentSummary.tpl.html',
            controller: [
                '$scope', '$RestService', '$location', '$translate', 'currencyFilter', 'orderService', 'cartsService', 'shoppingCartService',
                'notificationService', 'commonSetting', 'itemsService', 'userService', 'paymentService', '$uibModal', '$state', 'GetSettingsService',
                'visitEnrollCountService', '$rootScope', 'companyDetails','autoshipConfiguration','releaseToggleService',
                function ($scope, $RestService, $location, $translate, currencyFilter, orderService, cartsService, shoppingCartService,
                          notificationService, commonSetting, itemsService, userService, paymentService, $uibModal, $state, GetSettingsService,
                          visitEnrollCountService, $rootScope, companyDetails,autoshipConfiguration,releaseToggleService) {
                    $scope.userService = userService;
                    $scope.cartsService = cartsService;
                    $scope.orderService = orderService;
                    $scope.paymentService = paymentService;
                    $scope.IsSubmitDisable = false;
                    $scope.Warning = {};
                    $scope.Warning.FlagBirthDefects = false;
                    $scope.Warning.FlagCancer = false;
                    $scope.AutoWarning = {};
                    $scope.AutoWarning.FlagBirthDefects = false;
                    $scope.AutoWarning.FlagCancer = false;
                    $scope.itemsService = itemsService;
                    $scope.commonSetting = commonSetting;
                    $scope.isShow = [];
                    $scope.fraudPreventionInfo = {};
                    if (localStorage.getItem('SubmitApplication') && JSON.parse(localStorage.getItem('SubmitApplication'))) {
                        $scope.SubmitApplicationResponse = JSON.parse(localStorage.getItem('SubmitApplication'));
                    } else {
                        $scope.SubmitApplicationResponse = {};
                    }

                    function getPageSetting() {
                        $scope.pageSettingCall = true;
                        GetSettingsService.GetSetting('Payment').then(function (result) {
                            $scope.pageSettingCall = false;
                            try {
                                if (result) {
                                    if (result.length > 0) {
                                        _.each(result, function (data) {
                                            $scope.isShow[data.SettingName] = data.Value;
                                        });
                                    }
                                }
                            } catch (e) {
                                console.warn('e', e);
                            }
                        }, function (error) {
                            $scope.pageSettingCall = false;
                            console.warn('error', error);
                        });
                    }
                    getPageSetting();

                    orderService.calculateOrder().then(function (result) {
                        if (Number(result.Status) === 0) {
                            $scope.CalculateOrderResponse = result.Data;

                            itemsService.selectedOrderItems.forEach(function (item) {
                                $scope.CalculateOrderResponse.Details.some(function (calcItem) {
                                    if (calcItem.ItemCode === item.ItemCode) {
                                        angular.extend(calcItem, item);
                                        return true;
                                    }
                                    return false;
                                });
                            });

                        } else {
                            $scope.CalculateOrderResponse = {};
                        }
                    });

                    if (itemsService.selectedAutoOrderItems.length > 0) {
                        orderService.calculateAutoOrder().then(function (result) {
                            $scope.CalculateAutoOrderResponse = result.Data;
                            _.each(itemsService.selectedAutoOrderItems, function (item) {
                                _.each($scope.CalculateAutoOrderResponse.Details, function (cal) {
                                    if (cal.ItemCode === item.ItemCode) {
                                        cal.FlagCancer = item.FlagCancer;
                                        cal.FlagBirthDefects = item.FlagBirthDefects;
                                    }
                                });
                            });
                        });
                    }

                    // GetFraudPreventionInfo

                    function GetFraudPreventionInfo() {
                        var request = '?client=' +companyDetails.detail.Name;
                        $RestService.GetFraudPreventionInfo(request).then(function (result) {
                            $scope.fraudPreventionInfo = result.data;
                            try {
                                eval('if (\'ka\' in window) {} else {var ka;}'+$scope.fraudPreventionInfo.ClientSideCode);
                            } catch (e) {
                                console.warn('error', e);
                            }
                        });
                    }
                    GetFraudPreventionInfo();

                    $scope.increaseQuantiy = function (item, isAutoship, isPack) {
                        cartsService.increaseQuantiy(item, isAutoship, isPack);
                    };
                    $scope.decreaseQuantiy = function (item, isAutoship, isPack) {
                        if ($scope.getQuantityModel(true, false)[item.ItemCode] == 1 && userService.customerTypeID === 1) {
                            notificationService.error('error_', $translate.instant('cannot_delete_item'));
                        } else {
                            cartsService.decreaseQuantiy(item, isAutoship, isPack);
                        }
                    };
                    $scope.getQuantityModel = function (isPack, isAutoship) {
                        return cartsService[isPack ? 'packQuantity' : (isAutoship ? 'autoshipQuantity' : 'orderQuantity')];
                    };
                    $scope.checkQuantity = function (item, isAutoship, isPack) {
                        var quantity = $scope.getQuantityModel(isPack, isAutoship)[item.ItemCode];
                        if (!Number(quantity)) {
                            cartsService.removeFromCart(item, isAutoship, isPack, true);
                        } else {
                            item.Quantity = quantity;
                            if (isAutoship) {
                                localStorage.setItem('cart.autoship', JSON.stringify(itemsService.selectedAutoOrderItems));
                                orderService.calculateAutoOrder();
                            } else {
                                localStorage.setItem((isPack ? 'cart.packs' : 'cart.order'), JSON.stringify(isPack ? itemsService.selectedPacks : itemsService.selectedOrderItems));
                                orderService.calculateOrder();
                            }
                        }

                    };


                    $scope.checkCvvModal = function () {
                        if (userService.paymentMethods[0].MerchantID && (Object.keys($scope.isShow).length>0 && $scope.isShow['IsAllowCVVModel'] && $scope.isShow['IsAllowCVVModel'].includes(userService.paymentMethods[0].MerchantID))) {
                            $uibModal
                                .open({
                                    animation: true,
                                    backdrop: 'static',
                                    controller: 'AllowCvvModalController',
                                    controllerAs: 'ctrl',
                                    keyboard: false,
                                    resolve: {},
                                    template: $rootScope.isShowCustomAllowCvvModal ? '<custom-allow-cvv-modal></custom-allow-cvv-modal>' : '<allow-cvv-modal></allow-cvv-modal>'
                                })
                                .result.then(function (data) {
                                if (data) {
                                    $scope.submitApplication(data);
                                }
                            });
                        } else {
                            $scope.submitApplication();
                        }
                    };

                    $scope.submitApplication = function (cvv) {

                        if (releaseToggleService.isOn('ReleaseToggle_AddFrequency') && itemsService.selectedAutoOrderItems.length > 0 && autoshipConfiguration.setting && autoshipConfiguration.setting.autoshipSettings.frequencyTypeID == undefined) {
                            notificationService.error('error_', 'choose_frequency_sidecart');
                            return;
                        }
                        $scope.IsSubmitDisable = true;

                        $('#placeorder').prop('disabled', true);
                        var productdetails = [];
                        _.each(itemsService.selectedOrderItems, function (item) {
                            productdetails.push({
                                SkuID: item.ItemCode,
                                Quantity: item.Quantity,
                            });
                        });

                        var autoshipproductdetails = [];
                        _.each(itemsService.selectedAutoOrderItems, function (item) {
                            autoshipproductdetails.push({ SkuID: item.ItemCode, Quantity: item.Quantity });
                        });

                        var submitApplicationRequest =
                            {
                                'SiteId': userService.referralURL || '',
                                'StoreID': 4,
                                'AssociateId': paymentService.PaymentDataResponse.AssociateID || 0,
                                'FraudPreventionId': '',
                                'OrderRequest': {
                                    'CurrencyCode': commonSetting.commonData.CurrencySymbol[0].CurrencyCode,
                                    'ShipMethodID': userService.selectedShippingMethod || 1,
                                    'Details': productdetails,
                                    'OrderCartID': shoppingCartService.enrollmentOrderCartId
                                },

                                'Payment': {
                                    'MarchentID': userService.paymentMethods[0].MerchantID,
                                    'CurrencyCode': commonSetting.commonData.CurrencySymbol[0].CurrencyCode,
                                    'SavePayment': true,
                                    'HpToken': userService.paymentMethods[0].Token,
                                    'CardType': userService.paymentMethods[0].CardType,
                                    'NameOnCard': userService.paymentMethods[0].Nameoncard,
                                    'ExpirationMonth': userService.paymentMethods[0].ExpireMonth,
                                    'ExpirationYear': userService.paymentMethods[0].ExpireYear,
                                    'Last4': userService.paymentMethods[0].Last4,
                                    'SecurityCode': null,
                                    'BillingAddress': null,
                                    'SelectedCc': 1,
                                    'SavedPaymentMethodID': 0,
                                    'CvvCode':cvv ||0
                                },
                                'AcceptTerms': true,
                                'FirstName': userService.personalInfo.FirstName,
                                'Company': userService.personalInfo.CompanyName,
                                'LastName': userService.personalInfo.LastName,
                                'TaxID': userService.commissionPayment || '',
                                'BirthDate': userService.customerTypeID === 2 ? null : '' + userService.personalInfo.birthYear + '-' + userService.personalInfo.birthMonth + '-' + userService.personalInfo.birthDay + '',
                                'TextNumber': userService.personalInfo.phoneNumber.Phone1,
                                'PrimaryPhone': userService.personalInfo.phoneNumber.Phone2 || '',
                                'SecondaryPhone': userService.personalInfo.phoneNumber.Fax || '',
                                'Email': userService.personalInfo.Email,
                                'Username': userService.webOffice.UserName,
                                'Password': userService.webOffice.Password,
                                'LanguageCode': commonSetting.commonData.selectedLanguageCode.split('-')[0] || 'en',
                                'CustomerType': userService.customerTypeID,
                                'SponsorID': userService.enrollerId || userService.enrollerInfo.CustomerId,
                                'WebPageURL': userService.customerTypeID === 1 ? userService.webOffice.UserName : '',
                                'WebPageItemID': 0,
                                'sendEmails': userService.personalInfo.SendMail ? true : false,
                                'ApplicantAddress': {
                                    'Address1': userService.mailingAddress.StreetAddress,
                                    'Address2': userService.mailingAddress.Apartment,
                                    'Address3': '',
                                    'City': userService.mailingAddress.City,
                                    'State': userService.mailingAddress.State,
                                    'Zip': userService.mailingAddress.ZipCode,
                                    'CountryCode': commonSetting.commonData.selectedCountry
                                },
                                'ShippingAddress': {
                                    'Address1': userService.shippingAddress.StreetAddress,
                                    'Address2': userService.shippingAddress.Apartment,
                                    'Address3': '',
                                    'City': userService.shippingAddress.City,
                                    'State': userService.shippingAddress.State,
                                    'Zip': userService.shippingAddress.ZipCode,
                                    'CountryCode': commonSetting.commonData.selectedCountry
                                },
                                'EnrollerWebAlias': userService.enrollerInfo.WebAlias,
                                'EnrollerBackOfficeID': userService.enrollerInfo.BackOfficeID,
                                // 'CouponCodes': commonSetting.commonData.OrderAllowCoupons || commonSetting.commonData.PacksAllowCoupons ? userService.couponInfo.Allcoupons : '',
                                'CouponCodes': userService.couponInfo.OrderAllowCoupons ? userService.couponInfo.Allcoupons : '',
                                'LegName': userService.legName || '',
                                'EnrollerID': 0,
                                'PlacementOverride': [
                                    {
                                        'Tree': 'Enrollment',
                                        'AssociateId': userService.enrollerId || userService.enrollerInfo.CustomerId || 0,
                                        'TreeIndex': 0,
                                        'BaseLegName': ''
                                    }
                                ]
                            };

                        if ($location.search().testPayment1 === 'true') {
                            submitApplicationRequest.Payment.MarchentID = 99;
                        }

                        if (userService.paymentMethods[1] && userService.paymentMethods[1].Token) {
                            submitApplicationRequest.Payment.Amount = userService.paymentMethods[0].amountToCharge;

                            submitApplicationRequest.Payment2 = {
                                Amount: userService.paymentMethods[1].amountToCharge,
                                MarchentID: userService.paymentMethods[1].MerchantID,
                                CurrencyCode: commonSetting.commonData.CurrencySymbol[0].CurrencyCode,
                                SavePayment: true,
                                HpToken: userService.paymentMethods[1].Token,
                                CardType: userService.paymentMethods[1].CardType,
                                NameOnCard: userService.paymentMethods[1].Nameoncard,
                                ExpirationMonth: userService.paymentMethods[1].ExpireMonth,
                                ExpirationYear: userService.paymentMethods[1].ExpireYear,
                                Last4: userService.paymentMethods[1].Last4,
                                SecurityCode: null,
                                BillingAddress: null,
                                SelectedCc: 1,
                                SavedPaymentMethodID: 0
                            };

                            if ($location.search().testPayment2 === 'true') {
                                submitApplicationRequest.Payment2.MarchentID = 99;
                            }
                        }

                        if (autoshipproductdetails.length > 0) {
                            submitApplicationRequest.AutoOrderRequest = {
                                'AutoShipDay': moment(userService.autoshipDate).format('DD'),
                                'BeginMonth': moment(userService.autoshipDate).format('MM'),
                                'ShipMethodID': userService.selectedShippingMethod || 1,
                                'AutoshipType': 1,
                                'Details': autoshipproductdetails,
                                'AutoOrderCartID': shoppingCartService.enrollmentAutoshipCartId,
                                'FrequencyTypeID': releaseToggleService.isOn('ReleaseToggle_AddFrequency') ? autoshipConfiguration.setting && autoshipConfiguration.setting.autoshipSettings.frequencyTypeID : ''
                            };
                        }



                        $RestService.SubmitApplication(submitApplicationRequest).then(function (result) {
                            console.log('final data saved!!!');
                            result = result.data;
                            if(result.Message == 'Success' && result.Data.ErrorMessage == null) {
                                localStorage.setItem('SubmitApplication', JSON.stringify(result.Data));
                                $state.go('Complete', { action: 'Get', WebAlias: userService.WebAlias });
                                notificationService.success('success', $translate.instant('successfully_enrolled'));
                                visitEnrollCountService.setVisitEnrollCount((userService.enrollerId || userService.enrollerInfo.CustomerId), false);
                                // paymentService.clearPayment();
                                // userService.setDefault();
                            } else {
                                notificationService.error('error_', result.Data.ErrorMessage);
                                try {
                                    $scope.IsSubmitDisable = false;
                                    $('#placeorder').prop('disabled', false);
                                    // Check for payment error
                                    var error = result.Data.ErrorMessage;
                                    if (error && error.length && !!~error.indexOf('Failed Payment')) {
                                        var cardNumberText = 'Index:';
                                        if (error.indexOf(cardNumberText) > -1) {
                                            var cardNumberIndex = error.indexOf(cardNumberText) + cardNumberText.length;
                                            var cardNumber = Number(error.slice(cardNumberIndex, cardNumberIndex + 1)) + 1;

                                            var cardAmountText = 'Amount:';
                                            var cardAmountIndex = error.indexOf(cardAmountText) + cardAmountText.length;
                                            var cardAmountEndIndex = error.indexOf(' ', cardAmountIndex);
                                            var cardAmount = error.slice(cardAmountIndex, cardAmountEndIndex);

                                            notificationService.error('error_',
                                                $translate.instant('enrollment_invalid_card',
                                                    { cardNumber: cardNumber.toString(), cardAmount: currencyFilter(cardAmount) }));
                                        }
                                        else {
                                            notificationService.error('error_', result.Data.ErrorMessage);
                                        }

                                        return;
                                    }

                                    $scope.SubmitApplicationResponse = {};
                                    localStorage.removeItem('SubmitApplication');
                                    localStorage.setItem('SubmitApplication', JSON.stringify(result.Data));
                                    $scope.SubmitApplicationResponse = result.Data;
                                } catch (ex) {
                                    console.warn('ex', ex);
                                    $('#placeorder').prop('disabled', false);
                                    notificationService.error('error_', $translate.instant('error_occured_try_again'));
                                    $scope.IsSubmitDisable = false;
                                }
                            }

                        }).catch(function (err) {
                            $('#placeorder').prop('disabled', false);
                            $scope.IsSubmitDisable = false;
                            console.error(err);
                            notificationService.error('error_',$translate.instant('error_occured_try_again'));
                        });
                    };


                    if ($scope.SubmitApplicationResponse && $scope.SubmitApplicationResponse.Data) {
                        $('head').append($scope.SubmitApplicationResponse.Data.Head);
                    }
                }
            ]
        };
    }).controller('CustomApplicationCtrl123', [
        '$scope',
        'sessionService',
        '$location',
        'orderService',
        '$q',
        '$window',
        'itemsService',
        'cartsService',
        'itemsListService',
        'notificationService',
        'commonSetting',
        'userService',
        'checkWebAliasService',
        '$state',
        '$stateParams',
        'paymentService',
        '$RestService',
        function (
            $scope,
            sessionService,
            $location,
            orderService,
            $q,
            $window,
            itemsService,
            cartsService,
            itemsListService,
            notificationService,
            commonSetting,
            userService,
            checkWebAliasService,
            $state,
            $stateParams,
            paymentService,
            $RestService,
        ) {
            $window.scrollTo(0, 0);
            //Common Service used on DOM
            $scope.cartsService = cartsService;
            $scope.itemsService = itemsService;
            $scope.itemsListService = itemsListService;
            $scope.userService = userService;
            $scope.orderService = orderService;
            $scope.paymentService = paymentService;
            $scope.noOfStepsVerified = 0;
            $scope.isTermsChecked = false;
            //Update Quantity
            $scope.cartsService.setQuantiy();
            if (userService.enrollerInfo.Referral !== $stateParams.WebAlias) {
                checkWebAliasService.checkWebAliasPromise = $q.defer();
            }

            sessionStorage.setItem('IsEnrollment', 'true');

            //End Common Service used on DOM
            $scope.jpChar = {};
            $scope.Search = {};
            $scope.isShowUpDown = [];
            $scope.EmailCheck = false;
            if (commonSetting.commonData.selectedLanguageCode == 'ja-JP') {
                $scope.jpChar = {
                    day: '_day',
                    year: '_year'
                };
            }
            userService.autoshipDate = userService.autoshipDate ?
                userService.autoshipDate :
                $('#startdate').val();

            if (userService.autoshipDate) {
                $('#startdate').val(userService.autoshipDate);
            }
            userService.autoshipCardDetail = userService.autoshipCardDetail || {};
            userService.billingAddress = userService.billingAddress || {};
            userService.paymentMethods = userService.paymentMethods || [];
            userService.couponInfo.promoCodeValid = '';
            $scope.IsApplication = true;
            if ($location.search().type) {
                userService.customerTypeID = parseInt($location.search().type, 10);
            }
            //for selected order item
            function init() {
                if (localStorage.getItem('cart.order')) {
                    itemsService.selectedOrderItems = JSON.parse(localStorage.getItem('cart.order'));
                }
            }
            init();
            userService.webOffice.ConfirmPassword = '';
            userService.commissionPayment = '';
            userService.licenseNumber = '';
            $scope.SaveApplicationDetail = function () {
                console.log('saved application called');

                $('#application').addClass('ischeck');
                $('#application').focus();
                $('#application').blur();

                if (!userService.commissionPayment && userService.customerTypeID == 1) {
                    //notificationService.error('error_', $translate.instant('add_ssn_required'));
                    //return;
                }
                console.log('orderService.calculateOrderResponse', orderService.calculateOrderResponse);
                console.log('orderService.calculateOrderResponse.Result', orderService.calculateOrderResponse.Result);
                if (orderService.calculateOrderResponse.Result) {
                    if (orderService.calculateOrderResponse.Result.Status !== 0) {
                        notificationService.error('error_', orderService.calculateOrderResponse.Result.Errors);
                        return;
                    }
                } else {
                    notificationService.error('error_', $translate.instant('error_occured_try_again'));
                    return;
                }

                if (userService.customerTypeID !== 1 || (userService.customerTypeID === 1 && itemsService.selectedOrderItems.length > 0)) {
                    if (userService.paymentMethods.length > 0) {
                        if (userService.paymentMethods[0].Last4 || userService.paymentMethods[0].Last4 === undefined) {
                            $scope.scrollTo(5);
                            $scope.UpdateSteps(5);
                        } else {
                            notificationService.error('error_', $translate.instant('add_payment_error'));
                            return;
                        }
                    } else {
                        notificationService.error('error_', $translate.instant('add_payment_error'));
                        return;
                    }
                } else {
                    notificationService.error('error_', $translate.instant('please_select_lease_one_pack'));
                }

            };

            $scope.GetShipName = function () {
                userService.shipMethodName = _.filter(
                    userService.shippingMethods,
                    function (item) {
                        return (
                            Number(item.ShipMethodID) ===
                            Number(userService.selectedShippingMethod)
                        );
                    }
                )[0].ShippingTypeName;
                orderService.calculateOrder();
            };


            $scope.ClearApplication = function (element) {
                var id = '#' + element.target.id;
                if ($(id).is(':checked')) {
                    $(id)
                        .closest('.control-group')
                        .find('.has-error.help-block')
                        .remove();
                    $(id)
                        .closest('.control-group')
                        .removeClass('has-error');
                }
            };

            paymentService.PaymentDataResponse = paymentService.PaymentDataResponse || {};
            $scope.countPaymentMethods = function () {
                var paymentMethods = userService.paymentMethods;
                return paymentMethods ? paymentMethods.length : 0;
            };

            // If they've already set up a split payment and try to add autoship items, only allow one payment method
            if ($scope.countPaymentMethods() > 1) {
                userService.paymentMethods = [userService.paymentMethods[0]];
            }

            // Enable Disable Steps
            setTimeout(function () {
                $('.card').find('.toggle-ul.step_' + 1).slideDown(200);
            }, 200);
            $scope.isShowUpDown[1] = true;
            $scope.UpdateSteps = function (num) {
                $scope.noOfStepsVerified = num;
                for (var index = 1; index <= userService.TotalSteps; index++) {
                    if (index != num + 1) {
                        $('.card').find('.toggle-ul.step_' + index).slideUp(200);
                        $scope.isShowUpDown[index] = false;
                    }
                }
                $('.card').find('.toggle-ul.step_' + parseInt(num + 1, 10).toString()).slideDown(200);
                $scope.isShowUpDown[num + 1] = true;
            };
            $scope.scrollTo = function (num) {
                $('html, body').animate({
                    scrollTop: $('#step_' + parseInt(num, 10).toString()).offset().top
                }, 50);
            };

            $scope.checkTerms = function() {

                $scope.isTermsChecked = !$scope.isTermsChecked;
            }
            $scope.submitCustomApplication = function () {

                if (!$scope.isTermsChecked) {
                    return false;
                }
                var submitApplicationRequest =
                    {
                        'SiteId': userService.referralURL || '',
                        'StoreID': 4,
                        'AssociateId': paymentService.PaymentDataResponse.AssociateID || 0,
                        'FraudPreventionId': '',

                        'AcceptTerms': true,
                        'FirstName': userService.personalInfo.FirstName,
                        'Company': userService.personalInfo.CompanyName,
                        'LastName': userService.personalInfo.LastName,
                        'TaxID': userService.commissionPayment || '',
                        'BirthDate': userService.personalInfo.birthYear + '-' + userService.personalInfo.birthMonth + '-' + userService.personalInfo.birthDay + '',
                        'TextNumber': userService.personalInfo.phoneNumber.Phone1,
                        'PrimaryPhone': userService.personalInfo.phoneNumber.Phone2 || '',
                        'SecondaryPhone': userService.personalInfo.phoneNumber.Fax || '',
                        'Email': userService.personalInfo.Email,
                        'Username': userService.webOffice.UserName,
                        'Password': userService.webOffice.Password,
                        'LanguageCode': commonSetting.commonData.selectedLanguageCode.split('-')[0] || 'en',
                        //'CustomerType': userService.customerTypeID,
                        'CustomerType': '1',
                        'SponsorID': userService.enrollerId || userService.enrollerInfo.CustomerId,
                        'WebPageURL': userService.customerTypeID === 1 ? userService.webOffice.UserName : '',
                        'WebPageItemID': 0,
                        'sendEmails': userService.personalInfo.SendMail ? true : false,
                        'ApplicantAddress': {
                            'Address1': userService.mailingAddress.StreetAddress,
                            'Address2': userService.mailingAddress.Apartment,
                            'Address3': '',
                            'City': userService.mailingAddress.City,
                            'State': userService.mailingAddress.State,
                            'Zip': userService.mailingAddress.ZipCode,
                            'CountryCode': userService.mailingAddress.Country
                        },
                        'ShippingAddress': {
                            'Address1': userService.shippingAddress.StreetAddress,
                            'Address2': userService.shippingAddress.Apartment,
                            'Address3': '',
                            'City': userService.shippingAddress.City,
                            'State': userService.shippingAddress.State,
                            'Zip': userService.shippingAddress.ZipCode,
                            'CountryCode': userService.mailingAddress.Country
                        },
                        'EnrollerWebAlias': userService.enrollerInfo.WebAlias,
                        'EnrollerBackOfficeID': userService.enrollerInfo.BackOfficeID,
                        // 'CouponCodes': commonSetting.commonData.OrderAllowCoupons || commonSetting.commonData.PacksAllowCoupons ? userService.couponInfo.Allcoupons : '',
                        'CouponCodes': userService.couponInfo.OrderAllowCoupons ? userService.couponInfo.Allcoupons : '',
                        'LegName': userService.legName || '',
                        'EnrollerID': 0,
                        'PlacementOverride': [
                            {
                                'Tree': 'Enrollment',
                                'AssociateId': userService.enrollerId || userService.enrollerInfo.CustomerId || 0,
                                'TreeIndex': 0,
                                'BaseLegName': ''
                            }
                        ]
                    };







                $RestService.SubmitApplication(submitApplicationRequest).then(function (result) {

                    result = result.data;
                    if(result.Message == 'Success' && result.Data.ErrorMessage == null) {
                        localStorage.setItem('SubmitApplication', JSON.stringify(result.Data));
                        $state.go('Complete', { action: 'Get', WebAlias: userService.WebAlias });
                        notificationService.success('success', $translate.instant('successfully_enrolled'));
                        visitEnrollCountService.setVisitEnrollCount((userService.enrollerId || userService.enrollerInfo.CustomerId), false);
                        // paymentService.clearPayment();
                        // userService.setDefault();
                    } else {
                        notificationService.error('error_', result.Data.ErrorMessage);
                        try {
                            $scope.IsSubmitDisable = false;
                            $('#placeorder').prop('disabled', false);
                            // Check for payment error
                            var error = result.Data.ErrorMessage;
                            if (error && error.length && !!~error.indexOf('Failed Payment')) {
                                var cardNumberText = 'Index:';
                                if (error.indexOf(cardNumberText) > -1) {
                                    var cardNumberIndex = error.indexOf(cardNumberText) + cardNumberText.length;
                                    var cardNumber = Number(error.slice(cardNumberIndex, cardNumberIndex + 1)) + 1;

                                    var cardAmountText = 'Amount:';
                                    var cardAmountIndex = error.indexOf(cardAmountText) + cardAmountText.length;
                                    var cardAmountEndIndex = error.indexOf(' ', cardAmountIndex);
                                    var cardAmount = error.slice(cardAmountIndex, cardAmountEndIndex);

                                    notificationService.error('error_',
                                        $translate.instant('enrollment_invalid_card',
                                            { cardNumber: cardNumber.toString(), cardAmount: currencyFilter(cardAmount) }));
                                }
                                else {
                                    notificationService.error('error_', result.Data.ErrorMessage);
                                }

                                return;
                            }

                            $scope.SubmitApplicationResponse = {};
                            localStorage.removeItem('SubmitApplication');
                            localStorage.setItem('SubmitApplication', JSON.stringify(result.Data));
                            $scope.SubmitApplicationResponse = result.Data;
                        } catch (ex) {
                            console.warn('ex', ex);
                            $('#placeorder').prop('disabled', false);
                            notificationService.error('error_', $translate.instant('error_occured_try_again'));
                            $scope.IsSubmitDisable = false;
                        }
                    }

                }).catch(function (err) {
                    $('#placeorder').prop('disabled', false);
                    $scope.IsSubmitDisable = false;
                    console.error(err);
                    notificationService.error('error_',$translate.instant('error_occured_try_again'));
                });
            };

            //Use this Event for Page Reload while Browser Back button Navigation.
            var page_loaded = false;
            window.onpopstate = function () {
                if (!page_loaded) {
                    page_loaded = true;
                    return false;
                }
                if ($state.current.name == 'Application') {
                    if (!$location.search().test && !$location.search().testModeToken) {
                        window.location.reload();
                        return false;
                    }
                }
            };
        }
    ]);
})();