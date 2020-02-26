var TableEditable = function () {

    return {

        //main function to initiate the module
        init: function () {
            function restoreRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);

                for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                    oTable.fnUpdate(aData[i], nRow, i, false);
                }

                oTable.fnDraw();
            }

            function editRow1(oTable1, nRow) {
                var aData = oTable1.fnGetData(nRow);
                var jqTds = $('>td', nRow);
                jqTds[0].innerHTML = '<input type="text" style="width:30px !important;" class="m-wrap small" value="' + aData[0] + '">';
                jqTds[1].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[1] + '">';
                jqTds[2].innerHTML = '<input type="text" style="width:30px !important;" class="m-wrap small" value="' + aData[2] + '">';
                jqTds[3].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[3] + '">';
				jqTds[4].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[4] + '">';
				jqTds[5].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[5] + '">';
				jqTds[6].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[6] + '">';
                jqTds[7].innerHTML = '<a class="edit btn mini blue" href=""><i class="icon-ok"></i>Save</a>&nbsp;&nbsp;<a class="cancel btn mini green" href=""><i class="icon-remove"></i> Cancel</a>';
               
            }

            function saveRow1(oTable1, nRow) {
                var jqInputs = $('input', nRow);
                oTable1.fnUpdate(jqInputs[0].value, nRow, 0, false);
                oTable1.fnUpdate(jqInputs[1].value, nRow, 1, false);
                oTable1.fnUpdate(jqInputs[2].value, nRow, 2, false);
                oTable1.fnUpdate(jqInputs[3].value, nRow, 3, false);
				oTable1.fnUpdate(jqInputs[4].value, nRow, 4, false);
				oTable1.fnUpdate(jqInputs[5].value, nRow, 5, false);
				oTable1.fnUpdate(jqInputs[6].value, nRow, 6, false);
                oTable1.fnUpdate('<a href="javascript:;" class="edit btn mini green"><i class="icon-edit"></i> Edit</a>&nbsp;&nbsp;<a href="#" class="btn mini red"><i class="icon-trash"></i> Remove</a>', nRow, 7, false);
                oTable1.fnDraw();
            }

            function cancelEditRow1(oTable1, nRow) {
                var jqInputs = $('input', nRow);
                oTable1.fnUpdate(jqInputs[0].value, nRow, 0, false);
                oTable1.fnUpdate(jqInputs[1].value, nRow, 1, false);
                oTable1.fnUpdate(jqInputs[2].value, nRow, 2, false);
                oTable1.fnUpdate(jqInputs[3].value, nRow, 3, false);
				oTable1.fnUpdate(jqInputs[0].value, nRow, 4, false);
                oTable1.fnUpdate(jqInputs[1].value, nRow, 5, false);
                oTable1.fnUpdate(jqInputs[2].value, nRow, 6, false);
                oTable1.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 7, false);
                oTable1.fnDraw();
            }

            var oTable1 = $('#sample_editable_1').dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ records per page",
                    "oPaginate": {
                        "sPrevious": "Prev",
                        "sNext": "Next"
                    }
                },
                "aoColumnDefs": [{
                        'bSortable': false,
                        'aTargets': [0]
                    }
                ]
            });

			var oTable2 = $('#sample_editable_2').dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ records per page",
                    "oPaginate": {
                        "sPrevious": "Prev",
                        "sNext": "Next"
                    }
                },
                "aoColumnDefs": [{
                        'bSortable': false,
                        'aTargets': [0]
                    }
                ]
            });
			var oTable3 = $('#sample_editable_3').dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ records per page",
                    "oPaginate": {
                        "sPrevious": "Prev",
                        "sNext": "Next"
                    }
                },
                "aoColumnDefs": [{
                        'bSortable': false,
                        'aTargets': [0]
                    }
                ]
            });


            jQuery('#sample_editable_1_wrapper .dataTables_filter input').addClass("m-wrap medium"); // modify table search input
            jQuery('#sample_editable_1_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
            jQuery('#sample_editable_1_wrapper .dataTables_length select').select2({
                showSearchInput : false //hide search box with special css class
            }); // initialize select2 dropdown

            var nEditing = null;

            $('#sample_editable_1_new').click(function (e) {
                e.preventDefault();
                var aiNew = oTable.fnAddData(['', '', '', '',
                        '<a class="edit" href="">Edit</a>', '<a class="cancel" data-mode="new" href="">Cancel</a>'
                ]);
                var nRow = oTable.fnGetNodes(aiNew[0]);
                editRow(oTable, nRow);
                nEditing = nRow;
            });

            $('#sample_editable_1 a.delete').live('click', function (e) {
                e.preventDefault();

                if (confirm("Are you sure to delete this row ?") == false) {
                    return;
                }

                var nRow = $(this).parents('tr')[0];
                oTable.fnDeleteRow(nRow);
                alert("Deleted successfully!");
            });

            $('#sample_editable_1 a.cancel').live('click', function (e) {
                e.preventDefault();
                if ($(this).attr("data-mode") == "new") {
                    var nRow = $(this).parents('tr')[0];
                    oTable1.fnDeleteRow(nRow);
                } else {
                    restoreRow(oTable1, nEditing);
                    nEditing = null;
                }
            });
			$('#sample_editable_2 a.cancel').live('click', function (e) {
                e.preventDefault();
                if ($(this).attr("data-mode") == "new") {
                    var nRow = $(this).parents('tr')[0];
                    oTable.fnDeleteRow(nRow);
                } else {
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                }
            });
			$('#sample_editable_3 a.cancel').live('click', function (e) {
                e.preventDefault();
                if ($(this).attr("data-mode") == "new") {
                    var nRow = $(this).parents('tr')[0];
                    oTable.fnDeleteRow(nRow);
                } else {
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                }
            });

            $('#sample_editable_1 a.edit').live('click', function (e) {
                e.preventDefault();

                /* Get the row as a parent of the link that was clicked on */
                var nRow = $(this).parents('tr')[0];

                if (nEditing !== null && nEditing != nRow) {
                    /* Currently editing - but not this row - restore the old before continuing to edit mode */
                    restoreRow(oTable1, nEditing);
                    editRow1(oTable1, nRow);
                    nEditing = nRow;
                } else if (nEditing == nRow && this.innerHTML == "<i class=\"icon-ok\"></i>Save") {
                    /* Editing this row and want to save it */
                    saveRow1(oTable1, nEditing);
                    nEditing = null;
                    alert("Updated successfully!");
                } else {
                    /* No edit in progress - let's start one */
                    editRow1(oTable1, nRow);
                    nEditing = nRow;
                }
            });
			 $('#sample_editable_2 a.edit').live('click', function (e) {
                e.preventDefault();

                /* Get the row as a parent of the link that was clicked on */
                var nRow = $(this).parents('tr')[0];

                if (nEditing !== null && nEditing != nRow) {
                    /* Currently editing - but not this row - restore the old before continuing to edit mode */
                    restoreRow(oTable, nEditing);
                    editRow(oTable, nRow);
                    nEditing = nRow;
                } else if (nEditing == nRow && this.innerHTML == "Save") {
                    /* Editing this row and want to save it */
                    saveRow(oTable, nEditing);
                    nEditing = null;
                    alert("Updated successfully!");
                } else {
                    /* No edit in progress - let's start one */
                    editRow(oTable, nRow);
                    nEditing = nRow;
                }
            });
			 $('#sample_editable_3 a.edit').live('click', function (e) {
                e.preventDefault();

                /* Get the row as a parent of the link that was clicked on */
                var nRow = $(this).parents('tr')[0];

                if (nEditing !== null && nEditing != nRow) {
                    /* Currently editing - but not this row - restore the old before continuing to edit mode */
                    restoreRow(oTable, nEditing);
                    editRow(oTable, nRow);
                    nEditing = nRow;
                } else if (nEditing == nRow && this.innerHTML == "Save") {
                    /* Editing this row and want to save it */
                    saveRow(oTable, nEditing);
                    nEditing = null;
                    alert("Updated successfully!");
                } else {
                    /* No edit in progress - let's start one */
                    editRow(oTable, nRow);
                    nEditing = nRow;
                }
            });
        }

    };

}();