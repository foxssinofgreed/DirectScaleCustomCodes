(function () {
    'use strict';
    module.filter('TranslatePayHistoryWord', [
        '$translate',
        '$sce',
        function($translate) {
            return function(text) {
                if (text) {
                    var textWords = text.split(' ');
                    var translateString = '';
                    _.each(textWords, function(word) {
                        var translatekeyword = '';
                        var translated = '';
                        if (!Number(word)) {
                            translatekeyword = 'number2word_' + word.toLowerCase();
                        }
                        translated = $translate.instant(translatekeyword);
                        if (angular.equals(translated, translatekeyword) || translated === '') {
                            translateString += word + ' ';
                        } else {
                            translateString += translated + ' ';
                        }
                    });
                    return translateString;
                }
            };
        }
    ])

        .controller('CustomPayHistoryControllerAU', CustomPayHistoryControllerAU);
    CustomPayHistoryControllerAU.$inject = [
        '$scope',
        '$RestService',
        '$filter',
        '$timeout',
        '$translate',
        '$q',
        'featureToggleService',
        'UserService',
        'Notification',
        'GetPageSetting'
    ];
    function CustomPayHistoryControllerAU(
        $scope,
        $RestService,
        $filter,
        $timeout,
        $translate,
        $q,
        featureToggleService,
        UserService,
        Notification,
        GetPageSetting
    ) {
        var vm = this;
        vm.UserService = UserService;
        vm.SelectedFilters = 'All';
        vm.IsShowView = true;
        $scope.SessionData.PageName = $translate.instant('pay_history');
        $scope.getPageNameTranslate('pay_history');
        vm.ShowPeriodMobile = true;
        vm.ShowPeriodDetailMobile = false;
        vm.CurrentSelectedBonus = {};
        vm.ShowAccountBalance = featureToggleService.isOn('ShowAccountBalance');
        vm.ShowAccountBalanceDetails = false;
        vm.AccountBalanceDetails = null;
        vm.AccountBalance = 0;
        vm.exchangeRate = 2;

        $scope.GetShippingAddress = function() {
            var getShippingAddressRequest = 'api/CustomerShippingAddress';
            $RestService.CustomerShippingAddress(getShippingAddressRequest).then(function(result) {
                result = result.data;
                if (parseInt(result.Status, 10) === 0) {
                    $scope.SessionData.shippingAddressResult = result.Data.Addresses;
                    if ($scope.SessionData.shippingAddressResult.length > 0) {
                        if($scope.SessionData.shippingAddressResult[0].MainCountry === 'AUS')
                        {
                            vm.exchageRate = 2;
                        }

                    }
                }
            });
        };

        vm.IsLoading = true;
        $scope.ShowLoader = {};
        vm.PaymentTypeFilters = [];
        var FGetCompanyBonusesAndFieldsdefer = $q.defer();

        $scope.Accord = {};
        $scope.Active = {};

        function convertHex(hex, opacity) {
            hex = hex.replace('#', '');
            var r = parseInt(hex.substring(0, 2), 16);
            var g = parseInt(hex.substring(2, 4), 16);
            var b = parseInt(hex.substring(4, 6), 16);

            var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
            return result;
        }

        /*************************************Lazy Loading **********************************/

        $scope.GetCommissionBonusDetailDataPaging = $scope.GetCommissionBonusDetailDataPaging || {};
        $scope.GetCommissionBonusDetailDataPaging.PageNo = 0;
        $scope.GetCommissionBonusDetailDataPaging.PageSize = 10;
        /*************************************Lazy Loading **********************************/

        $scope.PageNo = 1;
        $scope.PageSize = 20;
        $scope.TotalRecords = 0;
        vm.CommissionChecks = [];

        vm.GetRecordsOnScroll = function() {
            if (!vm.IsLoading) {
                $scope.getCommissionChecks();
            }
        };
        var count = 0;
        vm.PaymentTypeFilters = [{ Name: 'all_payment', Id: 'All', IsChecked: true }];
        $scope.getCommissionChecks = function() {
            if (
                $scope.PageNo.toString() === '1' ||
                (parseInt($scope.PageNo, 10) - 1) * parseInt($scope.PageSize, 10) < parseInt($scope.TotalRecords, 10)
            ) {
                vm.IsLoading = true;
                $scope.ShowLoader['PeriodList'] = true;
                var request = {
                    PaymentTypeFilter: vm.SelectedFilters || 'All',
                    PageSize: $scope.PageSize,
                    PageNo: $scope.PageNo
                };
                $RestService
                    .GetCommissionChecks(request)
                    .then(function(result) {
                        vm.IsLoading = false;
                        $scope.ShowLoader['PeriodList'] = false;
                        result = result.data;
                        $scope.TotalRecords = result.Data.TotalChecks;
                        $scope.ChecksData = result.Data;
                        if (result.Status === 0) {
                            if (count === 0) {
                                count = +1;
                                _.each($scope.ChecksData.PaymentFilterTypes, function(item) {
                                    vm.PaymentTypeFilters.push({ Name: item + '_payhistory_commission', Id: item, IsChecked: true });
                                });
                            }
                            if ($scope.ChecksData.Checks.length > 0) {
                                _.each($scope.ChecksData.Checks, function(item) {
                                    vm.CommissionChecks.push(item);
                                });
                                if ($scope.PageNo.toString() === '1') {
                                    $scope.getCommissionCheckDetails(vm.CommissionChecks[0]);
                                }
                            } else {
                                vm.CommissionChecks = [];
                                vm.IsShowView = false;
                            }
                        } else {
                            vm.CommissionChecks = [];
                            vm.IsShowView = false;
                        }
                        $scope.PageNo = $scope.PageNo + 1;
                    })
                    .finally(function() {
                        $scope.ShowLoader['PeriodList'] = false;
                    });
                if (vm.ShowAccountBalance) {
                    $RestService.GetCommissionBalance().then(function(response) {
                        vm.AccountBalance = response.data.Data;
                    });
                }
            }
        };

        vm.isProjected = function(check) {
            return check.PaymentTypes.includes('Projected');
        };

        $scope.getCommissionCheckDetails = function(CommissionCheck) {
            $scope.ShowLoader['PayHistoryLoad'] = true;
            var request = { TransactionNumber: CommissionCheck.TransactionNumber };
            vm.SelectedCommissionCheck = CommissionCheck;
            $RestService
                .GetCommissionCheckDetails(request)
                .then(function(result) {
                    vm.ShowAccountBalanceDetails = false;
                    result = result.data;
                    $scope.AdjustmentAmountEarned = 0;
                    if (result && result.Status === 0) {
                        vm.CommissionCheckDetailsData = result.Data;
                        $scope.CommissionBonusName = {};
                        if (result.Data && result.Data.Details && result.Data.Details.length > 0) {
                            _.each(result.Data.Details, function(data) {
                                if (data.PeriodInfo.Type) {
                                    $scope.Active[data.PeriodInfo.Type + data.PeriodInfo.PeriodId] = false;
                                    FGetCommissionDetail(data);
                                    data.SortOrder = 0;
                                } else {
                                    data.PeriodInfo.Type = 'Adjustment';
                                    data.SortOrder = -1;
                                    $scope.AdjustmentAmountEarned = $scope.AdjustmentAmountEarned + data.AmountPaid;
                                }
                            });
                        }
                        vm.CommissionCheckDetailsData = result.Data;
                    }
                    $scope.ShowLoader['PayHistoryLoad'] = false;
                })
                .finally(function() {
                    $scope.ShowLoader['PayHistoryLoad'] = false;
                });
        };

        vm.getAccountBalanceDetails = function() {
            if (vm.AccountBalanceDetails === null) {
                $RestService.GetCommissionBalanceDetails().then(function(response) {
                    vm.AccountBalanceDetails = response.data;
                    vm.ShowAccountBalanceDetails = true;
                    vm.ShowInvoice = false;

                });
            } else {
                vm.ShowAccountBalanceDetails = true;
                vm.ShowInvoice = false;
            }
        };

        $scope.Amount = {};

        $(function($) {
            $(document).on('click', '#CommissionsPayHistory .lv-item', function() {
                $('#CommissionsPayHistory .lv-item').removeClass('b-blue');
                $('#CommissionsPayHistory .lv-item')
                    .find('a')
                    .removeClass('c-color4');
                $('#CommissionsPayHistory .lv-item')
                    .find('.amount')
                    .removeClass('c-color4');
                $(this).addClass('b-blue');
                $(this)
                    .find('a')
                    .addClass('c-color4');
                $(this)
                    .find('.amount')
                    .addClass('c-color4');
            });
        });
        vm.ShowInvoiceDetail = ShowInvoiceDetail;

        function ShowInvoiceDetail(OrderID, CustomerID, periodTypeID, periodID) {
            $scope.ShowLoader['payHistoryCommissionMain' + periodTypeID + '_' + periodID.toString()] = true;
            var GetOrdersRequest = { CustomerID: CustomerID, OrderID: OrderID };
            $RestService
                .GetOrderDetails(GetOrdersRequest)
                .then(function(result) {
                    result = result.data;
                    if (parseInt(result.Status, 10) === 0 && result.Order) {
                        vm.ShowSales = false;
                        vm.ShowAccountBalanceDetails = false;
                        vm.ShowInvoice = true;
                        $scope.GetOrder = result.Order[0];
                        $scope.GetOrder.TaxRate = Number($scope.GetOrder.TaxRate);
                        $scope.GetOrderDetails = result.OrderDetails;
                        $scope.currentDate = new Date().toJSON();
                        $scope.ShowLoader['payHistoryCommissionMain' + periodTypeID + '_' + periodID.toString()] = false;
                    } else {
                        Notification.error('Error', $translate.instant(result.ErrorDescription));
                        $scope.ShowLoader['payHistoryCommissionMain' + periodTypeID + '_' + periodID.toString()] = false;
                    }
                })
                .catch(function() {
                    $scope.ShowLoader['payHistoryCommissionMain' + periodTypeID + '_' + periodID.toString()] = false;
                });
        }

        vm.ShowSalesDetail = ShowSalesDetail;

        function ShowSalesDetail() {
            vm.ShowSales = true;
            vm.ShowInvoice = false;
        }
        vm.ShowSales = true;
        vm.ShowInvoice = false;
        $scope.SaveAsPDF = function() {
            window.print();
        };
        vm.backToHome = function() {
            vm.ShowSales = true;
            vm.ShowInvoice = false;
            vm.ShowPeriodMobile = false;
            vm.ShowPeriodDetailMobile = true;
        };
        vm.FGetCommissionDetailClickMobile = FGetCommissionDetailClickMobile;

        function FGetCommissionDetailClickMobile(data) {
            vm.ShowSales = true;
            vm.ShowPeriodMobile = false;
            vm.ShowPeriodDetailMobile = true;
            $scope.SessionData.ItemDetailsHeader = true;

            $scope.getCommissionCheckDetails(data);
        }

        vm.GetAccountBalanceMobile = GetAccountBalanceMobile;

        function GetAccountBalanceMobile() {
            vm.ShowInvoice = false;
            $scope.SessionData.AccountBalanceHeader = true;
            vm.ShowAccountBalanceDetails = true;
            if (vm.AccountBalanceDetails === null) {
                $RestService.GetCommissionBalanceDetails().then(function(response) {
                    vm.AccountBalanceDetails = response.data;
                });
            }
        }

        vm.FGetCommissionDetail = FGetCommissionDetail;

        function FGetCommissionDetail(data) {
            if (data) {
                var currentPeriodTypeID = _.filter($scope.SessionData.CommonData.PeriodTypes, function(period) {
                    return period.PeriodTypeDescription == data.PeriodInfo.Type;
                });
                var hasPeriodType =
                    currentPeriodTypeID && currentPeriodTypeID.length > 0 && currentPeriodTypeID[0].PeriodTypeID;

                vm.ShowSales = true;
                vm.ShowPeriodMobile = false;
                vm.ShowPeriodDetailMobile = true;
                $scope.SessionData.ItemDetailsHeader = true;
                $scope.ShowLoader['commision'] = true;

                var GetCommissionDetailRequest = {
                    PeriodId: data.PeriodInfo.PeriodId,
                    PeriodTypeId: hasPeriodType ? currentPeriodTypeID[0].PeriodTypeID || 2 : 2
                };

                $RestService
                    .GetCommissionDetail(GetCommissionDetailRequest)
                    .then(function(result) {
                        result = result.data;

                        if (result && result.Data && result.Data.IsBonusUpdate) {
                            FGetCommissionReportSettings();
                            FGetCompanyBonusesAndFields(vm.CurrentSelectedBonus.PeriodId);
                        }

                        $scope.selectedPeriod =
                            $filter('translatemonth')(moment(data.StartDate).format('MMMM DD')) +
                            '-' +
                            $filter('translatemonth')(moment(data.EndDate).format('MMMM DD'));

                        $scope.CommissionBonusName[data.PeriodInfo.Type.toString() + data.PeriodInfo.PeriodId.toString()] =
                            result.Data;
                        _.each(result.data.Bonuses, function(bonus) {
                            $scope.Active[
                            data.PeriodInfo.Type.toString() + data.PeriodInfo.PeriodId.toString() + bonus.BonusId.toString()
                                ] = false;
                        });
                        $scope.ShowLoader['commision'] = false;
                    })
                    .catch(function() {
                        $scope.ShowLoader['commision'] = false;
                    });
            }
        }

        //All of these FGet... Methods are in Commissions.js. This is NOT DRY...
        vm.FGetCompanyBonusesAndFields = FGetCompanyBonusesAndFields;

        function FGetCompanyBonusesAndFields() {
            $RestService
                .GetCompanyBonusesAndFields('')
                .then(function(result) {
                    result = result.data;
                    try {
                        FGetCompanyBonusesAndFieldsdefer.resolve(true);
                        if (parseInt(result.Status, 10) === 0) {
                            try {
                                _.each(result.Data, function(bonus) {
                                    var accessColumn = bonus.AvailableFields.split(',');
                                    _.each(accessColumn, function(coloumn) {
                                        $scope.IsShowColumn[bonus.Name + '_' + coloumn] = true;
                                    });
                                });
                            } catch (ex) {
                                console.error('ex', ex);
                            }
                        }
                    } catch (ex) {
                        console.error(ex);
                    }
                })
                .catch(function() {
                    FGetCompanyBonusesAndFieldsdefer.reject(false);
                });
        }

        vm.FnCommissionBonuseDetails = FnCommissionBonuseDetails;
        // In Disco We are Setting Default Record Count 10 Because in Exigo We have Record count when we fetch commission bonus name
        var recordcountDisco = 10;
        var isCommissionRequest = true;
        function FnCommissionBonuseDetails(BonusId, type, recordCount, BonusDescription, periodTypeID, periodID) {
            var currentPeriodTypeID = _.filter($scope.SessionData.CommonData.PeriodTypes, function(period) {
                return period.PeriodTypeDescription === periodTypeID;
            });
            var hasPeriodType =
                currentPeriodTypeID && currentPeriodTypeID.length > 0 && currentPeriodTypeID[0].PeriodTypeID;

            vm.CurrentSelectedBonus = {
                PeriodTypeId: hasPeriodType ? currentPeriodTypeID[0].PeriodTypeID || 2 : 2,
                PeriodId: periodID
            };
            recordCount = recordCount > 0 ? recordCount : recordcountDisco;
            if (
                (isCommissionRequest &&
                    ((BonusId === $scope.CurrentBonusID || !$scope.CurrentBonusID) &&
                        (parseInt($scope.GetCommissionBonusDetailDataPaging.PageNo, 10) === 0 ||
                            parseInt($scope.GetCommissionBonusDetailDataPaging.PageNo, 10) *
                            parseInt($scope.GetCommissionBonusDetailDataPaging.PageSize, 10) <
                            parseInt(recordCount, 10)))) ||
                !recordCount
            ) {
                isCommissionRequest = false;
                try {
                    $scope.ShowLoader['payHistoryCommissionMain' + periodTypeID + '_' + periodID.toString()] = true;
                    var GetCommissionDetailRequest = {
                        PeriodId: vm.CurrentSelectedBonus.PeriodId,
                        PeriodTypeId: vm.CurrentSelectedBonus.PeriodTypeId,
                        BonusId: BonusId,
                        BonusDescription: BonusDescription,
                        PageNo: recordCount ? $scope.GetCommissionBonusDetailDataPaging.PageNo + 1 : 1,
                        PageSize: recordCount ? $scope.GetCommissionBonusDetailDataPaging.PageSize : 10,
                        OrderBy: $scope.SortColumnId,
                        OrderType: $scope.reverse ? 'ASC' : 'DESC'
                    };
                    $scope.PrevBonusId = BonusId;
                    $RestService
                        .CommissionBonuseDetails(GetCommissionDetailRequest)
                        .then(function(result) {
                            result = result.data;
                            $scope.GetCommissionBonusDetailDataPaging.PageNo =
                                parseInt($scope.GetCommissionBonusDetailDataPaging.PageNo, 10) + 1;
                            $scope.GetCommissionBonusDetailData = $scope.GetCommissionBonusDetailData || [];
                            if (result.Data.BonusDetails) {
                                recordcountDisco = result.Data.TotalRecords;
                                var totalNumberofRecord = recordcountDisco || recordCount;
                                var totalRecordFetch =
                                    $scope.GetCommissionBonusDetailDataPaging.PageNo *
                                    $scope.GetCommissionBonusDetailDataPaging.PageSize;
                                $scope.allRecordfecth = totalNumberofRecord > totalRecordFetch;
                                $scope.selectedPeriod =
                                    $filter('translatemonth')(moment(vm.CurrentSelectedBonus.StartDate).format('MMMM DD')) +
                                    '-' +
                                    $filter('translatemonth')(moment(vm.CurrentSelectedBonus.EndDate).format('MMMM DD'));
                                // code for convert string to float for number.
                                _.each(result.Data.BonusDetails, function(item) {
                                    for (var prop in item) {
                                        if (isNaN(parseFloat(item[prop]))) {
                                            item[prop] = item[prop];
                                        } else if (item[prop].toString().match(/[a-zA-Z]/i)) {
                                            item[prop] = item[prop];
                                        } else {
                                            item[prop] = parseFloat(item[prop]);
                                        }
                                    }
                                    $scope.GetCommissionBonusDetailData.push(item);
                                });

                                $scope.Total = 0;
                                _.each($scope.GetCommissionBonusDetailData, function(item) {
                                    $scope.Total += item.CommissionAmount;
                                });
                                _.each($scope.CommissionBonusName[periodTypeID.toString() + periodID.toString()].Bonuses, function(
                                    data
                                ) {
                                    try {
                                        if (data.BonusId === BonusId) {
                                            $scope.Accord[data.BonusId + periodID.toString()] = true;
                                            $('#T' + '_' + data.BonusId.toString() + periodID.toString())
                                                .find('span')
                                                .removeClass('collapsed');
                                        } else {
                                            $('#A' + data.BonusId + periodID.toString()).removeClass('in');
                                            $scope.Accord[data.BonusId + periodID.toString()] = false;
                                            data.isActive = false;
                                        }
                                        setTimeout(function() {
                                            $('#bonusdetailtable_' + data.BonusId).tableHeadFixer();
                                            $('.table > tbody > tr > td.bgm-color-fix').css(
                                                'background-color',
                                                convertHex($scope.ColorlocalStorage.Color.color1, 10)
                                            );
                                        }, 100);

                                        _.each($scope.Accord, function(key, value) {
                                            if (value === BonusId.toString() + periodID.toString()) {
                                                $scope.Accord[BonusId.toString() + periodID.toString()] = true;
                                                $('#T' + '_' + BonusId.toString() + periodID.toString())
                                                    .find('span')
                                                    .removeClass('collapsed');
                                                $('#A' + BonusId.toString() + periodID.toString()).addClass('in');
                                            } else {
                                                $scope.Accord[value] = false;
                                                $('#T' + '_' + value)
                                                    .find('span')
                                                    .addClass('collapsed');
                                                $('#A' + value).removeClass('in');
                                            }
                                        });
                                    } catch (e) {
                                        //this code is for handle when we have exception because of sepecial symbol
                                        if (data.BonusId.replace(/[^a-zA-Z0-9 ]/g, '') === BonusId.replace(/[^a-zA-Z0-9 ]/g, '')) {
                                            $scope.Accord[data.BonusId + periodID.toString()] = true;
                                            $('#T' + '_' + (data.BonusId.replace(/[^a-zA-Z0-9 ]/g, '') + periodID.toString()).toString())
                                                .find('span')
                                                .removeClass('collapsed');
                                        } else {
                                            $('#A' + data.BonusId.replace(/[^a-zA-Z0-9 ]/g, '') + periodID.toString()).removeClass('in');
                                            $scope.Accord[data.BonusId + periodID.toString()] = false;
                                        }
                                        setTimeout(function() {
                                            $('#bonusdetailtable_' + data.BonusId).tableHeadFixer();
                                        }, 1000);
                                    }
                                });

                                _.each($scope.Active, function(key, value) {
                                    if (value == periodTypeID.toString() + periodID.toString() + BonusId.toString()) {
                                        $scope.Active[periodTypeID.toString() + periodID.toString() + BonusId.toString()] = true;
                                    } else {
                                        $scope.Active[value] = false;
                                    }
                                });
                            } else {
                                Notification.error('Error', $translate.instant('there_is_no_data_for_bonusID'));
                            }

                            $scope.ShowLoader['payHistoryCommissionMain' + periodTypeID + '_' + periodID.toString()] = false;
                            isCommissionRequest = true;
                        })
                        .catch(function() {
                            $scope.ShowLoader['payHistoryCommissionMain' + periodTypeID + '_' + periodID.toString()] = false;
                            isCommissionRequest = true;
                        });
                } catch (ex) {
                    console.error('ex', ex);
                    $scope.ShowLoader['payHistoryCommissionMain' + periodTypeID + '_' + periodID.toString()] = false;
                }
            }
        }

        vm.FShowCommissionList = FShowCommissionList;

        $scope.clearpreviousData = function(BonusId, type, recordCount, BonusDescription, periodTypeID, periodID) {
            $scope.GetCommissionBonusDetailData = [];

            recordcountDisco = 10;
            $scope.SortColumnId = '';
            $scope.reverse = true;
            $scope.GetCommissionBonusDetailDataPaging = $scope.GetCommissionBonusDetailDataPaging || {};
            $scope.GetCommissionBonusDetailDataPaging.PageNo = 0;
            $scope.GetCommissionBonusDetailDataPaging.PageSize = 10;
            $scope.CurrentBonusID = BonusId;

            if (
                GetPageSetting.getSetting('global', 'IsDynamicCommissionView') === '1' &&
                $scope.GetCommissionReportSettingsResponse
            ) {
                _.each($scope.GetCommissionReportSettingsResponse.Node, function(item) {
                    if (item.BonusId !== BonusId) {
                        item.isActive = false;
                    }
                });
            } else if ($scope.CommissionBonusName[periodTypeID.toString() + periodID.toString()]) {
                _.each($scope.CommissionBonusName[periodTypeID + periodID.toString().toString()].Bonuses, function(item) {
                    if (item.BonusId !== BonusId) {
                        item.isActive = false;
                    }
                });
            }

            FnCommissionBonuseDetails(BonusId, type, recordCount, BonusDescription, periodTypeID, periodID);
        };
        function FShowCommissionList() {
            vm.ShowPeriodMobile = true;
            vm.ShowPeriodDetailMobile = false;
            $scope.SessionData.ItemDetailsHeader = false;
            $scope.SessionData.AccountBalanceHeader = false;
            vm.ShowAccountBalanceDetails = false;
        }

        setTimeout(function() {
            FShowCommissionList();
        }, 1000);
        //   $scope.SessionData.ItemDetailsHeader = true;
        vm.FGetCommissionReportSettings = FGetCommissionReportSettings;

        function FGetCommissionReportSettings() {
            var GetCommissionReportSettingsRequest = '';

            $RestService
                .GetCommissionReportSettings(GetCommissionReportSettingsRequest)
                .then(function(result) {
                    result = result.data;

                    try {
                        if (parseInt(result.Status, 10) === 0) {
                            $scope.GetCommissionReportSettingsResponse = result;
                            _.each(result.Node, function(bonus) {
                                var accessColumn = bonus.Fields.split(',');
                                _.each(accessColumn, function(coloumn) {
                                    $scope.IsShowColumn[bonus.BonusId + '_' + coloumn] = true;
                                });
                                try {
                                    if (bonus.BonusName === 'Adjustment' && bonus.CommissionType === 1) {
                                        var sortColumnName = _.each(bonus.Columns, function(column) {
                                            return column.FieldId === bonus.SortColumnId;
                                        });
                                        $scope.SortColumnName =
                                            (bonus.SortDirection === 1 ? '' : '-') +
                                            (sortColumnName.length > 0 ? sortColumnName[0].Name : '');
                                    }
                                } catch (e) {
                                    console.error('Error', e);
                                }
                            });
                        }
                    } catch (ex) {
                        console.error(ex);
                    }
                })
                .catch(function() {});
        }

        FGetCommissionReportSettings();
        vm.GoToDashboard = UserService.viewTeamDashboard;

        $scope.reverse = true;
        $scope.SortBy = function(predicate, BonusId, BonusDescription, periodTypeID, periodID) {
            $scope.GetCommissionBonusDetailData = [];
            $scope.SortColumnId = predicate.toString().trim();
            predicate = '[\'' + predicate + '\']';
            $scope.reverse = $scope.predicate === predicate ? !$scope.reverse : false;
            $scope.predicate = predicate;
            $scope.GetCommissionBonusDetailDataPaging.PageNo = 0;
            $scope.GetCommissionBonusDetailDataPaging.PageSize = 10;
            FnCommissionBonuseDetails(BonusId, '', null, BonusDescription, periodTypeID, periodID);
        };
        $scope.IsShowColumn = {};

        $scope.Addcolumnsign = function(value, id) {
            var setvalue;
            if (id === 4) {
                setvalue = value + '%';
            } else if (id === 15) {
                setvalue = $filter('currency')(value * vm.exchangeRate, 'A$', 2);
            } else if (id === 2) {
                //setvalue = value;
                setvalue = value;
            } else {
                setvalue = $filter('currency')(value * vm.exchangeRate, 'A$', 2);
            }
            return setvalue;
        };

        vm.filterChecks = function() {
            vm.IsShowOptions = false;
            vm.SelectedFilters = '';
            for (var i = 0; i < vm.PaymentTypeFilters.length; i++) {
                if (vm.PaymentTypeFilters[i].IsChecked) {
                    if (vm.PaymentTypeFilters[i].Id !== 'All') {
                        vm.SelectedFilters = vm.SelectedFilters + vm.PaymentTypeFilters[i].Id + ',';
                    } else {
                        vm.SelectedFilters = 'All,';
                        break;
                    }
                }
            }
            vm.SelectedFilters = vm.SelectedFilters.replace(/,(?=[^,]*$)/, '');
            $scope.PageNo = 1;
            vm.CommissionChecks = [];
            vm.IsShowView = true;
            $scope.getCommissionChecks();
        };

        vm.filterChecks();

        vm.OnChangeFilter = function(Id, IsChecked) {
            if (Id === 'All') {
                if (IsChecked) {
                    _.each(vm.PaymentTypeFilters, function(item) {
                        item.IsChecked = true;
                    });
                } else {
                    _.each(vm.PaymentTypeFilters, function(item, index) {
                        if (index === 1) {
                            item.IsChecked = true;
                        } else {
                            item.IsChecked = false;
                        }
                    });
                    if (vm.PaymentTypeFilters.length === 2) {
                        _.each(vm.PaymentTypeFilters, function(item) {
                            item.IsChecked = true;
                        });
                    }
                }
            } else {
                if (!IsChecked) {
                    if (vm.PaymentTypeFilters[0].IsChecked) {
                        vm.PaymentTypeFilters[0].IsChecked = false;
                    }
                    var _checked = _.filter(vm.PaymentTypeFilters, function(item) {
                        return item.IsChecked;
                    });
                    if (_checked.length === 0) {
                        vm.PaymentTypeFilters[1].IsChecked = true;
                        if (vm.PaymentTypeFilters.length === 2) {
                            vm.PaymentTypeFilters[0].IsChecked = true;
                        }
                    }
                } else {
                    var IsAllChecked = true;
                    var count = 0;
                    _.each(vm.PaymentTypeFilters, function(item) {
                        if (item.Id === Id) {
                            item.IsChecked = true;
                        }
                        if (!item.IsChecked && item.Id !== 'All') {
                            IsAllChecked = false;
                        }
                        count++;
                        if (count === vm.PaymentTypeFilters.length) {
                            vm.PaymentTypeFilters[0].IsChecked = IsAllChecked;
                        }
                    });
                }
            }
        };
    } // End of Controller

})();

let widthOfThePage = $(window).width();
if (widthOfThePage <= 720) {
    $('#churchxela').addClass('accordion-item');
}