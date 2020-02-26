(function(t) {
    "function" == typeof define && define.amd ? define(["jquery", "moment"], t) : t(jQuery, moment)
})(function(t, e) {
    (e.defineLocale || e.lang).call(e, "nb", {
        months: "Januar_Februar_Mars_April_Mai_Juni_Juli_August_September_Oktober_November_Desember".split("_"),
        monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
        weekdays: "Søndag_Mandag_Tirsdag_Onsdag_Torsdag_Fredag_Lørdag".split("_"),
        weekdaysShort: "søn_man_tir_ons_tor_fre_lør".split("_"),
        weekdaysMin: "sø_ma_ti_on_to_fr_lø".split("_"),
        longDateFormat: {
            LT: "HH:mm",
            LTS: "LT:ss",
            L: "DD.MM.YYYY",
            LL: "D. MMMM YYYY",
            LLL: "D. MMMM YYYY LT",
            LLLL: "dddd [d.] D. MMMM YYYY LT"
        },
        calendar: {
            sameDay: "[i dag på.] LT",
            nextDay: "[i morgen på.] LT",
            nextWeek: "dddd [ved.] LT",
            lastDay: "[i går på.] LT",
            lastWeek: "[siste] dddd [ved] LT",
            sameElse: "L"
        },
        relativeTime: {
            future: "om %s",
            past: "%s siden",
            s: "få sekunder",
            m: "et minut",
            mm: "%d minutter",
            h: "en time",
            hh: "%d timer",
            d: "en dag",
            dd: "%d dage",
            M: "en måned",
            MM: "%d måneder",
            y: "et år",
            yy: "%d år"
        },
        ordinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
            dow: 1,
            doy: 4
        }
    }), t.fullCalendar.datepickerLang("nb", "nb", {
        closeText: "Luk",
        prevText: "&#x3C;Forrige",
        nextText: "Næste&#x3E;",
        currentText: "Idag",
        monthNames: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
        dayNames: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
        dayNamesShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
        dayNamesMin: ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø"],
        weekHeader: "Uge",
        dateFormat: "dd.mm.yy",
        firstDay: 1,
        isRTL: !1,
        showMonthAfterYear: !1,
        yearSuffix: ""
    }), t.fullCalendar.lang("nb", {
        defaultButtonText: {
            month: "Måned",
            week: "Uke",
            day: "Dag",
            list: "Agenda"
        },
        allDayText: "Hele dagen",
        eventLimitText: "flere"
    })
});