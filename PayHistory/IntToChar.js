function IntToCharTotal(){
    setTimeout(function (){
        let digitsPH = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
        let numbersPH = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

        function IntToChar (num) {
            if ((num = num.toString()).length > 9) return 'overflow';
            arryPH = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
            if (!arryPH) return; let intsInWPH = '';
            intsInWPH += (arryPH[1] != 0) ? (digitsPH[Number(arryPH[1])] || numbersPH[arryPH[1][0]] + ' ' + digitsPH[arryPH[1][1]]) + 'ten million ' : '';
            intsInWPH += (arryPH[2] != 0) ? (digitsPH[Number(arryPH[2])] || numbersPH[arryPH[2][0]] + ' ' + digitsPH[arryPH[2][1]]) + 'hundred thousand' : '';
            intsInWPH += (arryPH[3] != 0) ? (digitsPH[Number(arryPH[3])] || numbersPH[arryPH[3][0]] + ' ' + digitsPH[arryPH[3][1]]) + 'thousand ' : '';
            intsInWPH += (arryPH[4] != 0) ? (digitsPH[Number(arryPH[4])] || numbersPH[arryPH[4][0]] + ' ' + digitsPH[arryPH[4][1]]) + 'hundred ' : '';
            intsInWPH += (arryPH[5] != 0) ? ((intsInWPH != '') ? '' : '') + (digitsPH[Number(arryPH[5])] || numbersPH[arryPH[5][0]] + ' ' + digitsPH[arryPH[5][1]]) + 'and ' : '';
            return intsInWPH;
        }
        let totalValuePHint = $('#totalValuePH').text().replace('A$', '');
        totalValuePHint = totalValuePHint.replace(',', '');

        let numsOfPHTotal = totalValuePHint.split('.');

        if (numsOfPHTotal[1] === '00'){
            $('#displayInttoChar').text(IntToChar(numsOfPHTotal[0]).toUpperCase());
            $('#displayInttoChar').text($('#displayInttoChar').text().replace('AND', ''));
        } else {
            $('#displayInttoChar').text(IntToChar(numsOfPHTotal[0]).toUpperCase() + numsOfPHTotal[1] + '/100');
        }
    }, 500);
}
$(document).ready(setTimeout(function (){
    IntToCharTotal();
}, 1000));
$(window).loaded(IntToCharTotal());